import { useState, type FormEvent } from 'react';
import { ArrowLeft, CalendarDays, Check, ChevronDown, Minus, Pause, Plus, Trash2 } from 'lucide-react';
interface Milestone {
  id: string;
  stamp: string;
  reward: string;
}
const initialMilestones: Milestone[] = [{
  id: 'milestone-five',
  stamp: '5th stamp',
  reward: 'Free Upsize Coffee'
}, {
  id: 'milestone-eight',
  stamp: '8th stamp',
  reward: '1 Free Brewed Coffee'
}];
export const EditStampCard = () => {
  const [cardName, setCardName] = useState('Kape Juan Loyalty Card');
  const [stampCount, setStampCount] = useState(8);
  const [expiry, setExpiry] = useState('Dec 31, 2025');
  const [rules, setRules] = useState('Earn 1 stamp for every ₱100 purchase. Stamps expire after 6 months of inactivity.');
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [notice, setNotice] = useState('');
  const [isActive, setIsActive] = useState(true);
  const returnToCards = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    setNotice('Back to Cards List');
  };
  const saveCard = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice('Your changes have been saved.');
  };
  const addMilestone = () => {
    setMilestones(current => [...current, {
      id: `milestone-${crypto.randomUUID()}`,
      stamp: `${stampCount}th stamp`,
      reward: ''
    }]);
    setNotice('New milestone added.');
  };
  return <div className="min-h-dvh bg-[#F7F8FB] text-[#322D45]">
      <header className="sticky top-0 z-30 border-b border-[#E8E6EF] bg-[#F7F8FB]/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto grid h-16 w-full max-w-[402px] grid-cols-[1fr_auto_1fr] items-center gap-2">
          <button type="button" onClick={returnToCards} className="flex h-10 w-10 items-center justify-center rounded-full text-[#322D45] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-95" aria-label="Back to Cards List">
            <ArrowLeft className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </button>
          <h1 className="font-sora text-[17px] font-semibold tracking-[-0.02em]">
            <span>Edit Card</span>
          </h1>
          <button type="button" onClick={() => setNotice('Delete confirmation requested.')} className="justify-self-end rounded-full px-1 py-2 text-right text-[12px] font-normal text-[#C97873] transition-colors hover:text-[#A44D49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C97873]">
            <span>Delete Card</span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[402px] px-4 pb-32 pt-4">
        <section className="mb-4 flex items-center gap-3 px-1" aria-label="Card status">
          <span className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${isActive ? 'bg-[#9FE0C7] text-[#322D45]' : 'bg-[#E7E4ED] text-[#6F697E]'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
          <p className="text-[12px] font-normal text-[#817B90]">
            <span>Last updated Jul 28, 2025</span>
          </p>
        </section>

        <form id="edit-card-form" onSubmit={saveCard} className="rounded-[20px] bg-[#E4DFF5] p-4 shadow-[0_12px_34px_rgba(50,45,69,0.09)] sm:p-5">
          <section aria-labelledby="card-info-heading">
            <div className="mb-5 flex items-center justify-between border-b border-[#CBC5DF] pb-3">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#716A82]">
                  <span>Existing card</span>
                </p>
                <h2 id="card-info-heading" className="mt-1 font-sora text-[20px] font-bold tracking-[-0.03em]">
                  <span>Card Info</span>
                </h2>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/75" aria-hidden="true">
                <Check className="h-4 w-4 text-[#4F8D75]" strokeWidth={2.5} />
              </span>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-[#5D576C]">Card Name</span>
                <input value={cardName} onChange={event => setCardName(event.target.value)} className="h-12 w-full rounded-[16px] border border-[#CEC8DD] bg-white/90 px-4 text-[15px] font-medium text-[#322D45] shadow-sm outline-none transition focus:border-[#7EC6AA] focus:ring-4 focus:ring-[#9FE0C7]/30" />
              </label>

              <div>
                <span id="stamp-count-label" className="mb-2 block text-[13px] font-medium text-[#5D576C]">Total Stamps Required</span>
                <div className="grid h-12 grid-cols-[48px_1fr_48px] overflow-hidden rounded-[16px] border border-[#CEC8DD] bg-white/90 shadow-sm" role="group" aria-labelledby="stamp-count-label">
                  <button type="button" onClick={() => setStampCount(count => Math.max(2, count - 1))} className="flex items-center justify-center border-r border-[#E5E1EB] transition-colors hover:bg-[#F7F8FB] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#7EC6AA]" aria-label="Decrease total stamps">
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <output className="flex items-center justify-center font-mono text-[17px] font-bold" aria-live="polite">
                    <span>{stampCount}</span>
                  </output>
                  <button type="button" onClick={() => setStampCount(count => Math.min(20, count + 1))} className="flex items-center justify-center border-l border-[#E5E1EB] transition-colors hover:bg-[#F7F8FB] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#7EC6AA]" aria-label="Increase total stamps">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-[#5D576C]">Expiry Date</span>
                <span className="relative block">
                  <input value={expiry} onChange={event => setExpiry(event.target.value)} className="h-12 w-full rounded-[16px] border border-[#CEC8DD] bg-white/90 px-4 pr-12 text-[15px] text-[#322D45] shadow-sm outline-none transition focus:border-[#7EC6AA] focus:ring-4 focus:ring-[#9FE0C7]/30" />
                  <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777084]" aria-hidden="true" />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-[#5D576C]">Card Rules</span>
                <textarea value={rules} onChange={event => setRules(event.target.value)} rows={4} className="w-full resize-none rounded-[16px] border border-[#CEC8DD] bg-white/90 px-4 py-3 text-[14px] leading-6 text-[#322D45] shadow-sm outline-none transition focus:border-[#7EC6AA] focus:ring-4 focus:ring-[#9FE0C7]/30" />
              </label>
            </div>
          </section>

          <section className="mt-8 border-t border-[#CBC5DF] pt-6" aria-labelledby="milestones-heading">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#716A82]">
                  <span>Reward path</span>
                </p>
                <h2 id="milestones-heading" className="mt-1 font-sora text-[20px] font-bold tracking-[-0.03em]">
                  <span>Milestones &amp; Rewards</span>
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {milestones.map(milestone => <div key={milestone.id} className="rounded-[16px] border border-[#EDB98F] bg-[#FFF0E5] p-3">
                  <div className="flex items-center gap-2">
                    <label className="min-w-0 flex-[0.85]">
                      <span className="sr-only">Stamp milestone</span>
                      <input value={milestone.stamp} onChange={event => setMilestones(current => current.map(item => item.id === milestone.id ? {
                    ...item,
                    stamp: event.target.value
                  } : item))} className="h-10 w-full rounded-[12px] border border-[#F0C9AA] bg-white/80 px-3 font-mono text-[12px] font-bold text-[#322D45] outline-none focus:border-[#D99C6A]" />
                    </label>
                    <span className="shrink-0 text-[#9B7659]" aria-hidden="true">→</span>
                    <label className="min-w-0 flex-[1.35]">
                      <span className="sr-only">Reward</span>
                      <input value={milestone.reward} placeholder="Reward name" onChange={event => setMilestones(current => current.map(item => item.id === milestone.id ? {
                    ...item,
                    reward: event.target.value
                  } : item))} className="h-10 w-full rounded-[12px] border border-[#F0C9AA] bg-white/80 px-3 text-[12px] font-medium text-[#322D45] outline-none placeholder:text-[#9B94A5] focus:border-[#D99C6A]" />
                    </label>
                    {milestones.length > 2 && <button type="button" onClick={() => setMilestones(current => current.filter(item => item.id !== milestone.id))} className="flex h-9 w-8 shrink-0 items-center justify-center rounded-full text-[#B86863] hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-[#B86863]" aria-label={`Remove ${milestone.stamp}`}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>}
                  </div>
                </div>)}
            </div>

            <button type="button" onClick={addMilestone} className="mt-4 inline-flex items-center gap-2 rounded-full px-2 py-2 text-[13px] font-medium text-[#30775D] transition-colors hover:bg-[#9FE0C7]/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D9A7D]">
              <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              <span>Add Milestone</span>
            </button>
          </section>

          <section className="mt-7 border-t border-[#CBC5DF] pt-6" aria-labelledby="danger-heading">
            <h2 id="danger-heading" className="mb-3 font-sora text-[16px] font-semibold tracking-[-0.02em] text-[#5B5369]">
              <span>Danger Zone</span>
            </h2>
            <div className="rounded-[18px] border border-[#F1C8C5] bg-[#FFF2F1] p-4">
              <p className="mb-3 text-[13px] font-normal leading-5 text-[#777080]">
                <span>Deactivating will hide this card from new customers.</span>
              </p>
              <button type="button" onClick={() => {
              setIsActive(active => !active);
              setNotice(isActive ? 'Card has been deactivated.' : 'Card has been reactivated.');
            }} className="inline-flex h-10 items-center gap-2 rounded-full border border-[#D99591] px-4 text-[13px] font-medium text-[#9C504D] transition-colors hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B86863]">
                {isActive ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
                <span>{isActive ? 'Deactivate Card' : 'Reactivate Card'}</span>
              </button>
            </div>
          </section>
        </form>

        <div className="min-h-7 px-2 pt-3" role="status" aria-live="polite">
          {notice && <p className="text-center text-[12px] font-medium text-[#5C756B]">
              <span>{notice}</span>
            </p>}
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E6E3EB] bg-[#F7F8FB]/96 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_28px_rgba(50,45,69,0.08)] backdrop-blur-xl">
        <div className="mx-auto grid w-full max-w-[402px] grid-cols-[0.82fr_1.18fr] gap-3">
          <button type="button" onClick={returnToCards} className="h-12 rounded-full border border-[#B9B4C9] bg-transparent text-[14px] font-medium text-[#322D45] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98]">
            <span>Cancel</span>
          </button>
          <button type="submit" form="edit-card-form" className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#9FE0C7] text-[14px] font-semibold text-[#322D45] shadow-[0_6px_16px_rgba(87,151,126,0.2)] transition-colors hover:bg-[#8DD6BA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98]">
            <span>Save Changes</span>
            <ChevronDown className="h-4 w-4 -rotate-90" aria-hidden="true" />
          </button>
        </div>
      </footer>
    </div>;
};