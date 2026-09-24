import { Search } from "lucide-react";

type CustomerBrowseEmptyStateProps = {
  hasQuery: boolean;
};

export function CustomerBrowseEmptyState({ hasQuery }: CustomerBrowseEmptyStateProps) {
  return (
    <section
      className="rounded-[20px] border border-dashed border-[#B9B4C9] bg-[#E4DFF5]/55 px-6 py-12 text-center"
      aria-labelledby="browse-empty-title"
    >
      <Search className="mx-auto h-7 w-7 text-[#777187]" strokeWidth={1.5} aria-hidden="true" />
      <h2 id="browse-empty-title" className="mt-4 font-display text-base font-semibold text-[#322D45]">
        No shops found
      </h2>
      <p className="mt-1 text-sm text-[#777187]">
        {hasQuery ? "Try another shop name." : "Shops will appear here once available."}
      </p>
    </section>
  );
}
