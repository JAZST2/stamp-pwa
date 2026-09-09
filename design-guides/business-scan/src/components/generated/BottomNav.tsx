import React from 'react';
import { Home, Search, QrCode, LayoutDashboard, Settings } from 'lucide-react';
export type BottomNavType = 'customer' | 'business';
interface BottomNavProps {
  activeTab: string;
  type: BottomNavType;
  onTabChange?: (tab: string) => void;
}
export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  type,
  onTabChange
}) => {
  const customerTabs = [{
    id: 'home',
    icon: Home,
    label: 'Home'
  }, {
    id: 'browse',
    icon: Search,
    label: 'Browse'
  }, {
    id: 'wallet',
    icon: QrCode,
    label: 'Wallet'
  }];
  const businessTabs = [{
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard'
  }, {
    id: 'scan',
    icon: QrCode,
    label: 'Scan'
  }, {
    id: 'settings',
    icon: Settings,
    label: 'Settings'
  }];
  const tabs = type === 'customer' ? customerTabs : businessTabs;
  return <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#E4DFF5] px-6 pb-6 pt-2 safe-bottom">
      <div className="max-w-md mx-auto flex justify-between items-center relative">
        {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return <button key={tab.id} onClick={() => onTabChange?.(tab.id)} className="flex flex-col items-center justify-center w-16 group relative">
              {/* Active Indicator (Mint Pill) */}
              {isActive && <div className="absolute -top-1 w-12 h-1.5 bg-[#9FE0C7] rounded-full transition-all duration-300" />}
              
              <div className={`p-2 rounded-xl transition-colors ${isActive ? 'text-[#322D45]' : 'text-[#322D45]/40'}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : 'scale-100'} transition-transform`} />
              </div>
              <span className={`text-[10px] font-inter font-medium ${isActive ? 'text-[#322D45]' : 'text-[#322D45]/40'}`}>
                {tab.label}
              </span>
            </button>;
      })}
      </div>
    </nav>;
};