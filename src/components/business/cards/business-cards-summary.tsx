type BusinessCardsSummaryProps = {
  totalCards: number;
  activeCards: number;
};

function getProgramsLabel(totalCards: number): string {
  if (totalCards === 1) {
    return "1 loyalty program";
  }

  return `${totalCards} loyalty programs`;
}

export function BusinessCardsSummary({
  totalCards,
  activeCards,
}: BusinessCardsSummaryProps) {
  return (
    <div className="mb-3 flex items-center justify-between px-1">
      <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#777187]">
        {getProgramsLabel(totalCards)}
      </h2>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#777187]">
        {activeCards} active
      </p>
    </div>
  );
}
