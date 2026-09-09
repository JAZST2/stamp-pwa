import { redirect } from "next/navigation";
import { EditStampCardScreen } from "@/components/business";
import { getCurrentProfile } from "@/lib/auth";
import { getStampCardDetailForCurrentUser } from "@/lib/business/stamp-cards-server";

type EditBusinessCardPageProps = {
  params: Promise<{ cardId: string }>;
};

export default async function EditBusinessCardPage({
  params,
}: EditBusinessCardPageProps) {
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

  return <EditStampCardScreen card={card} />;
}
