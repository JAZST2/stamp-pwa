import { redirect } from "next/navigation";
import { BusinessLogin } from "@/components/auth/business-login";
import { getCurrentProfile, getPostLoginRedirect } from "@/lib/auth";

export default async function BusinessLoginPage() {
  const session = await getCurrentProfile();

  if (session?.user) {
    redirect(
      getPostLoginRedirect({
        role: session.resolvedRole,
        onboardingCompleted: session.profile?.onboarding_completed,
      }),
    );
  }

  return <BusinessLogin />;
}
