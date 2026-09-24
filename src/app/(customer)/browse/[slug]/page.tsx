import { redirect } from "next/navigation";
import { CustomerBusinessLandingScreen } from "@/components/customer/browse";
import { getCurrentProfile } from "@/lib/auth";
import { getBrowseBusinessLanding } from "@/lib/customer/browse-server";

type BusinessLandingPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BusinessLandingPage({ params }: BusinessLandingPageProps) {
  const session = await getCurrentProfile();
  if (!session) {
    redirect("/");
  }

  const { slug } = await params;
  const business = await getBrowseBusinessLanding(slug, session.user.id);
  if (!business) {
    redirect("/browse");
  }

  return <CustomerBusinessLandingScreen business={business} />;
}
