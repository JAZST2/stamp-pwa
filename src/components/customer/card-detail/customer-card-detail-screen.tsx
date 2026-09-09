"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, QrCode } from "lucide-react";
import { activateRewardClaimAction } from "@/app/(customer)/rewards/actions";
import { CustomerStampCard } from "@/components/customer/customer-stamp-card";
import { CustomerTopBar } from "@/components/customer/customer-top-bar";
import { CustomerCardRewardRulesModal } from "@/components/customer/card-detail/customer-card-reward-rules-modal";
import { CustomerCardUnlockedRewardRow } from "@/components/customer/card-detail/customer-card-unlocked-reward-row";
import { PillButton } from "@/components/ui/pill-button";
import { QrPreviewModal } from "@/components/ui/qr-preview-modal";
import { StatusPopup } from "@/components/ui/status-popup";
import {
  DEFAULT_CUSTOMER_CARD_TAGLINE,
  getStampCardProgressMessage,
  type CustomerStampCardMilestone,
} from "@/lib/customer/stamp-cards";
import type { CustomerUnlockedRewardItem } from "@/lib/customer/rewards";

export type CustomerCardDetailScreenProps = {
  businessName: string;
  currentStamps: number;
  totalStamps: number;
  tagline?: string;
  rules: string | null;
  milestones: CustomerStampCardMilestone[];
  personalCode: string;
  qrPayload: string;
  unlockedRewards: CustomerUnlockedRewardItem[];
};

type OpenPopup = "qr" | "rules" | null;

export function CustomerCardDetailScreen({
  businessName,
  currentStamps,
  totalStamps,
  tagline = DEFAULT_CUSTOMER_CARD_TAGLINE,
  rules,
  milestones,
  personalCode,
  qrPayload,
  unlockedRewards,
}: CustomerCardDetailScreenProps) {
  const router = useRouter();
  const [openPopup, setOpenPopup] = useState<OpenPopup>(null);
  const [activatingRewardId, setActivatingRewardId] = useState<string | null>(null);
  const [statusPopup, setStatusPopup] = useState<{
    open: boolean;
    variant: "success" | "error" | "info";
    title: string;
    subtitle: string;
  }>({
    open: false,
    variant: "info",
    title: "",
    subtitle: "",
  });
  const displayName = businessName.trim() || "Stamp card";
  const progressMessage = getStampCardProgressMessage(currentStamps, totalStamps);
  const closePopup = useCallback(() => setOpenPopup(null), []);

  const activateUnlockedReward = async (reward: CustomerUnlockedRewardItem) => {
    if (activatingRewardId) {
      return;
    }

    setActivatingRewardId(reward.id);
    const result = await activateRewardClaimAction(reward.id);
    setActivatingRewardId(null);

    if (!result.ok) {
      setStatusPopup({
        open: true,
        variant: "error",
        title: "Unable to activate reward",
        subtitle: result.error,
      });
      return;
    }

    const activatedCode = result.claimCode?.trim();
    setStatusPopup({
      open: true,
      variant: "success",
      title: "Reward activated",
      subtitle: activatedCode
        ? `Claim code ${activatedCode} is now ready in your Rewards tab.`
        : "Your reward is now ready in your Rewards tab.",
    });
    router.refresh();
  };

  return (
    <>
      <CustomerTopBar title={displayName} backHref="/home" showProfile={false} />

      <main className="mx-auto flex w-full max-w-[402px] flex-col px-5 pb-32 pt-[calc(6rem+env(safe-area-inset-top))]">
        <section aria-labelledby="card-detail-heading">
          <div className="mb-6 px-1">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6D6680]">
              <span>Your loyalty card</span>
            </p>
            <h1
              id="card-detail-heading"
              className="mt-2 font-display text-[28px] font-bold leading-tight tracking-[-0.04em] text-[#322D45]"
            >
              <span>{tagline}</span>
            </h1>
          </div>

          <CustomerStampCard
            variant="full"
            businessName={displayName}
            currentStamps={currentStamps}
            totalStamps={totalStamps}
            className="shadow-[0_4px_12px_rgba(50,45,69,0.06)]"
          />

          <div className="mx-3 rounded-b-[20px] bg-[#322D45] px-5 py-4 text-center shadow-[0_4px_12px_rgba(50,45,69,0.06)]">
            <p className="font-mono text-sm font-bold leading-relaxed text-white">
              <span>{progressMessage}</span>
            </p>
          </div>
        </section>

        <section aria-labelledby="card-actions-heading" className="mt-8">
          {unlockedRewards.length > 0 ? (
            <div className="mb-6 rounded-[22px] border border-[#E8E2F5] bg-[#F2EDFD] p-4 shadow-[0_8px_20px_rgba(50,45,69,0.05)]">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#6D6680]">
                Reward unlocked
              </p>
              <h2 className="mt-2 font-display text-[21px] font-semibold leading-tight tracking-[-0.03em] text-[#322D45]">
                Tap to activate and generate your claim code.
              </h2>
              <div className="mt-4 space-y-3">
                {unlockedRewards.map((reward) => (
                  <CustomerCardUnlockedRewardRow
                    key={reward.id}
                    reward={reward}
                    isActivating={activatingRewardId === reward.id}
                    onActivate={(item) => {
                      void activateUnlockedReward(item);
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}
          <h2 id="card-actions-heading" className="sr-only">
            <span>Card actions</span>
          </h2>
          <div className="flex flex-col gap-3">
            <PillButton
              variant="mint"
              size="lg"
              className="min-h-14 w-full gap-2.5 font-semibold shadow-[0_4px_12px_rgba(50,45,69,0.06)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/35"
              aria-label={`Show my ${displayName} join QR code`}
              onClick={() => setOpenPopup("qr")}
            >
              <QrCode aria-hidden="true" className="h-5 w-5" />
              <span>Show My Join QR</span>
            </PillButton>
            <PillButton
              variant="peach"
              size="lg"
              className="min-h-14 w-full gap-2.5 font-semibold shadow-[0_4px_12px_rgba(50,45,69,0.06)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFC9A3]/40"
              aria-label={`View ${displayName} reward rules`}
              onClick={() => setOpenPopup("rules")}
            >
              <BookOpen aria-hidden="true" className="h-5 w-5" />
              <span>View Reward Rules</span>
            </PillButton>
          </div>
          <p className="mt-5 text-center text-sm leading-6 text-[#6D6680]">
            <span>Present your QR before paying to collect a stamp.</span>
          </p>
        </section>
      </main>

      <QrPreviewModal
        open={openPopup === "qr"}
        eyebrow={displayName}
        title="Your Join QR"
        subtitle="Present this QR before paying to collect a stamp."
        code={personalCode}
        qrPayload={qrPayload}
        qrAriaLabel={`Join QR code for ${displayName}`}
        onClose={closePopup}
      />
      <CustomerCardRewardRulesModal
        open={openPopup === "rules"}
        businessName={displayName}
        rules={rules}
        milestones={milestones}
        onClose={closePopup}
      />
      <StatusPopup
        open={statusPopup.open}
        variant={statusPopup.variant}
        title={statusPopup.title}
        subtitle={statusPopup.subtitle}
        onConfirm={() =>
          setStatusPopup((previous) => ({
            ...previous,
            open: false,
          }))
        }
      />
    </>
  );
}
