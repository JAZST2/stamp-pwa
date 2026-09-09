import React from 'react';
import { ArrowLeft, UserCircle } from 'lucide-react';
interface TopBarProps {
  title?: string;
  onBack?: () => void;
  showProfile?: boolean;
  rightAction?: React.ReactNode;
}
export const TopBar: React.FC<TopBarProps> = ({
  title,
  onBack,
  showProfile = true,
  rightAction
}) => {
  return <header className="fixed top-0 left-0 right-0 bg-[#F7F8FB]/80 backdrop-blur-md z-50 safe-top">
      <div className="h-16 px-6 flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {onBack ? <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#E4DFF5] active:scale-90 transition-transform">
              <ArrowLeft className="w-5 h-5 text-[#322D45]" />
            </button> : <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#9FE0C7] rounded-lg flex items-center justify-center font-sora font-bold text-[#322D45]">
                P
              </div>
              <span className="font-sora font-bold text-[#322D45] tracking-tight text-xl">
                Perkly<span className="text-[#9FE0C7]">Ph</span>
              </span>
            </div>}
        </div>

        {title && !onBack && <div className="absolute left-1/2 -translate-x-1/2 font-sora font-semibold text-[#322D45]">
            {title}
          </div>}

        <div className="flex items-center">
          {rightAction ? rightAction : showProfile && <button className="w-10 h-10 rounded-full bg-white border border-[#E4DFF5] flex items-center justify-center text-[#322D45]/60 hover:text-[#322D45] transition-colors">
                <UserCircle className="w-7 h-7" />
              </button>}
        </div>
      </div>
    </header>;
};