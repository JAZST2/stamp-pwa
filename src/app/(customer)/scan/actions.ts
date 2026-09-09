"use server";

import { getCurrentProfile } from "@/lib/auth";
import { extractCardCodeFromScanInput } from "@/lib/customer/scan-join";
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

function isPermissionDeniedError(error?: { code?: string } | null): boolean {
  return error?.code === "42501";
}

function isUniqueViolationError(error?: { code?: string } | null): boolean {
  return error?.code === "23505";
}

export async function joinStampCardAction(rawInput: string): Promise<JoinStampCardResult> {
  const session = await getCurrentProfile();

  if (!session || session.resolvedRole !== "customer") {
    return { ok: false, error: "Please log in as a customer to join a card." };
  }

  const cardCode = extractCardCodeFromScanInput(rawInput);
  if (!cardCode) {
    return {
      ok: false,
      error: "Invalid code. Scan a valid QR or enter a valid business card code.",
    };
  }

  const supabase = await createClient();
  const { data: card, error: cardError } = await supabase
    .from("stamp_cards")
    .select("id, name, business_id, card_code")
    .eq("card_code", cardCode)
    .eq("status", "active")
    .is("deleted_at", null)
    .maybeSingle<{
      id: string;
      name: string;
      business_id: string;
      card_code: string | null;
    }>();

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

  const { error: createMembershipError } = await supabase
    .from("customer_memberships")
    .insert({
      customer_id: session.user.id,
      stamp_card_id: card.id,
      business_id: card.business_id,
    });

  if (createMembershipError) {
    if (isUniqueViolationError(createMembershipError)) {
      return {
        ok: true,
        status: "already_joined",
        cardName: card.name,
        cardCode,
        membershipId: null,
      };
    }

    if (isPermissionDeniedError(createMembershipError)) {
      return {
        ok: false,
        error:
          "Unable to join this card due to permissions. Verify membership insert policy.",
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
    membershipId: null,
  };
}
