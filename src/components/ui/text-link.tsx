import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
  /** `action` = forgot-password style; `inline` = sign-up style inside body copy */
  variant?: "action" | "inline";
};

/** Inline text action used for “Forgot password?” and “Sign up”. */
export function TextLink({
  children,
  className,
  variant = "action",
  ...props
}: TextLinkProps) {
  return (
    <a
      className={cn(
        "font-medium text-[#3F9F7B] transition hover:text-[#2F7D61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68C9A3]",
        variant === "action" && "rounded-md px-1 py-1 text-[13px]",
        variant === "inline" && "rounded",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
    </a>
  );
}
