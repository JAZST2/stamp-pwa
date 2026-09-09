import { Suspense } from "react";
import { BusinessCardsTab } from "@/components/business";
import { getCurrentProfile } from "@/lib/auth";
import { listStampCardsForCurrentUserBusiness } from "@/lib/business/stamp-cards-server";

async function CardsTabData() {
  const session = await getCurrentProfile();
  const cards = session
    ? await listStampCardsForCurrentUserBusiness({
        userId: session.user.id,
        userEmail: session.user.email,
      })
    : [];

  return <BusinessCardsTab cards={cards} />;
}

export default function CardsPage() {
  return (
    <Suspense fallback={<BusinessCardsTab cards={[]} isLoading />}>
      <CardsTabData />
    </Suspense>
  );
}
