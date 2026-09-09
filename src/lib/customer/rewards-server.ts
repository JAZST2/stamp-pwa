import "server-only";

import { formatShortDate } from "@/lib/date";
import {
  isCustomerRewardStatus,
  resolveRewardBusinessInitials,
  resolveRewardLogoColor,
  type CustomerRewardItem,
  type CustomerRewardsByStatus,
  type CustomerUnlockedRewardItem,
  type RewardClaimStatus,
} from "@/lib/customer/rewards";
import { createClient } from "@/lib/supabase/server";

type RewardClaimRow = {
  id: string;
  membership_id: string;
  status: RewardClaimStatus;
  claim_code: string | null;
  reward_description: string | null;
  unlocked_at: string | null;
  activated_at: string | null;
  pending_at: string | null;
  claimed_at: string | null;
  businesses:
    | {
        name: string | null;
        status: string | null;
      }
    | Array<{
        name: string | null;
        status: string | null;
      }>
    | null;
  stamp_cards:
    | {
        expiry_date: string | null;
        status: string | null;
        deleted_at: string | null;
      }
    | Array<{
        expiry_date: string | null;
        status: string | null;
        deleted_at: string | null;
      }>
    | null;
};

export type RewardClaimMutationResult =
  | { ok: true; claimId: string; status: RewardClaimStatus; claimCode: string | null }
  | { ok: false; error: string };

function resolveRelatedRow<T>(value: T | T[] | null): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function parseDateLabel(prefix: string, value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return `${prefix} ${formatShortDate(new Date(parsed))}`;
}

function resolveRewardLabel(row: RewardClaimRow): string {
  if (row.status === "claimed") {
    return (
      parseDateLabel("Claimed", row.claimed_at) ??
      parseDateLabel("Claimed", row.activated_at) ??
      "Claimed reward"
    );
  }

  if (row.status === "pending") {
    return parseDateLabel("Pending since", row.pending_at) ?? "Show this to cashier for redemption";
  }

  const stampCard = resolveRelatedRow(row.stamp_cards);
  return parseDateLabel("Expires", stampCard?.expiry_date) ?? "No expiry date";
}

function mapToReadyPendingClaimedItem(row: RewardClaimRow): CustomerRewardItem | null {
  if (!isCustomerRewardStatus(row.status)) {
    return null;
  }

  const claimCode = row.claim_code?.trim();
  if (!claimCode) {
    return null;
  }

  const business = resolveRelatedRow(row.businesses);
  const stampCard = resolveRelatedRow(row.stamp_cards);

  if (business?.status !== "active") {
    return null;
  }

  if (stampCard?.status !== "active" || stampCard.deleted_at) {
    return null;
  }

  const businessName = business.name?.trim() || "Business";
  const rewardTitle = row.reward_description?.trim() || "Reward";

  return {
    id: row.id,
    membershipId: row.membership_id,
    businessName,
    initials: resolveRewardBusinessInitials(businessName),
    rewardTitle,
    expiryLabel: resolveRewardLabel(row),
    code: claimCode.toUpperCase(),
    logoColor: resolveRewardLogoColor(businessName),
    status: row.status,
  };
}

function mapToUnlockedItem(row: RewardClaimRow): CustomerUnlockedRewardItem | null {
  if (row.status !== "unlocked") {
    return null;
  }

  const business = resolveRelatedRow(row.businesses);
  const stampCard = resolveRelatedRow(row.stamp_cards);

  if (business?.status !== "active") {
    return null;
  }

  if (stampCard?.status !== "active" || stampCard.deleted_at) {
    return null;
  }

  const businessName = business.name?.trim() || "Business";
  const rewardTitle = row.reward_description?.trim() || "Reward";

  return {
    id: row.id,
    membershipId: row.membership_id,
    businessName,
    initials: resolveRewardBusinessInitials(businessName),
    rewardTitle,
    unlockedLabel: parseDateLabel("Unlocked", row.unlocked_at) ?? "Unlocked reward",
    logoColor: resolveRewardLogoColor(businessName),
  };
}

