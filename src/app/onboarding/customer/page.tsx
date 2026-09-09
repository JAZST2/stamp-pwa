import { redirect } from "next/navigation";
import { CustomerOnboarding } from "@/components/auth/customer-onboarding";
import {
  getCurrentProfile,
  getRoleRedirect,
  isOnboardingCompleted,
} from "@/lib/auth";

export default async function CustomerOnboardingPage() {
  const session = await getCurrentProfile();

  if (!session) {
    redirect("/");
  }

  if (session.resolvedRole && session.resolvedRole !== "customer") {
    redirect(getRoleRedirect(session.resolvedRole));
  }

  if (isOnboardingCompleted(session.profile?.onboarding_completed)) {
    redirect("/home");
  }

  return (
    <CustomerOnboarding fullName={session.profile?.full_name ?? "Customer"} />
  );
}
