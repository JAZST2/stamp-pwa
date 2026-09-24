"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { joinStampCardByIdAction } from "@/app/(customer)/scan/actions";
import { StatusPopup } from "@/components/ui/status-popup";
import type { BrowseLandingCard } from "@/lib/customer/browse";

type CustomerLandingCardItemProps = {
  businessName: string;
  card: BrowseLandingCard;
};

export function CustomerLandingCardItem({ businessName, card }: CustomerLandingCardItemProps) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const isJoined = card.isJoined;

  const stampSlots = useMemo(
    () =>
      Array.from({ length: Math.max(0, card.totalStamps) }, (_, index) => {
        const stampNumber = index + 1;
        const isMilestone = card.milestones.some((milestone) => milestone.stampNumber === stampNumber);
        return {
          id: `${card.id}-stamp-${stampNumber}`,
          stampNumber,
          isMilestone,
        };
      }),
    [card.id, card.milestones, card.totalStamps],
  );

  const firstMilestone = card.milestones[0];
  const rewardLabel = firstMilestone
    ? `${firstMilestone.stampNumber}th stamp = ${firstMilestone.rewardDescription}`
    : "Collect stamps to unlock rewards";

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

  const handleJoin = async () => {
    if (isJoined) {
      return;
    }

    setIsJoining(true);
    const result = await joinStampCardByIdAction(card.id);
    setIsJoining(false);

    if (!result.ok) {
      setPopup({
        open: true,
        variant: "error",
        title: "Unable to join",
        subtitle: result.error,
      });
      return;
    }

    if (result.status === "already_joined") {
      setPopup({
        open: true,
        variant: "info",
        title: "Already joined",
        subtitle: `You already have ${result.cardName} in your wallet.`,
      });
      router.refresh();
      return;
    }

    setPopup({
      open: true,
      variant: "success",
      title: "Card joined",
      subtitle: `${result.cardName} is now in your wallet. No scan needed.`,
    });
    router.refresh();
  };

  return (
    <article className="rounded-[20px] border border-white/70 bg-[#E4DFF5] p-4 shadow-[0_10px_26px_rgba(50,45,69,0.08)]">
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#9FE0C7] text-[#322D45] shadow-[inset_0_0_0_1px_rgba(50,45,69,0.05)]"
          aria-label={`${businessName} logo placeholder`}
        >
          <span className="font-display text-[13px] font-bold">{businessName.slice(0, 2).toUpperCase()}</span>
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-display text-[16px] font-semibold tracking-[-0.025em] text-[#322D45]">
            {businessName}
          </h3>
          <p className="mt-0.5 text-[12px] text-[#746E84]">{card.name}</p>
        </div>
        <span className="ml-auto rounded-full bg-white/60 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.04em] text-[#625C74]">
          {isJoined ? "Joined" : "New card"}
        </span>
      </div>

      <div className="mt-4 overflow-x-auto pb-1">
        <ol className="flex min-w-max items-center gap-1.5" aria-label={`${card.totalStamps} empty stamp slots`}>
          {stampSlots.map((slot) => (
            <li
              key={slot.id}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                slot.isMilestone
                  ? "border-solid border-[#F0AD7C] bg-[#FFC9A3] text-[#322D45]"
                  : "border-dashed border-[#9A94AA] bg-white/30 text-[#8D879C]"
              }`}
              aria-label={
                slot.isMilestone
                  ? `Stamp ${slot.stampNumber}, reward milestone`
                  : `Stamp ${slot.stampNumber}, empty`
              }
            >
              {slot.isMilestone ? (
                <Star className="h-3.5 w-3.5 fill-current" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <span className="font-mono text-[8px]">{slot.stampNumber}</span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3 border-t border-[#D4CEE8] pt-3">
        <p className="font-mono text-[11px] font-bold text-[#322D45]">0/{card.totalStamps} stamps</p>
        <p className="text-right text-[11px] leading-4 text-[#746E84]">{rewardLabel}</p>
      </div>

      <p className="mt-3 text-[12px] text-[#777187]">{card.expiryLabel}</p>

      <button
        type="button"
        className={`mt-3 flex h-[50px] w-full items-center justify-center rounded-full px-5 font-display text-[14px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98] ${
          isJoined
            ? "cursor-not-allowed bg-[#C7C3D3] text-[#625C74]"
            : "bg-[#9FE0C7] text-[#322D45] hover:bg-[#8BD8BA]"
        }`}
        disabled={isJoining || isJoined}
        onClick={() => void handleJoin()}
      >
        {isJoining ? "Joining..." : isJoined ? "Joined" : `Join ${businessName}`}
      </button>

      <StatusPopup
        open={popup.open}
        variant={popup.variant}
        title={popup.title}
        subtitle={popup.subtitle}
        buttonLabel="Okay"
        onConfirm={() => {
          setPopup((previous) => ({ ...previous, open: false }));
        }}
      />
    </article>
  );
}
