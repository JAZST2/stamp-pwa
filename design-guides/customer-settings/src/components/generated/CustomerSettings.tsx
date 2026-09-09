import { useState } from 'react';
import { Bell, ChevronRight, CircleHelp, Compass, Gift, Home, KeyRound, LogOut, Megaphone, QrCode, ScanLine, Settings, Share2, ShieldAlert, Smartphone, Trash2, UserRound, Copy, Check } from 'lucide-react';
const QR_PATTERN = ['1111111010101111111', '1000001001101000001', '1011101010101011101', '1011101001001011101', '1011101011101011101', '1000001000101000001', '1111111010101111111', '0000000011000000000', '1101011110111011011', '0011000010100101100', '1110111011111010111', '0100010001010001010', '1111111010111110101', '1000001011100011010', '1011101010111011111', '1011101001100010010', '1011101010111111101', '1000001001010010110', '1111111011101111011'].flatMap((row, rowIndex) => row.split('').map((value, columnIndex) => ({
  id: `qr-${rowIndex}-${columnIndex}`,
  filled: value === '1'
})));
interface ToggleProps {
  checked: boolean;
  label: string;
  onChange: () => void;
}
const Toggle = ({
  checked,
  label,
  onChange
}: ToggleProps) => {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] ${checked ? 'border-[#83CFB2] bg-[#9FE0C7]' : 'border-[#B9B4C9] bg-[#DAD7E4]'}`}>
      <span className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(50,45,69,0.22)] transition-transform duration-200 ${checked ? 'translate-x-[23px]' : 'translate-x-[3px]'}`} aria-hidden="true" />
    </button>;
};
const CustomerBottomNav = () => {
  return <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#DAD6E7] bg-white/95 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl" aria-label="Customer navigation">
      <div className="mx-auto grid max-w-[402px] grid-cols-5 px-2">
        <button type="button" className="flex min-h-14 flex-col items-center justify-end gap-1 rounded-xl text-[#777186]" aria-label="Home">
          <Home className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button type="button" className="flex min-h-14 flex-col items-center justify-end gap-1 rounded-xl text-[#777186]" aria-label="Scan or join">
          <ScanLine className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
          <span className="text-[10px] font-medium">Scan/Join</span>
        </button>
        <button type="button" className="flex min-h-14 flex-col items-center justify-end gap-1 rounded-xl text-[#777186]" aria-label="Browse">
          <Compass className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
          <span className="text-[10px] font-medium">Browse</span>
        </button>
        <button type="button" className="flex min-h-14 flex-col items-center justify-end gap-1 rounded-xl text-[#777186]" aria-label="Rewards">
          <Gift className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
          <span className="text-[10px] font-medium">Rewards</span>
        </button>
        <button type="button" className="relative flex min-h-14 flex-col items-center justify-end gap-1 rounded-xl text-[#322D45]" aria-label="Settings" aria-current="page">
          <span className="absolute top-0 h-1.5 w-11 rounded-full bg-[#9FE0C7]" aria-hidden="true" />
          <Settings className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
          <span className="text-[10px] font-semibold">Settings</span>
        </button>
      </div>
    </nav>;
};
export const CustomerSettings = () => {
  const [stampAlerts, setStampAlerts] = useState(true);
  const [rewardNotifications, setRewardNotifications] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyCode = async () => {
    await navigator.clipboard?.writeText('USR-A3K9');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  const shareQr = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'My PerklyPh QR',
        text: 'Add me on PerklyPh — USR-A3K9'
      });
      return;
    }
    await copyCode();
  };
  return <div className="min-h-dvh bg-[#F7F8FB] text-[#322D45]">
      <header className="sticky top-0 z-40 border-b border-[#E5E2EC]/80 bg-[#F7F8FB]/94 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[402px] items-end px-5 pb-4 pt-[max(12px,env(safe-area-inset-top))]">
          <h1 className="font-sora text-[22px] font-semibold tracking-[-0.025em]">
            <span>Settings</span>
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[402px] px-5 pb-32 pt-6">
        <section className="flex items-center gap-3" aria-labelledby="profile-name">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#9FE0C7] font-sora text-lg font-bold text-[#322D45] shadow-[inset_0_0_0_1px_rgba(50,45,69,0.08)]" aria-label="Mara Santos avatar">
            <span>MS</span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="profile-name" className="truncate font-sora text-[17px] font-semibold tracking-[-0.02em]">
              <span>Mara Santos</span>
            </h2>
            <p className="mt-1 truncate text-[13px] text-[#777186]">
              <span>mara.santos@email.com</span>
            </p>
          </div>
          <button type="button" className="shrink-0 rounded-full border border-[#B9B4C9] bg-transparent px-3.5 py-2 text-xs font-medium text-[#322D45] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98]">
            <span>Edit Profile</span>
          </button>
        </section>

        <section className="relative mt-6 overflow-hidden rounded-2xl bg-[#E4DFF5] p-5 shadow-[0_8px_22px_rgba(50,45,69,0.08)]" aria-labelledby="personal-qr-title">
          <div className="absolute -right-9 -top-9 h-28 w-28 rounded-full bg-white/25" aria-hidden="true" />
          <div className="relative flex items-center gap-5">
            <figure className="shrink-0 rounded-[14px] bg-white p-2.5 shadow-[0_4px_12px_rgba(50,45,69,0.08)]">
              <div className="grid h-[94px] w-[94px] grid-cols-[repeat(19,minmax(0,1fr))] bg-white" aria-hidden="true">
                {QR_PATTERN.map(cell => <span key={cell.id} className={cell.filled ? 'bg-[#322D45]' : 'bg-transparent'} />)}
              </div>
              <figcaption className="sr-only">
                <span>Personal QR code for user USR-A3K9</span>
              </figcaption>
            </figure>
            <div className="min-w-0 flex-1">
              <QrCode className="mb-2 h-5 w-5 text-[#625B79]" strokeWidth={1.8} aria-hidden="true" />
              <h2 id="personal-qr-title" className="font-sora text-[16px] font-semibold leading-tight">
                <span>Your Personal QR</span>
              </h2>
              <p className="mt-2 font-mono text-[13px] font-bold tracking-[0.08em] text-[#4A9E7E]">
                <span>USR-A3K9</span>
              </p>
            </div>
          </div>
          <div className="relative mt-4 grid grid-cols-2 gap-2.5">
            <button type="button" onClick={copyCode} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#B9B4C9]/80 bg-[#EAE7F5] px-4 text-xs font-medium transition hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98]">
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button type="button" onClick={shareQr} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#9FE0C7] px-4 text-xs font-semibold transition hover:bg-[#8FD5BB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.98]">
              <Share2 className="h-4 w-4" aria-hidden="true" />
              <span>Share QR</span>
            </button>
          </div>
        </section>

        <section className="mt-7" aria-labelledby="account-heading">
          <h2 id="account-heading" className="mb-2.5 px-1 font-sora text-sm font-semibold">
            <span>Account</span>
          </h2>
          <div className="overflow-hidden rounded-2xl bg-[#E4DFF5]">
            <button type="button" className="flex min-h-14 w-full items-center gap-3 border-b border-[#B9B4C9] px-4 text-left transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#322D45]">
              <UserRound className="h-5 w-5 text-[#625B79]" strokeWidth={1.8} aria-hidden="true" />
              <span className="flex-1 text-sm font-medium">Edit Profile</span>
              <ChevronRight className="h-5 w-5 text-[#777186]" aria-hidden="true" />
            </button>
            <button type="button" className="flex min-h-14 w-full items-center gap-3 border-b border-[#B9B4C9] px-4 text-left transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#322D45]">
              <KeyRound className="h-5 w-5 text-[#625B79]" strokeWidth={1.8} aria-hidden="true" />
              <span className="flex-1 text-sm font-medium">Change Password</span>
              <ChevronRight className="h-5 w-5 text-[#777186]" aria-hidden="true" />
            </button>
            <button type="button" className="flex min-h-14 w-full items-center gap-3 px-4 text-left transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#322D45]">
              <Smartphone className="h-5 w-5 text-[#625B79]" strokeWidth={1.8} aria-hidden="true" />
              <span className="flex-1 text-sm font-medium">Linked Mobile</span>
              <span className="text-xs text-[#777186]">+63 9XX XXX XXXX</span>
              <ChevronRight className="h-5 w-5 text-[#777186]" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section className="mt-6" aria-labelledby="notifications-heading">
          <h2 id="notifications-heading" className="mb-2.5 px-1 font-sora text-sm font-semibold">
            <span>Notifications</span>
          </h2>
          <div className="overflow-hidden rounded-2xl bg-[#E4DFF5]">
            <div className="flex min-h-14 items-center gap-3 border-b border-[#B9B4C9] px-4">
              <Bell className="h-5 w-5 text-[#625B79]" strokeWidth={1.8} aria-hidden="true" />
              <span className="flex-1 text-sm font-medium">Stamp Alerts</span>
              <Toggle checked={stampAlerts} label="Stamp Alerts" onChange={() => setStampAlerts(!stampAlerts)} />
            </div>
            <div className="flex min-h-14 items-center gap-3 border-b border-[#B9B4C9] px-4">
              <Gift className="h-5 w-5 text-[#625B79]" strokeWidth={1.8} aria-hidden="true" />
              <span className="flex-1 text-sm font-medium">Reward Notifications</span>
              <Toggle checked={rewardNotifications} label="Reward Notifications" onChange={() => setRewardNotifications(!rewardNotifications)} />
            </div>
            <div className="flex min-h-14 items-center gap-3 px-4">
              <Megaphone className="h-5 w-5 text-[#625B79]" strokeWidth={1.8} aria-hidden="true" />
              <span className="flex-1 text-sm font-medium">Promotions &amp; Updates</span>
              <Toggle checked={promotions} label="Promotions and Updates" onChange={() => setPromotions(!promotions)} />
            </div>
          </div>
        </section>

        <section className="mt-6" aria-labelledby="support-heading">
          <h2 id="support-heading" className="mb-2.5 px-1 font-sora text-sm font-semibold">
            <span>Support</span>
          </h2>
          <div className="overflow-hidden rounded-2xl bg-[#E4DFF5]">
            <button type="button" className="flex min-h-14 w-full items-center gap-3 border-b border-[#B9B4C9] px-4 text-left transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#322D45]">
              <CircleHelp className="h-5 w-5 text-[#625B79]" strokeWidth={1.8} aria-hidden="true" />
              <span className="flex-1 text-sm font-medium">Help &amp; Support</span>
              <ChevronRight className="h-5 w-5 text-[#777186]" aria-hidden="true" />
            </button>
            <button type="button" className="flex min-h-14 w-full items-center gap-3 px-4 text-left transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#322D45]">
              <ShieldAlert className="h-5 w-5 text-[#625B79]" strokeWidth={1.8} aria-hidden="true" />
              <span className="flex-1 text-sm font-medium">Report a Problem</span>
              <ChevronRight className="h-5 w-5 text-[#777186]" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section className="mt-6" aria-labelledby="danger-heading">
          <h2 id="danger-heading" className="mb-2.5 px-1 font-sora text-sm font-semibold">
            <span>Danger zone</span>
          </h2>
          <div className="overflow-hidden rounded-2xl bg-[#E4DFF5]">
            <button type="button" className="flex min-h-14 w-full items-center gap-3 border-b border-[#B9B4C9] px-4 text-left text-[#D18C5B] transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#322D45]">
              <LogOut className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              <span className="flex-1 text-sm font-medium">Log Out</span>
            </button>
            <button type="button" className="flex min-h-14 w-full items-center gap-3 px-4 text-left text-[#C96868] transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#322D45]">
              <Trash2 className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              <span className="flex-1 text-sm font-medium">Delete Account</span>
            </button>
          </div>
        </section>
      </main>

      <CustomerBottomNav />
    </div>;
};