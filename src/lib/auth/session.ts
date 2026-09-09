import type { User } from "@supabase/supabase-js";
import { normalizeRole, type Profile, type ProfileRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export async function getAuthUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<{
  user: User;
  profile: Profile | null;
  resolvedRole: ProfileRole | null;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone, personal_short_code, onboarding_completed")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  const resolvedRole =
    normalizeRole(profile?.role) ??
    normalizeRole(user.user_metadata?.role);

  return { user, profile, resolvedRole };
}
