import { ArrowRight, Coffee, Gift, Sparkles } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { StampCard } from './StampCard';
import { TopBar } from './TopBar';
type StampCardData = {
  id: string;
  businessName: string;
  currentStamps: number;
  totalStamps: number;
};
const ACTIVE_CARDS: StampCardData[] = [{
  id: 'kape-juan',
  businessName: 'Kape Juan',
  currentStamps: 7,
  totalStamps: 10
}, {
  id: 'brewed-bliss',
  businessName: 'Brewed Bliss',
  currentStamps: 4,
  totalStamps: 10
}, {
  id: 'sari-sari-bites',
  businessName: 'Sari-Sari Bites',
  currentStamps: 8,
  totalStamps: 10
}];
const EmptyCards = () => {
  return <section className="flex min-h-[440px] flex-col items-center justify-center rounded-[24px] border border-[#E4DFF5] bg-white px-8 py-12 text-center shadow-soft" aria-labelledby="empty-cards-title">
      <figure className="mb-8">
        <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[#FFC9A3]/45" aria-hidden="true">
          <div className="flex h-24 w-24 rotate-[-4deg] flex-col items-center justify-center rounded-[24px] border-2 border-[#322D45] bg-[#FFF7F1] shadow-[6px_6px_0_#9FE0C7]">
            <Coffee className="mb-2 h-9 w-9 text-[#322D45]" strokeWidth={1.8} />
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#9FE0C7]" />
              <span className="h-2.5 w-2.5 rounded-full border border-dashed border-[#322D45]/40" />
              <span className="h-2.5 w-2.5 rounded-full border border-dashed border-[#322D45]/40" />
            </div>
          </div>
        </div>
        <figcaption className="sr-only">A cheerful coffee loyalty card ready for its first stamp</figcaption>
      </figure>
      <h2 id="empty-cards-title" className="font-sora text-2xl font-bold tracking-[-0.03em] text-[#322D45]">
        <span>Your next favorite is nearby</span>
      </h2>
      <p className="mt-3 max-w-[270px] text-[15px] leading-6 text-[#5F5972]">
        <span>Find a local spot, collect your first stamp, and make every visit count.</span>
      </p>
      <button type="button" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#9FE0C7] px-7 font-medium text-[#322D45] shadow-sm transition hover:bg-[#8CD1B8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98]">
        <span>Browse Shops</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </section>;
};
export const CustomerHome = () => {
  const hasCards = ACTIVE_CARDS.length > 0;
  return <div className="min-h-dvh bg-[#F7F8FB] text-[#322D45]">
      <TopBar showProfile />

      <main className="mx-auto w-full max-w-md px-6 pb-32 pt-24">
        <section aria-labelledby="home-heading">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-[#5F5972]">
                <Sparkles className="h-4 w-4 text-[#7BC8AB]" aria-hidden="true" />
                <span>Good morning, Mara</span>
              </p>
              <h1 id="home-heading" className="font-sora text-[34px] font-bold leading-[1.08] tracking-[-0.04em] text-[#322D45]">
                <span>Your stamp cards</span>
              </h1>
            </div>
            <div className="mb-1 flex h-11 min-w-11 items-center justify-center rounded-full bg-[#FFC9A3]/55 px-3" aria-label="3 active cards">
              <Gift className="h-4 w-4" aria-hidden="true" />
              <strong className="ml-1.5 font-mono text-xs">3</strong>
            </div>
          </div>

          {hasCards ? <div className="space-y-6" aria-label="Active stamp cards">
              <article aria-label="Kape Juan stamp card">
                <StampCard variant="compact" businessName="Kape Juan" currentStamps={7} totalStamps={10} />
              </article>
              <article aria-label="Brewed Bliss stamp card">
                <StampCard variant="compact" businessName="Brewed Bliss" currentStamps={4} totalStamps={10} />
              </article>
              <article aria-label="Sari-Sari Bites stamp card">
                <StampCard variant="compact" businessName="Sari-Sari Bites" currentStamps={8} totalStamps={10} />
              </article>
            </div> : <EmptyCards />}
        </section>
      </main>

      <BottomNav activeTab="home" type="customer" />
    </div>;
};