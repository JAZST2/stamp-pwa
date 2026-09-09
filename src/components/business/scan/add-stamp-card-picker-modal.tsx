"use client";

import { CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AddStampCardChoice = {
  cardId: string;
  cardName: string;
  currentStampCount: number;
  totalStamps: number;
};

type AddStampCardPickerModalProps = {
  open: boolean;
  customerName: string;
  customerCode: string;
  cards: AddStampCardChoice[];
  selectedCardId: string | null;
  isSubmitting: boolean;
  onSelect: (cardId: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export function AddStampCardPickerModal({
  open,
  customerName,
  customerCode,
  cards,
  selectedCardId,
  isSubmitting,
  onSelect,
  onConfirm,
  onCancel,
}: AddStampCardPickerModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-[#322D45]/35 px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-picker-title"
    >
      <section className="w-full max-w-[392px] rounded-[24px] border border-white/85 bg-[#E4DFF5] p-5 shadow-[0_24px_56px_-30px_rgba(50,45,69,0.65)]">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#746E82]">
          Add Stamp
        </p>
        <h2
          id="card-picker-title"
          className="mt-2 font-heading text-[22px] font-semibold tracking-[-0.03em] text-[#322D45]"
        >
          Select Card
        </h2>
        <p className="mt-2 text-[14px] leading-6 text-[#625C74]">
          {customerName} ({customerCode}) has multiple active cards. Choose where to add the stamp.
        </p>

        <div className="mt-4 overflow-hidden rounded-[18px] border border-[#CFC9DF] bg-white/45">
          {cards.map((card, index) => {
            const isSelected = selectedCardId === card.cardId;
            return (
              <button
                key={card.cardId}
                type="button"
                onClick={() => onSelect(card.cardId)}
                className={cn(
                  "flex min-h-[62px] w-full items-center gap-3 px-4 text-left transition hover:bg-white/60",
                  index < cards.length - 1 && "border-b border-[#D8D2E5]",
                  isSelected && "bg-white/80",
                )}
                aria-pressed={isSelected}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    isSelected ? "border-[#3F9478] bg-[#9FE0C7]" : "border-[#B9B4C9] bg-white",
                  )}
                  aria-hidden="true"
                >
                  {isSelected ? <CheckCircle2 className="h-4 w-4 text-[#2F6E58]" /> : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[#322D45]">{card.cardName}</p>
                  <p className="mt-0.5 text-[12px] text-[#6B657A]">
                    Current stamps: {card.currentStampCount}/{card.totalStamps}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#8A8499]" aria-hidden="true" />
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#B9B4C9] bg-white/45 px-4 text-[13px] font-medium text-[#4F4962] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!selectedCardId || isSubmitting}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#9FE0C7] px-4 text-[13px] font-semibold text-[#322D45] transition hover:bg-[#8FD5BB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Stamp"}
          </button>
        </div>
      </section>
    </div>
  );
}
