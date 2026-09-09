"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Edit3,
  Printer,
  Share2,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import type { StampCardQrStepPreview } from "@/lib/business/stamp-cards";
import { finalizeStampCardAction } from "@/app/(business)/cards/create/actions";
import { ScreenOverlayLoader } from "@/components/ui";
import { buildCardJoinQrPayload } from "@/lib/qr/stamp-card";

type StampSlot = {
  id: string;
  label: string;
  milestone: boolean;
};

const DEMO_PREVIEW: StampCardQrStepPreview = {
  name: "Kape Juan Loyalty Card",
  total_stamps: 8,
  expiry_date: "2025-12-31",
  card_code: "KAPE-8S-QR2",
  milestones: [
    {
      stamp_number: 8,
      reward_description: "1 Free Brewed Coffee",
    },
  ],
};
const REQUEST_TIMEOUT_MS = 20000;

function buildStampSlots(totalStamps: number, milestones: number[]): StampSlot[] {
  const milestoneSet = new Set(milestones);

  return Array.from({ length: totalStamps }, (_, index) => {
    const label = String(index + 1);

    return {
      id: `stamp-${label}`,
      label,
      milestone: milestoneSet.has(index + 1),
    };
  });
}

function formatExpiryDate(value: string | null): string {
  if (!value) {
    return "No expiry";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

type CreateCardQrStepScreenProps = {
  preview?: StampCardQrStepPreview;
  cardId?: string;
};

export function CreateCardQrStepScreen({
  preview = DEMO_PREVIEW,
  cardId,
}: CreateCardQrStepScreenProps) {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const qrExportCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardCode = preview.card_code ?? "AUTO-GENERATED";
  const qrPayload = buildCardJoinQrPayload(cardCode);
  const stampSlots = buildStampSlots(
    preview.total_stamps,
    preview.milestones.map((milestone) => milestone.stamp_number),
  );
  const primaryMilestone = preview.milestones[preview.milestones.length - 1];

  function goBackToSetup() {
    router.push("/cards/create");
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(cardCode);
      setCopied(true);
      setNotice("Card code copied.");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setNotice(`Card code: ${cardCode}`);
    }
  }

  async function shareCard() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: preview.name,
          text: `Join the ${preview.name} with code ${cardCode}.`,
        });
        setNotice("Card shared.");
      } catch {
        setNotice("Sharing cancelled.");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(cardCode);
      setNotice("Share code copied to clipboard.");
    } catch {
      setNotice(`Share this code: ${cardCode}`);
    }
  }

  function saveQr() {
    const exportCanvas = qrExportCanvasRef.current;
    if (!exportCanvas) {
      setNotice("QR image is unavailable right now.");
      return;
    }

    const pngDataUrl = exportCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngDataUrl;
    link.download = `${preview.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-qr.png`;
    link.click();
    setNotice("QR image saved as PNG.");
  }

  function finish() {
    if (!cardId) {
      setCompleted(true);
      setNotice("Card created - opening your cards.");
      router.push("/cards");
      return;
    }

    setIsFinalizing(true);
    setNotice("Finalizing card...");

    void (async () => {
      let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

      try {
        const result = await Promise.race([
          finalizeStampCardAction(cardId),
          new Promise<never>((_, reject) => {
            timeoutHandle = setTimeout(() => {
              reject(new Error("request_timeout"));
            }, REQUEST_TIMEOUT_MS);
          }),
        ]);

        if (!result.ok) {
          setNotice(result.error);
          return;
        }

        setCompleted(true);
        setNotice("Card created - opening your cards.");
        router.push("/cards");
      } catch (error) {
        if (error instanceof Error && error.message === "request_timeout") {
          setNotice("Request timed out. Please try again.");
          return;
        }
        setNotice("Unexpected error. Please try again.");
      } finally {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
        setIsFinalizing(false);
      }
    })();
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[402px] flex-col overflow-hidden bg-[#F7F8FB] text-[#322D45]">
      <ScreenOverlayLoader
        visible={isFinalizing}
        title="Finalizing card"
        description="Activating card and preparing list..."
      />
      <header className="z-20 shrink-0 border-b border-[#E4DFF5]/75 bg-[#F7F8FB]/95 px-5 pb-3 pt-[max(14px,env(safe-area-inset-top))] backdrop-blur-xl">
        <div className="grid h-10 grid-cols-[44px_1fr_44px] items-center">
          <button
            type="button"
            onClick={goBackToSetup}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7] active:bg-[#E4DFF5]"
            aria-label="Back to card setup"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </button>
          <h1 className="text-center font-sora text-[18px] font-semibold tracking-[-0.025em]">
            Create Card
          </h1>
          <span aria-hidden="true" />
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          <p className="font-mono text-[10px] tracking-[0.055em] text-[#777187]">
            2 of 2 - Generate QR
          </p>
          <div
            className="flex items-center gap-1.5 rounded-full border border-[#E4DFF5] bg-white px-2 py-1.5"
            aria-label="Step 2 of 2"
          >
            <span className="h-2 w-2 rounded-full bg-[#B9B4C9]" aria-hidden="true" />
            <span className="h-2 w-5 rounded-full bg-[#9FE0C7]" aria-hidden="true" />
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4">
        <section
          className="rounded-[20px] border border-white/80 bg-[#E4DFF5] p-4 shadow-[0_10px_28px_rgba(50,45,69,0.08)]"
          aria-labelledby="preview-title"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#777187]">
                Card preview
              </p>
              <h2
                id="preview-title"
                className="mt-1 font-sora text-[16px] font-semibold tracking-[-0.025em]"
              >
                {preview.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={goBackToSetup}
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[12px] font-medium text-[#514B60] transition hover:bg-white/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7]"
            >
              <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Edit</span>
            </button>
          </div>
          <div
            className="mt-3 grid grid-cols-8 gap-1.5"
            aria-label={`${preview.total_stamps} empty stamp slots`}
          >
            {stampSlots.map((slot) => (
              <span
                key={slot.id}
                className={`flex aspect-square items-center justify-center rounded-full border ${slot.milestone ? "border-[#E6A678] bg-[#FFC9A3]" : "border-[#B9B4C9] bg-white/45"}`}
                aria-label={
                  slot.milestone
                    ? `Stamp ${slot.label}, reward milestone`
                    : `Stamp ${slot.label}, empty`
                }
              >
                {slot.milestone ? (
                  <Star
                    className="h-3.5 w-3.5 fill-[#322D45] text-[#322D45]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[#B9B4C9]"
                    aria-hidden="true"
                  />
                )}
              </span>
            ))}
          </div>
          <p className="mt-2 text-right font-mono text-[10px] font-bold text-[#6F697E]">
            0/{preview.total_stamps} stamps
          </p>
        </section>

        <section
          className="mt-3 rounded-[16px] border border-white/75 bg-[#EEEBF8] px-4"
          aria-label="Card summary"
        >
          <div className="flex min-h-10 items-center justify-between gap-4 border-b border-[#D2CDE2] py-2">
            <p className="text-[12px] text-[#625C70]">Stamps Required</p>
            <p className="font-mono text-[12px] font-bold">{preview.total_stamps}</p>
          </div>
          <div className="flex min-h-10 items-center justify-between gap-4 border-b border-[#D2CDE2] py-2">
            <p className="text-[12px] text-[#625C70]">Expiry</p>
            <p className="text-right text-[12px] font-medium">
              {formatExpiryDate(preview.expiry_date)}
            </p>
          </div>
          <div className="flex min-h-11 items-center justify-between gap-3 py-2">
            <p className="text-[12px] text-[#625C70]">Milestone</p>
            <p className="flex items-center gap-1.5 text-right text-[11px] font-medium leading-4">
              <Star
                className="h-4 w-4 shrink-0 fill-[#FFC9A3] text-[#D8915E]"
                aria-hidden="true"
              />
              <span>
                {primaryMilestone
                  ? `${primaryMilestone.stamp_number}th stamp -> ${primaryMilestone.reward_description}`
                  : "No milestone set"}
              </span>
            </p>
          </div>
        </section>

        <section
          className="mt-3 rounded-[20px] border border-white/80 bg-[#E4DFF5] p-4 shadow-[0_10px_28px_rgba(50,45,69,0.08)]"
          aria-labelledby="qr-heading"
        >
          <h2
            id="qr-heading"
            className="text-center font-sora text-[16px] font-semibold tracking-[-0.025em]"
          >
            Your Card QR Code
          </h2>
          <div className="mx-auto mt-3 w-fit rounded-[16px] border border-white bg-[#F7F8FB] p-2.5 shadow-[0_5px_16px_rgba(50,45,69,0.08)]">
            <QRCodeCanvas
              value={qrPayload}
              size={142}
              fgColor="#322D45"
              bgColor="#F7F8FB"
              marginSize={2}
              level="M"
              role="img"
              aria-label={`QR code for ${preview.name}`}
            />
            <QRCodeCanvas
              ref={qrExportCanvasRef}
              value={qrPayload}
              size={1200}
              fgColor="#322D45"
              bgColor="#F7F8FB"
              marginSize={6}
              level="H"
              className="hidden"
              aria-hidden="true"
            />
          </div>
          <p className="mx-auto mt-2 max-w-[270px] text-center text-[11px] leading-[17px] text-[#716B7F]">
            Customers scan this QR code to join your loyalty card.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2" aria-label="QR code actions">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-[#B9B4C9] bg-white/25 text-[11px] font-medium transition hover:bg-white/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7] active:scale-[0.98]"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={shareCard}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-[#B9B4C9] bg-white/25 text-[11px] font-medium transition hover:bg-white/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7] active:scale-[0.98]"
            >
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={saveQr}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-[#B9B4C9] bg-white/25 text-[11px] font-medium transition hover:bg-white/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7] active:scale-[0.98]"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Save Image</span>
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#CFC9DF] pt-3">
            <p className="text-[11px] text-[#716B7F]">Card Code</p>
            <button
              type="button"
              onClick={copyCode}
              className="inline-flex items-center gap-2 rounded-full px-2 py-1 font-mono text-[12px] font-bold text-[#3E8A6C] transition hover:bg-white/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7]"
              aria-label={`Copy card code ${cardCode}`}
            >
              <span>{cardCode}</span>
              {copied ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </section>

        <div className="min-h-7 pt-2" role="status" aria-live="polite">
          <p className="text-center text-[11px] font-medium text-[#4F806D]">{notice}</p>
        </div>
      </main>

      <footer className="relative z-20 shrink-0 border-t border-[#E4DFF5] bg-[#F7F8FB]/96 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_28px_rgba(50,45,69,0.08)] backdrop-blur-xl">
        <span
          className="absolute left-5 top-2 h-2 w-2 rotate-12 rounded-[2px] bg-[#FFC9A3]"
          aria-hidden="true"
        />
        <span
          className="absolute right-7 top-1.5 h-2.5 w-2.5 rounded-full bg-[#FFC9A3]"
          aria-hidden="true"
        />
        <span
          className="absolute right-4 top-8 h-1.5 w-1.5 rounded-full bg-[#E2A170]"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={finish}
          disabled={isFinalizing}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#9FE0C7] px-6 font-sora text-[14px] font-semibold shadow-[0_8px_20px_rgba(79,153,124,0.22)] transition hover:bg-[#91D8BD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-[0.99]"
        >
          {completed ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
          <span>
            {completed ? "Card Created" : isFinalizing ? "Saving..." : "Done - Go to Cards"}
          </span>
        </button>
      </footer>
    </div>
  );
}
