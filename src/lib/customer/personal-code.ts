const DEFAULT_INITIALS = "PKL";

export function buildPersonalShortCode(fullName: string, phoneOrDigits: string): string {
  const initials = resolveInitials(fullName);
  const tail = resolvePhoneTail(phoneOrDigits);
  const entropy = Math.random()
    .toString(36)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 3)
    .padEnd(3, "X");

  return `${initials}${tail}${entropy}`;
}

export function formatPhMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("63")) {
    return `+${digits}`;
  }
  if (digits.startsWith("0")) {
    return `+63${digits.slice(1)}`;
  }
  return `+63${digits}`;
}

function resolveInitials(fullName: string): string {
  const initials =
    fullName
      .trim()
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 3) || DEFAULT_INITIALS;

  return initials;
}

function resolvePhoneTail(phoneOrDigits: string): string {
  const digits = phoneOrDigits.replace(/\D/g, "");
  if (!digits) {
    return "0000";
  }

  return digits.slice(-4).padStart(4, "0");
}
