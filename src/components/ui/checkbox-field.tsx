import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CheckboxFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "children"
> & {
  children: ReactNode;
  containerClassName?: string;
};

export function CheckboxField({
  id,
  name,
  children,
  className,
  containerClassName,
  ...props
}: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-2.5 py-1 text-[12px] leading-5 text-[#716B82]",
        containerClassName,
      )}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        className={cn(
          "mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[#A9A2BB] accent-[#78CDB0] focus:ring-[#9FE0C7]",
          className,
        )}
        {...props}
      />
      <span>{children}</span>
    </label>
  );
}
