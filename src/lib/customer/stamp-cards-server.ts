import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  isCustomerCardId,
  mapCustomerStampCardListItems,
  type CustomerStampCardDetail,
  type CustomerStampCardListItem,
  type CustomerStampCardMilestone,
  type CustomerStampCardSource,
} from "@/lib/customer/stamp-cards";

type MembershipRow = {
  id: string;
  current_stamp_count: number | null;
  stamp_card_id: string;
  business_id: string;
};

type StampCardRow = {
  id: string;
  name: string | null;
  total_stamps: number | null;
  status: string | null;
  deleted_at: string | null;
};

type BusinessRow = {
  id: string;
  name: string | null;
  status: string | null;
  tagline: string | null;
};

function isActiveStampCard(card: StampCardRow): boolean {
  return card.status === "active" && !card.deleted_at;
}

function isActiveBusiness(business: BusinessRow): boolean {
  return business.status === "active";
}

function isColumnShapeError(error: { code?: string; message?: string }) {
  const message = error.message?.toLowerCase() ?? "";
  return (
    error.code === "PGRST204" ||
    error.code === "42703" ||
    message.includes("column") ||
    message.includes("schema cache") ||
    message.includes("has no field")
  );
}

async function listActiveBusinessesById(
  supabase: Awaited<ReturnType<typeof createClient>>,
  businessIds: string[],
): Promise<BusinessRow[]> {
  if (!businessIds.length) {
    return [];
  }

  const withTagline = await supabase
    .from("businesses")
    .select("id, name, status, tagline")
    .in("id", businessIds)
    .eq("status", "active");

  if (!withTagline.error) {
    return (withTagline.data ?? []) as BusinessRow[];
  }

  if (!isColumnShapeError(withTagline.error)) {
    return [];
  }

  const withoutTagline = await supabase
    .from("businesses")
    .select("id, name, status")
    .in("id", businessIds)
    .eq("status", "active");

  if (withoutTagline.error) {
    return [];
  }

  return ((withoutTagline.data ?? []) as Array<Omit<BusinessRow, "tagline">>).map((business) => ({
    ...business,
    tagline: null,
  }));
}

export async function listCustomerStampCards(
  customerId: string,
): Promise<CustomerStampCardListItem[]> {
  if (!customerId) {
    return [];
  }

  const supabase = await createClient();
  const { data: memberships, error: membershipsError } = await supabase
    .from("customer_memberships")
    .select("id, current_stamp_count, stamp_card_id, business_id")
    .eq("customer_id", customerId)
    .order("updated_at", { ascending: false });

  if (membershipsError || !memberships?.length) {
    return [];
  }

  const membershipRows = memberships as MembershipRow[];
  const cardIds = [...new Set(membershipRows.map((row) => row.stamp_card_id))];
  const businessIds = [...new Set(membershipRows.map((row) => row.business_id))];

  const [{ data: cards }, businesses] = await Promise.all([
    cardIds.length
      ? supabase
          .from("stamp_cards")
          .select("id, name, total_stamps, status, deleted_at")
          .in("id", cardIds)
          .eq("status", "active")
          .is("deleted_at", null)
      : Promise.resolve({ data: [] as StampCardRow[] }),
    listActiveBusinessesById(supabase, businessIds),
  ]);

  const cardsById = new Map(
    ((cards ?? []) as StampCardRow[])
      .filter(isActiveStampCard)
      .map((card) => [card.id, card]),
  );
  const businessesById = new Map(
    ((businesses ?? []) as BusinessRow[])
      .filter(isActiveBusiness)
      .map((business) => [business.id, business]),
  );

  const sources = membershipRows.flatMap((membership) => {
    const card = cardsById.get(membership.stamp_card_id);
    const business = businessesById.get(membership.business_id);

    if (!card || !business) {
      return [];
    }

    const source: CustomerStampCardSource = {
      id: membership.id,
      stampCardId: card.id,
      businessName: business.name ?? "",
      cardName: card.name ?? "",
      currentStamps: membership.current_stamp_count ?? 0,
      totalStamps: card.total_stamps ?? 0,
      tagline: business.tagline ?? null,
    };

    return [source];
  });

  return mapCustomerStampCardListItems(sources);
}

async function getStampCardRulesAndMilestones(stampCardId: string): Promise<{
  rules: string | null;
  milestones: CustomerStampCardMilestone[];
}> {
  const supabase = await createClient();
  const [{ data: card }, { data: milestones }] = await Promise.all([
    supabase
      .from("stamp_cards")
      .select("rules")
      .eq("id", stampCardId)
      .maybeSingle<{ rules: string | null }>(),
    supabase
      .from("stamp_card_milestones")
      .select("stamp_number, reward_description")
      .eq("stamp_card_id", stampCardId)
      .order("stamp_number", { ascending: true }),
  ]);

  return {
    rules: card?.rules ?? null,
    milestones:
      milestones?.flatMap((milestone) => {
        if (typeof milestone.stamp_number !== "number") {
          return [];
        }

        const rewardDescription = milestone.reward_description?.trim();
        if (!rewardDescription) {
          return [];
        }

        return [
          {
            stampNumber: milestone.stamp_number,
            rewardDescription,
          },
        ];
      }) ?? [],
  };
}

export async function getCustomerStampCardDetail(
  customerId: string,
  cardId: string,
): Promise<CustomerStampCardDetail | null> {
  if (!customerId || !isCustomerCardId(cardId)) {
    return null;
  }

  const cards = await listCustomerStampCards(customerId);
  const card = cards.find((item) => item.id === cardId || item.stampCardId === cardId);
  if (!card) {
    return null;
  }

  const { rules, milestones } = await getStampCardRulesAndMilestones(card.stampCardId);

  return {
    ...card,
    rules,
    milestones,
  };
}
