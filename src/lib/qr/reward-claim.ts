const REWARD_CLAIM_QR_SEGMENT = ":REWARD:CLAIM:";
const DEFAULT_QR_NAMESPACE = "APP";
const CLAIM_CODE_PATTERN = /^[A-Z0-9-]{6,64}$/;

export function buildRewardClaimQrPayload(claimCode: string): string {
  return `${getQrNamespace()}${REWARD_CLAIM_QR_SEGMENT}${normalizeClaimCode(claimCode)}`;
}

export function parseRewardClaimQrPayload(payload: string): {
  claimCode: string;
} | null {
  const normalizedPayload = payload.trim();
  if (!normalizedPayload) {
    return null;
  }

  const prefixedMatch = normalizedPayload.match(
    /^([A-Z0-9_-]+):REWARD:CLAIM:(.+)$/i,
  );
  if (prefixedMatch) {
    const codeFromPrefix = prefixedMatch[2].trim();
    if (isValidClaimCode(codeFromPrefix)) {
      return { claimCode: normalizeClaimCode(codeFromPrefix) };
    }
  }

  if (isValidClaimCode(normalizedPayload)) {
    return { claimCode: normalizeClaimCode(normalizedPayload) };
  }

  return null;
}

function normalizeClaimCode(code: string): string {
  return code.trim().toUpperCase();
}

function isValidClaimCode(code: string): boolean {
  return CLAIM_CODE_PATTERN.test(code.trim());
}

function getQrNamespace(): string {
  const fromEnv = process.env.NEXT_PUBLIC_QR_NAMESPACE?.trim();
  if (!fromEnv) {
    return DEFAULT_QR_NAMESPACE;
  }

  const cleaned = fromEnv.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  return cleaned || DEFAULT_QR_NAMESPACE;
}
