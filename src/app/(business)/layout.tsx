import "@/styles/globals.css";
import { redirect } from "next/navigation";
import {
  BUSINESS_ONBOARDING_PATH,
  BUSINESS_STATUS_PATH,
  getCurrentProfile,
  getRoleRedirect,
} from "@/lib/auth";
import {
  canAccessBusinessDashboard,
  getBusinessStatus,
} from "@/lib/business/status";
import { BusinessRouteShell } from "@/components/business";

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const businessStatus = await getBusinessStatus({
    userId: session.user.id,
    userEmail: session.user.email,
  });

  if (!canAccessBusinessDashboard(businessStatus)) {
    redirect(BUSINESS_STATUS_PATH);
  }

  return <BusinessRouteShell>{children}</BusinessRouteShell>;
}
