export {
  BUSINESS_STATUS_PATH,
  BUSINESS_ONBOARDING_PATH,
  CUSTOMER_ONBOARDING_PATH,
  ROLE_REDIRECT,
  getPostLoginRedirect,
  getRoleRedirect,
  isOnboardingCompleted,
  normalizeRole,
  type Profile,
  type ProfileRole,
} from "@/lib/auth/roles";

export { getAuthUser, getCurrentProfile } from "@/lib/auth/session";
