import { cn } from "@/lib/utils";

type BusinessDashboardStatCardProps = {
  label: string;
  value: string;
  className?: string;
};

export function BusinessDashboardStatCard({
  label,
  value,
  className,
}: BusinessDashboardStatCardProps) {
  return (
    <article
      className={cn(
        "rounded-[20px] border border-[#E4DFF5] bg-[#E4DFF5]/55 p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-mono uppercase tracking-widest text-[#322D45]/60">
          {label}
        </p>
        <p className="font-sora text-2xl font-bold text-[#322D45]">{value}</p>
      </div>
    </article>
  );
}
