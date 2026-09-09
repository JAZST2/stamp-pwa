import { CustomerSettingsScreen } from "@/components/customer/settings/customer-settings-screen";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { ensurePersonalShortCode } from "@/lib/customer/personal-code-server";

const DEFAULT_FULL_NAME = "Customer";
const DEFAULT_EMAIL = "No email on file";

export default async function SettingsPage() {
  const session = await getCurrentProfile();
  if (!session) {
    redirect("/");
  }

  const fullName =
    session.profile?.full_name ||
    session.user.user_metadata?.full_name ||
    DEFAULT_FULL_NAME;
  const email = session.user.email || DEFAULT_EMAIL;
  const personalCode =
    (await ensurePersonalShortCode({
      userId: session.user.id,
      fullName,
      phone: session.profile?.phone ?? null,
      existingPersonalCode: session.profile?.personal_short_code ?? null,
    })) ?? "";

  return (
    <CustomerSettingsScreen
      fullName={fullName}
      email={email}
      personalCode={personalCode}
      phone={session.profile?.phone ?? null}
    />
  );
}
