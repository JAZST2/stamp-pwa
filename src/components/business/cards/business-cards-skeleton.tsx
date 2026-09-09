export function BusinessCardsSkeleton() {
  return (
    <ul className="flex animate-pulse flex-col gap-4" aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <li
          key={`cards-skeleton-${index + 1}`}
          className="rounded-[20px] border border-[#D8D3E7] bg-[#E4DFF5] p-4 shadow-[0_8px_24px_rgba(50,45,69,0.08)]"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-white/70" />
            <div className="min-w-0 flex-1">
              <div className="h-4 w-44 rounded bg-white/70" />
            </div>
            <div className="h-6 w-16 rounded-full bg-white/70" />
          </div>

          <div className="mt-4 rounded-xl border border-[#CDC7DE] bg-white/55 px-3 py-2.5">
            <div className="grid grid-cols-3 gap-3">
              <div className="h-8 rounded bg-white/70" />
              <div className="h-8 rounded bg-white/70" />
              <div className="h-8 rounded bg-white/70" />
            </div>
          </div>

          <div className="mt-4 flex gap-2 border-t border-[#CFC9E1] pt-3">
            <div className="h-9 flex-1 rounded-full bg-white/70" />
            <div className="h-9 flex-[1.4] rounded-full bg-white/70" />
          </div>
        </li>
      ))}
    </ul>
  );
}
