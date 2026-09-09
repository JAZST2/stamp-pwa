import Link from "next/link";
import { ArrowRight, Coffee } from "lucide-react";

export function CustomerHomeEmptyState() {
  return (
    <section
      className="flex min-h-[440px] flex-col items-center justify-center rounded-[24px] border border-[#E4DFF5] bg-white px-8 py-12 text-center shadow-[0_4px_12px_rgba(50,45,69,0.06)]"
      aria-labelledby="empty-cards-title"
    >
      <figure className="mb-8">
        <div
          className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[#FFC9A3]/45"
          aria-hidden="true"
        >
          <div className="flex h-24 w-24 rotate-[-4deg] flex-col items-center justify-center rounded-[24px] border-2 border-[#322D45] bg-[#FFF7F1] shadow-[6px_6px_0_#9FE0C7]">
            <Coffee className="mb-2 h-9 w-9 text-[#322D45]" strokeWidth={1.8} />
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#9FE0C7]" />
              <span className="h-2.5 w-2.5 rounded-full border border-dashed border-[#322D45]/40" />
              <span className="h-2.5 w-2.5 rounded-full border border-dashed border-[#322D45]/40" />
            </div>
          </div>
        </div>
        <figcaption className="sr-only">
          A cheerful coffee loyalty card ready for its first stamp
        </figcaption>
      </figure>
      <h2
        id="empty-cards-title"
        className="font-display text-2xl font-bold tracking-[-0.03em] text-[#322D45]"
      >
        <span>Your next favorite is nearby</span>
      </h2>
      <p className="mt-3 max-w-[270px] text-[15px] leading-6 text-[#5F5972]">
        <span>Find a local spot, collect your first stamp, and make every visit count.</span>
      </p>
      <Link
        href="/browse"
        className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#9FE0C7] px-7 font-medium text-[#322D45] shadow-sm transition hover:bg-[#8CD1B8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98]"
      >
        <span>Browse Shops</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
