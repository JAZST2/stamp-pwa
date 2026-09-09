import { useState } from 'react';
import { ArrowLeft, Check, Copy, Download, Edit3, Printer, Share2, Star } from 'lucide-react';
type StampSlot = {
  id: string;
  label: string;
  milestone: boolean;
};
const STAMP_SLOTS: StampSlot[] = [{
  id: 'stamp-1',
  label: '1',
  milestone: false
}, {
  id: 'stamp-2',
  label: '2',
  milestone: false
}, {
  id: 'stamp-3',
  label: '3',
  milestone: false
}, {
  id: 'stamp-4',
  label: '4',
  milestone: false
}, {
  id: 'stamp-5',
  label: '5',
  milestone: false
}, {
  id: 'stamp-6',
  label: '6',
  milestone: false
}, {
  id: 'stamp-7',
  label: '7',
  milestone: false
}, {
  id: 'stamp-8',
  label: '8',
  milestone: true
}];
const QR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168 168"><rect width="168" height="168" fill="#F7F8FB"/><g fill="#322D45"><path d="M8 8h48v48H8zm8 8v32h32V16zm8 8h16v16H24zM112 8h48v48h-48zm8 8v32h32V16zm8 8h16v16h-16zM8 112h48v48H8zm8 8v32h32v-32zm8 8h16v16H24z"/><path d="M72 8h8v16h8V8h8v24H72zm0 32h16v8H72zm24 0h8v24H88v-8h8zM64 64h16v8h8v8H72v8h-8zm32 0h16v8h8v8h-16v8h-8zm32 0h8v16h16v8h-24zm-64 32h8v16h16v8H72v8h-8zm32 0h8v8h16v16h-8v-8h-8v16h-8zm32 0h24v8h-8v8h16v8h-24v-16h-8zm-40 32h8v24H72v-8h16zm16 8h8v16h-8zm16-8h8v8h8v16h-16zm24 8h16v24h-8v-16h-8z"/></g></svg>`;
export const CreateCardQrStep = () => {
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);
  const [completed, setCompleted] = useState(false);
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    setNotice('Returning to card setup.');
  };
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText('KAPE-8S-QR2');
      setCopied(true);
      setNotice('Card code copied.');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setNotice('Card code: KAPE-8S-QR2');
    }
  };
  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kape Juan Loyalty Card',
          text: 'Join the Kape Juan Loyalty Card with code KAPE-8S-QR2.'
        });
        setNotice('Card shared.');
      } catch {
        setNotice('Sharing cancelled.');
      }
      return;
    }
    setNotice('Share link copied to your clipboard.');
    await navigator.clipboard?.writeText('KAPE-8S-QR2');
  };
  const saveQr = () => {
    const blob = new Blob([QR_SVG], {
      type: 'image/svg+xml'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kape-juan-loyalty-qr.svg';
    link.click();
    URL.revokeObjectURL(url);
    setNotice('QR image saved.');
  };
  const finish = () => {
    setCompleted(true);
    setNotice('Card created — opening your cards.');
  };
  return <div className="mx-auto flex h-dvh w-full max-w-[402px] flex-col overflow-hidden bg-[#F7F8FB] text-[#322D45] md:my-5 md:h-[min(874px,calc(100vh-40px))] md:rounded-[28px] md:border md:border-[#E4DFF5] md:shadow-[0_24px_70px_rgba(50,45,69,0.12)]">
      <header className="z-20 shrink-0 border-b border-[#E4DFF5]/75 bg-[#F7F8FB]/95 px-5 pb-3 pt-[max(14px,env(safe-area-inset-top))] backdrop-blur-xl">
        <div className="grid h-10 grid-cols-[44px_1fr_44px] items-center">
          <button type="button" onClick={goBack} className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7] active:bg-[#E4DFF5]" aria-label="Back to card setup">
            <ArrowLeft className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </button>
          <h1 className="text-center font-sora text-[18px] font-semibold tracking-[-0.025em]">
            <span>Create Card</span>
          </h1>
          <span aria-hidden="true" />
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          <p className="font-mono text-[10px] tracking-[0.055em] text-[#777187]">
            <span>2 of 2 — Generate QR</span>
          </p>
          <div className="flex items-center gap-1.5 rounded-full border border-[#E4DFF5] bg-white px-2 py-1.5" aria-label="Step 2 of 2">
            <span className="h-2 w-2 rounded-full bg-[#B9B4C9]" aria-hidden="true" />
            <span className="h-2 w-5 rounded-full bg-[#9FE0C7]" aria-hidden="true" />
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4">
        <section className="rounded-[20px] border border-white/80 bg-[#E4DFF5] p-4 shadow-[0_10px_28px_rgba(50,45,69,0.08)]" aria-labelledby="preview-title">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#777187]">
                <span>Card preview</span>
              </p>
              <h2 id="preview-title" className="mt-1 font-sora text-[16px] font-semibold tracking-[-0.025em]">
                <span>Kape Juan Loyalty Card</span>
              </h2>
            </div>
            <button type="button" onClick={goBack} className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[12px] font-medium text-[#514B60] transition hover:bg-white/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7]">
              <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Edit</span>
            </button>
          </div>
          <div className="mt-3 grid grid-cols-8 gap-1.5" aria-label="Eight empty stamp slots">
            {STAMP_SLOTS.map(slot => <span key={slot.id} className={`flex aspect-square items-center justify-center rounded-full border ${slot.milestone ? 'border-[#E6A678] bg-[#FFC9A3]' : 'border-[#B9B4C9] bg-white/45'}`} aria-label={slot.milestone ? `Stamp ${slot.label}, reward milestone` : `Stamp ${slot.label}, empty`}>
                {slot.milestone ? <Star className="h-3.5 w-3.5 fill-[#322D45] text-[#322D45]" strokeWidth={1.8} aria-hidden="true" /> : <span className="h-1.5 w-1.5 rounded-full bg-[#B9B4C9]" aria-hidden="true" />}
              </span>)}
          </div>
          <p className="mt-2 text-right font-mono text-[10px] font-bold text-[#6F697E]">
            <span>0/8 stamps</span>
          </p>
        </section>

        <section className="mt-3 rounded-[16px] border border-white/75 bg-[#EEEBF8] px-4" aria-label="Card summary">
          <div className="flex min-h-10 items-center justify-between gap-4 border-b border-[#D2CDE2] py-2">
            <p className="text-[12px] text-[#625C70]"><span>Stamps Required</span></p>
            <p className="font-mono text-[12px] font-bold"><span>8</span></p>
          </div>
          <div className="flex min-h-10 items-center justify-between gap-4 border-b border-[#D2CDE2] py-2">
            <p className="text-[12px] text-[#625C70]"><span>Expiry</span></p>
            <p className="text-right text-[12px] font-medium"><span>Dec 31, 2025</span></p>
          </div>
          <div className="flex min-h-11 items-center justify-between gap-3 py-2">
            <p className="text-[12px] text-[#625C70]"><span>Milestone</span></p>
            <p className="flex items-center gap-1.5 text-right text-[11px] font-medium leading-4">
              <Star className="h-4 w-4 shrink-0 fill-[#FFC9A3] text-[#D8915E]" aria-hidden="true" />
              <span>8th stamp → 1 Free Brewed Coffee</span>
            </p>
          </div>
        </section>

        <section className="mt-3 rounded-[20px] border border-white/80 bg-[#E4DFF5] p-4 shadow-[0_10px_28px_rgba(50,45,69,0.08)]" aria-labelledby="qr-heading">
          <h2 id="qr-heading" className="text-center font-sora text-[16px] font-semibold tracking-[-0.025em]">
            <span>Your Card QR Code</span>
          </h2>
          <div className="mx-auto mt-3 w-fit rounded-[16px] border border-white bg-[#F7F8FB] p-2.5 shadow-[0_5px_16px_rgba(50,45,69,0.08)]">
            <svg viewBox="0 0 168 168" className="h-[142px] w-[142px]" role="img" aria-label="QR code for Kape Juan Loyalty Card">
              <rect width="168" height="168" fill="#F7F8FB" />
              <g fill="#322D45">
                <path d="M8 8h48v48H8zm8 8v32h32V16zm8 8h16v16H24zM112 8h48v48h-48zm8 8v32h32V16zm8 8h16v16h-16zM8 112h48v48H8zm8 8v32h32v-32zm8 8h16v16H24z" />
                <path d="M72 8h8v16h8V8h8v24H72zm0 32h16v8H72zm24 0h8v24H88v-8h8zM64 64h16v8h8v8H72v8h-8zm32 0h16v8h8v8h-16v8h-8zm32 0h8v16h16v8h-24zm-64 32h8v16h16v8H72v8h-8zm32 0h8v8h16v16h-8v-8h-8v16h-8zm32 0h24v8h-8v8h16v8h-24v-16h-8zm-40 32h8v24H72v-8h16zm16 8h8v16h-8zm16-8h8v8h8v16h-16zm24 8h16v24h-8v-16h-8z" />
              </g>
            </svg>
          </div>
          <p className="mx-auto mt-2 max-w-[270px] text-center text-[11px] leading-[17px] text-[#716B7F]">
            <span>Customers scan this QR code to join your loyalty card.</span>
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2" aria-label="QR code actions">
            <button type="button" onClick={() => window.print()} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-[#B9B4C9] bg-white/25 text-[11px] font-medium transition hover:bg-white/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7] active:scale-[0.98]">
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Print</span>
            </button>
            <button type="button" onClick={shareCard} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-[#B9B4C9] bg-white/25 text-[11px] font-medium transition hover:bg-white/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7] active:scale-[0.98]">
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Share</span>
            </button>
            <button type="button" onClick={saveQr} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-[#B9B4C9] bg-white/25 text-[11px] font-medium transition hover:bg-white/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7] active:scale-[0.98]">
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Save Image</span>
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#CFC9DF] pt-3">
            <p className="text-[11px] text-[#716B7F]"><span>Card Code</span></p>
            <button type="button" onClick={copyCode} className="inline-flex items-center gap-2 rounded-full px-2 py-1 font-mono text-[12px] font-bold text-[#3E8A6C] transition hover:bg-white/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7]" aria-label="Copy card code KAPE-8S-QR2">
              <span>KAPE-8S-QR2</span>
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </section>

        <div className="min-h-7 pt-2" role="status" aria-live="polite">
          <p className="text-center text-[11px] font-medium text-[#4F806D]">
            <span>{notice}</span>
          </p>
        </div>
      </main>

      <footer className="relative z-20 shrink-0 border-t border-[#E4DFF5] bg-[#F7F8FB]/96 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_28px_rgba(50,45,69,0.08)] backdrop-blur-xl">
        <span className="absolute left-5 top-2 h-2 w-2 rotate-12 rounded-[2px] bg-[#FFC9A3]" aria-hidden="true" />
        <span className="absolute right-7 top-1.5 h-2.5 w-2.5 rounded-full bg-[#FFC9A3]" aria-hidden="true" />
        <span className="absolute right-4 top-8 h-1.5 w-1.5 rounded-full bg-[#E2A170]" aria-hidden="true" />
        <button type="button" onClick={finish} className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#9FE0C7] px-6 font-sora text-[14px] font-semibold shadow-[0_8px_20px_rgba(79,153,124,0.22)] transition hover:bg-[#91D8BD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.99]">
          {completed ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
          <span>{completed ? 'Card Created' : 'Done — Go to Cards'}</span>
        </button>
      </footer>
    </div>;
};