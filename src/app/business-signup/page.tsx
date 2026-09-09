import { redirect } from "next/navigation";
import { BusinessSignUp } from "@/components/auth/business-signup";
import { getCurrentProfile, getPostLoginRedirect } from "@/lib/auth";

export default async function BusinessSignUpPage() {
  const session = await getCurrentProfile();

  if (session?.user) {
    redirect(
      getPostLoginRedirect({
        role: session.resolvedRole,
        onboardingCompleted: session.profile?.onboarding_completed,
      }),
    );
  }

  return <BusinessSignUp />;
}
