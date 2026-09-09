"use server";

import { revalidatePath } from "next/cache";
import type {
  StampCardMilestoneCreateInput,
  StampCardStatus,
} from "@/lib/business/stamp-cards";
import { getCurrentProfile } from "@/lib/auth";
import { resolveBusinessIdForCurrentUser } from "@/lib/business/stamp-cards-server";
import { createClient } from "@/lib/supabase/server";

type UpdateStampCardInput = {
  cardId: string;
  name: string;
  total_stamps: number;
  expiry_date: string | null;
  rules: string | null;
  status: StampCardStatus;
  milestones: StampCardMilestoneCreateInput[];
};

type UpdateStampCardResult = { ok: true } | { ok: false; error: string };

function sanitizeMilestones(
  milestones: StampCardMilestoneCreateInput[],
): StampCardMilestoneCreateInput[] {
  return milestones.map((milestone) => ({
    stamp_number: milestone.stamp_number,
    reward_description: milestone.reward_description.trim(),
  }));
}

function hasDuplicateMilestoneNumbers(
  milestones: StampCardMilestoneCreateInput[],
): boolean {
  const uniqueNumbers = new Set(milestones.map((milestone) => milestone.stamp_number));
  return uniqueNumbers.size !== milestones.length;
}

function isPermissionDeniedError(error?: { code?: string } | null): boolean {
  return error?.code === "42501";
}

function isMissingFunctionError(error?: { code?: string } | null): boolean {
  return error?.code === "PGRST202" || error?.code === "42883";
}

export async function updateStampCardAction(
  payload: UpdateStampCardInput,
): Promise<UpdateStampCardResult> {
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

  const name = payload.name.trim();
  const rules = payload.rules?.trim() ?? "";
  const milestones = sanitizeMilestones(payload.milestones);

  if (!name) {
    return { ok: false, error: "Card name is required." };
  }

  if (!payload.expiry_date) {
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
    return { ok: false, error: "Milestone stamp numbers must be unique." };
  }

  if (
    milestones.some(
      (milestone) =>
        milestone.stamp_number < 1 || milestone.stamp_number > payload.total_stamps,
    )
  ) {
    return {
      ok: false,
      error: "Milestone stamp numbers must be within total stamps.",
    };
  }

  const supabase = await createClient();

  const { error: updateCardError } = await supabase
    .from("stamp_cards")
    .update({
      name,
      total_stamps: payload.total_stamps,
      expiry_date: payload.expiry_date,
      rules,
      status: payload.status,
    })
    .eq("id", payload.cardId)
    .eq("business_id", businessId);

  if (updateCardError) {
    if (isPermissionDeniedError(updateCardError)) {
      return {
        ok: false,
        error:
          "Permission denied while updating card. Apply Supabase update grants/policies for stamp_cards.",
      };
    }
    return { ok: false, error: "Unable to update card. Please try again." };
  }

  const { error: upsertMilestonesError } = await supabase
    .from("stamp_card_milestones")
    .upsert(
      milestones.map((milestone) => ({
        stamp_card_id: payload.cardId,
        stamp_number: milestone.stamp_number,
        reward_description: milestone.reward_description,
      })),
      {
        onConflict: "stamp_card_id,stamp_number",
      },
    );

  if (upsertMilestonesError) {
    if (isPermissionDeniedError(upsertMilestonesError)) {
      return {
        ok: false,
        error:
          "Permission denied while saving milestones. Apply Supabase grants/policies for stamp_card_milestones.",
      };
    }
    return { ok: false, error: "Unable to save milestones. Please try again." };
  }

  const allowedStampNumbers = milestones.map((milestone) => milestone.stamp_number);
  const { error: pruneMilestonesError } = await supabase
    .from("stamp_card_milestones")
    .delete()
    .eq("stamp_card_id", payload.cardId)
    .not("stamp_number", "in", `(${allowedStampNumbers.join(",")})`);

  if (pruneMilestonesError) {
    if (isPermissionDeniedError(pruneMilestonesError)) {
      return {
        ok: false,
        error:
          "Permission denied while pruning milestones. Apply Supabase grants/policies for stamp_card_milestones.",
      };
    }
    return { ok: false, error: "Unable to finalize milestones. Please try again." };
  }

  revalidatePath("/cards");
  revalidatePath(`/cards/${payload.cardId}`);
  revalidatePath(`/cards/${payload.cardId}/edit`);

  return { ok: true };
}

export async function softDeleteStampCardAction(
  cardId: string,
): Promise<UpdateStampCardResult> {
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

  if (!cardId.trim()) {
    return { ok: false, error: "Card is required." };
  }

  const supabase = await createClient();
  const { data: existingCard, error: existingCardError } = await supabase
    .from("stamp_cards")
    .select("id")
    .eq("id", cardId)
    .eq("business_id", businessId)
    .in("status", ["active", "inactive"])
    .is("deleted_at", null)
    .maybeSingle<{ id: string }>();

  if (existingCardError) {
    if (isPermissionDeniedError(existingCardError)) {
      return {
        ok: false,
        error:
          "Permission denied while deleting card. Apply Supabase select/update grants and policies for stamp_cards.",
      };
    }
    return { ok: false, error: "Unable to find card. Please try again." };
  }

  if (!existingCard) {
    return { ok: false, error: "Card was not found or is already deleted." };
  }

  const { error } = await supabase.rpc("soft_delete_stamp_card", {
    p_card_id: cardId,
  });

  if (error) {
    if (isPermissionDeniedError(error)) {
      return {
        ok: false,
        error:
          "Permission denied while deleting card. Apply Supabase grants for soft_delete_stamp_card.",
      };
    }
    if (isMissingFunctionError(error)) {
      return {
        ok: false,
        error:
          "Delete is not available yet. Run the soft_delete_stamp_card migration in Supabase.",
      };
    }
    if (error.code === "P0002") {
      return { ok: false, error: "Card was not found or is already deleted." };
    }
    return { ok: false, error: "Unable to delete card. Please try again." };
  }

  revalidatePath("/cards");
  revalidatePath(`/cards/${cardId}`);
  revalidatePath(`/cards/${cardId}/edit`);

  return { ok: true };
}
