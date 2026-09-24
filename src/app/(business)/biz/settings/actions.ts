"use server";

import { getCurrentProfile } from "@/lib/auth";
import type { BusinessProfileDraft } from "@/lib/business/profile";
import { updateBusinessProfileForCurrentUser } from "@/lib/business/profile-server";

export async function updateBusinessProfileAction(draft: BusinessProfileDraft) {
  const session = await getCurrentProfile();
  if (!session || session.resolvedRole !== "business_owner") {
    return { ok: false as const, error: "Please log in as a business owner to continue." };
  }

  return updateBusinessProfileForCurrentUser({
    userId: session.user.id,
    userEmail: session.user.email,
    draft,
  });
}
