import { LoaderCircle, Sparkles } from "lucide-react";
import type { CustomerUnlockedRewardItem } from "@/lib/customer/rewards";

type CustomerCardUnlockedRewardRowProps = {
  reward: CustomerUnlockedRewardItem;
  isActivating: boolean;
  onActivate: (reward: CustomerUnlockedRewardItem) => void;
};

export function CustomerCardUnlockedRewardRow({
  reward,
  isActivating,
  onActivate,
}: CustomerCardUnlockedRewardRowProps) {
  return (
    <article
      className="rounded-[20px] border border-[#E7E1F6] bg-[#EFEAFD] p-4 shadow-[0_8px_20px_rgba(50,45,69,0.06)]"
      aria-label={`Unlocked reward ${reward.rewardTitle} from ${reward.businessName}`}
    >
      <div className="mb-3 flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white/80 font-display text-[12px] font-bold shadow-sm"
          style={{ backgroundColor: reward.logoColor }}
          aria-label={`${reward.businessName} logo placeholder`}
          role="img"
        >
          <span>{reward.initials}</span>
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="font-display text-[15px] font-semibold leading-5 text-[#322D45]">
            <span>{reward.rewardTitle}</span>
          </h3>
          <p className="mt-1 text-[13px] leading-5 text-[#655F77]">
            <span>{reward.businessName}</span>
          </p>
          <p className="mt-1 text-[12px] leading-4 text-[#807A91]">
            <span>{reward.unlockedLabel}</span>
          </p>
        </div>
        <Sparkles className="h-5 w-5 shrink-0 text-[#D98855]" strokeWidth={1.9} aria-hidden="true" />
      </div>

      <button
        type="button"
        onClick={() => onActivate(reward)}
        disabled={isActivating}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#9FE0C7] px-5 text-[14px] font-semibold text-[#322D45] transition hover:bg-[#8DD4B8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#CBE9DD] disabled:text-[#66707B]"
      >
        {isActivating ? (
          <LoaderCircle className="h-[18px] w-[18px] animate-spin" aria-hidden="true" />
        ) : null}
        <span>{isActivating ? "Activating reward..." : "Tap to Activate Reward"}</span>
      </button>
    </article>
  );
}
