import "server-only";

import type { BusinessDashboardSnapshot } from "@/lib/business/dashboard";
import { resolveBusinessIdForCurrentUser } from "@/lib/business/stamp-cards-server";
import { createClient } from "@/lib/supabase/server";

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercent(numerator: number, denominator: number): string {
  if (denominator <= 0) {
    return "0%";
  }

  return `${Math.round((numerator / denominator) * 100)}%`;
}

function buildMetrics(values: {
  uniqueCustomers: number;
  stampsIssued: number;
  activeCards: number;
  claimedRewards: number;
  completedMemberships: number;
}): BusinessDashboardSnapshot["metrics"] {
  return [
    {
      id: "unique-customers",
      label: "Unique Customer",
      value: formatCount(values.uniqueCustomers),
    },
    {
      id: "stamps-issued",
      label: "Stamp Issued",
      value: formatCount(values.stampsIssued),
    },
    {
      id: "active-cards",
      label: "Active Cards",
      value: formatCount(values.activeCards),
    },
    {
      id: "redemption-rate",
      label: "Redemption Rate",
      value: formatPercent(values.claimedRewards, values.completedMemberships),
    },
  ];
}

export async function getBusinessDashboardSnapshot(options: {
  userId: string;
  userEmail?: string | null;
}): Promise<BusinessDashboardSnapshot> {
  const empty: BusinessDashboardSnapshot = {
    businessName: "Business",
    metrics: buildMetrics({
      uniqueCustomers: 0,
      stampsIssued: 0,
      activeCards: 0,
      claimedRewards: 0,
      completedMemberships: 0,
    }),
  };

  const businessId = await resolveBusinessIdForCurrentUser(options);
  if (!businessId) {
    return empty;
  }

  const supabase = await createClient();

  const [businessResult, cardsResult, membershipsResult, stampEventsResult, rewardClaimsResult] = await Promise.all([
    supabase.from("businesses").select("name").eq("id", businessId).maybeSingle<{ name: string | null }>(),
    supabase
      .from("stamp_cards")
      .select("id, status")
      .eq("business_id", businessId)
      .neq("status", "deleted"),
    supabase
      .from("customer_memberships")
      .select("id, customer_id, status")
      .eq("business_id", businessId),
    supabase
      .from("stamp_events")
      .select("id", { count: "exact", head: true })
      .eq("business_id", businessId),
    supabase
      .from("reward_claims")
      .select("id, status")
      .eq("business_id", businessId),
  ]);

  const cards = cardsResult.data ?? [];
  const activeCards = cards.filter((card) => card.status === "active").length;
  const memberships = membershipsResult.data ?? [];
  const uniqueCustomers = new Set(
    memberships.map((row) => row.customer_id).filter((value): value is string => Boolean(value)),
  ).size;
  const completedMemberships = memberships.filter((row) => row.status === "completed").length;
  const rewardClaims = rewardClaimsResult.data ?? [];
  const claimedRewards = rewardClaims.filter((row) => row.status === "claimed").length;

  return {
    businessName: businessResult.data?.name?.trim() || "Business",
    metrics: buildMetrics({
      uniqueCustomers,
      stampsIssued: stampEventsResult.count ?? 0,
      activeCards,
      claimedRewards,
      completedMemberships,
    }),
  };
}
