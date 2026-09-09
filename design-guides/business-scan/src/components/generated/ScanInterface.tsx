import { useState } from 'react';
import { Camera, CheckCircle2, Keyboard, ScanLine, ShieldCheck } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { PillButton } from './PillButton';
import { TopBar } from './TopBar';
export const ScanInterface = () => {
  const [scanMode, setScanMode] = useState<'stamp' | 'reward'>('stamp');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [claimCode, setClaimCode] = useState('');
  const isStampMode = scanMode === 'stamp';
  return <div className="min-h-dvh bg-[#F7F8FB] text-[#322D45]">
      <TopBar title="Scan & Process" showProfile={false} />

      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-32 pt-24">
        <section aria-labelledby="scan-heading" className="flex flex-1 flex-col">
          <h1 id="scan-heading" className="sr-only">
            <span>Scan and process a customer code</span>
          </h1>

          <div className="grid grid-cols-2 gap-1.5 rounded-full border border-[#E4DFF5] bg-white p-1.5 shadow-soft" role="tablist" aria-label="Scan action">
            <PillButton variant={isStampMode ? 'mint' : 'ghost'} size="md" role="tab" aria-selected={isStampMode} onClick={() => setScanMode('stamp')} className={`w-full border-0 px-3 ${!isStampMode ? 'bg-transparent text-[#5F5A70] shadow-none hover:bg-[#F1EFF8]' : ''}`}>
              <span>Add Stamp</span>
            </PillButton>
            <PillButton variant={!isStampMode ? 'peach' : 'ghost'} size="md" role="tab" aria-selected={!isStampMode} onClick={() => setScanMode('reward')} className={`w-full border-0 px-3 ${isStampMode ? 'bg-transparent text-[#5F5A70] shadow-none hover:bg-[#F1EFF8]' : ''}`}>
              <span>Redeem Reward</span>
            </PillButton>
          </div>

          <div className="mb-5 mt-7 text-center">
            <p className="font-sora text-lg font-semibold tracking-[-0.02em]">
              <span>{isStampMode ? 'Scan customer pass' : 'Scan reward pass'}</span>
            </p>
            <p className="mt-1.5 text-sm leading-6 text-[#6F6A7D]">
              <span>
                {isStampMode ? 'Align the QR code to add one visit.' : 'Align the QR code to confirm redemption.'}
              </span>
            </p>
          </div>

          <div className="relative min-h-[336px] flex-1 overflow-hidden rounded-[28px] border-2 border-dashed border-[#BEB7D6] bg-[#ECEAF3] p-5 shadow-soft">
            <div className="absolute inset-0 opacity-40" aria-hidden="true" style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(50,45,69,0.10) 1px, transparent 1px)',
            backgroundSize: '18px 18px'
          }} />

            <div className="relative flex h-full min-h-[292px] flex-col items-center justify-center">
              <div className="absolute inset-[12%] rounded-[28px] border border-white/80 bg-white/20" aria-hidden="true" />

              <div className="absolute left-[12%] top-[12%] h-12 w-12 rounded-tl-[22px] border-l-[5px] border-t-[5px] border-[#322D45]" aria-hidden="true" />
              <div className="absolute right-[12%] top-[12%] h-12 w-12 rounded-tr-[22px] border-r-[5px] border-t-[5px] border-[#322D45]" aria-hidden="true" />
              <div className="absolute bottom-[12%] left-[12%] h-12 w-12 rounded-bl-[22px] border-b-[5px] border-l-[5px] border-[#322D45]" aria-hidden="true" />
              <div className="absolute bottom-[12%] right-[12%] h-12 w-12 rounded-br-[22px] border-b-[5px] border-r-[5px] border-[#322D45]" aria-hidden="true" />

              <div className="absolute left-[17%] right-[17%] top-1/2 h-0.5 bg-[#9FE0C7] shadow-[0_0_12px_rgba(159,224,199,0.9)]" aria-hidden="true" />

              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white bg-white/75 text-[#322D45] shadow-soft backdrop-blur-sm">
                <Camera className="h-8 w-8" aria-hidden="true" />
              </div>
              <p className="relative mt-4 max-w-48 text-center text-sm font-medium leading-5 text-[#4E495E]">
                <span>Camera preview will appear here</span>
              </p>
            </div>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#322D45] px-3 py-1.5 text-white shadow-sm">
              <ScanLine className="h-3.5 w-3.5 text-[#9FE0C7]" aria-hidden="true" />
              <span className="text-[11px] font-medium tracking-wide">Ready to scan</span>
            </div>
          </div>

          <section aria-labelledby="manual-entry-heading" className="mt-5">
            <h2 id="manual-entry-heading" className="sr-only">
              <span>Manual claim code entry</span>
            </h2>
            {!showManualEntry ? <button type="button" onClick={() => setShowManualEntry(true)} className="mx-auto flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-[#4F4962] underline decoration-[#9FE0C7] decoration-2 underline-offset-4 transition-colors hover:text-[#322D45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7]">
                <Keyboard className="h-4 w-4" aria-hidden="true" />
                <span>Enter claim code instead</span>
              </button> : <form className="rounded-[20px] border border-[#E4DFF5] bg-white p-3 shadow-soft" onSubmit={event => event.preventDefault()}>
                <label htmlFor="claim-code" className="mb-2 block px-1 text-xs font-medium text-[#625D70]">
                  <span>Customer claim code</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Keyboard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777184]" aria-hidden="true" />
                    <input id="claim-code" value={claimCode} onChange={event => setClaimCode(event.target.value.toUpperCase())} autoComplete="off" inputMode="text" maxLength={10} placeholder="PKLY-4821" className="font-mono h-11 w-full rounded-xl border border-[#DCD7EA] bg-[#F7F8FB] pl-10 pr-3 text-sm font-bold uppercase tracking-[0.12em] text-[#322D45] placeholder:text-[#9993A6] focus:border-[#9FE0C7] focus:outline-none focus:ring-2 focus:ring-[#9FE0C7]/30" />
                  </div>
                  <button type="submit" aria-label="Process claim code" disabled={!claimCode.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#9FE0C7] text-[#322D45] transition-transform active:scale-95 disabled:opacity-40">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </form>}
          </section>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#767181]">
            <ShieldCheck className="h-4 w-4 text-[#65A98F]" aria-hidden="true" />
            <span>Codes are verified before changes are applied</span>
          </div>
        </section>
      </main>

      <BottomNav activeTab="scan" type="business" />
    </div>;
};