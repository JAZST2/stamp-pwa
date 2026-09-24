import { redirect } from "next/navigation";
import { BusinessSettingsScreen } from "@/components/business/settings/business-settings-screen";
import { getCurrentProfile } from "@/lib/auth";
import { getBusinessProfileForCurrentUser } from "@/lib/business/profile-server";
import { formatPhMobile } from "@/lib/customer/personal-code";

export const dynamic = "force-dynamic";

const DEFAULT_EMAIL = "No email on file";

export default async function BusinessSettingsPage() {
  const session = await getCurrentProfile();
  if (!session) {
    redirect("/");
  }

  const profile = await getBusinessProfileForCurrentUser({
    userId: session.user.id,
    userEmail: session.user.email,
  });
  const businessName = profile?.name.trim() || "";

  return (
    <BusinessSettingsScreen
      businessName={businessName}
      contactEmail={profile?.contactEmail || session.user.email || DEFAULT_EMAIL}
      contactPhone={profile?.contactPhoneDigits ? formatPhMobile(profile.contactPhoneDigits) : null}
    />
  );
}
