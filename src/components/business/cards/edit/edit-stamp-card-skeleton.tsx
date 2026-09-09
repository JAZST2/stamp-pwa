export function EditStampCardSkeleton() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-[#F7F8FB] text-[#322D45]">
      <header className="sticky top-0 z-30 border-b border-[#E8E6EF] bg-[#F7F8FB]/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-white/80" />
          <div className="mx-auto h-5 w-24 rounded bg-white/80" />
          <div className="h-4 w-16 justify-self-end rounded bg-white/80" />
        </div>
      </header>

      <main className="flex-1 animate-pulse space-y-4 px-4 pb-32 pt-4">
        <div className="h-5 w-44 rounded bg-white/80" />
        <section className="rounded-[20px] bg-[#E4DFF5] p-5 shadow-[0_12px_34px_rgba(50,45,69,0.09)]">
          <div className="h-16 rounded bg-white/70" />
          <div className="mt-5 h-12 rounded bg-white/70" />
          <div className="mt-5 h-12 rounded bg-white/70" />
          <div className="mt-5 h-24 rounded bg-white/70" />
          <div className="mt-6 space-y-3 border-t border-[#CBC5DF] pt-6">
            <div className="h-12 rounded bg-white/70" />
            <div className="h-12 rounded bg-white/70" />
          </div>
          <div className="mt-6 h-20 rounded border border-[#F1C8C5] bg-[#FFF2F1]" />
        </section>
      </main>
    </div>
  );
}
