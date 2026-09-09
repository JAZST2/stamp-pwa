import React from 'react';
import { Star } from 'lucide-react';
interface StampCardProps {
  variant?: 'compact' | 'full';
  totalStamps: number;
  currentStamps: number;
  businessName: string;
  className?: string;
}
export const StampCard: React.FC<StampCardProps> = ({
  variant = 'full',
  totalStamps = 10,
  currentStamps = 0,
  businessName,
  className = ''
}) => {
  const stamps = Array.from({
    length: totalStamps
  });
  return <div className={`bg-white rounded-[24px] overflow-hidden shadow-sm border border-[#E4DFF5] ${className}`}>
      {/* Card Header */}
      <div className="bg-[#E4DFF5] px-5 py-4 flex justify-between items-center">
        <span className="font-sora font-semibold text-[#322D45] text-lg truncate">
          {businessName}
        </span>
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <div className="w-4 h-4 bg-[#9FE0C7] rounded-full animate-pulse" />
        </div>
      </div>

      {/* Stamp Grid */}
      <div className={`p-5 ${variant === 'compact' ? 'py-4' : 'py-6'}`}>
        <div className={`grid ${variant === 'compact' ? 'grid-cols-5' : 'grid-cols-5'} gap-3`}>
          {stamps.map((_, idx) => {
          const isFilled = idx < currentStamps;
          const isReward = (idx + 1) % 5 === 0;
          return <div key={idx} aria-label={`Stamp ${idx + 1}${isReward ? ', reward milestone' : ''}${isFilled ? ', collected' : ', not collected'}`} className={`
                  aspect-square rounded-full flex items-center justify-center transition-all duration-300
                  ${isFilled ? 'bg-[#9FE0C7] border-transparent' : 'bg-transparent border-2 border-dashed border-[#E4DFF5]'}
                `}>
                {isReward ? <Star aria-hidden="true" className="w-4 h-4 text-[#F09B62]" fill="#FFC9A3" /> : isFilled ? <div className="text-[#322D45] font-sora font-bold text-xs"><span>P</span></div> : null}
              </div>;
        })}
        </div>

        {/* Card Footer / Progress */}
        {variant === 'full' && <div className="mt-6 flex justify-between items-center border-t border-[#F7F8FB] pt-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#322D45]/60">
              Loyalty Progress
            </span>
            <span className="font-mono font-bold text-[#322D45] text-sm">
              {currentStamps} / {totalStamps}
            </span>
          </div>}
      </div>
    </div>;
};