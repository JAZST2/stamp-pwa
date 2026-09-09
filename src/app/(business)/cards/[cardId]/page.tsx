import { redirect } from "next/navigation";
import { BusinessCardDetailsScreen } from "@/components/business";
import { getCurrentProfile } from "@/lib/auth";
import { getStampCardDetailForCurrentUser } from "@/lib/business/stamp-cards-server";

type BusinessCardDetailPageProps = {
  params: Promise<{ cardId: string }>;
};

export default async function BusinessCardDetailPage({
  params,
}: BusinessCardDetailPageProps) {
  const session = await getCurrentProfile();

  if (!session) {
    redirect("/");
  }

  const { cardId } = await params;
  const card = await getStampCardDetailForCurrentUser({
    cardId,
    userId: session.user.id,
    userEmail: session.user.email,
  });

  if (!card) {
    redirect("/cards");
  }

  return <BusinessCardDetailsScreen card={card} />;
}
