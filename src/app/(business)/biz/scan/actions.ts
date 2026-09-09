"use server";

import { getCurrentProfile } from "@/lib/auth";
import {
  extractCustomerShortCodeFromScanInput,
  extractRewardClaimCodeFromScanInput,
} from "@/lib/business/scan";
import { lookupCustomerByPersonalCode } from "@/lib/business/scan-server";
import { resolveBusinessIdForCurrentUser } from "@/lib/business/stamp-cards-server";
import { createClient } from "@/lib/supabase/server";

type AddStampCardChoice = {
  cardId: string;
  cardName: string;
  currentStampCount: number;
  totalStamps: number;
};

type AddStampByCustomerCodeInput = {
  rawInput: string;
  selectedCardId?: string;
};

type AddStampSuccessResult = {
  ok: true;
  cardId: string;
  cardName: string;
  customerName: string;
  customerCode: string;
  currentStampCount: number;
  totalStamps: number;
};

type AddStampNeedsCardSelectionResult = {
  ok: false;
  reason: "select_card";
  customerName: string;
  customerCode: string;
  cards: AddStampCardChoice[];
};

type AddStampErrorResult = {
  ok: false;
  reason?: "error";
  error: string;
};

export type AddStampByCustomerCodeResult =
  | AddStampSuccessResult
  | AddStampNeedsCardSelectionResult
  | AddStampErrorResult;

type RedeemRewardSuccessResult = {
  ok: true;
  claimId: string;
  claimCode: string;
  rewardDescription: string;
};

type RedeemRewardErrorResult = {
  ok: false;
  error: string;
};

export type RedeemRewardByClaimCodeResult =
  | RedeemRewardSuccessResult
  | RedeemRewardErrorResult;

function isPermissionDeniedError(error?: { code?: string } | null): boolean {
  return error?.code === "42501";
}

type ActiveMembershipRow = AddStampCardChoice & {
  membership_id: string;
};

function mapStampInsertErrorToMessage(error: {
  code?: string;
  message?: string;
}): string {
  const message = error.message?.toLowerCase() ?? "";

  if (isPermissionDeniedError(error)) {
    return "Permission denied while adding a stamp. Verify Supabase grants and policies.";
  }

  if (message.includes("inactive or deleted")) {
    return "Card is inactive or deleted. Activate the card before adding stamps.";
  }

  if (message.includes("already reached card total") || message.includes("completed")) {
    return "This customer has already completed the current cycle for this card.";
  }

  if (message.includes("business is inactive")) {
    return "Your business is not active. Please contact support.";
  }

  if (error.code === "42804" || message.includes("membership_status")) {
    return "Stamp increment is blocked by a database type mismatch. Run the stamp status cast SQL in Supabase, then try again.";
  }

  return "Unable to add stamp right now. Please try again.";
}

function mapRewardRedeemErrorToMessage(error: { code?: string; message?: string }): string {
  const message = error.message?.toLowerCase() ?? "";

  if (isPermissionDeniedError(error) || message.includes("not authorized")) {
    return "You are not authorized to redeem this reward claim.";
  }

  if (message.includes("claim code not found")) {
    return "Claim code not found. Ask the customer to refresh their Rewards tab.";
  }

  if (message.includes("cannot be confirmed from status")) {
    return "This claim has already been redeemed or is not valid anymore.";
  }

  return "Unable to redeem reward right now. Please try again.";
}

