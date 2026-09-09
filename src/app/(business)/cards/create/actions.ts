"use server";

import type {
  StampCardMilestoneCreateInput,
  StampCardSetupDraft,
} from "@/lib/business/stamp-cards";
import { getCurrentProfile } from "@/lib/auth";
import { resolveBusinessIdForCurrentUser } from "@/lib/business/stamp-cards-server";
import { createClient } from "@/lib/supabase/server";

type CreateStampCardDraftResult =
  | { ok: true; cardId: string }
  | { ok: false; error: string };

type FinalizeStampCardResult = { ok: true } | { ok: false; error: string };

function hasDuplicateMilestoneNumbers(
  milestones: StampCardMilestoneCreateInput[],
): boolean {
  const uniqueNumbers = new Set(milestones.map((milestone) => milestone.stamp_number));
  return uniqueNumbers.size !== milestones.length;
}

function sanitizeMilestones(
  milestones: StampCardMilestoneCreateInput[],
): StampCardMilestoneCreateInput[] {
  return milestones.map((milestone) => ({
    stamp_number: milestone.stamp_number,
    reward_description: milestone.reward_description.trim(),
  }));
}

function isPermissionDeniedError(error?: { code?: string } | null): boolean {
  return error?.code === "42501";
}

export async function createStampCardDraftAction(
  payload: StampCardSetupDraft,
): Promise<CreateStampCardDraftResult> {
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

  const cardName = payload.card.name.trim();
  const rules = payload.card.rules?.trim() ?? "";
  const milestones = sanitizeMilestones(payload.milestones);

  if (!cardName) {
    return { ok: false, error: "Card name is required." };
  }

  if (!payload.card.expiry_date) {
    return { ok: false, error: "Expiry date is required." };
  }

  if (!rules) {
    return { ok: false, error: "Card rules are required." };
  }

  if (milestones.length === 0) {
    return { ok: false, error: "At least one milestone is required." };
  }

  if (milestones.some((milestone) => !milestone.reward_description)) {
    return { ok: false, error: "All milestones must have a reward." };
  }

  if (hasDuplicateMilestoneNumbers(milestones)) {
    return {
      ok: false,
      error: "Milestone stamp numbers must be unique.",
    };
  }

  if (
    milestones.some(
      (milestone) =>
        milestone.stamp_number < 1 ||
        milestone.stamp_number > payload.card.total_stamps,
    )
  ) {
    return {
      ok: false,
      error: "Milestone stamp numbers must be within total stamps.",
    };
  }

  const supabase = await createClient();
  const { data: insertedCard, error: insertCardError } = await supabase
    .from("stamp_cards")
    .insert({
      business_id: businessId,
      name: cardName,
      total_stamps: payload.card.total_stamps,
      expiry_date: payload.card.expiry_date,
      rules,
      status: "inactive",
    })
    .select("id")
    .single<{ id: string }>();

  if (insertCardError || !insertedCard) {
    if (isPermissionDeniedError(insertCardError)) {
      return {
        ok: false,
        error:
          "Permission denied while creating cards. Apply Supabase table grants/policies for stamp_cards.",
      };
    }
    return { ok: false, error: "Unable to save card setup. Please try again." };
  }

  const { error: milestonesError } = await supabase.from("stamp_card_milestones").insert(
    milestones.map((milestone) => ({
      stamp_card_id: insertedCard.id,
      stamp_number: milestone.stamp_number,
      reward_description: milestone.reward_description,
    })),
  );

  if (milestonesError) {
    await supabase.from("stamp_cards").delete().eq("id", insertedCard.id);
    if (isPermissionDeniedError(milestonesError)) {
      return {
        ok: false,
        error:
          "Permission denied while saving milestones. Apply Supabase table grants/policies for stamp_card_milestones.",
      };
    }
    return { ok: false, error: "Unable to save milestones. Please try again." };
  }

  return { ok: true, cardId: insertedCard.id };
}

export async function finalizeStampCardAction(
  cardId: string,
): Promise<FinalizeStampCardResult> {
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

  const supabase = await createClient();
  const { error } = await supabase
    .from("stamp_cards")
    .update({ status: "active" })
    .eq("id", cardId)
    .eq("business_id", businessId);

  if (error) {
    if (isPermissionDeniedError(error)) {
      return {
        ok: false,
        error:
          "Permission denied while finalizing card. Apply Supabase update grants/policies for stamp_cards.",
      };
    }
    return { ok: false, error: "Unable to finalize card. Please try again." };
  }

  return { ok: true };
}
