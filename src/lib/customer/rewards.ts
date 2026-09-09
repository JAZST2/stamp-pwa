export type RewardClaimStatus = "unlocked" | "ready" | "pending" | "claimed";
export type CustomerRewardStatus = Exclude<RewardClaimStatus, "unlocked">;

export type CustomerRewardItem = {
  id: string;
  membershipId: string;
  businessName: string;
  initials: string;
  rewardTitle: string;
  expiryLabel: string;
  code: string;
  logoColor: string;
  status: CustomerRewardStatus;
};

export type CustomerUnlockedRewardItem = {
  id: string;
  membershipId: string;
  businessName: string;
  initials: string;
  rewardTitle: string;
  unlockedLabel: string;
  logoColor: string;
};

export type CustomerRewardsByStatus = {
  ready: CustomerRewardItem[];
  pending: CustomerRewardItem[];
  claimed: CustomerRewardItem[];
};

export const CUSTOMER_REWARD_TABS: Array<{
  id: CustomerRewardStatus;
  label: string;
}> = [
  { id: "ready", label: "Ready" },
  { id: "pending", label: "Pending" },
  { id: "claimed", label: "Claimed" },
];

const REWARD_LOGO_COLORS = [
  "#BCE8D7",
  "#FFD7BC",
  "#C8E7FA",
  "#FADBC8",
  "#D8CEF7",
];

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function resolveRewardLogoColor(businessName: string): string {
  const key = businessName.trim().toLowerCase();
  if (!key) {
    return REWARD_LOGO_COLORS[0];
  }

  return REWARD_LOGO_COLORS[hashString(key) % REWARD_LOGO_COLORS.length];
}

export function resolveRewardBusinessInitials(businessName: string): string {
  const normalized = businessName.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return "PK";
  }

  const words = normalized.split(" ");
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  const initials = `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
  return initials || normalized.slice(0, 2).toUpperCase();
}

export function isCustomerRewardStatus(value: string): value is CustomerRewardStatus {
  return value === "ready" || value === "pending" || value === "claimed";
}
