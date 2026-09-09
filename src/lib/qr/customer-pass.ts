const CUSTOMER_PASS_QR_SEGMENT = ":CUSTOMER:PASS:";
const DEFAULT_QR_NAMESPACE = "APP";

export function buildCustomerPassQrPayload(personalShortCode: string): string {
  return `${getQrNamespace()}${CUSTOMER_PASS_QR_SEGMENT}${normalizePersonalShortCode(personalShortCode)}`;
}

export function parseCustomerPassQrPayload(payload: string): {
  personalShortCode: string;
} | null {
  const normalizedPayload = payload.trim();
  if (!normalizedPayload) {
    return null;
  }

  const prefixedMatch = normalizedPayload.match(
    /^([A-Z0-9_-]+):CUSTOMER:PASS:(.+)$/i,
  );
  if (prefixedMatch) {
    const codeFromPrefix = prefixedMatch[2].trim();
    if (isValidPersonalShortCode(codeFromPrefix)) {
      return { personalShortCode: normalizePersonalShortCode(codeFromPrefix) };
    }
  }

  if (isValidPersonalShortCode(normalizedPayload)) {
    return { personalShortCode: normalizePersonalShortCode(normalizedPayload) };
  }

  return null;
}

export function normalizePersonalShortCode(value: string): string {
  return value.trim().toUpperCase();
}

export function isValidPersonalShortCode(value: string): boolean {
  return /^[A-Z0-9-]{6,64}$/i.test(value.trim());
}

function getQrNamespace(): string {
  const fromEnv = process.env.NEXT_PUBLIC_QR_NAMESPACE?.trim();
  if (!fromEnv) {
    return DEFAULT_QR_NAMESPACE;
  }

  const cleaned = fromEnv.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  return cleaned || DEFAULT_QR_NAMESPACE;
}
