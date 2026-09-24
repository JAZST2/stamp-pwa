"use client";

import { useMemo, useState } from "react";
import { ListFilter, Search } from "lucide-react";
import type { BrowseBusinessListItem } from "@/lib/customer/browse";
import { CustomerBrowseBusinessCard } from "./customer-browse-business-card";
import { CustomerBrowseEmptyState } from "./customer-browse-empty-state";

type CustomerBrowseScreenProps = {
  businesses: BrowseBusinessListItem[];
};

export function CustomerBrowseScreen({ businesses }: CustomerBrowseScreenProps) {
  const [query, setQuery] = useState("");
  const [sortAscending, setSortAscending] = useState(false);

  const visibleBusinesses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = businesses.filter((business) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        business.name.toLowerCase().includes(normalizedQuery) ||
        business.description.toLowerCase().includes(normalizedQuery)
      );
    });

    if (!sortAscending) {
      return filtered;
    }

    return [...filtered].sort((first, second) => first.name.localeCompare(second.name));
  }, [businesses, query, sortAscending]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E4DFF5]/70 bg-[#F7F8FB]/90 px-5 pt-[max(18px,env(safe-area-inset-top))] backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-[402px] items-center justify-between">
          <h1 className="font-display text-[25px] font-semibold tracking-[-0.035em] text-[#322D45]">
            Browse Shops
          </h1>
          <button
            type="button"
            onClick={() => setSortAscending((current) => !current)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition active:scale-95 ${
              sortAscending
                ? "border-[#9FE0C7] bg-[#9FE0C7] text-[#322D45]"
                : "border-[#D6D1E5] bg-white text-[#625C74]"
            }`}
            aria-label={sortAscending ? "Use featured order" : "Sort shops alphabetically"}
            aria-pressed={sortAscending}
          >
            <ListFilter className="h-[19px] w-[19px]" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[402px] px-5 pb-[128px] pt-5">
        <section aria-label="Find a business">
          <label className="group flex h-12 items-center gap-3 rounded-full bg-[#E4DFF5] px-4 transition focus-within:ring-[3px] focus-within:ring-[#9FE0C7]/75">
            <Search
              className="h-[18px] w-[18px] shrink-0 text-[#777187]"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="sr-only">Search businesses</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search businesses..."
              className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-normal text-[#322D45] outline-none placeholder:text-[#8D879C]"
            />
          </label>
        </section>

        <section className="mt-6" aria-labelledby="partners-heading">
          <div className="mb-4 flex items-baseline justify-between px-0.5">
            <h2 id="partners-heading" className="font-display text-[15px] font-semibold text-[#322D45]">
              Local favorites
            </h2>
            <p className="font-mono text-[10px] text-[#777187]">{visibleBusinesses.length} SHOPS</p>
          </div>

          {visibleBusinesses.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3" aria-label="Partner businesses">
              {visibleBusinesses.map((business) => (
                <CustomerBrowseBusinessCard key={business.id} business={business} />
              ))}
            </ul>
          ) : (
            <CustomerBrowseEmptyState hasQuery={query.trim().length > 0} />
          )}
        </section>
      </main>

      <div
        className="pointer-events-none fixed bottom-[82px] right-[-28px] h-24 w-24 rounded-full bg-[#FFC9A3]/20 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed left-[-36px] top-28 h-24 w-24 rounded-full bg-[#9FE0C7]/20 blur-2xl"
        aria-hidden="true"
      />
    </>
  );
}
