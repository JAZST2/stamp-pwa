import Link from "next/link";
import type { BrowseBusinessListItem } from "@/lib/customer/browse";

type CustomerBrowseBusinessCardProps = {
  business: BrowseBusinessListItem;
};

export function CustomerBrowseBusinessCard({ business }: CustomerBrowseBusinessCardProps) {
  return (
    <li>
      <article className="flex min-h-[238px] flex-col rounded-[18px] border border-white/60 bg-[#E4DFF5] p-3.5 shadow-[0_7px_20px_rgba(50,45,69,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(50,45,69,0.10)]">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full font-display text-[14px] font-bold tracking-[-0.02em]"
          style={{
            backgroundColor: business.logoColor,
            color: "#322D45",
          }}
          aria-label={`${business.name} logo`}
          role="img"
        >
          <span>{business.initials}</span>
        </div>
        <div className="mt-3 min-w-0">
          <h2 className="truncate font-display text-[15px] font-semibold leading-5 tracking-[-0.025em] text-[#322D45]">
            {business.name}
          </h2>
          <p className="mt-1 truncate text-[12px] leading-[18px] text-[#777187]">{business.description}</p>
        </div>
        <div className="mt-3">
          <span className="inline-flex rounded-full bg-[#9FE0C7] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.02em] text-[#322D45]">
            {business.stampCount} stamps
          </span>
        </div>
        <Link
          href={`/browse/${business.slug}`}
          className="mt-auto flex min-h-10 w-full items-center justify-center rounded-full bg-[#FFC9A3] px-4 text-[13px] font-medium text-[#322D45] transition hover:bg-[#FFBC8E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.97]"
          aria-label={`View ${business.name}`}
        >
          View
        </Link>
      </article>
    </li>
  );
}
