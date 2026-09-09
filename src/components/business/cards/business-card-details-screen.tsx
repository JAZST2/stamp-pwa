"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Copy,
  Download,
  Printer,
  Share2,
  Star,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import type { StampCardDetailItem, StampCardStatus } from "@/lib/business/stamp-cards";
import { buildCardJoinQrPayload } from "@/lib/qr/stamp-card";
import { cn } from "@/lib/utils";
import { BusinessTabNavigation } from "../business-tab-navigation";
import { StampCardIcon } from "./stamp-card-icon";

type BusinessCardDetailsScreenProps = {
  card: StampCardDetailItem;
};

type StatItem = {
  id: string;
  label: string;
  value: string;
  color: string;
};

type QrAction = {
  id: "print" | "share" | "save";
  label: string;
  icon: LucideIcon;
};

const CARD_STATS: StatItem[] = [
  { id: "members", label: "Members", value: "124", color: "#E4DFF5" },
  { id: "redeemed", label: "Redeemed", value: "18", color: "#DDF3EA" },
  { id: "pending", label: "Pending", value: "7", color: "#FFE1CB" },
];

const QR_ACTIONS: QrAction[] = [
  { id: "print", label: "Print", icon: Printer },
  { id: "share", label: "Share", icon: Share2 },
  { id: "save", label: "Save", icon: Download },
];

const FALLBACK_RULES = "No card rules set yet.";

function getStatusBadgeClassName(status: StampCardStatus): string {
  if (status === "active") {
    return "bg-[#9FE0C7]";
  }

  return "bg-[#B9B4C9]";
}

function getStatusLabel(status: StampCardStatus): string {
  if (status === "active") {
    return "Active";
  }

  return "Inactive";
}

function getReadableStampSuffix(stampNumber: number): string {
  const moduloHundred = stampNumber % 100;

  if (moduloHundred >= 11 && moduloHundred <= 13) {
    return "th";
  }

  const moduloTen = stampNumber % 10;
  if (moduloTen === 1) {
    return "st";
  }
  if (moduloTen === 2) {
    return "nd";
  }
  if (moduloTen === 3) {
    return "rd";
  }

  return "th";
}

function buildStampSlots(totalStamps: number, milestoneStamps: number[]) {
  const milestones = new Set(milestoneStamps);

  return Array.from({ length: totalStamps }, (_, index) => {
    const stampNumber = index + 1;
    return {
      id: `stamp-slot-${stampNumber}`,
      stampNumber,
      isMilestone: milestones.has(stampNumber),
    };
  });
}

