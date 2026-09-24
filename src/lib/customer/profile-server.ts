import "server-only";

import { formatPhMobile } from "@/lib/customer/personal-code";
import { isPermissionDeniedError } from "@/lib/supabase/errors";
import { createClient } from "@/lib/supabase/server";

export type UpdateCustomerProfileResult =
  | { ok: true; fullName: string; phone: string }
  | { ok: false; error: string };

export async function updateCustomerProfile(options: {
  userId: string;
  fullName: string;
  phoneDigits: string;
}): Promise<UpdateCustomerProfileResult> {
  const fullName = options.fullName.trim();
  const phoneDigits = options.phoneDigits.replace(/\D/g, "").slice(0, 10);

  if (!fullName) {
    return { ok: false, error: "Please enter your full name." };
  }

  if (!/^\d{10}$/.test(phoneDigits)) {
    return { ok: false, error: "Please enter a valid 10-digit mobile number." };
  }

  const phone = formatPhMobile(phoneDigits);
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone,
    })
    .eq("id", options.userId);

  if (error) {
    if (isPermissionDeniedError(error)) {
      return {
        ok: false,
        error: "Permission denied while updating your profile. Check the profiles update policy.",
      };
    }
    return { ok: false, error: "Unable to save your profile right now. Please try again." };
  }

  await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      phone,
    },
  });

  return { ok: true, fullName, phone };
}
