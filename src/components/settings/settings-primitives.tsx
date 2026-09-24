import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SettingsSectionProps = {
  title: string;
  children: ReactNode;
};

type SettingsButtonRowProps = {
  label: string;
  icon: LucideIcon;
  value?: string;
  warning?: boolean;
  danger?: boolean;
  border?: boolean;
  onClick?: () => void;
  rightLabel?: string;
  disabled?: boolean;
};

type SettingsToggleRowProps = {
  label: string;
  icon: LucideIcon;
  checked: boolean;
  onChange?: () => void;
  border?: boolean;
  disabled?: boolean;
};

function Toggle({
  checked,
  label,
  onChange,
  disabled,
}: {
  checked: boolean;
  label: string;
  onChange?: () => void;
  disabled?: boolean;
}) {
  const interactive = Boolean(onChange) && !disabled;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-disabled={!interactive}
      tabIndex={interactive ? 0 : -1}
      onClick={interactive ? onChange : undefined}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45]",
        checked ? "border-[#83CFB2] bg-[#9FE0C7]" : "border-[#B9B4C9] bg-[#DAD7E4]",
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(50,45,69,0.22)] transition-transform duration-200",
          checked ? "translate-x-[23px]" : "translate-x-[3px]",
        )}
        aria-hidden="true"
      />
    </button>
  );
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className="mt-6" aria-label={title}>
      <h2 className="mb-2.5 px-1 font-display text-sm font-semibold">{title}</h2>
      <div className="overflow-hidden rounded-2xl bg-[#E4DFF5]">{children}</div>
    </section>
  );
}

export function SettingsButtonRow({
  label,
  icon: Icon,
  value,
  warning,
  danger,
  border = true,
  onClick,
  rightLabel,
  disabled,
}: SettingsButtonRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex min-h-14 w-full items-center gap-3 px-4 text-left transition",
        "focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#322D45]",
        border && "border-b border-[#B9B4C9]",
        warning ? "text-[#D18C5B]" : danger ? "text-[#C96868]" : "text-[#322D45]",
        disabled ? "opacity-70" : "hover:bg-white/25",
      )}
    >
      <Icon
        className={cn("h-5 w-5", warning || danger ? "text-current" : "text-[#625B79]")}
        strokeWidth={1.8}
        aria-hidden="true"
      />
      <span className="flex-1 text-sm font-medium">{label}</span>
      {value ? <span className="text-xs text-[#777186]">{value}</span> : null}
      {rightLabel ? <span className="text-xs font-semibold">{rightLabel}</span> : null}
      {!warning && !danger ? (
        <ChevronRight className="h-5 w-5 text-[#777186]" aria-hidden="true" />
      ) : null}
    </button>
  );
}

export function SettingsToggleRow({
  label,
  icon: Icon,
  checked,
  onChange,
  border = true,
  disabled,
}: SettingsToggleRowProps) {
  return (
    <div className={cn("flex min-h-14 items-center gap-3 px-4", border && "border-b border-[#B9B4C9]")}>
      <Icon className="h-5 w-5 text-[#625B79]" strokeWidth={1.8} aria-hidden="true" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      <Toggle checked={checked} label={label} onChange={onChange} disabled={disabled} />
    </div>
  );
}
