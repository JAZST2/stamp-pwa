"use server";

import { getCurrentProfile } from "@/lib/auth";
import { updateCustomerProfile } from "@/lib/customer/profile-server";

export async function updateCustomerProfileAction(input: {
  fullName: string;
  phoneDigits: string;
}) {
  const session = await getCurrentProfile();
  if (!session || session.resolvedRole !== "customer") {
    return { ok: false as const, error: "Please log in as a customer to continue." };
  }

  return updateCustomerProfile({
    userId: session.user.id,
    fullName: input.fullName,
    phoneDigits: input.phoneDigits,
  });
}
