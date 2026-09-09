import type { StatusMessage } from "@/lib/messages/types";

export const SUCCESS = {
  ACCOUNT_CREATED: {
    title: "Account Created",
    subtitle:
      "Welcome to PerklyPh! Your account was created successfully. Please log in to continue.",
  },
  ONBOARDING_COMPLETED: {
    title: "Profile Updated",
    subtitle:
      "You're all set! Your contact number and backup short code are saved successfully.",
  },
  BUSINESS_ONBOARDING_COMPLETED: {
    title: "Business Setup Complete",
    subtitle:
      "Your business details are saved successfully. You can now manage your portal.",
  },
} as const satisfies Record<string, StatusMessage>;
