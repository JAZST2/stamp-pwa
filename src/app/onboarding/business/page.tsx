import { redirect } from "next/navigation";
import { BusinessOnboarding } from "@/components/auth/business-onboarding";
import { getCurrentProfile, getRoleRedirect } from "@/lib/auth";

export default async function BusinessOnboardingPage() {
  const session = await getCurrentProfile();

  if (!session) {
    redirect("/");
  }

  if (session.resolvedRole && session.resolvedRole !== "business_owner") {
    redirect(getRoleRedirect(session.resolvedRole));
  }

  if (session.profile?.onboarding_completed === true) {
    redirect("/dashboard");
  }

  return <BusinessOnboarding initialContactEmail={session.user.email ?? ""} />;
}
