export function getInitials(value: string, fallback = "PK"): string {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return fallback;
  }

  const words = normalized.split(" ");
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  const initials = `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
  return initials || fallback;
}

export function composeAddress(parts: {
  address?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  province?: string | null;
  zipCode?: string | null;
  country?: string | null;
}): string {
  const direct = parts.address?.trim();
  if (direct) {
    return direct;
  }

  return [
    parts.addressLine1,
    parts.addressLine2,
    parts.city,
    parts.province,
    parts.zipCode,
    parts.country,
  ]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(", ");
}

export function parsePhMobileDigits(phone: string | null | undefined): string {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.startsWith("63") && digits.length >= 12) {
    return digits.slice(-10);
  }
  if (digits.startsWith("0") && digits.length >= 11) {
    return digits.slice(-10);
  }
  return digits.slice(-10);
}

export function normalizeBusinessSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
