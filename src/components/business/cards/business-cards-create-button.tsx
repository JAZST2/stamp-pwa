import Link from "next/link";
import { Plus } from "lucide-react";

export function BusinessCardsCreateButton() {
  return (
    <Link
      href="/cards/create"
      className="fixed bottom-[94px] right-[max(20px,calc((100vw_-_402px)/2_+_20px))] z-40 flex h-14 items-center gap-2 rounded-full bg-[#9FE0C7] px-5 font-sora text-[13px] font-semibold text-[#322D45] shadow-[0_10px_28px_rgba(50,45,69,0.18)] transition hover:-translate-y-0.5 hover:bg-[#8ED7BB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/45 active:translate-y-0 active:scale-95"
      aria-label="Create a new loyalty card"
    >
      <Plus aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
      <span>New Card</span>
    </Link>
  );
}
