import { useState, type FormEvent } from 'react';
import { ArrowLeft, CalendarDays, Minus, Plus, Star } from 'lucide-react';
type Milestone = {
  id: string;
  stamp: number;
  reward: string;
};
const INITIAL_MILESTONES: Milestone[] = [{
  id: 'milestone-five',
  stamp: 5,
  reward: 'Free Upsize'
}, {
  id: 'milestone-eight',
  stamp: 8,
  reward: 'Free Signature Drink'
}];
export const CreateStampCard = () => {
  const [stampTotal, setStampTotal] = useState(8);
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [status, setStatus] = useState('');
  const updateMilestoneStamp = (id: string, change: number) => {
    setMilestones(current => current.map(milestone => milestone.id === id ? {
      ...milestone,
      stamp: Math.max(1, milestone.stamp + change)
    } : milestone));
  };
  const updateMilestoneReward = (id: string, reward: string) => {
    setMilestones(current => current.map(milestone => milestone.id === id ? {
      ...milestone,
      reward
    } : milestone));
  };
  const addMilestone = () => {
    setMilestones(current => [...current, {
      id: `milestone-${Date.now()}`,
      stamp: Math.min(stampTotal, current.length + 2),
      reward: ''
    }]);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('Card setup saved. Ready for the QR step.');
  };
  return <div className="mx-auto flex h-dvh w-full max-w-[402px] flex-col overflow-hidden bg-[#F7F8FB] text-[#322D45] md:my-5 md:h-[min(874px,calc(100vh-40px))] md:rounded-[28px] md:border md:border-[#E4DFF5] md:shadow-[0_24px_70px_rgba(50,45,69,0.12)]">
      <header className="shrink-0 bg-[#F7F8FB]/95 px-5 pb-3 pt-[max(16px,env(safe-area-inset-top))] backdrop-blur-md">
        <div className="grid h-11 grid-cols-[44px_1fr_44px] items-center">
          <button type="button" onClick={() => window.history.back()} className="flex h-11 w-11 items-center justify-center rounded-full text-[#322D45] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7] active:bg-[#E4DFF5]" aria-label="Go back">
            <ArrowLeft className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </button>
          <h1 className="text-center font-sora text-[18px] font-semibold tracking-[-0.02em]">
            <span>Create Card</span>
          </h1>
          <span aria-hidden="true" />
        </div>

        <div className="mt-2 flex items-center justify-between px-1">
          <p className="font-mono text-[11px] leading-none tracking-[0.04em] text-[#777187]">
            <span>1 of 2 — Card Setup</span>
          </p>
          <div className="flex items-center gap-1.5 rounded-full border border-[#E4DFF5] bg-white px-2 py-1.5" aria-label="Step 1 of 2">
            <span className="h-2 w-5 rounded-full bg-[#9FE0C7]" aria-hidden="true" />
            <span className="h-2 w-2 rounded-full bg-[#B9B4C9]" aria-hidden="true" />
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-2">
        <form id="card-setup-form" onSubmit={handleSubmit} className="rounded-[20px] border border-white/70 bg-[#EEEBF8] p-5 shadow-[0_10px_30px_rgba(50,45,69,0.07)]">
          <section aria-labelledby="card-info-title">
            <div className="mb-5 flex items-center justify-between">
              <h2 id="card-info-title" className="font-sora text-[17px] font-semibold tracking-[-0.02em]">
                <span>Card Info</span>
              </h2>
              <span className="rounded-full bg-white/75 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#746E82]">
                Required
              </span>
            </div>

            <div>
              <label htmlFor="card-name" className="mb-2 block text-[13px] font-medium text-[#514B60]">
                <span>Card Name</span>
              </label>
              <input id="card-name" name="cardName" type="text" required placeholder="e.g. Kape Juan Loyalty Card" className="h-13 w-full rounded-2xl border border-[#D5D0E5] bg-[#E4DFF5] px-4 text-[14px] text-[#322D45] placeholder:text-[#777187] transition focus:border-[#9FE0C7] focus:outline-none focus:ring-4 focus:ring-[#9FE0C7]/35" />
            </div>

            <div className="mt-5 rounded-2xl border border-white/80 bg-white/60 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <label htmlFor="total-stamps" className="block text-[13px] font-medium text-[#514B60]">
                    <span>Total Stamps Required</span>
                  </label>
                  <p className="mt-1 text-[12px] text-[#777187]">
                    <span>Stamps needed per reward</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <button type="button" onClick={() => setStampTotal(value => Math.max(2, value - 1))} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9FE0C7] transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-95" aria-label="Decrease total stamps">
                    <Minus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                  </button>
                  <output id="total-stamps" className="min-w-7 text-center font-mono text-[24px] font-bold leading-none" aria-live="polite">
                    <span>{stampTotal}</span>
                  </output>
                  <button type="button" onClick={() => setStampTotal(value => Math.min(20, value + 1))} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9FE0C7] transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-95" aria-label="Increase total stamps">
                    <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="expiry-date" className="mb-2 block text-[13px] font-medium text-[#514B60]">
                <span>Expiry Date</span>
              </label>
              <div className="flex h-13 items-center gap-3 rounded-2xl border border-[#D5D0E5] bg-[#E4DFF5] px-4 transition focus-within:border-[#9FE0C7] focus-within:ring-4 focus-within:ring-[#9FE0C7]/35">
                <CalendarDays className="h-5 w-5 shrink-0 text-[#6E687C]" strokeWidth={1.8} aria-hidden="true" />
                <input id="expiry-date" name="expiryDate" type="date" className="min-w-0 flex-1 bg-transparent text-[14px] text-[#514B60] outline-none" />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="card-rules" className="mb-2 block text-[13px] font-medium text-[#514B60]">
                <span>Card Rules</span>
              </label>
              <textarea id="card-rules" name="cardRules" rows={4} placeholder="Describe how customers earn stamps (e.g. 1 stamp per purchase over ₱100)." className="w-full resize-none rounded-2xl border border-[#D5D0E5] bg-[#E4DFF5] px-4 py-3.5 text-[14px] leading-5 text-[#322D45] placeholder:text-[#777187] transition focus:border-[#9FE0C7] focus:outline-none focus:ring-4 focus:ring-[#9FE0C7]/35" />
            </div>
          </section>

          <section className="mt-7 border-t border-[#D5D0E5] pt-6" aria-labelledby="milestones-title">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFC9A3]" aria-hidden="true">
                <Star className="h-4 w-4 fill-[#FFC9A3] text-[#322D45]" strokeWidth={2} />
              </span>
              <h2 id="milestones-title" className="font-sora text-[17px] font-semibold tracking-[-0.02em]">
                <span>Milestones</span>
              </h2>
            </div>
            <p className="mb-4 text-[12px] leading-5 text-[#777187]">
              <span>Reward customers along the way to their final perk.</span>
            </p>

            <div className="space-y-3">
              {milestones.map(milestone => <div key={milestone.id} className="grid grid-cols-[116px_1fr] gap-2.5 rounded-2xl border border-[#F4B98D] bg-[#FFF3EA] p-3">
                  <div>
                    <label className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#746E82]">
                      <span>Stamp no.</span>
                    </label>
                    <div className="flex h-11 items-center justify-between rounded-xl border border-[#F1C6A7] bg-white px-1.5">
                      <button type="button" onClick={() => updateMilestoneStamp(milestone.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-full text-[#514B60] hover:bg-[#FFC9A3]/60 focus-visible:outline-2 focus-visible:outline-[#9FE0C7]" aria-label={`Decrease milestone from stamp ${milestone.stamp}`}>
                        <Minus className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                      </button>
                      <output className="font-mono text-[16px] font-bold" aria-live="polite">
                        <span>{milestone.stamp}</span>
                      </output>
                      <button type="button" onClick={() => updateMilestoneStamp(milestone.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-full text-[#514B60] hover:bg-[#FFC9A3]/60 focus-visible:outline-2 focus-visible:outline-[#9FE0C7]" aria-label={`Increase milestone from stamp ${milestone.stamp}`}>
                        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`reward-${milestone.id}`} className="mb-1.5 block font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#746E82]">
                      <span>Reward</span>
                    </label>
                    <input id={`reward-${milestone.id}`} type="text" value={milestone.reward} onChange={event => updateMilestoneReward(milestone.id, event.target.value)} placeholder="Free Upsize" className="h-11 w-full min-w-0 rounded-xl border border-[#F1C6A7] bg-white px-3 text-[13px] text-[#322D45] placeholder:text-[#8C8498] focus:border-[#9FE0C7] focus:outline-none focus:ring-3 focus:ring-[#9FE0C7]/30" />
                  </div>
                </div>)}
            </div>

            <button type="button" onClick={addMilestone} className="mt-4 inline-flex items-center gap-2 rounded-full px-1 py-2 text-[13px] font-medium text-[#347A63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#9FE0C7] text-[#322D45]" aria-hidden="true">
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span>Add Milestone</span>
            </button>
          </section>
          <p className="sr-only" role="status" aria-live="polite">
            <span>{status}</span>
          </p>
        </form>
      </main>

      <footer className="shrink-0 border-t border-[#E4DFF5] bg-[#F7F8FB]/96 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(50,45,69,0.08)] backdrop-blur-md">
        <button type="submit" form="card-setup-form" className="flex h-14 w-full items-center justify-center rounded-full bg-[#9FE0C7] px-6 font-sora text-[15px] font-semibold text-[#322D45] shadow-[0_8px_20px_rgba(79,153,124,0.22)] transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.99]">
          <span>Continue to QR Step →</span>
        </button>
      </footer>
    </div>;
};