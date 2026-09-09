import { INFO } from "@/lib/messages/info";
import type { StatusMessage } from "@/lib/messages/types";

export const ERROR = {
  PASSWORD_MISMATCH: {
    title: "Password Mismatch",
    subtitle: "Your password and confirmation password should match.",
  },
  EMAIL_ALREADY_REGISTERED: {
    title: "Email Already Registered",
    subtitle: "This email already has an account. Please log in instead.",
  },
  RATE_LIMIT: {
    title: "Sign Up Failed",
    subtitle: "Too many attempts right now. Please wait a moment, then try again.",
  },
  SIGN_UP_FAILED: {
    title: "Sign Up Failed",
    subtitle: "We couldn't create your account right now. Please try again.",
  },
  GENERIC: {
    title: "Something Went Wrong",
    subtitle: "We couldn't create your account right now. Please try again.",
  },
  LOGIN_FAILED: {
    title: "Login Failed",
    subtitle: "Unable to log in. Please try again.",
  },
  LOGIN_CONFIG: {
    title: "Login Failed",
    subtitle: "Unable to log in. Please check your configuration.",
  },
  ONBOARDING_SAVE_FAILED: {
    title: "Update Failed",
    subtitle: "We couldn't save your profile right now. Please try again.",
  },
  BUSINESS_ONBOARDING_SAVE_FAILED: {
    title: "Business Setup Failed",
    subtitle: "We couldn't save your business details right now. Please try again.",
  },
} as const satisfies Record<string, StatusMessage>;

export function getSignUpErrorMessage(rawMessage: string): StatusMessage {
  const normalized = rawMessage.toLowerCase();

  if (
    normalized.includes("already registered") ||
    normalized.includes("already exists")
  ) {
    return ERROR.EMAIL_ALREADY_REGISTERED;
  }

  if (normalized.includes("rate limit")) {
    return ERROR.RATE_LIMIT;
  }

  if (
    normalized.includes("password") &&
    (normalized.includes("weak") || normalized.includes("least"))
  ) {
    return {
      title: ERROR.SIGN_UP_FAILED.title,
      subtitle: INFO.WEAK_PASSWORD.subtitle,
    };
  }

  return ERROR.SIGN_UP_FAILED;
}

export function getLoginErrorMessage(rawMessage?: string | null): StatusMessage {
  if (!rawMessage) {
    return ERROR.LOGIN_FAILED;
  }

  const normalized = rawMessage.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return {
      title: ERROR.LOGIN_FAILED.title,
      subtitle: "Email or password is incorrect. Please try again.",
    };
  }

  if (normalized.includes("rate limit")) {
    return {
      title: ERROR.LOGIN_FAILED.title,
      subtitle: "Too many attempts right now. Please wait a moment, then try again.",
    };
  }

  return ERROR.LOGIN_FAILED;
}
