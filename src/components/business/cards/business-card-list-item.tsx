import { ChevronRight, Pencil } from "lucide-react";
import Link from "next/link";
import {
  getStampCardStatusLabel,
  type StampCardListItem,
} from "@/lib/business/stamp-cards";
import { cn } from "@/lib/utils";

type BusinessCardListItemProps = {
  card: StampCardListItem;
};

function getCardInitials(cardName: string): string {
  const words = cardName
    .split(" ")
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0) {
    return "SC";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function getStatusBadgeClassName(status: StampCardListItem["status"]): string {
  if (status === "active") {
    return "bg-[#9FE0C7]";
  }

  return "bg-[#B9B4C9]";
}

function getAvatarToneClassName(status: StampCardListItem["status"]): string {
  if (status === "active") {
    return "bg-[#9FE0C7]";
  }

  return "bg-white";
}

function formatExpiryDate(expiryDate: string | null): string {
  if (!expiryDate) {
    return "No expiry";
  }

  const parsedDate = new Date(expiryDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return expiryDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}

export function BusinessCardListItem({ card }: BusinessCardListItemProps) {
  const statusLabel = getStampCardStatusLabel(card.status);
  const initials = getCardInitials(card.name);

  return (
    <li className="rounded-[20px] border border-[#D8D3E7] bg-[#E4DFF5] p-4 shadow-[0_8px_24px_rgba(50,45,69,0.08)]">
      <article aria-labelledby={`${card.id}-name`}>
        <header className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/70 font-sora text-[12px] font-bold text-[#322D45]",
              getAvatarToneClassName(card.status),
            )}
            aria-label={`${card.name} logo placeholder`}
            role="img"
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h3
              id={`${card.id}-name`}
              className="truncate font-sora text-[15px] font-semibold tracking-[-0.02em] text-[#322D45]"
            >
              {card.name}
            </h3>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-[10px] font-medium text-[#322D45]",
              getStatusBadgeClassName(card.status),
            )}
          >
            {statusLabel}
          </span>
        </header>

        <div className="mt-4 rounded-xl border border-[#CDC7DE] bg-white/55 px-3 py-2.5">
          <dl className="grid grid-cols-3 gap-3">
            <div>
              <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#746E82]">
                Required
              </dt>
              <dd className="mt-1 text-[12px] font-medium text-[#322D45]">
                {card.total_stamps} stamps
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#746E82]">
                Expiry
              </dt>
              <dd className="mt-1 text-[12px] font-medium text-[#322D45]">
                {formatExpiryDate(card.expiry_date)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#746E82]">
                Milestones
              </dt>
              <dd className="mt-1 text-[12px] font-medium text-[#322D45]">
                {card.milestone_count}
              </dd>
            </div>
          </dl>
        </div>

        <footer className="mt-4 flex items-center gap-2 border-t border-[#CFC9E1] pt-3">
          <Link
            href={`/cards/${card.id}/edit`}
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#AFA8C3] bg-transparent px-3 font-sora text-[11px] font-semibold text-[#322D45] transition hover:bg-white/55 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 active:scale-[0.98]"
          >
            <Pencil aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span>Edit</span>
          </Link>
          <Link
            href={`/cards/${card.id}`}
            className="flex h-9 flex-[1.4] items-center justify-center gap-1.5 rounded-full bg-[#9FE0C7] px-3 font-sora text-[11px] font-semibold text-[#322D45] shadow-[0_3px_10px_rgba(50,45,69,0.07)] transition hover:bg-[#8ED7BB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/45 active:scale-[0.98]"
          >
            <span>View Details</span>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </footer>
      </article>
    </li>
  );
}
