"use client";

import { ListFilter } from "lucide-react";

type BusinessCardsHeaderProps = {
  sortNewestFirst: boolean;
  onToggleSort: () => void;
};

export function BusinessCardsHeader({
  sortNewestFirst,
  onToggleSort,
}: BusinessCardsHeaderProps) {
  return (
    <header className="sticky top-0 z-20 -mx-5 border-b border-[#E4DFF5]/70 bg-[#F7F8FB]/95 px-5 backdrop-blur-xl">
      <div className="flex items-start justify-between pb-4 pt-[max(24px,env(safe-area-inset-top))]">
        <div className="min-w-0 pr-4">
          <h1 className="font-sora text-[26px] font-semibold leading-tight tracking-[-0.035em] text-[#322D45]">
            My Cards
          </h1>
          <p className="mt-1.5 text-[14px] leading-5 text-[#777187]">
            Manage your loyalty stamp cards.
          </p>
        </div>
        <button
          type="button"
          aria-label={
            sortNewestFirst
              ? "Sort cards in reverse order"
              : "Sort cards in original order"
          }
          aria-pressed={!sortNewestFirst}
          onClick={onToggleSort}
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D8D3E7] bg-white text-[#322D45] shadow-[0_4px_14px_rgba(50,45,69,0.06)] transition hover:border-[#9FE0C7] hover:bg-[#9FE0C7]/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/35 active:scale-95"
        >
          <ListFilter aria-hidden="true" className="h-[19px] w-[19px]" strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
