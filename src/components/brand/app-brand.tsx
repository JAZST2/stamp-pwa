import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type AppBrandProps = {
  name?: string;
  tagline?: string;
  className?: string;
  /** Signup header: link + peach sparkles badge + tighter type. */
  variant?: "login" | "signup";
  href?: string;
};

export function AppBrand({
  name = "PerklyPh",
  tagline = "Your loyalty, rewarded.",
  className,
  variant = "login",
  href,
}: AppBrandProps) {
  if (variant === "signup") {
    const title = (
      <>
        <span className="font-heading text-[29px] font-bold tracking-[-0.055em] text-[#322D45]">
          {name}
        </span>
        <span
          className="grid h-6 w-6 place-items-center rounded-full bg-[#FFC9A3]"
          aria-hidden="true"
        >
          <Sparkles size={13} strokeWidth={2.5} />
        </span>
      </>
    );

    return (
      <header className={cn("mb-6 text-center", className)}>
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9FE0C7] focus-visible:ring-offset-2"
            aria-label={`${name} home`}
          >
            {title}
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1">
            {title}
          </span>
        )}
        <p className="mt-1 text-[13px] font-medium tracking-[0.01em] text-[#7F798F]">
          <span>{tagline}</span>
        </p>
      </header>
    );
  }

  return (
    <header className={cn("text-center", className)}>
      <p className="font-heading text-[28px] font-bold tracking-[-0.04em] text-[#322D45]">
        <span>{name}</span>
      </p>
      <p className="mt-1.5 text-[14px] font-normal leading-5 text-[#8B859D]">
        <span>{tagline}</span>
      </p>
    </header>
  );
}
