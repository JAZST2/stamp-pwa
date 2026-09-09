import { Gift, Sparkles } from "lucide-react";

/** Pastel loyalty stamp card illustration from the customer login design. */
export function StampCardIllustration() {
  return (
    <figure
      className="mt-8 flex h-[134px] w-full items-center justify-center"
      aria-label="Pastel loyalty stamp card illustration"
    >
      <div className="flex h-[88px] w-[148px] rotate-[-5deg] flex-col justify-between rounded-[20px] border border-[#E6AD87]/50 bg-[#FFC9A3] p-4 shadow-[0_14px_30px_rgba(80,65,105,0.09)]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#6E5161]">
            Perk card
          </span>
          <Sparkles className="h-4 w-4 text-[#6E5161]" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F8FB] text-[#322D45] shadow-sm">
            <Gift className="h-4 w-4" aria-hidden="true" />
          </span>
          <span
            className="h-8 w-8 rounded-full border-2 border-dashed border-[#A87878]/55 bg-[#FFD9BD]"
            aria-hidden="true"
          />
          <span
            className="h-8 w-8 rounded-full border-2 border-dashed border-[#A87878]/55 bg-[#FFD9BD]"
            aria-hidden="true"
          />
        </div>
      </div>
      <span
        className="-ml-5 mt-20 flex h-12 w-12 rotate-[8deg] items-center justify-center rounded-[15px] border-[5px] border-[#F7F8FB] bg-[#9FE0C7] shadow-[0_8px_18px_rgba(80,65,105,0.12)]"
        aria-hidden="true"
      >
        <Sparkles className="h-5 w-5 text-[#322D45]" />
      </span>
    </figure>
  );
}
