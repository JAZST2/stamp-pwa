import type { StatusMessage } from "@/lib/messages/types";

export const INFO = {
  TERMS_REQUIRED: {
    title: "Confirmation Needed",
    subtitle: "Please agree to the Terms & Privacy Policy to continue.",
  },
  WEAK_PASSWORD: {
    title: "Weak Password",
    subtitle: "Please use at least 8 characters for your password.",
  },
  INVALID_PHONE: {
    title: "Invalid Mobile Number",
    subtitle: "Please enter exactly 10 digits for your mobile number.",
  },
} as const satisfies Record<string, StatusMessage>;
