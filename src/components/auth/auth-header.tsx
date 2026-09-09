import { cn } from "@/lib/utils";

type AuthHeaderProps = {
  title: string;
  description: string;
  titleId?: string;
  className?: string;
};

export function AuthHeader({
  title,
  description,
  titleId = "auth-title",
  className,
}: AuthHeaderProps) {
  return (
    <div className={className}>
      <h1
        id={titleId}
        className="font-heading text-[26px] font-semibold leading-tight tracking-[-0.03em] text-[#322D45]"
      >
        <span>{title}</span>
      </h1>
      <p className="mt-2 text-[14px] leading-5 text-[#746E86]">
        <span>{description}</span>
      </p>
    </div>
  );
}
