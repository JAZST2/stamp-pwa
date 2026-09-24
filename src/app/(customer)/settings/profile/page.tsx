import { redirect } from "next/navigation";
import { CustomerEditProfileScreen } from "@/components/customer/settings/customer-edit-profile-screen";
import { getCurrentProfile } from "@/lib/auth";

const DEFAULT_FULL_NAME = "Customer";
const DEFAULT_EMAIL = "No email on file";

export default async function CustomerEditProfilePage() {
  const session = await getCurrentProfile();
  if (!session) {
    redirect("/");
  }

  const fullName =
    session.profile?.full_name ||
    session.user.user_metadata?.full_name ||
    DEFAULT_FULL_NAME;

  return (
    <CustomerEditProfileScreen
      fullName={fullName}
      email={session.user.email || DEFAULT_EMAIL}
      phone={session.profile?.phone ?? null}
    />
  );
}
