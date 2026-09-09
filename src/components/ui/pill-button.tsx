import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PillButtonVariant = "mint" | "peach" | "ghost";
export type PillButtonSize = "sm" | "md" | "lg";

export type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: PillButtonVariant;
  size?: PillButtonSize;
  children: ReactNode;
};

const BASE_STYLES =
  "inline-flex items-center justify-center rounded-full font-medium transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100";

const VARIANT_STYLES: Record<PillButtonVariant, string> = {
  mint: "bg-[#9FE0C7] text-[#322D45] shadow-sm hover:bg-[#8CD1B8]",
  peach: "bg-[#FFC9A3] text-[#322D45] shadow-sm hover:bg-[#FFB885]",
  ghost: "border-2 border-[#322D45] bg-transparent text-[#322D45] hover:bg-[#322D45]/5",
};

const SIZE_STYLES: Record<PillButtonSize, string> = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export function PillButton({
  variant = "mint",
  size = "md",
  type = "button",
  children,
  className,
  ...props
}: PillButtonProps) {
  return (
    <button
      type={type}
      className={cn(BASE_STYLES, VARIANT_STYLES[variant], SIZE_STYLES[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
