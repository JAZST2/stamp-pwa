"use client";

import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StatusPopupVariant = "success" | "error" | "info";

type StatusPopupProps = {
  open: boolean;
  variant: StatusPopupVariant;
  title: string;
  subtitle: string;
  buttonLabel?: string;
  onConfirm: () => void;
};

const VARIANT_STYLES: Record<
  StatusPopupVariant,
  {
    icon: typeof CheckCircle2;
    iconClassName: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconClassName: "text-[#3F9478]",
  },
  error: {
    icon: AlertCircle,
    iconClassName: "text-[#B44A5F]",
  },
  info: {
    icon: Info,
    iconClassName: "text-[#5F596F]",
  },
};

export function StatusPopup({
  open,
  variant,
  title,
  subtitle,
  buttonLabel = "Okay",
  onConfirm,
}: StatusPopupProps) {
  if (!open) {
    return null;
  }

  const Icon = VARIANT_STYLES[variant].icon;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#322D45]/35 px-5"
      role="dialog"
      aria-modal="true"
      aria-live="assertive"
    >
      <section className="w-full max-w-[360px] rounded-[20px] border border-white/80 bg-[#E4DFF5] p-6 shadow-[0_24px_56px_-30px_rgba(50,45,69,0.65)]">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/70">
            <Icon
              className={cn("h-5 w-5", VARIANT_STYLES[variant].iconClassName)}
              aria-hidden="true"
            />
          </span>
          <h2 className="font-heading text-[20px] font-semibold leading-tight tracking-[-0.03em] text-[#322D45]">
            {title}
          </h2>
        </div>
        <p className="mt-3 text-[14px] leading-6 text-[#716B82]">{subtitle}</p>

        <Button
          type="button"
          className="mt-6 min-h-12 h-auto rounded-full bg-[#9FE0C7] text-[15px] font-semibold text-[#322D45]"
          onClick={onConfirm}
        >
          {buttonLabel}
        </Button>
      </section>
    </div>
  );
}
