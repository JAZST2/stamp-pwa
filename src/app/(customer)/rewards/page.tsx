import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CustomerRewardsScreen } from "@/components/customer/rewards";
import { getCurrentProfile } from "@/lib/auth";
import { listCustomerRewardsByStatus } from "@/lib/customer/rewards-server";

async function RewardsTabData({ userId }: { userId: string }) {
  const rewards = await listCustomerRewardsByStatus(userId);
  return (
    <CustomerRewardsScreen
      ready={rewards.ready}
      pending={rewards.pending}
      claimed={rewards.claimed}
    />
  );
}

export default async function RewardsPage() {
  const session = await getCurrentProfile();
  if (!session) {
    redirect("/");
  }

  return (
    <Suspense fallback={<CustomerRewardsScreen ready={[]} pending={[]} claimed={[]} isLoading />}>
      <RewardsTabData userId={session.user.id} />
    </Suspense>
  );
}
