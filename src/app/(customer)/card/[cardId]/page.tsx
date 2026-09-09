import { redirect } from "next/navigation";
import { CustomerCardDetailScreen } from "@/components/customer/card-detail";
import { getCurrentProfile } from "@/lib/auth";
import { ensurePersonalShortCode } from "@/lib/customer/personal-code-server";
import { listUnlockedRewardsForMembership } from "@/lib/customer/rewards-server";
import { getCustomerStampCardDetail } from "@/lib/customer/stamp-cards-server";
import { buildCustomerPassQrPayload } from "@/lib/qr/customer-pass";

const DEFAULT_FULL_NAME = "Customer";

type CustomerCardDetailPageProps = {
  params: Promise<{ cardId: string }>;
};

export default async function CustomerCardDetailPage({
  params,
}: CustomerCardDetailPageProps) {
  const session = await getCurrentProfile();
  if (!session) {
    redirect("/");
  }

  const { cardId } = await params;
  const card = await getCustomerStampCardDetail(session.user.id, cardId);

  if (!card) {
    redirect("/home");
  }

  const fullName =
    session.profile?.full_name ||
    session.user.user_metadata?.full_name ||
    DEFAULT_FULL_NAME;
  const personalCode =
    (await ensurePersonalShortCode({
      userId: session.user.id,
      fullName,
      phone: session.profile?.phone ?? null,
      existingPersonalCode: session.profile?.personal_short_code ?? null,
    })) ?? "";
  const qrPayload = personalCode ? buildCustomerPassQrPayload(personalCode) : "";
  const unlockedRewards = await listUnlockedRewardsForMembership(session.user.id, card.id);

  return (
    <CustomerCardDetailScreen
      businessName={card.businessName}
      currentStamps={card.currentStamps}
      totalStamps={card.totalStamps}
      tagline={card.tagline}
      rules={card.rules}
      milestones={card.milestones}
      personalCode={personalCode}
      qrPayload={qrPayload}
      unlockedRewards={unlockedRewards}
    />
  );
}
