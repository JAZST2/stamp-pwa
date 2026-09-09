export type StampCardStatus = "active" | "inactive";

const STAMP_CARD_STATUSES = new Set<StampCardStatus>(["active", "inactive"]);

export type StampCardRow = {
  id: string;
  business_id: string;
  name: string;
  total_stamps: number;
  expiry_date: string | null;
  rules: string | null;
  card_code: string | null;
  status: StampCardStatus;
  created_at: string;
  updated_at: string;
};

export type StampCardMilestoneRow = {
  id: string;
  stamp_card_id: string;
  stamp_number: number;
  reward_description: string;
  created_at: string;
  updated_at: string;
};

export type StampCardCreateInput = Pick<
  StampCardRow,
  "name" | "total_stamps" | "expiry_date" | "rules" | "status"
>;

export type StampCardMilestoneCreateInput = Pick<
  StampCardMilestoneRow,
  "stamp_number" | "reward_description"
>;

export type StampCardSetupDraft = {
  card: StampCardCreateInput;
  milestones: StampCardMilestoneCreateInput[];
};

export type StampCardQrStepPreview = Pick<
  StampCardRow,
  "name" | "total_stamps" | "expiry_date" | "card_code"
> & {
  milestones: StampCardMilestoneCreateInput[];
};

export type StampCardListItem = Pick<
  StampCardRow,
  "id" | "name" | "total_stamps" | "expiry_date" | "status" | "created_at"
> & {
  milestone_count: number;
};

export type StampCardDetailItem = Pick<
  StampCardRow,
  | "id"
  | "name"
  | "total_stamps"
  | "expiry_date"
  | "rules"
  | "card_code"
  | "status"
  | "updated_at"
> & {
  milestones: StampCardMilestoneCreateInput[];
};

export function normalizeStampCardStatus(
  value?: string | null,
): StampCardStatus | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (STAMP_CARD_STATUSES.has(normalized as StampCardStatus)) {
    return normalized as StampCardStatus;
  }

  return null;
}

export function getStampCardStatusLabel(status: StampCardStatus): string {
  if (status === "active") {
    return "Active";
  }

  return "Inactive";
}
