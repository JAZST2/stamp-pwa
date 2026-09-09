import { cn } from "@/lib/utils";
import {
  CUSTOMER_REWARD_TABS,
  type CustomerRewardStatus,
} from "@/lib/customer/rewards";

type CustomerRewardsStatusTabsProps = {
  activeTab: CustomerRewardStatus;
  onTabChange: (tab: CustomerRewardStatus) => void;
  counts: Record<CustomerRewardStatus, number>;
};

export function CustomerRewardsStatusTabs({
  activeTab,
  onTabChange,
  counts,
}: CustomerRewardsStatusTabsProps) {
  return (
    <nav
      className="mb-5 grid grid-cols-3 rounded-full border border-[#DDD9E8] bg-white/75 p-1"
      aria-label="Reward status"
    >
      {CUSTOMER_REWARD_TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "min-h-10 rounded-full px-3 text-[14px] font-medium transition-all",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45]",
              isActive
                ? "bg-[#9FE0C7] text-[#322D45] shadow-[0_2px_8px_rgba(50,45,69,0.06)]"
                : "text-[#8D879E] hover:text-[#322D45]",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span>{tab.label}</span>
            <span className="sr-only">{`${counts[tab.id]} rewards`}</span>
          </button>
        );
      })}
    </nav>
  );
}
