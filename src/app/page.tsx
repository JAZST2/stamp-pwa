import { redirect } from "next/navigation";
import { CustomerLogin } from "@/components/auth/customer-login";
import { getCurrentProfile, getPostLoginRedirect } from "@/lib/auth";

export default async function RootPage() {
  const session = await getCurrentProfile();

  if (session?.user) {
    redirect(
      getPostLoginRedirect({
        role: session.resolvedRole,
        onboardingCompleted: session.profile?.onboarding_completed,
      }),
    );
  }

  return <CustomerLogin />;
}
