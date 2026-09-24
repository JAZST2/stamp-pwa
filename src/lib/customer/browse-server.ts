import "server-only";

import { formatBusinessHours, hasAnyOpenHours, parseBusinessHours } from "@/lib/business/hours";
import {
  resolveRewardBusinessInitials,
  resolveRewardLogoColor,
} from "@/lib/customer/rewards";
import type {
  BrowseBusinessLanding,
  BrowseBusinessListItem,
  BrowseLandingCard,
} from "@/lib/customer/browse";
import type { CustomerStampCardMilestone } from "@/lib/customer/stamp-cards";
import { formatShortDate } from "@/lib/date";
import { composeAddress } from "@/lib/display";
import { isColumnShapeError } from "@/lib/supabase/errors";
import { createClient } from "@/lib/supabase/server";

type BusinessBrowseRow = {
  id: string;
  name?: string | null;
  slug?: string | null;
  tagline?: string | null;
  description?: string | null;
  logo_url?: string | null;
  cover_photo_url?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  province?: string | null;
  zip_code?: string | null;
  country?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  hours?: unknown;
};

type ActiveCardRow = {
  id: string;
  name: string | null;
  total_stamps: number | null;
  expiry_date: string | null;
  rules: string | null;
  card_code: string | null;
};

const BUSINESS_LIST_SELECTS = [
  "id, name, slug, tagline, description, logo_url, cover_photo_url, address_line1, address_line2, city, province",
  "id, name, slug, tagline, description, logo_url, cover_photo_url, address_line1, address_line2",
];

const BUSINESS_DETAIL_SELECTS = [
  "id, name, slug, tagline, description, logo_url, cover_photo_url, address_line1, address_line2, city, province, zip_code, country, contact_email, contact_phone, hours",
  "id, name, slug, tagline, description, logo_url, cover_photo_url, address_line1, address_line2, contact_email, contact_phone, hours",
];

function resolveBusinessName(row: BusinessBrowseRow): string {
  return (row.name ?? "").trim() || "Business";
}

function resolveBusinessAddress(row: BusinessBrowseRow): string {
  return composeAddress({
    addressLine1: row.address_line1,
    addressLine2: row.address_line2,
    city: row.city,
    province: row.province,
    zipCode: row.zip_code,
    country: row.country,
  });
}

function mapListItem(row: BusinessBrowseRow, stampCount: number): BrowseBusinessListItem {
  const name = resolveBusinessName(row);
  return {
    id: row.id,
    slug: row.slug?.trim() || row.id,
    name,
    description: row.description?.trim() || row.tagline?.trim() || "Local rewards, made simple.",
    address: resolveBusinessAddress(row),
    logoUrl: row.logo_url?.trim() || null,
    coverPhotoUrl: row.cover_photo_url?.trim() || null,
    initials: resolveRewardBusinessInitials(name),
    logoColor: resolveRewardLogoColor(name),
    stampCount,
  };
}

function formatCardExpiry(expiryDate: string | null): string {
  if (!expiryDate) {
    return "No expiry date";
  }

  const parsed = Date.parse(expiryDate);
  if (Number.isNaN(parsed)) {
    return "No expiry date";
  }

  return `Expires ${formatShortDate(new Date(parsed))}`;
}

