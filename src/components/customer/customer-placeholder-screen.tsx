import type { ReactNode } from "react";

type CustomerPlaceholderScreenProps = {
  section: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function CustomerPlaceholderScreen({
  section,
  title,
  description,
  children,
}: CustomerPlaceholderScreenProps) {
  return (
    <main className="mx-auto w-full max-w-[402px] px-5 pb-[116px] pt-10 text-[#322D45]">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-[#8B859D]">
        {section}
      </p>
      <h1 className="mt-2 font-display text-[29px] font-semibold tracking-[-0.04em] text-[#322D45]">
        {title}
      </h1>
      <p className="mt-2 text-[15px] leading-6 text-[#746E86]">{description}</p>
      <div className="mt-8 rounded-[20px] border border-[#B9B4C9]/45 bg-white px-5 py-6 text-[14px] text-[#746E86] shadow-[0_7px_18px_rgba(50,45,69,0.08)]">
        Placeholder content
      </div>
      {children ? <div className="mt-8">{children}</div> : null}
    </main>
  );
}
