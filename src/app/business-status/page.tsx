import { redirect } from "next/navigation";
import { BusinessStatusScreen } from "@/components/auth/business-status-screen";
import {
  BUSINESS_ONBOARDING_PATH,
  getCurrentProfile,
  getRoleRedirect,
} from "@/lib/auth";
import {
  canAccessBusinessDashboard,
  getBusinessStatus,
} from "@/lib/business/status";

export default async function BusinessStatusPage() {
  const session = await getCurrentProfile();

  if (!session) {
    redirect("/");
  }

  if (session.resolvedRole && session.resolvedRole !== "business_owner") {
    redirect(getRoleRedirect(session.resolvedRole));
  }

  if (session.profile?.onboarding_completed !== true) {
    redirect(BUSINESS_ONBOARDING_PATH);
  }

  const status = await getBusinessStatus({
    userId: session.user.id,
    userEmail: session.user.email,
  });

  if (canAccessBusinessDashboard(status)) {
    redirect("/dashboard");
  }

  return <BusinessStatusScreen status={status} />;
}
