import { BusinessPlaceholderScreen } from "@/components/business";
import { LogoutButton } from "@/components/auth/logout-button";

export default function BusinessSettingsPage() {
  return (
    <BusinessPlaceholderScreen
      title="Settings"
      description="Settings placeholder. Business profile, staff permissions, and app preferences will appear here."
    >
      <LogoutButton />
    </BusinessPlaceholderScreen>
  );
}
