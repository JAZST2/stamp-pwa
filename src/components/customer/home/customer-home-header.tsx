import { Gift, Sparkles } from "lucide-react";

type CustomerHomeHeaderProps = {
  firstName: string;
  activeCardCount: number;
  isLoading?: boolean;
};

export function CustomerHomeHeader({
  firstName,
  activeCardCount,
  isLoading = false,
}: CustomerHomeHeaderProps) {
  const cardCountLabel = isLoading
    ? "Loading stamp cards"
    : `${activeCardCount} active ${activeCardCount === 1 ? "card" : "cards"}`;

  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-[#5F5972]">
          <Sparkles className="h-4 w-4 text-[#7BC8AB]" aria-hidden="true" />
          <span>Good morning, {firstName}</span>
        </p>
        <h1
          id="home-heading"
          className="font-display text-[34px] font-bold leading-[1.08] tracking-[-0.04em] text-[#322D45]"
        >
          <span>Your stamp cards</span>
        </h1>
      </div>
      <div
        className="mb-1 flex h-11 min-w-11 items-center justify-center rounded-full bg-[#FFC9A3]/55 px-3"
        role="status"
        aria-label={cardCountLabel}
      >
        <Gift className="h-4 w-4" aria-hidden="true" />
        {isLoading ? (
          <span className="ml-1.5 h-3 w-3 animate-pulse rounded bg-[#322D45]/20" />
        ) : (
          <strong className="ml-1.5 font-mono text-xs">{activeCardCount}</strong>
        )}
      </div>
    </div>
  );
}
