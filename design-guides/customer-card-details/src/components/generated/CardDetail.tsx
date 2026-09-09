import { BookOpen, QrCode } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { PillButton } from './PillButton';
import { StampCard } from './StampCard';
import { TopBar } from './TopBar';
export const CardDetail = () => {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    }
  };
  return <div className="min-h-dvh bg-[#F7F8FB] text-[#322D45]">
      <TopBar title="Kape Juan" onBack={handleBack} showProfile={false} />

      <main className="mx-auto flex w-full max-w-md flex-col px-5 pb-32 pt-24">
        <section aria-labelledby="card-detail-heading">
          <div className="mb-6 px-1">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#6D6680]">
              <span>Your loyalty card</span>
            </p>
            <h1 id="card-detail-heading" className="mt-2 font-sora text-[28px] font-bold leading-tight tracking-[-0.04em] text-[#322D45]">
              <span>Good coffee gets rewarded.</span>
            </h1>
          </div>

          <StampCard variant="full" totalStamps={10} currentStamps={6} businessName="Kape Juan" className="shadow-soft" />

          <div className="mx-3 rounded-b-[20px] bg-[#322D45] px-5 py-4 text-center shadow-soft">
            <p className="font-mono text-sm font-bold leading-relaxed text-white">
              <span>4 more stamps to your next reward!</span>
            </p>
          </div>
        </section>

        <section aria-labelledby="card-actions-heading" className="mt-8">
          <h2 id="card-actions-heading" className="sr-only">
            <span>Card actions</span>
          </h2>
          <div className="flex flex-col gap-3">
            <PillButton variant="mint" size="lg" className="min-h-14 w-full gap-2.5 font-semibold shadow-soft focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/35" aria-label="Show my Kape Juan join QR code">
              <QrCode aria-hidden="true" className="h-5 w-5" />
              <span>Show My Join QR</span>
            </PillButton>
            <PillButton variant="peach" size="lg" className="min-h-14 w-full gap-2.5 font-semibold shadow-soft focus-visible:ring-4 focus-visible:ring-[#FFC9A3]/40" aria-label="View Kape Juan reward rules">
              <BookOpen aria-hidden="true" className="h-5 w-5" />
              <span>View Reward Rules</span>
            </PillButton>
          </div>
          <p className="mt-5 text-center text-sm leading-6 text-[#6D6680]">
            <span>Present your QR before paying to collect a stamp.</span>
          </p>
        </section>
      </main>

      <BottomNav activeTab="wallet" type="customer" />
    </div>;
};