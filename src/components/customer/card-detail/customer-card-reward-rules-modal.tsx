"use client";

import { useEffect } from "react";
import { Star } from "lucide-react";
import { getStampOrdinalLabel, type CustomerStampCardMilestone } from "@/lib/customer/stamp-cards";

type CustomerCardRewardRulesModalProps = {
  open: boolean;
  businessName: string;
  rules: string | null;
  milestones: CustomerStampCardMilestone[];
  onClose: () => void;
};

const FALLBACK_RULES = "No card rules set yet.";

export function CustomerCardRewardRulesModal({
  open,
  businessName,
  rules,
  milestones,
  onClose,
}: CustomerCardRewardRulesModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const displayName = businessName.trim() || "Stamp card";
  const rulesText = rules?.trim() || FALLBACK_RULES;

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[#322D45]/35 px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reward-rules-title"
      onClick={onClose}
    >
      <section
        className="max-h-[min(88dvh,640px)] w-full max-w-[360px] overflow-y-auto rounded-[20px] border border-white/80 bg-[#E4DFF5] p-6 shadow-[0_24px_56px_-30px_rgba(50,45,69,0.65)]"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#746E82]">
          {displayName}
        </p>
        <h2
          id="reward-rules-title"
          className="mt-2 font-display text-[20px] font-semibold tracking-[-0.03em] text-[#322D45]"
        >
          Reward Rules
        </h2>
        <p className="mt-3 whitespace-pre-line text-[14px] leading-6 text-[#504A60]">{rulesText}</p>

        <ul className="mt-4 space-y-3 border-t border-[#CDC6E5] pt-4">
          {milestones.length === 0 ? (
            <li className="text-[13px] font-medium text-[#504A60]">No reward milestones yet.</li>
          ) : (
            milestones.map((milestone) => (
              <li
                key={`${displayName}-milestone-${milestone.stampNumber}`}
                className="flex items-start gap-3 text-[13px] font-medium text-[#322D45]"
              >
                <Star
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 fill-[#FFC9A3] text-[#D9905A]"
                />
                <span>
                  {getStampOrdinalLabel(milestone.stampNumber)} - {milestone.rewardDescription}
                </span>
              </li>
            ))
          )}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#9FE0C7] px-4 text-[15px] font-semibold text-[#322D45] transition hover:bg-[#8FD5BB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98]"
        >
          Close
        </button>
      </section>
    </div>
  );
}
