export function CustomerHomeCardsSkeleton() {
  return (
    <ul className="space-y-6" aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <li
          key={`home-card-skeleton-${index + 1}`}
          className="overflow-hidden rounded-[24px] border border-[#E4DFF5] bg-white shadow-sm"
        >
          <div className="flex items-center justify-between bg-[#E4DFF5] px-5 py-4">
            <div className="h-5 w-36 animate-pulse rounded bg-white/70" />
            <div className="h-8 w-8 animate-pulse rounded-full bg-white/80" />
          </div>
          <div className="px-5 py-4">
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 10 }, (_, stampIndex) => (
                <div
                  key={`home-card-skeleton-${index + 1}-stamp-${stampIndex + 1}`}
                  className="aspect-square animate-pulse rounded-full bg-[#E4DFF5]/80"
                />
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
