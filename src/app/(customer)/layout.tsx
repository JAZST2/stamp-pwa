import "@/styles/globals.css";
import { redirect } from "next/navigation";
import {
  CUSTOMER_ONBOARDING_PATH,
  getCurrentProfile,
  getRoleRedirect,
  isOnboardingCompleted,
} from "@/lib/auth";
import { CustomerTabNavigation } from "@/components/customer/customer-tab-navigation";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentProfile();

  if (!session) {
    redirect("/");
  }

  if (session.resolvedRole && session.resolvedRole !== "customer") {
    redirect(getRoleRedirect(session.resolvedRole));
  }

  if (!isOnboardingCompleted(session.profile?.onboarding_completed)) {
    redirect(CUSTOMER_ONBOARDING_PATH);
  }

  return (
    <div className="min-h-screen bg-[#F7F8FB] text-[#322D45]">
      {children}
      <CustomerTabNavigation />
    </div>
  );
}