export async function listBrowseBusinesses(): Promise<BrowseBusinessListItem[]> {
  const supabase = await createClient();
  let rows: BusinessBrowseRow[] | null = null;

  for (const select of BUSINESS_LIST_SELECTS) {
    const { data, error } = await supabase
      .from("businesses")
      .select(select)
      .eq("status", "active")
      .order("name", { ascending: true });

    if (!error) {
      rows = (data ?? []) as unknown as BusinessBrowseRow[];
      break;
    }

    if (!isColumnShapeError(error)) {
      return [];
    }
  }

  if (!rows?.length) {
    return [];
  }

  const businessIds = rows.map((row) => row.id);
  const { data: events } = await supabase
    .from("stamp_events")
    .select("business_id")
    .in("business_id", businessIds);

  const countByBusinessId = (events ?? []).reduce((counts, event) => {
    const businessId = (event as { business_id?: string }).business_id;
    if (!businessId) {
      return counts;
    }
    counts.set(businessId, (counts.get(businessId) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());

  return rows
    .map((row) => mapListItem(row, countByBusinessId.get(row.id) ?? 0))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export async function getBrowseBusinessLanding(
  slug: string,
  customerId: string,
): Promise<BrowseBusinessLanding | null> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return null;
  }

  const supabase = await createClient();
  let business: BusinessBrowseRow | null = null;

  for (const select of BUSINESS_DETAIL_SELECTS) {
    const { data, error } = await supabase
      .from("businesses")
      .select(select)
      .eq("slug", normalizedSlug)
      .eq("status", "active")
      .maybeSingle<BusinessBrowseRow>();

    if (!error) {
      business = data;
      break;
    }

    if (!isColumnShapeError(error)) {
      return null;
    }
  }

  if (!business) {
    return null;
  }

  const [{ data: cards }, { data: memberships }] = await Promise.all([
    supabase
      .from("stamp_cards")
      .select("id, name, total_stamps, expiry_date, rules, card_code")
      .eq("business_id", business.id)
      .eq("status", "active")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("customer_memberships")
      .select("id, stamp_card_id")
      .eq("customer_id", customerId)
      .eq("business_id", business.id),
  ]);

  const cardRows = (cards ?? []) as ActiveCardRow[];
  const membershipByCardId = new Map(
    ((memberships ?? []) as Array<{ id: string; stamp_card_id: string }>).map((row) => [
      row.stamp_card_id,
      row.id,
    ]),
  );

  const cardIds = cardRows.map((card) => card.id);
  const { data: milestoneRows } = cardIds.length
    ? await supabase
        .from("stamp_card_milestones")
        .select("stamp_card_id, stamp_number, reward_description")
        .in("stamp_card_id", cardIds)
        .order("stamp_number", { ascending: true })
    : { data: [] as Array<{ stamp_card_id: string; stamp_number: number; reward_description: string | null }> };

  const milestonesByCardId = new Map<string, CustomerStampCardMilestone[]>();
  (milestoneRows ?? []).forEach((milestone) => {
    if (typeof milestone.stamp_number !== "number") {
      return;
    }
    const rewardDescription = milestone.reward_description?.trim();
    if (!rewardDescription) {
      return;
    }
    const current = milestonesByCardId.get(milestone.stamp_card_id) ?? [];
    current.push({
      stampNumber: milestone.stamp_number,
      rewardDescription,
    });
    milestonesByCardId.set(milestone.stamp_card_id, current);
  });

  const landingCards: BrowseLandingCard[] = cardRows.flatMap((card) => {
    const totalStamps = card.total_stamps ?? 0;
    const cardCode = card.card_code?.trim();
    if (!totalStamps || !cardCode) {
      return [];
    }

    return [
      {
        id: card.id,
        name: card.name?.trim() || "Stamp card",
        totalStamps,
        expiryLabel: formatCardExpiry(card.expiry_date),
        rules: card.rules,
        cardCode,
        milestones: milestonesByCardId.get(card.id) ?? [],
        isJoined: membershipByCardId.has(card.id),
        membershipId: membershipByCardId.get(card.id) ?? null,
      },
    ];
  });

  const name = resolveBusinessName(business);
  const hours = parseBusinessHours(business.hours);

  return {
    id: business.id,
    slug: business.slug?.trim() || business.id,
    name,
    tagline: business.tagline?.trim() || "Local rewards, made simple.",
    description: business.description?.trim() || "",
    address: resolveBusinessAddress(business),
    contactEmail: business.contact_email?.trim() || "",
    contactPhone: business.contact_phone?.trim() || "",
    logoUrl: business.logo_url?.trim() || null,
    coverPhotoUrl: business.cover_photo_url?.trim() || null,
    initials: resolveRewardBusinessInitials(name),
    logoColor: resolveRewardLogoColor(name),
    hours: hasAnyOpenHours(hours) ? formatBusinessHours(hours) : [],
    cards: landingCards,
  };
}
