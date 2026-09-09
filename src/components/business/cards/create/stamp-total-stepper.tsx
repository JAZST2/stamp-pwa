"use client";

import { Minus, Plus } from "lucide-react";

type StampTotalStepperProps = {
  value: number;
  onChange: (nextValue: number) => void;
};

const MIN_STAMPS = 1;
const MAX_STAMPS = 20;

export function StampTotalStepper({ value, onChange }: StampTotalStepperProps) {
  return (
    <div className="mt-5 rounded-2xl border border-white/80 bg-white/60 px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <label htmlFor="total-stamps" className="block text-[13px] font-medium text-[#514B60]">
            Total Stamps Required
          </label>
          <p className="mt-1 text-[12px] text-[#777187]">Stamps needed per reward</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => onChange(Math.max(MIN_STAMPS, value - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9FE0C7] transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-95"
            aria-label="Decrease total stamps"
          >
            <Minus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          </button>
          <output
            id="total-stamps"
            className="min-w-7 text-center font-mono text-[24px] font-bold leading-none"
            aria-live="polite"
          >
            {value}
          </output>
          <button
            type="button"
            onClick={() => onChange(Math.min(MAX_STAMPS, value + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9FE0C7] transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-95"
            aria-label="Increase total stamps"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
