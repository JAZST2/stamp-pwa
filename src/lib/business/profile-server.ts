import "server-only";

import { parseBusinessHours } from "@/lib/business/hours";
import type { BusinessProfileDraft } from "@/lib/business/profile";
import { resolveBusinessIdForCurrentUser } from "@/lib/business/stamp-cards-server";
import { formatPhMobile } from "@/lib/customer/personal-code";
import { normalizeBusinessSlug, parsePhMobileDigits } from "@/lib/display";
import {
  isColumnShapeError,
  isPermissionDeniedError,
  isUniqueViolationError,
} from "@/lib/supabase/errors";
import { createClient } from "@/lib/supabase/server";

type BusinessProfileRow = {
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
  contact_phone?: string | null;
  hours?: unknown;
};

export type UpdateBusinessProfileResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

const BUSINESS_PROFILE_SELECTS = [
  "id, name, slug, tagline, description, logo_url, cover_photo_url, address_line1, address_line2, city, province, zip_code, country, contact_phone, hours",
];

const BUSINESS_LOOKUP_COLUMN_CANDIDATES: Array<{
  column: string;
}> = [
  { column: "owner_id" },
];

function mapBusinessProfileDraft(
  row: BusinessProfileRow,
  fallbackContactEmail: string | null | undefined,
): BusinessProfileDraft {
  const name = row.name?.trim() || "";

  return {
    name,
    slug: row.slug?.trim() || "",
    tagline: row.tagline?.trim() || "",
    description: row.description?.trim() || "",
    logoUrl: row.logo_url?.trim() || "",
    coverPhotoUrl: row.cover_photo_url?.trim() || "",
    addressLine1: row.address_line1?.trim() || "",
    addressLine2: row.address_line2?.trim() || "",
    city: row.city?.trim() || "",
    province: row.province?.trim() || "",
    zipCode: row.zip_code?.trim() || "",
    country: row.country?.trim() || "Philippines",
    contactEmail: fallbackContactEmail?.trim() || "",
    contactPhoneDigits: parsePhMobileDigits(row.contact_phone),
    hours: parseBusinessHours(row.hours),
  };
}

export async function getBusinessProfileForCurrentUser(options: {
  userId: string;
  userEmail?: string | null;
}): Promise<(BusinessProfileDraft & { id: string }) | null> {
  const supabase = await createClient();
  const businessId = await resolveBusinessIdForCurrentUser(options);
  const idCandidates = businessId ? [businessId] : [];
  const selectCandidates: Array<{
    column: string;
    value: string;
    useCreatedAtOrder: boolean;
  }> = [];

  for (const id of idCandidates) {
    selectCandidates.push({
      column: "id",
      value: id,
      useCreatedAtOrder: false,
    });
  }

  for (const candidate of BUSINESS_LOOKUP_COLUMN_CANDIDATES) {
    const value = options.userId;
    if (!value) {
      continue;
    }
    selectCandidates.push({
      column: candidate.column,
      value,
      useCreatedAtOrder: true,
    });
  }

  for (const lookup of selectCandidates) {
    for (const select of BUSINESS_PROFILE_SELECTS) {
      const baseQuery = supabase
        .from("businesses")
        .select(select);

      let orderedQuery = baseQuery.eq(lookup.column, lookup.value);

      if (lookup.useCreatedAtOrder) {
        orderedQuery = orderedQuery.order("created_at", { ascending: false }).limit(1);
      }

      const { data, error } = await orderedQuery.maybeSingle<BusinessProfileRow>();

      if (error) {
        if (!isColumnShapeError(error)) {
          break;
        }

        if (!lookup.useCreatedAtOrder) {
          continue;
        }

        // Retry without created_at ordering when schemas do not expose it.
        const fallbackBaseQuery = supabase
          .from("businesses")
          .select(select);
        const fallbackQuery = fallbackBaseQuery.eq(lookup.column, lookup.value);
        const { data: fallbackData, error: fallbackError } = await fallbackQuery
          .limit(1)
          .maybeSingle<BusinessProfileRow>();

        if (fallbackError) {
          if (isColumnShapeError(fallbackError)) {
            continue;
          }
          break;
        }

        if (!fallbackData) {
          continue;
        }

        return {
          id: fallbackData.id,
          ...mapBusinessProfileDraft(fallbackData, options.userEmail),
        };
      }

      if (!data) {
        continue;
      }

      return {
        id: data.id,
        ...mapBusinessProfileDraft(data, options.userEmail),
      };
    }
  }

  return null;
}

