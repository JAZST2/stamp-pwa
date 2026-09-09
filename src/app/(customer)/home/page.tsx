import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CustomerHomeScreen } from "@/components/customer/home";
import { getCurrentProfile } from "@/lib/auth";
import { getDisplayFirstName } from "@/lib/customer/display-name";
import { listCustomerStampCards } from "@/lib/customer/stamp-cards-server";

const DEFAULT_FULL_NAME = "Customer";

type HomeTabDataProps = {
  firstName: string;
  userId: string;
};

async function HomeTabData({ firstName, userId }: HomeTabDataProps) {
  const cards = await listCustomerStampCards(userId);

  return <CustomerHomeScreen firstName={firstName} cards={cards} />;
}

export default async function HomePage() {
  const session = await getCurrentProfile();
  if (!session) {
    redirect("/");
  }

  const fullName =
    session.profile?.full_name ||
    session.user.user_metadata?.full_name ||
    DEFAULT_FULL_NAME;
  const firstName = getDisplayFirstName(fullName);

  return (
    <Suspense fallback={<CustomerHomeScreen firstName={firstName} cards={[]} isLoading />}>
      <HomeTabData firstName={firstName} userId={session.user.id} />
    </Suspense>
  );
}
