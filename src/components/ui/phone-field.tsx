import type { FormEvent, InputEvent, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type PhoneFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "name" | "type"
> & {
  id?: string;
  name?: string;
  label?: string;
  countryCode?: string;
  containerClassName?: string;
};

/** Philippines mobile field with fixed +63 prefix (signup design). */
export function PhoneField({
  id = "mobile",
  name = "mobile",
  label = "Mobile number",
  countryCode = "+63",
  className,
  containerClassName,
  onInput,
  ...props
}: PhoneFieldProps) {
  function handleInput(event: FormEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const digitsOnly = input.value.replace(/\D/g, "").slice(0, 10);
    input.value = digitsOnly;
    onInput?.(event as unknown as InputEvent<HTMLInputElement>);
  }

  return (
    <div
      className={cn(
        "flex min-h-12 overflow-hidden rounded-2xl border border-[#C8C2D9] bg-[#E4DFF5] transition focus-within:border-[#74CFAE] focus-within:ring-3 focus-within:ring-[#9FE0C7]/40",
        containerClassName,
      )}
    >
      <span
        className="flex shrink-0 items-center gap-2 border-r border-[#C8C2D9] px-3 text-sm font-medium"
        aria-label="Philippines country code"
      >
        <span role="img" aria-label="Philippines flag">
          🇵🇭
        </span>
        <span>{countryCode}</span>
      </span>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        pattern="[0-9]{10}"
        maxLength={10}
        className={cn(
          "min-w-0 flex-1 bg-transparent px-3.5 text-[15px] outline-none placeholder:text-[#8D879C]",
          className,
        )}
        onInput={handleInput}
        {...props}
      />
    </div>
  );
}
