import "server-only";

import { isPermissionDeniedError, isUniqueViolationError } from "@/lib/supabase/errors";
import { createClient } from "@/lib/supabase/server";

export type JoinStampCardResult =
  | {
      ok: true;
      status: "joined" | "already_joined";
      cardName: string;
      cardCode: string;
      membershipId: string | null;
    }
  | {
      ok: false;
      error: string;
    };

type ActiveCardRow = {
  id: string;
  name: string;
  business_id: string;
  card_code: string | null;
};

async function loadActiveCard(options: {
  cardId?: string;
  cardCode?: string;
}): Promise<{ ok: true; card: ActiveCardRow } | { ok: false; error: string }> {
  const supabase = await createClient();
  let query = supabase
    .from("stamp_cards")
    .select("id, name, business_id, card_code")
    .eq("status", "active")
    .is("deleted_at", null);

  if (options.cardId) {
    query = query.eq("id", options.cardId);
  } else if (options.cardCode) {
    query = query.eq("card_code", options.cardCode);
  } else {
    return { ok: false, error: "A valid stamp card is required to join." };
  }

  const { data: card, error: cardError } = await query.maybeSingle<ActiveCardRow>();

  if (cardError) {
    if (isPermissionDeniedError(cardError)) {
      return {
        ok: false,
        error: "Permission denied while reading card data. Please check RLS policies.",
      };
    }
    return { ok: false, error: "Unable to validate this card right now. Please try again." };
  }

  if (!card) {
    return {
      ok: false,
      error: "Card not found or unavailable. It may be inactive or deleted.",
    };
  }

  return { ok: true, card };
}

export async function joinActiveStampCardForCustomer(options: {
  customerId: string;
  cardId?: string;
  cardCode?: string;
}): Promise<JoinStampCardResult> {
  const loaded = await loadActiveCard(options);
  if (!loaded.ok) {
    return loaded;
  }

  const card = loaded.card;
  const cardCode = card.card_code?.trim().toUpperCase() || options.cardCode || "";
  const supabase = await createClient();

  const { data: existingMembership } = await supabase
    .from("customer_memberships")
    .select("id")
    .eq("customer_id", options.customerId)
    .eq("stamp_card_id", card.id)
    .maybeSingle<{ id: string }>();

  if (existingMembership) {
    return {
      ok: true,
      status: "already_joined",
      cardName: card.name,
      cardCode,
      membershipId: existingMembership.id,
    };
  }

  const { data: createdMembership, error: createMembershipError } = await supabase
    .from("customer_memberships")
    .insert({
      customer_id: options.customerId,
      stamp_card_id: card.id,
      business_id: card.business_id,
    })
    .select("id")
    .maybeSingle<{ id: string }>();

  if (createMembershipError) {
    if (isUniqueViolationError(createMembershipError)) {
      const { data: membership } = await supabase
        .from("customer_memberships")
        .select("id")
        .eq("customer_id", options.customerId)
        .eq("stamp_card_id", card.id)
        .maybeSingle<{ id: string }>();

      return {
        ok: true,
        status: "already_joined",
        cardName: card.name,
        cardCode,
        membershipId: membership?.id ?? null,
      };
    }

    if (isPermissionDeniedError(createMembershipError)) {
      return {
        ok: false,
        error: "Unable to join this card due to permissions. Verify membership insert policy.",
      };
    }

    return {
      ok: false,
      error: "Unable to join card right now. Please try again in a moment.",
    };
  }

  return {
    ok: true,
    status: "joined",
    cardName: card.name,
    cardCode,
    membershipId: createdMembership?.id ?? null,
  };
}
