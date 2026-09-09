import { parseCardJoinQrPayload } from "@/lib/qr/stamp-card";

const CARD_CODE_PATTERN = /^[A-Z0-9-]{6,64}$/;

export function extractCardCodeFromScanInput(rawInput: string): string | null {
  const value = rawInput.trim();
  if (!value) {
    return null;
  }

  const parsed = parseCardJoinQrPayload(value);
  if (parsed) {
    return parsed.cardCode;
  }

  const normalized = value.toUpperCase();
  if (CARD_CODE_PATTERN.test(normalized)) {
    return normalized;
  }

  return null;
}