function getEmptyRewards(): CustomerRewardsByStatus {
  return { ready: [], pending: [], claimed: [] };
}

function mapRewardMutationError(message: string, fallback: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("not authorized")) {
    return "You are not allowed to update this reward.";
  }
  if (normalized.includes("not in an unlocked state")) {
    return "This reward has already been activated.";
  }
  if (normalized.includes("is not ready")) {
    return "This reward is no longer ready to show.";
  }
  if (normalized.includes("not found")) {
    return "This reward is no longer available.";
  }

  return fallback;
}

function mapRpcRewardClaimRow(data: unknown): RewardClaimMutationResult | null {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== "object") {
    return null;
  }

  const candidate = row as {
    id?: unknown;
    status?: unknown;
    claim_code?: unknown;
  };
  if (typeof candidate.id !== "string" || typeof candidate.status !== "string") {
    return null;
  }

  const status = candidate.status as RewardClaimStatus;
  const claimCode = typeof candidate.claim_code === "string" ? candidate.claim_code : null;
  return { ok: true, claimId: candidate.id, status, claimCode };
}

export async function listCustomerRewardsByStatus(
  customerId: string,
): Promise<CustomerRewardsByStatus> {
  if (!customerId) {
    return getEmptyRewards();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reward_claims")
    .select(
      "id, membership_id, status, claim_code, reward_description, unlocked_at, activated_at, pending_at, claimed_at, businesses(name, status), stamp_cards(expiry_date, status, deleted_at)",
    )
    .eq("customer_id", customerId)
    .in("status", ["ready", "pending", "claimed"])
    .order("updated_at", { ascending: false });

  if (error || !data?.length) {
    return getEmptyRewards();
  }

  const rows = data as RewardClaimRow[];
  const rewards = getEmptyRewards();

  rows.forEach((row) => {
    const item = mapToReadyPendingClaimedItem(row);
    if (!item) {
      return;
    }

    rewards[item.status].push(item);
  });

  return rewards;
}

export async function listUnlockedRewardsForMembership(
  customerId: string,
  membershipId: string,
): Promise<CustomerUnlockedRewardItem[]> {
  if (!customerId || !membershipId) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reward_claims")
    .select(
      "id, membership_id, status, claim_code, reward_description, unlocked_at, activated_at, pending_at, claimed_at, businesses(name, status), stamp_cards(expiry_date, status, deleted_at)",
    )
    .eq("customer_id", customerId)
    .eq("membership_id", membershipId)
    .eq("status", "unlocked")
    .order("unlocked_at", { ascending: true });

  if (error || !data?.length) {
    return [];
  }

  return (data as RewardClaimRow[])
    .map((row) => mapToUnlockedItem(row))
    .filter((item): item is CustomerUnlockedRewardItem => Boolean(item));
}

export async function activateRewardClaim(
  claimId: string,
): Promise<RewardClaimMutationResult> {
  if (!claimId.trim()) {
    return { ok: false, error: "Missing reward claim id." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("activate_reward_claim", {
    p_claim_id: claimId,
  });

  if (error) {
    return {
      ok: false,
      error: mapRewardMutationError(
        error.message ?? "",
        "Unable to activate reward right now. Please try again.",
      ),
    };
  }

  const mapped = mapRpcRewardClaimRow(data);
  if (!mapped) {
    return { ok: false, error: "Unexpected response while activating reward." };
  }

  return mapped;
}

export async function markRewardClaimPending(
  claimId: string,
): Promise<RewardClaimMutationResult> {
  if (!claimId.trim()) {
    return { ok: false, error: "Missing reward claim id." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("mark_reward_claim_pending", {
    p_claim_id: claimId,
  });

  if (error) {
    return {
      ok: false,
      error: mapRewardMutationError(
        error.message ?? "",
        "Unable to move this reward to pending right now. Please try again.",
      ),
    };
  }

  const mapped = mapRpcRewardClaimRow(data);
  if (!mapped) {
    return { ok: false, error: "Unexpected response while updating reward." };
  }

  return mapped;
}
