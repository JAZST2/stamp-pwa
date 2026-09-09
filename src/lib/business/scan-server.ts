import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

type CustomerPassProfile = {
  id: string;
  full_name: string | null;
};

function isMissingFunctionError(error?: { code?: string } | null): boolean {
  return error?.code === "PGRST202" || error?.code === "42883";
}

function isPermissionDeniedError(error?: { code?: string } | null): boolean {
  return error?.code === "42501";
}

export async function lookupCustomerByPersonalCode(
  supabase: SupabaseClient,
  personalShortCode: string,
): Promise<
  | { ok: true; profile: CustomerPassProfile }
  | { ok: false; error: string }
> {
  const { data, error } = await supabase.rpc("lookup_customer_by_personal_code", {
    p_code: personalShortCode,
  });

  if (!error) {
    const row = Array.isArray(data) ? data[0] : data;
    if (row?.id) {
      return {
        ok: true,
        profile: {
          id: row.id as string,
          full_name: (row.full_name as string | null) ?? null,
        },
      };
    }

    return {
      ok: false,
      error: "Customer code was not found. Ask the customer to refresh their pass.",
    };
  }

  if (isPermissionDeniedError(error)) {
    return {
      ok: false,
      error: "Permission denied while reading customer pass. Verify lookup grants.",
    };
  }

  if (!isMissingFunctionError(error)) {
    return { ok: false, error: "Unable to validate customer code. Please try again." };
  }

  const { data: customerProfile, error: fallbackError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .ilike("personal_short_code", personalShortCode)
    .eq("role", "customer")
    .maybeSingle<{ id: string; full_name: string | null }>();

  if (fallbackError) {
    if (isPermissionDeniedError(fallbackError)) {
      return {
        ok: false,
        error:
          "Permission denied while reading customer profile. Run the customer pass lookup SQL in Supabase.",
      };
    }
    return { ok: false, error: "Unable to validate customer code. Please try again." };
  }

  if (!customerProfile) {
    return {
      ok: false,
      error:
        "Customer code was not found. If this customer exists, run the customer pass lookup SQL in Supabase.",
    };
  }

  return { ok: true, profile: customerProfile };
}