function buildBusinessUpdatePayload(draft: BusinessProfileDraft) {
  const name = draft.name.trim();
  const slug = normalizeBusinessSlug(draft.slug || draft.name);
  const contactPhone = formatPhMobile(draft.contactPhoneDigits);

  return {
    name,
    slug,
    tagline: draft.tagline.trim() || null,
    description: draft.description.trim() || null,
    logo_url: draft.logoUrl.trim() || null,
    cover_photo_url: draft.coverPhotoUrl.trim() || null,
    address_line1: draft.addressLine1.trim(),
    address_line2: draft.addressLine2.trim() || null,
    city: draft.city.trim(),
    province: draft.province.trim(),
    zip_code: draft.zipCode.trim(),
    country: draft.country.trim(),
    contact_phone: contactPhone,
    hours: draft.hours,
  };
}

export async function updateBusinessProfileForCurrentUser(options: {
  userId: string;
  userEmail?: string | null;
  draft: BusinessProfileDraft;
}): Promise<UpdateBusinessProfileResult> {
  const businessId = await resolveBusinessIdForCurrentUser(options);
  if (!businessId) {
    return { ok: false, error: "No business profile found for this account." };
  }

  const name = options.draft.name.trim();
  const slug = normalizeBusinessSlug(options.draft.slug || options.draft.name);
  if (!name) {
    return { ok: false, error: "Business name is required." };
  }
  if (!slug) {
    return { ok: false, error: "Please provide a valid business slug." };
  }
  if (!options.draft.addressLine1.trim()) {
    return { ok: false, error: "Address line 1 is required." };
  }
  if (!options.draft.city.trim() || !options.draft.province.trim()) {
    return { ok: false, error: "City and province are required." };
  }
  if (!options.draft.zipCode.trim()) {
    return { ok: false, error: "Zip code is required." };
  }
  if (!options.draft.contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(options.draft.contactEmail.trim())) {
    return { ok: false, error: "Please enter a valid contact email." };
  }
  if (!/^\d{10}$/.test(options.draft.contactPhoneDigits.replace(/\D/g, ""))) {
    return { ok: false, error: "Please enter a valid 10-digit contact phone number." };
  }

  const payload = buildBusinessUpdatePayload({
    ...options.draft,
    name,
    slug,
    contactPhoneDigits: options.draft.contactPhoneDigits.replace(/\D/g, "").slice(0, 10),
  });
  const supabase = await createClient();

  const payloadVariants = [
    {
      name: payload.name,
      slug: payload.slug,
      tagline: payload.tagline,
      description: payload.description,
      logo_url: payload.logo_url,
      cover_photo_url: payload.cover_photo_url,
      address_line1: payload.address_line1,
      address_line2: payload.address_line2,
      city: payload.city,
      province: payload.province,
      zip_code: payload.zip_code,
      country: payload.country,
      contact_phone: payload.contact_phone,
      hours: payload.hours,
    },
    {
      name: payload.name,
      slug: payload.slug,
      tagline: payload.tagline,
      description: payload.description,
      logo_url: payload.logo_url,
      cover_photo_url: payload.cover_photo_url,
      contact_phone: payload.contact_phone,
      hours: payload.hours,
    },
  ];

  let lastError: { code?: string; message?: string } | null = null;
  for (const variant of payloadVariants) {
    const { error } = await supabase.from("businesses").update(variant).eq("id", businessId);
    if (!error) {
      return { ok: true, slug };
    }

    lastError = error;
    if (isUniqueViolationError(error) && error.message?.toLowerCase().includes("slug")) {
      return {
        ok: false,
        error: "That business slug is already taken. Please choose another one.",
      };
    }
    if (isPermissionDeniedError(error)) {
      return {
        ok: false,
        error: "Permission denied while updating the business profile.",
      };
    }
    if (!isColumnShapeError(error)) {
      break;
    }
  }

  return {
    ok: false,
    error: lastError?.message || "Unable to save business profile right now. Please try again.",
  };
}
