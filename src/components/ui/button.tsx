import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function Button({ children, className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "flex h-14 w-full items-center justify-center rounded-full bg-[#9FE0C7] px-6 text-[15px] font-semibold text-[#322D45] shadow-[0_8px_18px_rgba(78,164,131,0.18)] transition hover:-translate-y-0.5 hover:bg-[#8FD8BC] hover:shadow-[0_12px_24px_rgba(78,164,131,0.22)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#68C9A3]/35 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
    </button>
  );
}
