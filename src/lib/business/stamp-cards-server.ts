import { createClient } from "@/lib/supabase/server";
import {
  normalizeStampCardStatus,
  type StampCardDetailItem,
  type StampCardListItem,
  type StampCardQrStepPreview,
} from "@/lib/business/stamp-cards";

type ResolveBusinessOptions = {
  userId: string;
  userEmail?: string | null;
};

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

export async function resolveBusinessIdForCurrentUser(
  options: ResolveBusinessOptions,
): Promise<string | null> {
  const supabase = await createClient();

  const ownerColumnCandidates: Array<{
    column: string;
    value: string | null | undefined;
  }> = [
    { column: "owner_id", value: options.userId },
    { column: "user_id", value: options.userId },
    { column: "profile_id", value: options.userId },
    { column: "created_by", value: options.userId },
    { column: "contact_email", value: options.userEmail },
  ];

  for (const candidate of ownerColumnCandidates) {
    if (!candidate.value) {
      continue;
    }

    const { data, error } = await supabase
      .from("businesses")
      .select("id, created_at")
      .eq(candidate.column, candidate.value)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      if (isColumnShapeError(error)) {
        continue;
      }
      continue;
    }

    const businessId = data?.[0]?.id;
    if (businessId) {
      return businessId;
    }
  }

  const { data: staffRows, error: staffError } = await supabase
    .from("business_staff")
    .select("business_id, created_at")
    .eq("profile_id", options.userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1);

  if (!staffError) {
    const businessId = staffRows?.[0]?.business_id;
    if (businessId) {
      return businessId;
    }
  }

  return null;
}

export async function listStampCardsForCurrentUserBusiness(options: {
  userId: string;
  userEmail?: string | null;
}): Promise<StampCardListItem[]> {
  const businessId = await resolveBusinessIdForCurrentUser(options);
  if (!businessId) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stamp_cards")
    .select("id, name, total_stamps, expiry_date, status, created_at")
    .eq("business_id", businessId)
    .in("status", ["active", "inactive"])
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  const cardIds = data.map((card) => card.id);
  let milestoneCountByCardId = new Map<string, number>();

  if (cardIds.length > 0) {
    const { data: milestones } = await supabase
      .from("stamp_card_milestones")
      .select("stamp_card_id")
      .in("stamp_card_id", cardIds);

    milestoneCountByCardId = (milestones ?? []).reduce((acc, milestone) => {
      const currentCount = acc.get(milestone.stamp_card_id) ?? 0;
      acc.set(milestone.stamp_card_id, currentCount + 1);
      return acc;
    }, new Map<string, number>());
  }

  return data.flatMap((card) => {
    const status = normalizeStampCardStatus(card.status);
    if (!status) {
      return [];
    }

    return [
      {
        id: card.id,
        name: card.name,
        total_stamps: card.total_stamps,
        expiry_date: card.expiry_date,
        status,
        created_at: card.created_at,
        milestone_count: milestoneCountByCardId.get(card.id) ?? 0,
      },
    ];
  });
}

export async function getStampCardQrPreviewForCurrentUser(options: {
  cardId: string;
  userId: string;
  userEmail?: string | null;
}): Promise<StampCardQrStepPreview | null> {
  const businessId = await resolveBusinessIdForCurrentUser({
    userId: options.userId,
    userEmail: options.userEmail,
  });

  if (!businessId) {
    return null;
  }

  const supabase = await createClient();
  const { data: card, error: cardError } = await supabase
    .from("stamp_cards")
    .select("name, total_stamps, expiry_date, card_code")
    .eq("id", options.cardId)
    .eq("business_id", businessId)
    .neq("status", "deleted")
    .is("deleted_at", null)
    .maybeSingle<{
      name: string;
      total_stamps: number;
      expiry_date: string | null;
      card_code: string | null;
    }>();

  if (cardError || !card) {
    return null;
  }

  const { data: milestones, error: milestonesError } = await supabase
    .from("stamp_card_milestones")
    .select("stamp_number, reward_description")
    .eq("stamp_card_id", options.cardId)
    .order("stamp_number", { ascending: true });

  if (milestonesError) {
    return null;
  }

  return {
    name: card.name,
    total_stamps: card.total_stamps,
    expiry_date: card.expiry_date,
    card_code: card.card_code,
    milestones:
      milestones?.map((milestone) => ({
        stamp_number: milestone.stamp_number,
        reward_description: milestone.reward_description,
      })) ?? [],
  };
}

export async function getStampCardDetailForCurrentUser(options: {
  cardId: string;
  userId: string;
  userEmail?: string | null;
}): Promise<StampCardDetailItem | null> {
  const businessId = await resolveBusinessIdForCurrentUser({
    userId: options.userId,
    userEmail: options.userEmail,
  });
  if (!businessId) {
    return null;
  }

  const supabase = await createClient();
  const { data: card, error: cardError } = await supabase
    .from("stamp_cards")
    .select("id, name, total_stamps, expiry_date, rules, card_code, status, updated_at")
    .eq("id", options.cardId)
    .eq("business_id", businessId)
    .in("status", ["active", "inactive"])
    .is("deleted_at", null)
    .maybeSingle<{
      id: string;
      name: string;
      total_stamps: number;
      expiry_date: string | null;
      rules: string | null;
      card_code: string | null;
      status: string;
      updated_at: string;
    }>();

  if (cardError || !card) {
    return null;
  }

  const status = normalizeStampCardStatus(card.status);
  if (!status) {
    return null;
  }

  const { data: milestones, error: milestonesError } = await supabase
    .from("stamp_card_milestones")
    .select("stamp_number, reward_description")
    .eq("stamp_card_id", options.cardId)
    .order("stamp_number", { ascending: true });

  if (milestonesError) {
    return null;
  }

  return {
    id: card.id,
    name: card.name,
    total_stamps: card.total_stamps,
    expiry_date: card.expiry_date,
    rules: card.rules,
    card_code: card.card_code,
    status,
    updated_at: card.updated_at,
    milestones:
      milestones?.map((milestone) => ({
        stamp_number: milestone.stamp_number,
        reward_description: milestone.reward_description,
      })) ?? [],
  };
}
