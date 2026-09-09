import type { ReactNode } from "react";

type BusinessPlaceholderScreenProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function BusinessPlaceholderScreen({
  title,
  description,
  children,
}: BusinessPlaceholderScreenProps) {
  return (
    <section className="pt-[max(24px,env(safe-area-inset-top))]">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#777187]">
        Business
      </p>
      <h1 className="mt-2 font-sora text-[26px] font-semibold tracking-[-0.035em] text-[#322D45]">
        {title}
      </h1>
      <div className="mt-5 rounded-[20px] border border-[#D8D3E7] bg-[#E4DFF5]/70 p-5 shadow-[0_8px_24px_rgba(50,45,69,0.08)]">
        <p className="text-[14px] leading-6 text-[#6F697E]">{description}</p>
      </div>
      {children ? <div className="mt-7">{children}</div> : null}
    </section>
  );
}
