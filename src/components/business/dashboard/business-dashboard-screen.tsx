import { Coffee, Gift, Stamp, UserPlus } from "lucide-react";
import { BusinessDashboardStatCard } from "@/components/business/dashboard/business-dashboard-stat-card";
import type { BusinessDashboardSnapshot } from "@/lib/business/dashboard";

type BusinessDashboardScreenProps = {
  snapshot: BusinessDashboardSnapshot;
};

type ActivityItem = {
  id: string;
  name: string;
  action: string;
  time: string;
  type: "stamp" | "reward" | "member";
};

const RECENT_ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: "activity-juan-stamp",
    name: "Juan D.",
    action: "added a stamp",
    time: "2 min ago",
    type: "stamp",
  },
  {
    id: "activity-maria-reward",
    name: "Maria K.",
    action: "redeemed a free Latte",
    time: "18 min ago",
    type: "reward",
  },
  {
    id: "activity-ana-member",
    name: "Ana S.",
    action: "joined your loyalty card",
    time: "42 min ago",
    type: "member",
  },
  {
    id: "activity-paolo-stamp",
    name: "Paolo R.",
    action: "added a stamp",
    time: "1 hr ago",
    type: "stamp",
  },
];

function activityColor(type: ActivityItem["type"]): string {
  if (type === "reward") {
    return "bg-[#FFC9A3]";
  }
  if (type === "member") {
    return "bg-[#E4DFF5]";
  }
  return "bg-[#9FE0C7]";
}

export function BusinessDashboardScreen({ snapshot }: BusinessDashboardScreenProps) {
  const businessName = snapshot.businessName.trim() || "Business";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E5E2EC]/80 bg-[#F7F8FB]/94 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[402px] items-end justify-between px-5 pb-4 pt-[max(12px,env(safe-area-inset-top))]">
          <h1 className="font-display text-[20px] font-semibold tracking-[-0.02em] text-[#322D45]">
            Business Portal
          </h1>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#E4DFF5] bg-white shadow-[0_4px_12px_rgba(50,45,69,0.08)]"
            aria-label={`${businessName} shop logo`}
            role="img"
          >
            <Coffee className="h-5 w-5 text-[#322D45]" aria-hidden="true" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[402px] px-5 pb-[128px] pt-6">
        <section aria-labelledby="overview-heading">
          <div className="mb-6 flex items-end justify-between gap-5">
            <div>
              <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#635D74]">
                {businessName}
              </p>
              <h2
                id="overview-heading"
                className="font-sora text-[30px] font-bold leading-[1.08] tracking-[-0.04em] text-[#322D45]"
              >
                Good morning,
                <br />
                here&apos;s today.
              </h2>
            </div>
            <div className="mb-1 flex items-center gap-2 rounded-full bg-[#9FE0C7] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#322D45]">
              <span className="h-2 w-2 rounded-full bg-[#322D45]" aria-hidden="true" />
              Live
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3" aria-label="Business metrics">
            {snapshot.metrics.map((metric, index) => (
              <BusinessDashboardStatCard
                key={metric.id}
                label={metric.label}
                value={metric.value}
                className={
                  index === 1 || index === 2
                    ? "min-h-[126px] bg-white shadow-[0_6px_18px_rgba(50,45,69,0.08)]"
                    : "min-h-[126px]"
                }
              />
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="activity-heading">
          <div className="mb-4 flex items-baseline justify-between">
            <h2
              id="activity-heading"
              className="font-sora text-xl font-bold tracking-[-0.025em] text-[#322D45]"
            >
              Recent activity
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#736C82]">
              Today
            </p>
          </div>

          <ul className="overflow-hidden rounded-[20px] border border-[#E4DFF5] bg-white px-4 shadow-[0_6px_18px_rgba(50,45,69,0.08)]">
            {RECENT_ACTIVITY_ITEMS.map((activity) => (
              <li
                key={activity.id}
                className="flex items-center gap-3 border-b border-[#EEEAF7] py-4 last:border-b-0"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${activityColor(activity.type)}`}
                  aria-hidden="true"
                >
                  {activity.type === "reward" ? (
                    <Gift className="h-5 w-5 text-[#322D45]" />
                  ) : activity.type === "member" ? (
                    <UserPlus className="h-5 w-5 text-[#322D45]" />
                  ) : (
                    <Stamp className="h-5 w-5 text-[#322D45]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] leading-5 text-[#514B60]">
                    <strong className="font-semibold text-[#322D45]">{activity.name}</strong>{" "}
                    {activity.action}
                  </p>
                  <time className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-[#746E82]">
                    {activity.time}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
