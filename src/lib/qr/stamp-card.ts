const JOIN_QR_SEGMENT = ":CARD:JOIN:";
const DEFAULT_QR_NAMESPACE = "APP";

export function buildCardJoinQrPayload(cardCode: string): string {
  return `${getQrNamespace()}${JOIN_QR_SEGMENT}${normalizeCardCode(cardCode)}`;
}

export function parseCardJoinQrPayload(payload: string): {
  cardCode: string;
} | null {
  const normalizedPayload = payload.trim();
  if (!normalizedPayload) {
    return null;
  }

  const prefixedMatch = normalizedPayload.match(
    /^([A-Z0-9_-]+):CARD:JOIN:(.+)$/i,
  );
  if (prefixedMatch) {
    const cardCodeFromPrefix = prefixedMatch[2].trim();
    if (isValidCardCode(cardCodeFromPrefix)) {
      return { cardCode: normalizeCardCode(cardCodeFromPrefix) };
    }
  }

  if (isValidCardCode(normalizedPayload)) {
    return { cardCode: normalizeCardCode(normalizedPayload) };
  }

  return null;
}

function normalizeCardCode(cardCode: string): string {
  return cardCode.trim().toUpperCase();
}

function getQrNamespace(): string {
  const fromEnv = process.env.NEXT_PUBLIC_QR_NAMESPACE?.trim();
  if (!fromEnv) {
    return DEFAULT_QR_NAMESPACE;
  }

  const cleaned = fromEnv.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  return cleaned || DEFAULT_QR_NAMESPACE;
}

function isValidCardCode(cardCode: string): boolean {
  return /^[A-Z0-9-]{6,64}$/i.test(cardCode.trim());
}
