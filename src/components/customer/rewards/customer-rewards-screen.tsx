"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { markRewardClaimPendingAction } from "@/app/(customer)/rewards/actions";
import { QrPreviewModal } from "@/components/ui/qr-preview-modal";
import { StatusPopup } from "@/components/ui/status-popup";
import type { CustomerRewardItem, CustomerRewardStatus } from "@/lib/customer/rewards";
import { buildRewardClaimQrPayload } from "@/lib/qr/reward-claim";
import { CustomerRewardsCard } from "./customer-rewards-card";
import { CustomerRewardsEmptyState } from "./customer-rewards-empty-state";
import { CustomerRewardsHeader } from "./customer-rewards-header";
import { CustomerRewardsStatusTabs } from "./customer-rewards-status-tabs";

type CustomerRewardsScreenProps = {
  ready: CustomerRewardItem[];
  pending: CustomerRewardItem[];
  claimed: CustomerRewardItem[];
  isLoading?: boolean;
};

const COPY_FEEDBACK_MS = 1600;

function getRewardsForTab(
  tab: CustomerRewardStatus,
  rewards: CustomerRewardsScreenProps,
): CustomerRewardItem[] {
  if (tab === "pending") {
    return rewards.pending;
  }

  if (tab === "claimed") {
    return rewards.claimed;
  }

  return rewards.ready;
}

export function CustomerRewardsScreen({
  ready,
  pending,
  claimed,
  isLoading = false,
}: CustomerRewardsScreenProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CustomerRewardStatus>("ready");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeRewardForQr, setActiveRewardForQr] = useState<CustomerRewardItem | null>(null);
  const [submittingRewardId, setSubmittingRewardId] = useState<string | null>(null);
  const [popup, setPopup] = useState<{
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
  const copiedTimeoutRef = useRef<number | null>(null);
  const visibleRewards = getRewardsForTab(activeTab, { ready, pending, claimed });
  const rewardCountLabel = `${visibleRewards.length} ${visibleRewards.length === 1 ? "reward" : "rewards"}`;

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard can be blocked; still show copied feedback.
    }

    if (copiedTimeoutRef.current !== null) {
      window.clearTimeout(copiedTimeoutRef.current);
    }

    setCopiedCode(code);
    copiedTimeoutRef.current = window.setTimeout(() => {
      setCopiedCode(null);
      copiedTimeoutRef.current = null;
    }, COPY_FEEDBACK_MS);
  };

  const onShowToCashier = async (reward: CustomerRewardItem) => {
    if (reward.status === "pending") {
      setActiveRewardForQr(reward);
      return;
    }

    if (reward.status !== "ready") {
      return;
    }

    setSubmittingRewardId(reward.id);
    const result = await markRewardClaimPendingAction(reward.id);
    setSubmittingRewardId(null);

    if (!result.ok) {
      setPopup({
        open: true,
        variant: "error",
        title: "Unable to prepare reward",
        subtitle: result.error,
      });
      return;
    }

    setActiveRewardForQr({
      ...reward,
      status: "pending",
      code: result.claimCode?.trim() || reward.code,
    });
    router.refresh();
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[402px] bg-[#F7F8FB] text-[#322D45]">
      <CustomerRewardsHeader />

      <main className="px-5 pb-32">
        <CustomerRewardsStatusTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{
            ready: ready.length,
            pending: pending.length,
            claimed: claimed.length,
          }}
        />

        {visibleRewards.length > 0 ? (
          <section aria-labelledby={`${activeTab}-rewards-heading`}>
            <div className="mb-4 flex items-end justify-between gap-4 px-1">
              <div>
                {activeTab === "ready" ? (
                  <>
                    <p className="mb-1 text-[13px] font-medium text-[#777186]">
                      <span>Available now</span>
                    </p>
                    <h2
                      id="ready-rewards-heading"
                      className="font-display text-xl font-semibold tracking-[-0.025em]"
                    >
                      <span>Ready to enjoy</span>
                    </h2>
                  </>
                ) : activeTab === "pending" ? (
                  <>
                    <p className="mb-1 text-[13px] font-medium text-[#777186]">
                      <span>Awaiting cashier scan</span>
                    </p>
                    <h2
                      id="pending-rewards-heading"
                      className="font-display text-xl font-semibold tracking-[-0.025em]"
                    >
                      <span>Pending claims</span>
                    </h2>
                  </>
                ) : (
                  <>
                    <p className="mb-1 text-[13px] font-medium text-[#777186]">
                      <span>Saved history</span>
                    </p>
                    <h2
                      id="claimed-rewards-heading"
                      className="font-display text-xl font-semibold tracking-[-0.025em]"
                    >
                      <span>Claimed rewards</span>
                    </h2>
                  </>
                )}
              </div>
              <span className="rounded-full bg-[#FFC9A3]/70 px-3 py-1 font-mono text-[12px] font-medium">
                {rewardCountLabel}
              </span>
            </div>

            <div
              className="space-y-4"
              aria-label={
                activeTab === "ready"
                  ? "Rewards ready to claim"
                  : activeTab === "pending"
                    ? "Rewards pending claim"
                    : "Claimed rewards"
              }
            >
              {visibleRewards.map((reward) => (
                <CustomerRewardsCard
                  key={reward.id}
                  reward={reward}
                  copiedCode={copiedCode}
                  isSubmitting={submittingRewardId === reward.id}
                  showToCashierLabel={
                    reward.status === "ready" ? "Show to Cashier" : "Show Claim QR"
                  }
                  onCopyCode={(code) => {
                    void copyCode(code);
                  }}
                  onShowToCashier={(selectedReward) => {
                    void onShowToCashier(selectedReward);
                  }}
                />
              ))}
            </div>

            {activeTab === "ready" ? (
              <p className="px-5 pb-2 pt-6 text-center text-[13px] leading-5 text-[#8D879E]">
                <span>Tap Show to Cashier right before redeeming in-store.</span>
              </p>
            ) : null}
          </section>
        ) : (
          <section className={isLoading ? "animate-pulse" : undefined}>
            <CustomerRewardsEmptyState status={activeTab} />
          </section>
        )}

        <StatusPopup
          open={popup.open}
          variant={popup.variant}
          title={popup.title}
          subtitle={popup.subtitle}
          onConfirm={() =>
            setPopup((previous) => ({
              ...previous,
              open: false,
            }))
          }
        />
        <QrPreviewModal
          open={Boolean(activeRewardForQr)}
          eyebrow={activeRewardForQr?.businessName ?? "Reward"}
          title="Claim Reward QR"
          subtitle="Show this QR to the cashier to redeem your reward."
          code={activeRewardForQr?.code ?? ""}
          qrPayload={
            activeRewardForQr?.code
              ? buildRewardClaimQrPayload(activeRewardForQr.code)
              : ""
          }
          qrAriaLabel="Reward claim QR code"
          emptyMessage="Claim QR unavailable"
          onClose={() => setActiveRewardForQr(null)}
        />
        <span className="sr-only" aria-live="polite">
          {copiedCode ? `Copied ${copiedCode}` : ""}
        </span>
      </main>
    </div>
  );
}
