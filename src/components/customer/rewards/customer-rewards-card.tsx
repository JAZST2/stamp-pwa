import { CheckCircle2, Copy, LoaderCircle, QrCode, Sparkles } from "lucide-react";
import type { CustomerRewardItem } from "@/lib/customer/rewards";

type CustomerRewardsCardProps = {
  reward: CustomerRewardItem;
  copiedCode: string | null;
  onCopyCode: (code: string) => void;
  onShowToCashier?: (reward: CustomerRewardItem) => void;
  showToCashierLabel?: string;
  isSubmitting?: boolean;
};

export function CustomerRewardsCard({
  reward,
  copiedCode,
  onCopyCode,
  onShowToCashier,
  showToCashierLabel = "Show to Cashier",
  isSubmitting = false,
}: CustomerRewardsCardProps) {
  const isCopied = copiedCode === reward.code;
  const shouldShowActionButton = reward.status !== "claimed" && Boolean(onShowToCashier);

  return (
    <article
      className="rounded-[20px] border border-white/70 bg-[#E4DFF5] p-4 shadow-[0_8px_24px_rgba(50,45,69,0.08)]"
      aria-label={`${reward.rewardTitle} from ${reward.businessName}`}
    >
      <div className="mb-3 flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/80 font-display text-[13px] font-bold shadow-sm"
          style={{ backgroundColor: reward.logoColor }}
          aria-label={`${reward.businessName} logo placeholder`}
          role="img"
        >
          <span>{reward.initials}</span>
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="font-display text-[16px] font-semibold leading-5">
            <span>{reward.businessName}</span>
          </h3>
          <p className="mt-1 text-[15px] font-medium leading-5">
            <span>{reward.rewardTitle}</span>
          </p>
          <p className="mt-1 text-[12px] leading-4 text-[#777186]">
            <span>{reward.expiryLabel}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-[#D98855]" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFC9A3]" />
          <Sparkles className="h-5 w-5" strokeWidth={1.8} />
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2 rounded-[14px] bg-[#FFD8BC] p-2 pl-3">
        <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[17px] font-medium tracking-[0.04em] text-[#322D45]">
          {reward.code}
        </code>
        <button
          type="button"
          onClick={() => onCopyCode(reward.code)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/60 text-[#322D45] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-95"
          aria-label={`Copy claim code ${reward.code}`}
        >
          {isCopied ? (
            <CheckCircle2 className="h-[18px] w-[18px]" aria-hidden="true" />
          ) : (
            <Copy className="h-[18px] w-[18px]" aria-hidden="true" />
          )}
        </button>
      </div>

      {shouldShowActionButton ? (
        <button
          type="button"
          onClick={() => onShowToCashier?.(reward)}
          disabled={isSubmitting}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#FFC9A3] px-5 text-[14px] font-medium text-[#322D45] transition hover:bg-[#FFBD8E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#F5CFB2] disabled:text-[#6C667C]"
        >
          {isSubmitting ? (
            <LoaderCircle className="h-[17px] w-[17px] animate-spin" aria-hidden="true" />
          ) : (
            <QrCode className="h-[17px] w-[17px]" aria-hidden="true" />
          )}
          <span>{showToCashierLabel}</span>
        </button>
      ) : null}
    </article>
  );
}
