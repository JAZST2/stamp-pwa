"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  CircleHelp,
  Copy,
  Gift,
  KeyRound,
  LogOut,
  Maximize2,
  Megaphone,
  QrCode,
  Share2,
  ShieldAlert,
  Smartphone,
  Trash2,
  UserRound,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useLogout } from "@/components/auth/use-logout";
import { PersonalQrPreviewModal } from "@/components/customer/settings/personal-qr-preview-modal";
import {
  SettingsButtonRow,
  SettingsSection,
  SettingsToggleRow,
} from "@/components/settings/settings-primitives";
import { buildCustomerPassQrPayload } from "@/lib/qr/customer-pass";

type CustomerSettingsScreenProps = {
  fullName: string;
  email: string;
  personalCode: string;
  phone: string | null;
};

function getAvatarInitials(fullName: string) {
  const nameParts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!nameParts.length) {
    return "CU";
  }

  return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
}

export function CustomerSettingsScreen({
  fullName,
  email,
  personalCode,
  phone,
}: CustomerSettingsScreenProps) {
  const router = useRouter();
  const { isLoggingOut, logout } = useLogout();
  const [stampAlerts, setStampAlerts] = useState(true);
  const [rewardNotifications, setRewardNotifications] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isQrPreviewOpen, setIsQrPreviewOpen] = useState(false);

  const avatarInitials = getAvatarInitials(fullName);
  const hasPersonalCode = personalCode.trim().length > 0;
  const qrPayload = hasPersonalCode ? buildCustomerPassQrPayload(personalCode) : "";
  const linkedMobile = phone || "Not linked";

  const copyCode = async () => {
    if (!hasPersonalCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(personalCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const shareQr = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My PerklyPh QR",
          text: `Add me on PerklyPh - ${personalCode}`,
        });
        return;
      }
    } catch {
      // User canceled share or platform rejected payload.
    }

    await copyCode();
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E5E2EC]/80 bg-[#F7F8FB]/94 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[402px] items-end px-5 pb-4 pt-[max(12px,env(safe-area-inset-top))]">
          <h1 className="font-display text-[22px] font-semibold tracking-[-0.025em]">Settings</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[402px] px-5 pb-[128px] pt-6">
        <section className="flex items-center gap-3" aria-labelledby="profile-name">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#9FE0C7] font-display text-lg font-bold text-[#322D45] shadow-[inset_0_0_0_1px_rgba(50,45,69,0.08)]"
            aria-label={`${fullName} avatar`}
          >
            {avatarInitials}
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="profile-name"
              className="truncate font-display text-[17px] font-semibold tracking-[-0.02em]"
            >
              {fullName}
            </h2>
            <p className="mt-1 truncate text-[13px] text-[#777186]">{email}</p>
          </div>
        </section>

        <section
          className="relative mt-6 overflow-hidden rounded-2xl bg-[#E4DFF5] p-5 shadow-[0_8px_22px_rgba(50,45,69,0.08)]"
          aria-labelledby="personal-qr-title"
        >
          <div className="absolute -right-9 -top-9 h-28 w-28 rounded-full bg-white/25" aria-hidden="true" />
          <div className="relative flex items-center gap-5">
            <figure className="shrink-0 rounded-[14px] bg-white p-2.5 shadow-[0_4px_12px_rgba(50,45,69,0.08)]">
              {hasPersonalCode ? (
                <button
                  type="button"
                  onClick={() => setIsQrPreviewOpen(true)}
                  className="block rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45]"
                  aria-label="View larger personal QR"
                >
                  <QRCodeCanvas
                    value={qrPayload}
                    size={128}
                    fgColor="#322D45"
                    bgColor="#FFFFFF"
                    marginSize={2}
                    level="H"
                    role="img"
                    aria-label={`Personal QR code for ${fullName}`}
                  />
                </button>
              ) : (
                <div
                  className="grid h-[128px] w-[128px] place-items-center bg-white text-center text-[11px] leading-4 text-[#777186]"
                  aria-hidden="true"
                >
                  QR unavailable
                </div>
              )}
              <figcaption className="sr-only">Personal QR code for user {personalCode || "unavailable"}</figcaption>
            </figure>
            <div className="min-w-0 flex-1">
              <QrCode className="mb-2 h-5 w-5 text-[#625B79]" strokeWidth={1.8} aria-hidden="true" />
              <h2 id="personal-qr-title" className="font-display text-[16px] font-semibold leading-tight">
                Your Personal QR
              </h2>
              <p className="mt-2 font-mono text-[13px] font-bold tracking-[0.08em] text-[#4A9E7E]">
                {hasPersonalCode ? personalCode : "Not generated"}
              </p>
              <button
                type="button"
                onClick={() => setIsQrPreviewOpen(true)}
                disabled={!hasPersonalCode}
                className="mt-3 inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#B9B4C9]/80 bg-white/55 px-3 text-[11px] font-medium text-[#322D45] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98] disabled:opacity-50"
              >
                <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                View QR
              </button>
            </div>
          </div>
          <div className="relative mt-4 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => void copyCode()}
              disabled={!hasPersonalCode}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#B9B4C9]/80 bg-[#EAE7F5] px-4 text-xs font-medium transition hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98] disabled:opacity-50"
            >
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied ? "Copied" : "Copy Code"}
            </button>
            <button
              type="button"
              onClick={() => void shareQr()}
              disabled={!hasPersonalCode}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#9FE0C7] px-4 text-xs font-semibold transition hover:bg-[#8FD5BB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98] disabled:opacity-50"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share QR
            </button>
          </div>
        </section>

        <SettingsSection title="Account">
          <SettingsButtonRow
            label="Edit Profile"
            icon={UserRound}
            onClick={() => router.push("/settings/profile")}
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
          <SettingsToggleRow
            label="Stamp Alerts"
            icon={Bell}
            checked={stampAlerts}
            onChange={() => setStampAlerts((current) => !current)}
          />
          <SettingsToggleRow
            label="Reward Notifications"
            icon={Gift}
            checked={rewardNotifications}
            onChange={() => setRewardNotifications((current) => !current)}
          />
          <SettingsToggleRow
            label="Promotions & Updates"
            icon={Megaphone}
            checked={promotions}
            onChange={() => setPromotions((current) => !current)}
            border={false}
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
            border
            onClick={() => void logout()}
            rightLabel={isLoggingOut ? "Logging out..." : undefined}
            disabled={isLoggingOut}
          />
          <SettingsButtonRow
            label="Delete Account"
            icon={Trash2}
            danger
            border={false}
          />
        </SettingsSection>
      </main>

      <PersonalQrPreviewModal
        open={isQrPreviewOpen && hasPersonalCode}
        fullName={fullName}
        personalCode={personalCode}
        qrPayload={qrPayload}
        onClose={() => setIsQrPreviewOpen(false)}
      />
    </>
  );
}
