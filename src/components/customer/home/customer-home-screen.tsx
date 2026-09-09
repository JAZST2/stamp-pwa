import Link from "next/link";
import type { CustomerStampCardListItem } from "@/lib/customer/stamp-cards";
import { CustomerStampCard } from "@/components/customer/customer-stamp-card";
import { CustomerTopBar } from "@/components/customer/customer-top-bar";
import { CustomerHomeCardsSkeleton } from "./customer-home-cards-skeleton";
import { CustomerHomeEmptyState } from "./customer-home-empty-state";
import { CustomerHomeHeader } from "./customer-home-header";

type CustomerHomeScreenProps = {
  firstName: string;
  cards: CustomerStampCardListItem[];
  isLoading?: boolean;
};

export function CustomerHomeScreen({
  firstName,
  cards,
  isLoading = false,
}: CustomerHomeScreenProps) {
  const hasCards = cards.length > 0;

  return (
    <>
      <CustomerTopBar showProfile />

      <main className="mx-auto w-full max-w-[402px] px-6 pb-32 pt-[calc(6rem+env(safe-area-inset-top))]">
        <section aria-labelledby="home-heading" aria-busy={isLoading}>
          <CustomerHomeHeader
            firstName={firstName}
            activeCardCount={cards.length}
            isLoading={isLoading}
          />

          {isLoading ? (
            <CustomerHomeCardsSkeleton />
          ) : hasCards ? (
            <ul className="space-y-6" aria-label="Active stamp cards">
              {cards.map((card) => (
                <li key={card.id}>
                  <Link
                    href={`/card/${card.id}`}
                    className="block rounded-[24px] transition active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/35"
                    aria-label={`View ${card.businessName} stamp card, ${card.currentStamps} of ${card.totalStamps} stamps`}
                  >
                    <CustomerStampCard
                      variant="compact"
                      businessName={card.businessName}
                      currentStamps={card.currentStamps}
                      totalStamps={card.totalStamps}
                      labelled={false}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <CustomerHomeEmptyState />
          )}
        </section>
      </main>
    </>
  );
}
