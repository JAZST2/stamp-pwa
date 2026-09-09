import { cn } from "@/lib/utils";

type AuthCardProps = {
  children: React.ReactNode;
  className?: string;
  "aria-labelledby"?: string;
};

/** Lavender surface panel used on auth screens. */
export function AuthCard({
  children,
  className,
  "aria-labelledby": ariaLabelledBy,
}: AuthCardProps) {
  return (
    <section
      className={cn(
        "w-full rounded-[20px] border border-white/70 bg-[#E4DFF5] px-6 py-7 shadow-[0_18px_45px_rgba(71,58,98,0.10)]",
        className,
      )}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </section>
  );
}
