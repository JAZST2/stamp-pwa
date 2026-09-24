import { redirect } from "next/navigation";
import { BusinessDashboardScreen } from "@/components/business/dashboard/business-dashboard-screen";
import { getCurrentProfile } from "@/lib/auth";
import { getBusinessDashboardSnapshot } from "@/lib/business/dashboard-server";

export default async function DashboardPage() {
  const session = await getCurrentProfile();
  if (!session) {
    redirect("/");
  }

  const snapshot = await getBusinessDashboardSnapshot({
    userId: session.user.id,
    userEmail: session.user.email,
  });

  return <BusinessDashboardScreen snapshot={snapshot} />;
}
