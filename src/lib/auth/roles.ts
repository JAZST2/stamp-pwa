export type ProfileRole =
  | "customer"
  | "business_owner"
  | "staff"
  | "platform_admin";

export type Profile = {
  id: string;
  role: ProfileRole;
  full_name: string | null;
  phone: string | null;
  personal_short_code: string | null;
  onboarding_completed: boolean | null;
};

export const ROLE_REDIRECT: Record<ProfileRole, string> = {
  customer: "/home",
  business_owner: "/dashboard",
  staff: "/biz/scan",
  platform_admin: "/queue",
};

export const CUSTOMER_ONBOARDING_PATH = "/onboarding/customer";
export const BUSINESS_ONBOARDING_PATH = "/onboarding/business";
export const BUSINESS_STATUS_PATH = "/business-status";

export function normalizeRole(role?: string | null): ProfileRole | null {
  if (!role) {
    return null;
  }

  const normalized = role.trim().toLowerCase();
  if (normalized in ROLE_REDIRECT) {
    return normalized as ProfileRole;
  }

  return null;
}

export function getRoleRedirect(role?: string | null): string {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole) {
    return ROLE_REDIRECT[normalizedRole];
  }

  return ROLE_REDIRECT.customer;
}

export function isOnboardingCompleted(value?: boolean | null): boolean {
  return value === true;
}

export function getPostLoginRedirect(options: {
  role?: string | null;
  onboardingCompleted?: boolean | null;
}): string {
  const normalizedRole = normalizeRole(options.role);

  if (
    normalizedRole === "business_owner" &&
    !isOnboardingCompleted(options.onboardingCompleted)
  ) {
    return BUSINESS_ONBOARDING_PATH;
  }

  if (
    normalizedRole === "customer" &&
    !isOnboardingCompleted(options.onboardingCompleted)
  ) {
    return CUSTOMER_ONBOARDING_PATH;
  }

  return getRoleRedirect(normalizedRole);
}
