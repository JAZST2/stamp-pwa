import { parseCustomerPassQrPayload } from "@/lib/qr/customer-pass";
import { parseRewardClaimQrPayload } from "@/lib/qr/reward-claim";

const PERSONAL_SHORT_CODE_PATTERN = /^[A-Z0-9-]{6,64}$/;
const REWARD_CLAIM_CODE_PATTERN = /^[A-Z0-9-]{6,64}$/;

export function extractCustomerShortCodeFromScanInput(rawInput: string): string | null {
  const value = rawInput.trim();
  if (!value) {
    return null;
  }

  const parsedPayload = parseCustomerPassQrPayload(value);
  if (parsedPayload) {
    return parsedPayload.personalShortCode;
  }

  const normalized = value.toUpperCase();
  if (PERSONAL_SHORT_CODE_PATTERN.test(normalized)) {
    return normalized;
  }

  return null;
}

export function extractRewardClaimCodeFromScanInput(rawInput: string): string | null {
  const value = rawInput.trim();
  if (!value) {
    return null;
  }

  const parsedPayload = parseRewardClaimQrPayload(value);
  if (parsedPayload) {
    return parsedPayload.claimCode;
  }

  const normalized = value.toUpperCase();
  if (REWARD_CLAIM_CODE_PATTERN.test(normalized)) {
    return normalized;
  }

  return null;
}