export function BusinessCardDetailsScreen({ card }: BusinessCardDetailsScreenProps) {
  const router = useRouter();
  const qrExportCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [notice, setNotice] = useState("");

  const cardCode = card.card_code ?? card.id.slice(0, 8).toUpperCase();
  const qrPayload = buildCardJoinQrPayload(cardCode);
  const stampSlots = useMemo(
    () =>
      buildStampSlots(
        card.total_stamps,
        card.milestones.map((milestone) => milestone.stamp_number),
      ),
    [card.total_stamps, card.milestones],
  );

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 1800);
  }

  function onBack() {
    router.push("/cards");
  }

  function onEdit() {
    router.push(`/cards/${card.id}/edit`);
  }

  async function copyCardCode() {
    try {
      await navigator.clipboard.writeText(cardCode);
      showNotice("Card code copied.");
    } catch {
      showNotice(`Card code: ${cardCode}`);
    }
  }

  function onPrint() {
    window.print();
    showNotice("Print opened.");
  }

  async function onShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: card.name,
          text: `Join ${card.name} with code ${cardCode}.`,
        });
        showNotice("Card shared.");
      } catch {
        showNotice("Sharing canceled.");
      }
      return;
    }

    await copyCardCode();
  }

  function onSave() {
    const exportCanvas = qrExportCanvasRef.current;
    if (!exportCanvas) {
      showNotice("QR image is unavailable.");
      return;
    }

    const pngDataUrl = exportCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngDataUrl;
    link.download = `${card.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-qr.png`;
    link.click();
    showNotice("QR image saved.");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col bg-[#F7F8FB] text-[#322D45]">
      <header className="sticky top-0 z-30 border-b border-[#E7E4EF] bg-[#F7F8FB]/95 backdrop-blur-xl">
        <nav
          aria-label="Card detail navigation"
          className="mx-auto grid h-[72px] w-full grid-cols-[48px_1fr_48px] items-center px-4"
        >
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to cards"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#322D45] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/40"
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <h1 className="truncate px-1 text-center font-sora text-[14px] font-semibold tracking-[-0.02em]">
            {card.name}
          </h1>
          <button
            type="button"
            onClick={onEdit}
            className="justify-self-end rounded-full px-1 py-2 text-[14px] font-medium text-[#4B9F81] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/40"
          >
            Edit
          </button>
        </nav>
      </header>

      <main className="flex-1 px-4 pb-28 pt-5">
        <section
          aria-label="Loyalty card overview"
          className="rounded-[20px] border border-white/70 bg-[#E4DFF5] p-5 shadow-[0_14px_32px_rgba(50,45,69,0.09)]"
        >
          <div className="flex items-center gap-3 border-b border-[#CDC6E5] pb-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(50,45,69,0.07)]"
              role="img"
              aria-label="Card icon"
            >
              <StampCardIcon aria-hidden="true" className="h-6 w-6 text-[#322D45]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-sora text-[17px] font-semibold tracking-[-0.025em]">
                {card.name}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[10px] font-medium text-[#322D45]",
                getStatusBadgeClassName(card.status),
              )}
            >
              {getStatusLabel(card.status)}
            </span>
          </div>

          <div
            className="grid grid-cols-4 gap-3 py-5"
            aria-label={`${card.total_stamps} stamp slots with milestones`}
          >
            {stampSlots.map((slot) => (
              <div
                key={slot.id}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-full border-2",
                  slot.isMilestone
                    ? "border-[#E6A678] bg-[#FFC9A3] shadow-[0_3px_0_rgba(50,45,69,0.12)]"
                    : "border-dashed border-[#AAA4BB] bg-white/25",
                )}
              >
                {slot.isMilestone ? (
                  <Star
                    aria-hidden="true"
                    className="h-5 w-5 fill-[#322D45] text-[#322D45]"
                  />
                ) : (
                  <span className="font-mono text-[11px] text-[#827B92]">
                    {slot.stampNumber}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Card statistics" className="mt-4 grid grid-cols-3 gap-2">
          {CARD_STATS.map((stat) => (
            <article
              key={stat.id}
              className="rounded-[16px] border border-[#D8D3E6] px-3 py-4"
              style={{ backgroundColor: stat.color }}
            >
              <p className="font-sora text-[20px] font-semibold leading-none tracking-[-0.04em]">
                {stat.value}
              </p>
              <p className="mt-2 text-[11px] leading-none text-[#756F83]">{stat.label}</p>
            </article>
          ))}
        </section>

        <section
          aria-labelledby="rules-heading"
          className="mt-4 rounded-[18px] border border-[#D5D0E5] bg-[#E4DFF5] p-5"
        >
          <h2
            id="rules-heading"
            className="font-sora text-[18px] font-semibold tracking-[-0.03em]"
          >
            Card Rules
          </h2>
          <p className="mt-3 whitespace-pre-line text-[14px] leading-6 text-[#504A60]">
            {card.rules?.trim() ? card.rules : FALLBACK_RULES}
          </p>
          <ul className="mt-4 space-y-3 border-t border-[#CDC6E5] pt-4">
            {card.milestones.length === 0 ? (
              <li className="text-[13px] font-medium text-[#504A60]">No milestones yet.</li>
            ) : (
              card.milestones.map((milestone) => (
                <li
                  key={`${card.id}-milestone-${milestone.stamp_number}`}
                  className="flex items-center gap-3 text-[13px] font-medium"
                >
                  <Star
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 fill-[#FFC9A3] text-[#D9905A]"
                  />
                  <span>
                    {milestone.stamp_number}
                    {getReadableStampSuffix(milestone.stamp_number)} stamp -{" "}
                    {milestone.reward_description}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section
          aria-labelledby="qr-heading"
          className="mt-4 rounded-[18px] border border-[#D5D0E5] bg-[#EEEBF9] px-5 py-6 text-center"
        >
          <div className="mx-auto w-fit rounded-[14px] border border-[#D2CCE1] bg-white p-3 shadow-[0_6px_18px_rgba(50,45,69,0.08)]">
            <QRCodeCanvas
              value={qrPayload}
              size={128}
              fgColor="#322D45"
              bgColor="#FFFFFF"
              marginSize={2}
              level="M"
              role="img"
              aria-label={`QR code for ${card.name}`}
            />
            <QRCodeCanvas
              ref={qrExportCanvasRef}
              value={qrPayload}
              size={1200}
              fgColor="#322D45"
              bgColor="#FFFFFF"
              marginSize={6}
              level="H"
              className="hidden"
              aria-hidden="true"
            />
          </div>
          <h2
            id="qr-heading"
            className="mt-4 font-sora text-[17px] font-semibold tracking-[-0.025em]"
          >
            Card QR Code
          </h2>
          <p className="mt-1 text-[13px] text-[#756F83]">Customers scan this to join.</p>

          <div className="mt-5 grid grid-cols-3 gap-2" aria-label="QR code actions">
            {QR_ACTIONS.map((action) => {
              const Icon = action.icon;
              const onAction =
                action.id === "print"
                  ? onPrint
                  : action.id === "share"
                    ? onShare
                    : onSave;

              return (
                <button
                  type="button"
                  key={action.id}
                  onClick={() => {
                    void onAction();
                  }}
                  className="flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-[#B9B4C9] bg-transparent px-3 text-[12px] font-medium transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/40"
                >
                  <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 border-t border-[#D5D0E5] pt-3">
            <button
              type="button"
              onClick={() => {
                void copyCardCode();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[#B9B4C9] bg-white/45 px-3 py-1.5 font-mono text-[12px] font-bold text-[#322D45] transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9FE0C7]/40"
              aria-label={`Copy card code ${cardCode}`}
            >
              <span>{cardCode}</span>
              <Copy aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>

          <p aria-live="polite" className="mt-3 h-4 font-mono text-[10px] text-[#5D8877]">
            {notice}
          </p>
        </section>
      </main>

      <BusinessTabNavigation />
    </div>
  );
}
