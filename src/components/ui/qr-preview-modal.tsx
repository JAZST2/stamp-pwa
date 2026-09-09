"use client";

import { useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

export type QrPreviewModalProps = {
  open: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  code: string;
  qrPayload: string;
  qrAriaLabel: string;
  emptyMessage?: string;
  onClose: () => void;
};

export function QrPreviewModal({
  open,
  eyebrow,
  title,
  subtitle,
  code,
  qrPayload,
  qrAriaLabel,
  emptyMessage = "QR unavailable",
  onClose,
}: QrPreviewModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const hasQr = qrPayload.trim().length > 0 && code.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[#322D45]/35 px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-preview-title"
      onClick={onClose}
    >
      <section
        className="w-full max-w-[360px] rounded-[20px] border border-white/80 bg-[#E4DFF5] p-6 text-center shadow-[0_24px_56px_-30px_rgba(50,45,69,0.65)]"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#746E82]">
          {eyebrow}
        </p>
        <h2
          id="qr-preview-title"
          className="mt-2 font-display text-[20px] font-semibold tracking-[-0.03em] text-[#322D45]"
        >
          {title}
        </h2>
        <p className="mt-1 text-[13px] text-[#716B82]">{subtitle}</p>

        <div className="mx-auto mt-5 w-fit rounded-[18px] border border-white bg-white p-3.5 shadow-[0_8px_22px_rgba(50,45,69,0.08)]">
          {hasQr ? (
            <QRCodeCanvas
              value={qrPayload}
              size={248}
              fgColor="#322D45"
              bgColor="#FFFFFF"
              marginSize={2}
              level="H"
              role="img"
              aria-label={qrAriaLabel}
            />
          ) : (
            <div className="grid h-[248px] w-[248px] place-items-center text-center text-[13px] leading-5 text-[#777186]">
              {emptyMessage}
            </div>
          )}
        </div>

        <p className="mt-4 font-mono text-[15px] font-bold tracking-[0.08em] text-[#4A9E7E]">
          {hasQr ? code : "Not generated"}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#9FE0C7] px-4 text-[15px] font-semibold text-[#322D45] transition hover:bg-[#8FD5BB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98]"
        >
          Close
        </button>
      </section>
    </div>
  );
}
