import { useState } from 'react';
import { ArrowLeft, BarChart3, Coffee, CreditCard, Download, FileClock, Gift, Printer, QrCode, ScanLine, Settings, Share2, Star } from 'lucide-react';
const STAMPS = [{
  id: 'stamp-1',
  number: 1
}, {
  id: 'stamp-2',
  number: 2
}, {
  id: 'stamp-3',
  number: 3
}, {
  id: 'stamp-4',
  number: 4
}, {
  id: 'stamp-5',
  number: 5
}, {
  id: 'stamp-6',
  number: 6
}, {
  id: 'stamp-7',
  number: 7
}, {
  id: 'stamp-8',
  number: 8
}] as const;
const STATS = [{
  id: 'members',
  label: 'Members',
  value: '124',
  color: '#E4DFF5'
}, {
  id: 'redeemed',
  label: 'Redeemed',
  value: '18',
  color: '#DDF3EA'
}, {
  id: 'pending',
  label: 'Pending',
  value: '7',
  color: '#FFE1CB'
}] as const;
const NAV_ITEMS = [{
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
}] as const;
const QR_ACTIONS = [{
  id: 'print',
  label: 'Print'
}, {
  id: 'share',
  label: 'Share'
}, {
  id: 'save',
  label: 'Save'
}] as const;
const QR_PATTERN = new Set([0, 1, 2, 3, 4, 6, 7, 8, 9, 13, 15, 17, 18, 20, 22, 24, 26, 27, 29, 31, 33, 35, 36, 37, 38, 40, 42, 43, 44, 45, 49, 51, 53, 54, 55, 56, 57, 58, 60, 62, 63, 67, 69, 71, 72, 73, 74, 76, 78, 79, 80]);
const QR_CELLS = Array.from({
  length: 81
}, (_, cell) => ({
  id: `qr-cell-${cell}`,
  filled: QR_PATTERN.has(cell)
}));
export const BusinessCardDetail = () => {
  const [isActive, setIsActive] = useState(true);
  const [notice, setNotice] = useState('');
  const handleBack = () => {
    window.location.hash = 'cards';
  };
  const handleAction = (action: string) => {
    setNotice(`${action} option ready`);
    window.setTimeout(() => setNotice(''), 1800);
  };
  return <div className="min-h-dvh bg-[#F7F8FB] text-[#322D45]">
      <header className="sticky top-0 z-40 border-b border-[#E7E4EF] bg-[#F7F8FB]/95 backdrop-blur-xl">
        <nav aria-label="Card detail navigation" className="mx-auto grid h-[72px] w-full max-w-[440px] grid-cols-[48px_1fr_48px] items-center px-4">
          <button type="button" onClick={handleBack} aria-label="Back to Cards List" className="flex h-10 w-10 items-center justify-center rounded-full text-[#322D45] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/40">
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <h1 className="truncate px-1 text-center font-sora text-[14px] font-semibold tracking-[-0.02em]">
            <span>Kape Juan Loyalty Card</span>
          </h1>
          <button type="button" onClick={() => handleAction('Edit card')} className="justify-self-end rounded-full px-1 py-2 text-[14px] font-medium text-[#4B9F81] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/40">
            <span>Edit</span>
          </button>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[440px] px-4 pb-32 pt-5">
        <section aria-label="Loyalty card overview" className="rounded-[20px] border border-white/70 bg-[#E4DFF5] p-5 shadow-[0_14px_32px_rgba(50,45,69,0.09)]">
          <div className="flex items-center gap-3 border-b border-[#CDC6E5] pb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(50,45,69,0.07)]" role="img" aria-label="Kape Juan coffee logo">
              <Coffee aria-hidden="true" className="h-6 w-6 text-[#322D45]" />
            </div>
            <div className="min-w-0">
              <p className="font-sora text-[17px] font-semibold tracking-[-0.025em]">
                <span>Kape Juan</span>
              </p>
              <p className="mt-1 text-[13px] text-[#726C82]">
                <span>Buy 7 drinks, get the 8th on us.</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 py-5" aria-label="Five of eight stamps collected">
            {STAMPS.map(stamp => <div key={stamp.id} aria-label={`Stamp ${stamp.number}${stamp.number <= 5 ? ', collected' : ', empty'}${stamp.number === 8 ? ', reward milestone' : ''}`} className={`flex aspect-square items-center justify-center rounded-full ${stamp.number <= 5 ? 'border-2 border-[#90D4BA] bg-[#9FE0C7] shadow-[0_3px_0_rgba(50,45,69,0.12)]' : 'border-2 border-dashed border-[#AAA4BB] bg-white/25'}`}>
                {stamp.number === 8 ? <Star aria-hidden="true" className="h-6 w-6 fill-[#FFC9A3] text-[#D9905A]" /> : stamp.number <= 5 ? <Coffee aria-hidden="true" className={`h-5 w-5 text-[#322D45] ${stamp.number % 2 === 0 ? '-rotate-6' : 'rotate-6'}`} /> : <span className="font-mono text-[11px] text-[#827B92]">{stamp.number}</span>}
              </div>)}
          </div>

          <div className="flex items-center justify-between border-t border-[#CDC6E5] pt-4">
            <p className="text-[13px] font-medium text-[#5E576F]">
              <span>Card progress</span>
            </p>
            <p className="font-mono text-[15px] font-bold tracking-[-0.04em]">
              <span>5/8 stamps</span>
            </p>
          </div>
        </section>

        <section aria-label="Card statistics" className="mt-4 grid grid-cols-3 gap-2">
          {STATS.map(stat => <article key={stat.id} className="rounded-[16px] border border-[#D8D3E6] px-3 py-4" style={{
          backgroundColor: stat.color
        }}>
              <p className="font-sora text-[20px] font-semibold leading-none tracking-[-0.04em]">
                <span>{stat.value}</span>
              </p>
              <p className="mt-2 text-[11px] leading-none text-[#756F83]">
                <span>{stat.label}</span>
              </p>
            </article>)}
        </section>

        <section aria-labelledby="status-heading" className="mt-6 rounded-[18px] border border-[#D5D0E5] bg-[#EEEBF9] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 id="status-heading" className="text-[15px] font-medium">
                <span>Card Status</span>
              </h2>
              <p className="mt-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#4B9F81]">
                <span>{isActive ? 'Active' : 'Inactive'}</span>
              </p>
            </div>
            <button type="button" role="switch" aria-checked={isActive} aria-label="Toggle card status" onClick={() => setIsActive(active => !active)} className={`flex h-8 w-[56px] items-center rounded-full p-1 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/40 ${isActive ? 'justify-end bg-[#9FE0C7]' : 'justify-start bg-[#B9B4C9]'}`}>
              <span className="h-6 w-6 rounded-full bg-white shadow-[0_2px_5px_rgba(50,45,69,0.2)]" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-3 border-t border-[#D5D0E5] pt-3 text-[12px] leading-5 text-[#756F83]">
            <span>Deactivating hides this card from new joins.</span>
          </p>
        </section>

        <section aria-labelledby="rules-heading" className="mt-4 rounded-[18px] border border-[#D5D0E5] bg-[#E4DFF5] p-5">
          <h2 id="rules-heading" className="font-sora text-[18px] font-semibold tracking-[-0.03em]">
            <span>Card Rules</span>
          </h2>
          <p className="mt-3 text-[14px] leading-6 text-[#504A60]">
            <span>Customers earn one stamp for every handcrafted drink purchased. One stamp per transaction.</span>
          </p>
          <ul className="mt-4 space-y-3 border-t border-[#CDC6E5] pt-4">
            <li className="flex items-center gap-3 text-[13px] font-medium">
              <Star aria-hidden="true" className="h-5 w-5 shrink-0 fill-[#FFC9A3] text-[#D9905A]" />
              <span>8 stamps — one free regular drink</span>
            </li>
            <li className="flex items-center gap-3 text-[13px] font-medium">
              <Star aria-hidden="true" className="h-5 w-5 shrink-0 fill-[#FFC9A3] text-[#D9905A]" />
              <span>Rewards expire 30 days after unlocking</span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="qr-heading" className="mt-4 rounded-[18px] border border-[#D5D0E5] bg-[#EEEBF9] px-5 py-6 text-center">
          <div className="mx-auto grid h-32 w-32 grid-cols-9 gap-[2px] rounded-[14px] border border-[#D2CCE1] bg-white p-3 shadow-[0_6px_18px_rgba(50,45,69,0.08)]" aria-label="QR code graphic" role="img">
            {QR_CELLS.map(cell => <span key={cell.id} aria-hidden="true" className={`rounded-[1px] ${cell.filled ? 'bg-[#322D45]' : 'bg-transparent'}`} />)}
          </div>
          <h2 id="qr-heading" className="mt-4 font-sora text-[17px] font-semibold tracking-[-0.025em]">
            <span>Card QR Code</span>
          </h2>
          <p className="mt-1 text-[13px] text-[#756F83]">
            <span>Customers scan this to join.</span>
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2" aria-label="QR code actions">
            {QR_ACTIONS.map(action => <button type="button" key={action.id} onClick={() => handleAction(action.label)} className="flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-[#B9B4C9] bg-transparent px-3 text-[12px] font-medium transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/40">
                {action.id === 'print' ? <Printer aria-hidden="true" className="h-3.5 w-3.5" /> : action.id === 'share' ? <Share2 aria-hidden="true" className="h-3.5 w-3.5" /> : <Download aria-hidden="true" className="h-3.5 w-3.5" />}
                <span>{action.label}</span>
              </button>)}
          </div>
          <p aria-live="polite" className="mt-3 h-4 font-mono text-[10px] text-[#5D8877]">
            <span>{notice}</span>
          </p>
        </section>
      </main>

      <nav aria-label="Business navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-[#DDD9E8] bg-white/95 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
        <div className="mx-auto grid w-full max-w-[440px] grid-cols-5 px-2">
          {NAV_ITEMS.map(item => <button key={item.id} type="button" onClick={() => handleAction(item.label)} aria-current={item.id === 'cards' ? 'page' : undefined} className={`flex min-w-0 flex-col items-center gap-1 rounded-xl py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9FE0C7] ${item.id === 'cards' ? 'text-[#322D45]' : 'text-[#898394]'}`}>
              <span className={`h-1 w-8 rounded-full ${item.id === 'cards' ? 'bg-[#9FE0C7]' : 'bg-transparent'}`} aria-hidden="true" />
              {item.id === 'dashboard' ? <BarChart3 aria-hidden="true" className="h-5 w-5" /> : item.id === 'scan' ? <ScanLine aria-hidden="true" className="h-5 w-5" /> : item.id === 'cards' ? <CreditCard aria-hidden="true" className="h-5 w-5" /> : item.id === 'records' ? <FileClock aria-hidden="true" className="h-5 w-5" /> : <Settings aria-hidden="true" className="h-5 w-5" />}
              <span className="truncate text-[9px] font-medium">{item.label}</span>
            </button>)}
        </div>
      </nav>
    </div>;
};