export type CustomerStampCardListItem = {
  id: string;
  stampCardId: string;
  businessName: string;
  currentStamps: number;
  totalStamps: number;
  tagline: string;
};

export type CustomerStampCardSource = {
  id: string;
  stampCardId: string;
  businessName: string;
  cardName: string;
  currentStamps: number;
  totalStamps: number;
  tagline: string | null;
};

export type CustomerStampCardMilestone = {
  stampNumber: number;
  rewardDescription: string;
};

export type CustomerStampCardDetail = CustomerStampCardListItem & {
  rules: string | null;
  milestones: CustomerStampCardMilestone[];
};

export const DEFAULT_CUSTOMER_CARD_TAGLINE = "Good coffee gets rewarded.";

const CUSTOMER_CARD_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toNonNegativeInteger(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
}

export function isCustomerCardId(value: string): boolean {
  return CUSTOMER_CARD_ID_PATTERN.test(value.trim());
}

export function resolveCustomerCardTagline(tagline: string | null | undefined): string {
  const value = tagline?.trim();
  return value || DEFAULT_CUSTOMER_CARD_TAGLINE;
}

function resolveCardTitle(
  businessName: string,
  cardName: string,
  hasDuplicateBusiness: boolean,
): string {
  const business = businessName.trim();
  const card = cardName.trim();

  if (hasDuplicateBusiness && business && card && card !== business) {
    return `${business} · ${card}`;
  }

  return business || card || "Stamp card";
}

export function getStampCardProgressMessage(
  currentStamps: number,
  totalStamps: number,
): string {
  const safeTotal = toNonNegativeInteger(totalStamps);
  const safeCurrent = Math.min(safeTotal, toNonNegativeInteger(currentStamps));
  const remaining = Math.max(0, safeTotal - safeCurrent);

  if (remaining === 0) {
    return "You completed this card!";
  }

  if (remaining === 1) {
    return "1 more stamp to your next reward!";
  }

  return `${remaining} more stamps to your next reward!`;
}

export function getStampOrdinalLabel(stampNumber: number): string {
  const safeNumber = toNonNegativeInteger(stampNumber);
  const moduloHundred = safeNumber % 100;

  if (moduloHundred >= 11 && moduloHundred <= 13) {
    return `${safeNumber}th stamp`;
  }

  const moduloTen = safeNumber % 10;
  if (moduloTen === 1) {
    return `${safeNumber}st stamp`;
  }
  if (moduloTen === 2) {
    return `${safeNumber}nd stamp`;
  }
  if (moduloTen === 3) {
    return `${safeNumber}rd stamp`;
  }

  return `${safeNumber}th stamp`;
}

export function mapCustomerStampCardListItems(
  rows: CustomerStampCardSource[],
): CustomerStampCardListItem[] {
  const businessNameCounts = rows.reduce((counts, row) => {
    const key = row.businessName.trim().toLowerCase();
    if (!key) {
      return counts;
    }

    counts.set(key, (counts.get(key) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());

  return rows.flatMap((row) => {
    const totalStamps = toNonNegativeInteger(row.totalStamps);
    if (totalStamps === 0) {
      return [];
    }

    const businessKey = row.businessName.trim().toLowerCase();

    return [
      {
        id: row.id,
        stampCardId: row.stampCardId,
        businessName: resolveCardTitle(
          row.businessName,
          row.cardName,
          Boolean(businessKey) && (businessNameCounts.get(businessKey) ?? 0) > 1,
        ),
        currentStamps: Math.min(totalStamps, toNonNegativeInteger(row.currentStamps)),
        totalStamps,
        tagline: resolveCustomerCardTagline(row.tagline),
      },
    ];
  });
}
