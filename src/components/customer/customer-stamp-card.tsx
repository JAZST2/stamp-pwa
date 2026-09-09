import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type CustomerStampCardVariant = "compact" | "full";

export type CustomerStampCardData = {
  id: string;
  businessName: string;
  currentStamps: number;
  totalStamps: number;
};

type CustomerStampCardProps = {
  businessName: string;
  currentStamps: number;
  totalStamps: number;
  variant?: CustomerStampCardVariant;
  className?: string;
  labelled?: boolean;
};

function toNonNegativeInteger(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
}

export function CustomerStampCard({
  businessName,
  currentStamps,
  totalStamps,
  variant = "full",
  className,
  labelled = true,
}: CustomerStampCardProps) {
  const safeTotalStamps = toNonNegativeInteger(totalStamps);
  const safeCurrentStamps = Math.min(
    safeTotalStamps,
    toNonNegativeInteger(currentStamps),
  );
  const stamps = Array.from({ length: safeTotalStamps });
  const displayName = businessName.trim() || "Stamp card";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[24px] border border-[#E4DFF5] bg-white shadow-sm",
        className,
      )}
      role={labelled ? "group" : undefined}
      aria-label={
        labelled
          ? `${displayName} stamp card, ${safeCurrentStamps} of ${safeTotalStamps} stamps`
          : undefined
      }
    >
      <div className="flex items-center justify-between bg-[#E4DFF5] px-5 py-4">
        <span className="truncate font-display text-lg font-semibold text-[#322D45]">
          {displayName}
        </span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
          aria-hidden="true"
        >
          <div className="h-4 w-4 animate-pulse rounded-full bg-[#9FE0C7]" />
        </div>
      </div>

      <div className={cn("px-5", variant === "compact" ? "py-4" : "py-6")}>
        <div className="grid grid-cols-5 gap-3" aria-hidden={variant === "compact" ? true : undefined}>
          {stamps.map((_, index) => {
            const isFilled = index < safeCurrentStamps;
            const isReward = (index + 1) % 5 === 0;
            const stampNumber = index + 1;

            return (
              <div
                key={`stamp-${index}`}
                aria-label={
                  variant === "full"
                    ? `Stamp ${stampNumber}${isReward ? ", reward milestone" : ""}${isFilled ? ", collected" : ", not collected"}`
                    : undefined
                }
                className={cn(
                  "flex aspect-square items-center justify-center rounded-full transition-all duration-300",
                  isFilled
                    ? "border-transparent bg-[#9FE0C7]"
                    : "border-2 border-dashed border-[#E4DFF5] bg-transparent",
                )}
              >
                {isReward ? (
                  <Star
                    aria-hidden="true"
                    className="h-4 w-4 text-[#F09B62]"
                    fill="#FFC9A3"
                  />
                ) : isFilled ? (
                  <span className="font-display text-xs font-bold text-[#322D45]">P</span>
                ) : null}
              </div>
            );
          })}
        </div>

        {variant === "full" ? (
          <div className="mt-6 flex items-center justify-between border-t border-[#F7F8FB] pt-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#322D45]/60">
              Loyalty Progress
            </span>
            <span className="font-mono text-sm font-bold text-[#322D45]">
              {safeCurrentStamps} / {safeTotalStamps}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
