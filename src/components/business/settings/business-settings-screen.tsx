"use client";

import { useRouter } from "next/navigation";
import {
  Bell,
  CircleHelp,
  Gift,
  KeyRound,
  LogOut,
  Megaphone,
  ShieldAlert,
  Smartphone,
  UserRound,
} from "lucide-react";
import {
  SettingsButtonRow,
  SettingsSection,
  SettingsToggleRow,
} from "@/components/settings/settings-primitives";
import { useLogout } from "@/components/auth/use-logout";
import { getInitials } from "@/lib/display";

type BusinessSettingsScreenProps = {
  businessName: string;
  contactEmail: string;
  contactPhone: string | null;
};

export function BusinessSettingsScreen({
  businessName,
  contactEmail,
  contactPhone,
}: BusinessSettingsScreenProps) {
  const router = useRouter();
  const { isLoggingOut, logout } = useLogout();
  const initials = getInitials(businessName, "BZ");
  const linkedMobile = contactPhone || "Not linked";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E5E2EC]/80 bg-[#F7F8FB]/94 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[402px] items-end px-5 pb-4 pt-[max(12px,env(safe-area-inset-top))]">
          <h1 className="font-display text-[22px] font-semibold tracking-[-0.025em]">Settings</h1>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[402px] px-5 pb-[128px] pt-6">
        <section className="flex items-center gap-3" aria-labelledby="business-profile-name">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#9FE0C7] font-display text-lg font-bold text-[#322D45] shadow-[inset_0_0_0_1px_rgba(50,45,69,0.08)]"
            aria-label={`${businessName} avatar`}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="business-profile-name"
              className="truncate font-display text-[17px] font-semibold tracking-[-0.02em]"
            >
              {businessName}
            </h2>
            <p className="mt-1 truncate text-[13px] text-[#777186]">{contactEmail}</p>
          </div>
        </section>

        <SettingsSection title="Account">
          <SettingsButtonRow
            label="Edit Profile"
            icon={UserRound}
            onClick={() => router.push("/biz/settings/profile")}
          />
          <SettingsButtonRow label="Change Password" icon={KeyRound} />
          <SettingsButtonRow
            label="Linked Mobile"
            icon={Smartphone}
            value={linkedMobile}
            border={false}
          />
        </SettingsSection>

        <SettingsSection title="Notifications">
          <SettingsToggleRow label="Stamp Alerts" icon={Bell} checked disabled />
          <SettingsToggleRow
            label="Reward Notifications"
            icon={Gift}
            checked
            disabled
          />
          <SettingsToggleRow
            label="Promotions & Updates"
            icon={Megaphone}
            checked={false}
            border={false}
            disabled
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsButtonRow label="Help & Support" icon={CircleHelp} />
          <SettingsButtonRow label="Report a Problem" icon={ShieldAlert} border={false} />
        </SettingsSection>

        <SettingsSection title="Danger zone">
          <SettingsButtonRow
            label="Log Out"
            icon={LogOut}
            warning
            border={false}
            onClick={() => void logout()}
            rightLabel={isLoggingOut ? "Logging out..." : undefined}
            disabled={isLoggingOut}
          />
        </SettingsSection>
      </section>
    </>
  );
}
