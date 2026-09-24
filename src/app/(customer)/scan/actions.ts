"use server";

import { getCurrentProfile } from "@/lib/auth";
import {
  joinActiveStampCardForCustomer,
  type JoinStampCardResult,
} from "@/lib/customer/join-server";
import { extractCardCodeFromScanInput } from "@/lib/customer/scan-join";
import { isCustomerCardId } from "@/lib/customer/stamp-cards";

export type { JoinStampCardResult };

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

  return joinActiveStampCardForCustomer({
    customerId: session.user.id,
    cardCode,
  });
}

export async function joinStampCardByIdAction(cardId: string): Promise<JoinStampCardResult> {
  const session = await getCurrentProfile();

  if (!session || session.resolvedRole !== "customer") {
    return { ok: false, error: "Please log in as a customer to join a card." };
  }

  if (!isCustomerCardId(cardId)) {
    return { ok: false, error: "Invalid stamp card." };
  }

  return joinActiveStampCardForCustomer({
    customerId: session.user.id,
    cardId,
  });
}
