"use client";

import { QrPreviewModal } from "@/components/ui/qr-preview-modal";

type PersonalQrPreviewModalProps = {
  open: boolean;
  fullName: string;
  personalCode: string;
  qrPayload: string;
  onClose: () => void;
};

export function PersonalQrPreviewModal({
  open,
  fullName,
  personalCode,
  qrPayload,
  onClose,
}: PersonalQrPreviewModalProps) {
  return (
    <QrPreviewModal
      open={open}
      eyebrow="Customer pass"
      title="Your Personal QR"
      subtitle="Hold this up to the business scanner."
      code={personalCode}
      qrPayload={qrPayload}
      qrAriaLabel={`Enlarged personal QR code for ${fullName}`}
      onClose={onClose}
    />
  );
}
