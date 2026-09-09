"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "name"
> & {
  id: string;
  name: string;
  label: string;
  /** Renders the password field with show/hide toggle. */
  passwordToggle?: boolean;
  containerClassName?: string;
  /**
   * `labeled` = login style (visible label + cloud input).
   * `plain` = signup style (sr-only label + perkly-input).
   */
  variant?: "labeled" | "plain";
};

export function TextField({
  id,
  name,
  label,
  type = "text",
  passwordToggle = false,
  className,
  containerClassName,
  variant = "labeled",
  ...props
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = passwordToggle || type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const isPlain = variant === "plain";

  if (isPlain) {
    return (
      <div className={cn(isPassword && "relative", containerClassName)}>
        <label htmlFor={id} className="sr-only">
          {label}
        </label>

        {isPassword ? (
          <>
            <input
              id={id}
              name={name}
              type={inputType}
              className={cn("perkly-input pr-12", className)}
              {...props}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-1.5 my-auto grid h-9 w-9 place-items-center rounded-full text-[#716B82] transition hover:bg-white/50 hover:text-[#322D45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#74CFAE]"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          </>
        ) : (
          <input
            id={id}
            name={name}
            type={inputType}
            className={cn("perkly-input", className)}
            {...props}
          />
        )}
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <label
        htmlFor={id}
        className="ml-1 block text-[13px] font-medium text-[#5F596F]"
      >
        <span>{label}</span>
      </label>

      {isPassword ? (
        <div
          className={cn(
            "mt-2 flex h-14 w-full items-center rounded-2xl border border-[#CBC5DB] bg-[#F7F8FB] px-4 shadow-[0_2px_0_rgba(50,45,69,0.02)] transition focus-within:border-[#68C9A3] focus-within:ring-4 focus-within:ring-[#9FE0C7]/30",
            className,
          )}
        >
          <input
            id={id}
            name={name}
            type={inputType}
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[#322D45] outline-none placeholder:text-[#9A94AA]"
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="ml-3 flex h-9 w-9 items-center justify-center rounded-full text-[#746E86] transition hover:bg-[#E4DFF5] hover:text-[#322D45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68C9A3]"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff className="h-[19px] w-[19px]" aria-hidden="true" />
            ) : (
              <Eye className="h-[19px] w-[19px]" aria-hidden="true" />
            )}
          </button>
        </div>
      ) : (
        <input
          id={id}
          name={name}
          type={inputType}
          className={cn(
            "mt-2 h-14 w-full rounded-2xl border border-[#CBC5DB] bg-[#F7F8FB] px-4 text-[15px] text-[#322D45] shadow-[0_2px_0_rgba(50,45,69,0.02)] outline-none transition placeholder:text-[#9A94AA] focus:border-[#68C9A3] focus:ring-4 focus:ring-[#9FE0C7]/30",
            className,
          )}
          {...props}
        />
      )}
    </div>
  );
}
