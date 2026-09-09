import { redirect } from "next/navigation";
import { CustomerSignUp } from "@/components/auth/customer-signup";
import { getCurrentProfile, getPostLoginRedirect } from "@/lib/auth";

export default async function SignUpPage() {
  const session = await getCurrentProfile();

  if (session?.user) {
    redirect(
      getPostLoginRedirect({
        role: session.resolvedRole,
        onboardingCompleted: session.profile?.onboarding_completed,
      }),
    );
  }

  return <CustomerSignUp />;
}
