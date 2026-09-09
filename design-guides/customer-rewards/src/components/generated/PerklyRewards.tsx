import { useState } from 'react';
import { CheckCircle2, Clock3, Compass, Copy, Gift, Home, QrCode, Settings, Sparkles } from 'lucide-react';
type RewardTab = 'ready' | 'pending' | 'claimed';
type Reward = {
  id: string;
  businessName: string;
  initials: string;
  logoColor: string;
  reward: string;
  expiry: string;
  code: string;
};
const REWARD_TABS: {
  id: RewardTab;
  label: string;
}[] = [{
  id: 'ready',
  label: 'Ready'
}, {
  id: 'pending',
  label: 'Pending'
}, {
  id: 'claimed',
  label: 'Claimed'
}];
const READY_REWARDS: Reward[] = [{
  id: 'kape-juan-coffee',
  businessName: 'Kape Juan',
  initials: 'KJ',
  logoColor: '#BCE8D7',
  reward: '1 Free Brewed Coffee',
  expiry: 'Expires Dec 31, 2025',
  code: 'KAPE-R-7X2M'
}, {
  id: 'sari-sari-snack',
  businessName: 'Sari-Sari Bites',
  initials: 'SB',
  logoColor: '#FFD7BC',
  reward: 'Free Merienda of Your Choice',
  expiry: 'Expires Jan 18, 2026',
  code: 'SARI-R-4P9K'
}];
const NAV_ITEMS = [{
  id: 'home',
  label: 'Home'
}, {
  id: 'scan',
  label: 'Scan/Join'
}, {
  id: 'browse',
  label: 'Browse'
}, {
  id: 'rewards',
  label: 'Rewards'
}, {
  id: 'settings',
  label: 'Settings'
}];
export const PerklyRewards = () => {
  const [activeTab, setActiveTab] = useState<RewardTab>('ready');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard access can be unavailable in a preview iframe; feedback remains useful.
    }
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(null), 1600);
  };
  return <div className="min-h-dvh bg-[#F7F8FB] text-[#322D45]">
      <div className="mx-auto min-h-dvh w-full max-w-[402px] bg-[#F7F8FB]">
        <header className="px-6 pb-4 pt-[calc(env(safe-area-inset-top)+28px)]">
          <h1 className="font-sora text-[28px] font-semibold leading-tight tracking-[-0.035em]">
            <span>My Rewards</span>
          </h1>
        </header>

        <main className="px-5 pb-32">
          <nav className="mb-5 grid grid-cols-3 rounded-full border border-[#DDD9E8] bg-white/75 p-1" aria-label="Reward status">
            {REWARD_TABS.map(tab => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`min-h-10 rounded-full px-3 text-[14px] font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] ${activeTab === tab.id ? 'bg-[#9FE0C7] text-[#322D45] shadow-[0_2px_8px_rgba(50,45,69,0.06)]' : 'text-[#8D879E] hover:text-[#322D45]'}`} aria-current={activeTab === tab.id ? 'page' : undefined}>
                <span>{tab.label}</span>
              </button>)}
          </nav>

          {activeTab === 'ready' ? <section aria-labelledby="ready-rewards-heading">
              <div className="mb-4 flex items-end justify-between gap-4 px-1">
                <div>
                  <p className="mb-1 text-[13px] font-medium text-[#777186]">
                    <span>Available now</span>
                  </p>
                  <h2 id="ready-rewards-heading" className="font-sora text-xl font-semibold tracking-[-0.025em]">
                    <span>Ready to enjoy</span>
                  </h2>
                </div>
                <span className="rounded-full bg-[#FFC9A3]/70 px-3 py-1 font-mono text-[12px] font-medium">
                  2 rewards
                </span>
              </div>

              <div className="space-y-4" aria-label="Rewards ready to claim">
                {READY_REWARDS.map(reward => <article key={reward.id} className="rounded-[20px] border border-white/70 bg-[#E4DFF5] p-4 shadow-[0_8px_24px_rgba(50,45,69,0.08)]" aria-label={`${reward.reward} from ${reward.businessName}`}>
                    <div className="mb-3 flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/80 font-sora text-[13px] font-bold shadow-sm" style={{
                  backgroundColor: reward.logoColor
                }} aria-label={`${reward.businessName} logo placeholder`} role="img">
                        <span>{reward.initials}</span>
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <h3 className="font-sora text-[16px] font-semibold leading-5">
                          <span>{reward.businessName}</span>
                        </h3>
                        <p className="mt-1 text-[15px] font-medium leading-5">
                          <span>{reward.reward}</span>
                        </p>
                        <p className="mt-1 text-[12px] leading-4 text-[#777186]">
                          <span>{reward.expiry}</span>
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 text-[#D98855]" aria-hidden="true">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FFC9A3]" />
                        <Sparkles className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                    </div>

                    <div className="mb-3 flex items-center gap-2 rounded-[14px] bg-[#FFD8BC] p-2 pl-3">
                      <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[17px] font-medium tracking-[0.04em] text-[#322D45]">
                        {reward.code}
                      </code>
                      <button type="button" onClick={() => copyCode(reward.code)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/60 text-[#322D45] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-95" aria-label={`Copy claim code ${reward.code}`}>
                        {copiedCode === reward.code ? <CheckCircle2 className="h-[18px] w-[18px]" aria-hidden="true" /> : <Copy className="h-[18px] w-[18px]" aria-hidden="true" />}
                      </button>
                    </div>

                    <button type="button" className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#FFC9A3] px-5 text-[14px] font-medium text-[#322D45] transition hover:bg-[#FFBD8E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.99]">
                      <QrCode className="h-[17px] w-[17px]" aria-hidden="true" />
                      <span>Show to Cashier</span>
                    </button>
                  </article>)}
              </div>

              <p className="px-5 pb-2 pt-6 text-center text-[13px] leading-5 text-[#8D879E]">
                <span>Switch to Pending to see stamps in progress</span>
              </p>
            </section> : <section className="flex min-h-[390px] flex-col items-center justify-center px-8 text-center" aria-labelledby="other-rewards-heading">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E4DFF5]">
                {activeTab === 'pending' ? <Clock3 className="h-7 w-7" aria-hidden="true" /> : <Gift className="h-7 w-7" aria-hidden="true" />}
              </div>
              <h2 id="other-rewards-heading" className="font-sora text-xl font-semibold">
                <span>{activeTab === 'pending' ? 'Rewards in progress' : 'No claimed rewards yet'}</span>
              </h2>
              <p className="mt-2 text-[14px] leading-6 text-[#777186]">
                <span>
                  {activeTab === 'pending' ? 'Keep collecting stamps—your next little treat is getting closer.' : 'Rewards you use will be saved here for easy reference.'}
                </span>
              </p>
            </section>}
        </main>

        <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E1DDEA] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
          <nav className="mx-auto grid h-[78px] w-full max-w-[402px] grid-cols-5 px-2 pt-2" aria-label="Customer navigation">
            {NAV_ITEMS.map(item => <button key={item.id} type="button" className={`flex min-w-0 flex-col items-center justify-start gap-0.5 rounded-xl py-1 text-[10px] font-medium transition focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#322D45] ${item.id === 'rewards' ? 'text-[#322D45]' : 'text-[#8D879E] hover:text-[#322D45]'}`} aria-current={item.id === 'rewards' ? 'page' : undefined}>
                <span className={`flex h-8 min-w-11 items-center justify-center rounded-full px-3 ${item.id === 'rewards' ? 'bg-[#9FE0C7]' : 'bg-transparent'}`}>
                  {item.id === 'home' && <Home className="h-5 w-5" aria-hidden="true" />}
                  {item.id === 'scan' && <QrCode className="h-5 w-5" aria-hidden="true" />}
                  {item.id === 'browse' && <Compass className="h-5 w-5" aria-hidden="true" />}
                  {item.id === 'rewards' && <Gift className="h-5 w-5" aria-hidden="true" />}
                  {item.id === 'settings' && <Settings className="h-5 w-5" aria-hidden="true" />}
                </span>
                <span className="truncate">{item.label}</span>
              </button>)}
          </nav>
        </footer>
      </div>
    </div>;
};