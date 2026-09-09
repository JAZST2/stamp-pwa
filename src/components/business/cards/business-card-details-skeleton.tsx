import { BusinessTabNavigation } from "../business-tab-navigation";

export function BusinessCardDetailsSkeleton() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col bg-[#F7F8FB] text-[#322D45]">
      <header className="sticky top-0 z-20 border-b border-[#E7E4EF] bg-[#F7F8FB]/95 px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))] backdrop-blur-xl">
        <div className="grid h-10 grid-cols-[48px_1fr_48px] items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-white/80" />
          <div className="mx-auto h-4 w-44 rounded bg-white/80" />
          <div className="h-8 w-10 justify-self-end rounded-full bg-white/80" />
        </div>
      </header>

      <main className="flex-1 animate-pulse space-y-4 px-4 pb-28 pt-5">
        <section className="rounded-[20px] border border-white/70 bg-[#E4DFF5] p-5 shadow-[0_14px_32px_rgba(50,45,69,0.09)]">
          <div className="flex items-center gap-3 border-b border-[#CDC6E5] pb-4">
            <div className="h-12 w-12 rounded-full bg-white/80" />
            <div className="space-y-2">
              <div className="h-4 w-40 rounded bg-white/80" />
              <div className="h-3 w-20 rounded bg-white/80" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={`detail-skeleton-stamp-${index + 1}`}
                className="aspect-square rounded-full border-2 border-dashed border-[#AAA4BB] bg-white/40"
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`detail-skeleton-stat-${index + 1}`}
              className="rounded-[16px] border border-[#D8D3E6] bg-[#EEEBF9] px-3 py-4"
            >
              <div className="h-5 w-12 rounded bg-white/80" />
              <div className="mt-2 h-3 w-14 rounded bg-white/80" />
            </div>
          ))}
        </section>

        <section className="rounded-[18px] border border-[#D5D0E5] bg-[#E4DFF5] p-5">
          <div className="h-5 w-28 rounded bg-white/80" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-white/80" />
            <div className="h-3 w-4/5 rounded bg-white/80" />
          </div>
          <div className="mt-4 space-y-3 border-t border-[#CDC6E5] pt-4">
            <div className="h-4 w-3/4 rounded bg-white/80" />
            <div className="h-4 w-2/3 rounded bg-white/80" />
          </div>
        </section>

        <section className="rounded-[18px] border border-[#D5D0E5] bg-[#EEEBF9] px-5 py-6">
          <div className="mx-auto h-32 w-32 rounded-[14px] border border-[#D2CCE1] bg-white/80" />
          <div className="mx-auto mt-4 h-5 w-36 rounded bg-white/80" />
          <div className="mx-auto mt-2 h-3 w-40 rounded bg-white/80" />
        </section>
      </main>

      <BusinessTabNavigation />
    </div>
  );
}
