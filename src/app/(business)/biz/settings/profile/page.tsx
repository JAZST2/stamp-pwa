import { redirect } from "next/navigation";
import { BusinessEditProfileScreen } from "@/components/business/settings/business-edit-profile-screen";
import { getCurrentProfile } from "@/lib/auth";
import { emptyBusinessProfileDraft } from "@/lib/business/profile";
import { getBusinessProfileForCurrentUser } from "@/lib/business/profile-server";

export const dynamic = "force-dynamic";

export default async function BusinessEditProfilePage() {
  const session = await getCurrentProfile();
  if (!session) {
    redirect("/");
  }

  const profile = await getBusinessProfileForCurrentUser({
    userId: session.user.id,
    userEmail: session.user.email,
  });

  return (
    <BusinessEditProfileScreen
      initialDraft={profile ?? emptyBusinessProfileDraft()}
    />
  );
}
