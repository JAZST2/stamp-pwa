"use client";

import { useMemo, useState } from "react";
import type { StampCardListItem } from "@/lib/business/stamp-cards";
import { BusinessCardListItem } from "./business-card-list-item";
import { BusinessCardsCreateButton } from "./business-cards-create-button";
import { BusinessCardsEmptyState } from "./business-cards-empty-state";
import { BusinessCardsHeader } from "./business-cards-header";
import { BusinessCardsSkeleton } from "./business-cards-skeleton";
import { BusinessCardsSummary } from "./business-cards-summary";

type BusinessCardsTabProps = {
  cards: StampCardListItem[];
  isLoading?: boolean;
};

function sortCards(cards: StampCardListItem[], sortNewestFirst: boolean) {
  return [...cards].sort((first, second) => {
    const firstTime = new Date(first.created_at).getTime();
    const secondTime = new Date(second.created_at).getTime();

    if (sortNewestFirst) {
      return secondTime - firstTime;
    }

    return firstTime - secondTime;
  });
}

export function BusinessCardsTab({ cards, isLoading = false }: BusinessCardsTabProps) {
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const orderedCards = useMemo(
    () => sortCards(cards, sortNewestFirst),
    [cards, sortNewestFirst],
  );

  const activeCardsCount = orderedCards.filter(
    (card) => card.status === "active",
  ).length;

  return (
    <>
      <BusinessCardsHeader
        sortNewestFirst={sortNewestFirst}
        onToggleSort={() => setSortNewestFirst((current) => !current)}
      />

      <section aria-labelledby="cards-list-heading" className="pt-5">
        <h2 id="cards-list-heading" className="sr-only">
          Loyalty stamp cards
        </h2>
        <BusinessCardsSummary
          totalCards={orderedCards.length}
          activeCards={activeCardsCount}
        />

        {isLoading ? (
          <BusinessCardsSkeleton />
        ) : orderedCards.length === 0 ? (
          <BusinessCardsEmptyState />
        ) : (
          <ul className="flex flex-col gap-4" aria-label="Loyalty stamp cards">
            {orderedCards.map((card) => (
              <BusinessCardListItem key={card.id} card={card} />
            ))}
          </ul>
        )}
      </section>

      <BusinessCardsCreateButton />

      <span className="sr-only" aria-live="polite">
        {sortNewestFirst ? "Cards in newest order" : "Cards in oldest order"}
      </span>
    </>
  );
}
