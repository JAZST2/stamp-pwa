import React from 'react';
export type PillButtonVariant = 'mint' | 'peach' | 'ghost';
export type PillButtonSize = 'sm' | 'md' | 'lg';
interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PillButtonVariant;
  size?: PillButtonSize;
  children: React.ReactNode;
}
export const PillButton: React.FC<PillButtonProps> = ({
  variant = 'mint',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-full font-inter font-medium transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center';
  const variantStyles = {
    mint: 'bg-[#9FE0C7] text-[#322D45] hover:bg-[#8CD1B8] shadow-sm',
    peach: 'bg-[#FFC9A3] text-[#322D45] hover:bg-[#FFB885] shadow-sm',
    ghost: 'bg-transparent border-2 border-[#322D45] text-[#322D45] hover:bg-[#322D45]/5'
  };
  const sizeStyles = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base'
  };
  return <button className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...props}>
      {children}
    </button>;
};