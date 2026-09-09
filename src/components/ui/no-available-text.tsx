import { cn } from "@/lib/utils";

type NoAvailableTextProps = {
  itemLabel: string;
  className?: string;
};

export function NoAvailableText({ itemLabel, className }: NoAvailableTextProps) {
  return (
    <p className={cn("text-[14px] leading-6 text-[#6F697E]", className)}>
      No available {itemLabel}.
    </p>
  );
}
