import { useState } from 'react';
import { BarChart3, ChevronRight, CreditCard, ListFilter, Pencil, Plus, QrCode, ReceiptText, Settings, Sparkles } from 'lucide-react';
type CardStatus = 'Active' | 'Inactive';
type CardTone = 'mint' | 'peach' | 'ink';
type NavId = 'dashboard' | 'scan' | 'cards' | 'records' | 'settings';
interface LoyaltyCard {
  id: string;
  name: string;
  initials: string;
  total: number;
  filled: number;
  status: CardStatus;
  tone: CardTone;
  slots: Array<{
    id: string;
    filled: boolean;
  }>;
}
interface NavItem {
  id: NavId;
  label: string;
}
const loyaltyCards: LoyaltyCard[] = [{
  id: 'kape-juan',
  name: 'Kape Juan Loyalty Card',
  initials: 'KJ',
  total: 8,
  filled: 5,
  status: 'Active',
  tone: 'mint',
  slots: [{
    id: 'kj-1',
    filled: true
  }, {
    id: 'kj-2',
    filled: true
  }, {
    id: 'kj-3',
    filled: true
  }, {
    id: 'kj-4',
    filled: true
  }, {
    id: 'kj-5',
    filled: true
  }, {
    id: 'kj-6',
    filled: false
  }, {
    id: 'kj-7',
    filled: false
  }, {
    id: 'kj-8',
    filled: false
  }]
}, {
  id: 'brewed-bliss',
  name: 'Brewed Bliss Rewards',
  initials: 'BB',
  total: 10,
  filled: 3,
  status: 'Active',
  tone: 'peach',
  slots: [{
    id: 'bb-1',
    filled: true
  }, {
    id: 'bb-2',
    filled: true
  }, {
    id: 'bb-3',
    filled: true
  }, {
    id: 'bb-4',
    filled: false
  }, {
    id: 'bb-5',
    filled: false
  }, {
    id: 'bb-6',
    filled: false
  }, {
    id: 'bb-7',
    filled: false
  }, {
    id: 'bb-8',
    filled: false
  }, {
    id: 'bb-9',
    filled: false
  }, {
    id: 'bb-10',
    filled: false
  }]
}, {
  id: 'sari-sari',
  name: 'Sari-Sari Bites Perks',
  initials: 'SB',
  total: 5,
  filled: 0,
  status: 'Inactive',
  tone: 'ink',
  slots: [{
    id: 'sb-1',
    filled: false
  }, {
    id: 'sb-2',
    filled: false
  }, {
    id: 'sb-3',
    filled: false
  }, {
    id: 'sb-4',
    filled: false
  }, {
    id: 'sb-5',
    filled: false
  }]
}];
const navItems: NavItem[] = [{
  id: 'dashboard',
  label: 'Dashboard'
}, {
  id: 'scan',
  label: 'Scan'
}, {
  id: 'cards',
  label: 'Cards'
}, {
  id: 'records',
  label: 'Records'
}, {
  id: 'settings',
  label: 'Settings'
}];
const destinations: Record<string, string> = {
  dashboard: '#dashboard',
  scan: '#scan',
  cards: '#cards',
  records: '#records',
  settings: '#settings'
};
export const BusinessCardsList = () => {
  const [activeTab, setActiveTab] = useState<NavId>('cards');
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const cards = sortNewestFirst ? loyaltyCards : [...loyaltyCards].reverse();
  const navigate = (path: string) => {
    window.location.hash = path;
  };
  return <div className="min-h-dvh bg-[#F7F8FB] text-[#322D45]">
      <header className="sticky top-0 z-30 border-b border-[#E4DFF5]/70 bg-[#F7F8FB]/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[402px] items-start justify-between px-5 pb-4 pt-[max(24px,env(safe-area-inset-top))]">
          <div className="min-w-0 pr-4">
            <h1 className="font-sora text-[26px] font-semibold leading-tight tracking-[-0.035em] text-[#322D45]">
              <span>My Cards</span>
            </h1>
            <p className="mt-1.5 text-[14px] leading-5 text-[#777187]">
              <span>Manage your loyalty stamp cards.</span>
            </p>
          </div>
          <button type="button" aria-label={sortNewestFirst ? 'Sort cards in reverse order' : 'Sort cards in original order'} aria-pressed={!sortNewestFirst} onClick={() => setSortNewestFirst(current => !current)} className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D8D3E7] bg-white text-[#322D45] shadow-[0_4px_14px_rgba(50,45,69,0.06)] transition hover:border-[#9FE0C7] hover:bg-[#9FE0C7]/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/35 active:scale-95">
            <ListFilter aria-hidden="true" className="h-[19px] w-[19px]" strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[402px] px-5 pb-48 pt-5">
        <section aria-labelledby="cards-list-heading">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 id="cards-list-heading" className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#777187]">
              <span>3 loyalty programs</span>
            </h2>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#777187]">
              <span>2 active</span>
            </p>
          </div>

          <ul className="flex flex-col gap-4" aria-label="Loyalty stamp cards">
            {cards.map(card => <li key={card.id} className="rounded-[20px] border border-[#D8D3E7] bg-[#E4DFF5] p-4 shadow-[0_8px_24px_rgba(50,45,69,0.08)]">
                <article aria-labelledby={`${card.id}-name`}>
                  <header className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/70 font-sora text-[12px] font-bold text-[#322D45] ${card.tone === 'mint' ? 'bg-[#9FE0C7]' : card.tone === 'peach' ? 'bg-[#FFC9A3]' : 'bg-white'}`} aria-label={`${card.name} business logo`} role="img">
                      <span>{card.initials}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 id={`${card.id}-name`} className="truncate font-sora text-[15px] font-semibold tracking-[-0.02em] text-[#322D45]">
                        <span>{card.name}</span>
                      </h3>
                      <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#6F697E]">
                        <span>{card.filled}/{card.total} stamps</span>
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-medium text-[#322D45] ${card.status === 'Active' ? 'bg-[#9FE0C7]' : 'bg-[#B9B4C9]'}`}>
                      {card.status}
                    </span>
                  </header>

                  <div className="mt-4 flex items-center gap-2" aria-label={`${card.filled} of ${card.total} stamps filled`}>
                    {card.slots.map(slot => <span key={slot.id} aria-hidden="true" className={`h-6 w-6 shrink-0 rounded-full ${slot.filled ? 'border-2 border-[#8CD2B7] bg-[#9FE0C7] shadow-[inset_0_0_0_3px_rgba(255,255,255,0.4)]' : 'border-2 border-dashed border-[#A49EB5] bg-white/30'}`} />)}
                  </div>

                  <footer className="mt-4 flex items-center gap-2 border-t border-[#CFC9E1] pt-3">
                    <button type="button" onClick={() => navigate(`edit-card/${card.id}`)} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#AFA8C3] bg-transparent px-3 font-sora text-[11px] font-semibold text-[#322D45] transition hover:bg-white/55 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 active:scale-[0.98]">
                      <Pencil aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
                      <span>Edit</span>
                    </button>
                    <button type="button" onClick={() => navigate(`card-detail/${card.id}`)} className="flex h-9 flex-[1.4] items-center justify-center gap-1.5 rounded-full bg-[#9FE0C7] px-3 font-sora text-[11px] font-semibold text-[#322D45] shadow-[0_3px_10px_rgba(50,45,69,0.07)] transition hover:bg-[#8ED7BB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/45 active:scale-[0.98]">
                      <span>View Details</span>
                      <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  </footer>
                </article>
              </li>)}
          </ul>
        </section>
      </main>

      <button type="button" onClick={() => navigate('create-card')} className="fixed bottom-[94px] right-[max(20px,calc((100vw_-_402px)/2_+_20px))] z-40 flex h-14 items-center gap-2 rounded-full bg-[#9FE0C7] px-5 font-sora text-[13px] font-semibold text-[#322D45] shadow-[0_10px_28px_rgba(50,45,69,0.18)] transition hover:-translate-y-0.5 hover:bg-[#8ED7BB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/45 active:translate-y-0 active:scale-95" aria-label="Create a new loyalty card">
        <Plus aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
        <span>New Card</span>
      </button>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#DDD8EA] bg-white/95 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl" aria-label="Business navigation">
        <ul className="mx-auto grid w-full max-w-[402px] grid-cols-5 px-2">
          {navItems.map(item => {
          const isActive = activeTab === item.id;
          return <li key={item.id}>
                <button type="button" onClick={() => {
              setActiveTab(item.id);
              navigate(destinations[item.id]);
            }} aria-current={isActive ? 'page' : undefined} className={`flex min-h-[64px] w-full flex-col items-center justify-center gap-1 rounded-[16px] px-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9FE0C7] ${isActive ? 'text-[#322D45]' : 'text-[#8A8497] hover:text-[#322D45]'}`}>
                  <span className={`flex h-7 min-w-10 items-center justify-center rounded-full px-2 transition ${isActive ? 'bg-[#9FE0C7]' : 'bg-transparent'}`}>
                    {item.id === 'dashboard' ? <BarChart3 aria-hidden="true" className="h-[19px] w-[19px]" strokeWidth={1.7} /> : null}
                    {item.id === 'scan' ? <QrCode aria-hidden="true" className="h-[19px] w-[19px]" strokeWidth={1.7} /> : null}
                    {item.id === 'cards' ? <CreditCard aria-hidden="true" className="h-[19px] w-[19px]" strokeWidth={1.7} /> : null}
                    {item.id === 'records' ? <ReceiptText aria-hidden="true" className="h-[19px] w-[19px]" strokeWidth={1.7} /> : null}
                    {item.id === 'settings' ? <Settings aria-hidden="true" className="h-[19px] w-[19px]" strokeWidth={1.7} /> : null}
                  </span>
                  <span className={`text-[9px] font-medium leading-none ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                </button>
              </li>;
        })}
        </ul>
      </nav>

      <span className="sr-only" aria-live="polite">
        {sortNewestFirst ? 'Cards in original order' : 'Cards in reverse order'}
      </span>
      <Sparkles aria-hidden="true" className="hidden" />
    </div>;
};