import { Clock3, Gift } from "lucide-react";
import type { CustomerRewardStatus } from "@/lib/customer/rewards";

type CustomerRewardsEmptyStateProps = {
  status: CustomerRewardStatus;
};

const EMPTY_COPY = {
  ready: {
    title: "No rewards ready yet",
    description: "Activate unlocked rewards from your card details to get a claim code.",
    icon: Gift,
  },
  pending: {
    title: "Rewards in progress",
    description: "Keep collecting stamps—your next little treat is getting closer.",
    icon: Clock3,
  },
  claimed: {
    title: "No claimed rewards yet",
    description: "Rewards you use will be saved here for easy reference.",
    icon: Gift,
  },
} as const;

export function CustomerRewardsEmptyState({ status }: CustomerRewardsEmptyStateProps) {
  const copy = EMPTY_COPY[status];
  const Icon = copy.icon;

  return (
    <section
      className="flex min-h-[390px] flex-col items-center justify-center px-8 text-center"
      aria-labelledby="other-rewards-heading"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E4DFF5]">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      <h2 id="other-rewards-heading" className="font-display text-xl font-semibold">
        <span>{copy.title}</span>
      </h2>
      <p className="mt-2 text-[14px] leading-6 text-[#777186]">
        <span>{copy.description}</span>
      </p>
    </section>
  );
}
