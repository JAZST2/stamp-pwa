"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import type { StampCardMilestoneCreateInput } from "@/lib/business/stamp-cards";

type MilestoneDraft = StampCardMilestoneCreateInput & { id: string };

type MilestoneEditorItemProps = {
  milestone: MilestoneDraft;
  maxStampNumber: number;
  onStampChange: (id: string, nextStampNumber: number) => void;
  onRewardChange: (id: string, nextReward: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
};

const MIN_STAMP_NUMBER = 1;

export function MilestoneEditorItem({
  milestone,
  maxStampNumber,
  onStampChange,
  onRewardChange,
  onRemove,
  canRemove,
}: MilestoneEditorItemProps) {
  const decreaseValue = Math.max(MIN_STAMP_NUMBER, milestone.stamp_number - 1);
  const increaseValue = Math.min(maxStampNumber, milestone.stamp_number + 1);

  return (
    <div className="grid grid-cols-[116px_minmax(0,1fr)_32px] gap-2.5 rounded-2xl border border-[#F4B98D] bg-[#FFF3EA] p-3">
      <div>
        <label className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#746E82]">
          Stamp no.
        </label>
        <div className="flex h-11 items-center justify-between rounded-xl border border-[#F1C6A7] bg-white px-1.5">
          <button
            type="button"
            onClick={() => onStampChange(milestone.id, decreaseValue)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#514B60] hover:bg-[#FFC9A3]/60 focus-visible:outline-2 focus-visible:outline-[#9FE0C7]"
            aria-label={`Decrease milestone from stamp ${milestone.stamp_number}`}
          >
            <Minus className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          </button>
          <output className="font-mono text-[16px] font-bold" aria-live="polite">
            {milestone.stamp_number}
          </output>
          <button
            type="button"
            onClick={() => onStampChange(milestone.id, increaseValue)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#514B60] hover:bg-[#FFC9A3]/60 focus-visible:outline-2 focus-visible:outline-[#9FE0C7]"
            aria-label={`Increase milestone from stamp ${milestone.stamp_number}`}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div>
        <label
          htmlFor={`reward-${milestone.id}`}
          className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#746E82]"
        >
          Reward
        </label>
        <input
          id={`reward-${milestone.id}`}
          type="text"
          required
          value={milestone.reward_description}
          onChange={(event) => onRewardChange(milestone.id, event.target.value)}
          placeholder="Free Upsize"
          className="h-11 w-full min-w-0 rounded-xl border border-[#F1C6A7] bg-white px-3 text-[13px] text-[#322D45] placeholder:text-[#8C8498] focus:border-[#9FE0C7] focus:outline-none focus:ring-3 focus:ring-[#9FE0C7]/30"
        />
      </div>
      <div className="flex items-end">
        {canRemove ? (
          <button
            type="button"
            onClick={() => onRemove(milestone.id)}
            className="flex h-11 w-8 items-center justify-center rounded-full text-[#514B60] transition hover:bg-[#FFC9A3]/60 focus-visible:outline-2 focus-visible:outline-[#9FE0C7] active:scale-95"
            aria-label={`Remove milestone at stamp ${milestone.stamp_number}`}
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          </button>
        ) : (
          <span className="block h-11 w-8" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
