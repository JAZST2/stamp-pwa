import { redirect } from "next/navigation";
import { CreateCardQrStepScreen } from "@/components/business";
import { getCurrentProfile } from "@/lib/auth";
import { getStampCardQrPreviewForCurrentUser } from "@/lib/business/stamp-cards-server";

type CreateCardQrPageProps = {
  params: Promise<{ cardId: string }>;
};

export default async function CreateCardQrPage({ params }: CreateCardQrPageProps) {
  const session = await getCurrentProfile();

  if (!session) {
    redirect("/");
  }

  const { cardId } = await params;
  const preview = await getStampCardQrPreviewForCurrentUser({
    cardId,
    userId: session.user.id,
    userEmail: session.user.email,
  });

  if (!preview) {
    redirect("/cards/create");
  }

  return <CreateCardQrStepScreen preview={preview} cardId={cardId} />;
}