export async function addStampByCustomerCodeAction({
  rawInput,
  selectedCardId,
}: AddStampByCustomerCodeInput): Promise<AddStampByCustomerCodeResult> {
  const session = await getCurrentProfile();
  if (!session) {
    return { ok: false, error: "Your session expired. Please log in again." };
  }

  const businessId = await resolveBusinessIdForCurrentUser({
    userId: session.user.id,
    userEmail: session.user.email,
  });
  if (!businessId) {
    return { ok: false, error: "No business profile found for this account." };
  }

  const customerCode = extractCustomerShortCodeFromScanInput(rawInput);
  if (!customerCode) {
    return {
      ok: false,
      reason: "error",
      error:
        "Invalid customer code. Scan a valid customer QR pass or enter a valid personal code.",
    };
  }

  const supabase = await createClient();
  const customerLookup = await lookupCustomerByPersonalCode(supabase, customerCode);
  if (!customerLookup.ok) {
    return { ok: false, reason: "error", error: customerLookup.error };
  }

  const customerProfile = customerLookup.profile;

  const { data: membershipRows, error: membershipError } = await supabase
    .from("customer_memberships")
    .select(
      "id, current_stamp_count, stamp_card_id, stamp_cards!inner(id, name, total_stamps, status, deleted_at)",
    )
    .eq("customer_id", customerProfile.id)
    .eq("business_id", businessId)
    .eq("status", "active")
    .eq("stamp_cards.status", "active")
    .is("stamp_cards.deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (membershipError) {
    if (isPermissionDeniedError(membershipError)) {
      return {
        ok: false,
        reason: "error",
        error:
          "Permission denied while reading memberships. Verify membership select policy.",
      };
    }
    return {
      ok: false,
      reason: "error",
      error: "Unable to find a valid card membership for this customer.",
    };
  }

  const activeMemberships: ActiveMembershipRow[] =
    membershipRows?.flatMap((row) => {
      const cardRaw = Array.isArray(row.stamp_cards) ? row.stamp_cards[0] : row.stamp_cards;
      if (!cardRaw) {
        return [];
      }

      return [
        {
          membership_id: row.id as string,
          cardId: cardRaw.id as string,
          cardName: cardRaw.name as string,
          currentStampCount: row.current_stamp_count as number,
          totalStamps: cardRaw.total_stamps as number,
        },
      ];
    }) ?? [];

  if (activeMemberships.length === 0) {
    return {
      ok: false,
      reason: "error",
      error: "Customer has no active card in this business yet.",
    };
  }

  if (!selectedCardId && activeMemberships.length > 1) {
    return {
      ok: false,
      reason: "select_card",
      customerName: customerProfile.full_name?.trim() || "Customer",
      customerCode,
      cards: activeMemberships.map((membership) => ({
        cardId: membership.cardId,
        cardName: membership.cardName,
        currentStampCount: membership.currentStampCount,
        totalStamps: membership.totalStamps,
      })),
    };
  }

  const membership =
    selectedCardId
      ? activeMemberships.find((item) => item.cardId === selectedCardId)
      : activeMemberships[0];
  if (!membership) {
    return {
      ok: false,
      reason: "error",
      error: "Selected card is not available for this customer anymore.",
    };
  }

  const { error: addStampError } = await supabase.from("stamp_events").insert({
    membership_id: membership.membership_id,
    business_id: businessId,
    stamp_card_id: membership.cardId,
    scanned_by: session.user.id,
  });

  if (addStampError) {
    return {
      ok: false,
      reason: "error",
      error: mapStampInsertErrorToMessage(addStampError),
    };
  }

  const { data: updatedMembership } = await supabase
    .from("customer_memberships")
    .select("current_stamp_count")
    .eq("id", membership.membership_id)
    .maybeSingle<{ current_stamp_count: number }>();

  return {
    ok: true,
    cardId: membership.cardId,
    cardName: membership.cardName,
    customerName: customerProfile.full_name?.trim() || "Customer",
    customerCode,
    currentStampCount: updatedMembership?.current_stamp_count ?? membership.currentStampCount + 1,
    totalStamps: membership.totalStamps,
  };
}

function mapRpcRedeemRow(data: unknown): {
  claimId: string;
  claimCode: string;
  rewardDescription: string;
} | null {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== "object") {
    return null;
  }

  const candidate = row as {
    id?: unknown;
    claim_code?: unknown;
    reward_description?: unknown;
  };

  if (typeof candidate.id !== "string" || typeof candidate.claim_code !== "string") {
    return null;
  }

  return {
    claimId: candidate.id,
    claimCode: candidate.claim_code,
    rewardDescription:
      typeof candidate.reward_description === "string" &&
      candidate.reward_description.trim().length > 0
        ? candidate.reward_description.trim()
        : "Reward",
  };
}

export async function redeemRewardByClaimCodeAction(
  rawInput: string,
): Promise<RedeemRewardByClaimCodeResult> {
  const session = await getCurrentProfile();
  if (!session) {
    return { ok: false, error: "Your session expired. Please log in again." };
  }

  const businessId = await resolveBusinessIdForCurrentUser({
    userId: session.user.id,
    userEmail: session.user.email,
  });
  if (!businessId) {
    return { ok: false, error: "No business profile found for this account." };
  }

  const claimCode = extractRewardClaimCodeFromScanInput(rawInput);
  if (!claimCode) {
    return {
      ok: false,
      error: "Invalid claim code. Scan a valid reward QR or enter a valid claim code.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("confirm_reward_claim", {
    p_claim_code: claimCode,
  });

  if (error) {
    return { ok: false, error: mapRewardRedeemErrorToMessage(error) };
  }

  const row = mapRpcRedeemRow(data);
  if (!row) {
    return { ok: false, error: "Unexpected response while redeeming reward." };
  }

  return {
    ok: true,
    claimId: row.claimId,
    claimCode: row.claimCode.toUpperCase(),
    rewardDescription: row.rewardDescription,
  };
}
