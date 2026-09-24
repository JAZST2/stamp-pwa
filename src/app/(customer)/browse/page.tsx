import { redirect } from "next/navigation";
import { CustomerBrowseScreen } from "@/components/customer/browse";
import { getCurrentProfile } from "@/lib/auth";
import { listBrowseBusinesses } from "@/lib/customer/browse-server";

export default async function BrowsePage() {
  const session = await getCurrentProfile();
  if (!session) {
    redirect("/");
  }

  const businesses = await listBrowseBusinesses();

  return <CustomerBrowseScreen businesses={businesses} />;
}
