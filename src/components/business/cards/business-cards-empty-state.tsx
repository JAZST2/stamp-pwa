import { CreditCard } from "lucide-react";
import { NoAvailableText } from "@/components/ui";

export function BusinessCardsEmptyState() {
  return (
    <div className="rounded-[20px] border border-[#D8D3E7] bg-[#E4DFF5] p-5 shadow-[0_8px_24px_rgba(50,45,69,0.08)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-[#F7F8FB] text-[#322D45]">
        <CreditCard aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <h3 className="mt-4 font-sora text-[15px] font-semibold tracking-[-0.02em] text-[#322D45]">
        Cards
      </h3>
      <NoAvailableText itemLabel="cards yet" className="mt-1.5" />
    </div>
  );
}
