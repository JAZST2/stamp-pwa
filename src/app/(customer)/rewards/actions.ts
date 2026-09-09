"use server";

import { getCurrentProfile } from "@/lib/auth";
import {
  activateRewardClaim,
  markRewardClaimPending,
  type RewardClaimMutationResult,
} from "@/lib/customer/rewards-server";

function isCustomerSession(
  session: Awaited<ReturnType<typeof getCurrentProfile>>,
): session is NonNullable<Awaited<ReturnType<typeof getCurrentProfile>>> {
  return Boolean(session && session.resolvedRole === "customer");
}

function unauthorizedResult(): RewardClaimMutationResult {
  return { ok: false, error: "Please log in as a customer to continue." };
}

export async function activateRewardClaimAction(
  claimId: string,
): Promise<RewardClaimMutationResult> {
  const session = await getCurrentProfile();
  if (!isCustomerSession(session)) {
    return unauthorizedResult();
  }

  return activateRewardClaim(claimId);
}

export async function markRewardClaimPendingAction(
  claimId: string,
): Promise<RewardClaimMutationResult> {
  const session = await getCurrentProfile();
  if (!isCustomerSession(session)) {
    return unauthorizedResult();
  }

  return markRewardClaimPending(claimId);
}
