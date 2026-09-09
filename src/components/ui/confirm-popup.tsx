"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmPopupProps = {
  open: boolean;
  title: string;
  subtitle: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmPopup({
  open,
  title,
  subtitle,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmPopupProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#322D45]/35 px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-popup-title"
      aria-describedby="confirm-popup-subtitle"
    >
      <section className="w-full max-w-[360px] rounded-[20px] border border-white/80 bg-[#E4DFF5] p-6 shadow-[0_24px_56px_-30px_rgba(50,45,69,0.65)]">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FFF2F1]">
            <AlertTriangle className="h-5 w-5 text-[#C97873]" aria-hidden="true" />
          </span>
          <h2
            id="confirm-popup-title"
            className="font-heading text-[20px] font-semibold leading-tight tracking-[-0.03em] text-[#322D45]"
          >
            {title}
          </h2>
        </div>
        <p
          id="confirm-popup-subtitle"
          className="mt-3 text-[14px] leading-6 text-[#716B82]"
        >
          {subtitle}
        </p>

        <div className="mt-6 grid grid-cols-[0.82fr_1.18fr] gap-3">
          <Button
            type="button"
            disabled={isConfirming}
            onClick={onCancel}
            className={cn(
              "min-h-12 h-auto rounded-full border border-[#B9B4C9] bg-transparent text-[15px] font-medium text-[#322D45] shadow-none hover:bg-white hover:shadow-none",
            )}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            disabled={isConfirming}
            onClick={onConfirm}
            className="min-h-12 h-auto rounded-full bg-[#C97873] text-[15px] font-semibold text-white shadow-none hover:bg-[#B86863] hover:shadow-none"
          >
            {isConfirming ? "Deleting..." : confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}
