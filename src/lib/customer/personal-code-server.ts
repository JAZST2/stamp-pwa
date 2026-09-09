import "server-only";
import { createClient } from "@/lib/supabase/server";
import { buildPersonalShortCode } from "@/lib/customer/personal-code";

const PERSONAL_CODE_ATTEMPTS = 8;

type EnsurePersonalShortCodeParams = {
  userId: string;
  fullName: string;
  phone: string | null;
  existingPersonalCode: string | null;
};

function isUniqueViolation(error?: { code?: string; message?: string } | null) {
  return (
    error?.code === "23505" &&
    Boolean(error.message?.toLowerCase().includes("personal_short_code"))
  );
}

export async function ensurePersonalShortCode({
  userId,
  fullName,
  phone,
  existingPersonalCode,
}: EnsurePersonalShortCodeParams): Promise<string | null> {
  if (existingPersonalCode) {
    return existingPersonalCode;
  }

  const supabase = await createClient();

  for (let attempt = 0; attempt < PERSONAL_CODE_ATTEMPTS; attempt += 1) {
    const personalShortCode = buildPersonalShortCode(fullName, phone ?? "");
    const { data, error } = await supabase
      .from("profiles")
      .update({
        personal_short_code: personalShortCode,
      })
      .eq("id", userId)
      .is("personal_short_code", null)
      .select("personal_short_code")
      .maybeSingle<{ personal_short_code: string | null }>();

    if (!error) {
      if (data?.personal_short_code) {
        return data.personal_short_code;
      }

      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("personal_short_code")
        .eq("id", userId)
        .maybeSingle<{ personal_short_code: string | null }>();

      if (currentProfile?.personal_short_code) {
        return currentProfile.personal_short_code;
      }
    }

    if (isUniqueViolation(error)) {
      continue;
    }

    return null;
  }

  return null;
}
