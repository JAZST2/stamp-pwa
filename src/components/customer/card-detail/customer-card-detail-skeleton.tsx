import { CustomerTopBar } from "@/components/customer/customer-top-bar";

export function CustomerCardDetailSkeleton() {
  return (
    <>
      <CustomerTopBar title="Stamp card" backHref="/home" showProfile={false} />

      <main
        className="mx-auto flex w-full max-w-[402px] flex-col px-5 pb-32 pt-[calc(6rem+env(safe-area-inset-top))]"
        aria-hidden="true"
      >
        <section className="animate-pulse">
          <div className="mb-6 px-1">
            <div className="h-3 w-32 rounded bg-[#E4DFF5]" />
            <div className="mt-3 h-8 w-64 rounded bg-[#E4DFF5]" />
          </div>

          <div className="overflow-hidden rounded-[24px] border border-[#E4DFF5] bg-white shadow-sm">
            <div className="flex items-center justify-between bg-[#E4DFF5] px-5 py-4">
              <div className="h-5 w-36 rounded bg-white/70" />
              <div className="h-8 w-8 rounded-full bg-white/80" />
            </div>
            <div className="px-5 py-6">
              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: 10 }, (_, index) => (
                  <div
                    key={`card-detail-skeleton-stamp-${index + 1}`}
                    className="aspect-square rounded-full bg-[#E4DFF5]/80"
                  />
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#F7F8FB] pt-4">
                <div className="h-3 w-28 rounded bg-[#E4DFF5]" />
                <div className="h-4 w-12 rounded bg-[#E4DFF5]" />
              </div>
            </div>
          </div>

          <div className="mx-3 rounded-b-[20px] bg-[#322D45] px-5 py-4">
            <div className="mx-auto h-4 w-52 rounded bg-white/20" />
          </div>
        </section>

        <section className="mt-8 flex animate-pulse flex-col gap-3">
          <div className="h-14 w-full rounded-full bg-[#9FE0C7]/70" />
          <div className="h-14 w-full rounded-full bg-[#FFC9A3]/70" />
          <div className="mx-auto mt-2 h-4 w-64 rounded bg-[#E4DFF5]" />
        </section>
      </main>
    </>
  );
}
