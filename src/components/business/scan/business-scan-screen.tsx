"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Keyboard, ScanLine, ShieldCheck } from "lucide-react";
import {
  addStampByCustomerCodeAction,
  redeemRewardByClaimCodeAction,
} from "@/app/(business)/biz/scan/actions";
import { AddStampCardPickerModal } from "@/components/business/scan/add-stamp-card-picker-modal";
import { BusinessScanCameraView } from "@/components/business/scan/business-scan-camera-view";
import { BusinessScanPillButton } from "@/components/business/scan/business-scan-pill-button";
import { ScreenOverlayLoader } from "@/components/ui/screen-overlay-loader";
import { StatusPopup } from "@/components/ui/status-popup";

type ScanMode = "stamp" | "reward";
type StampCardChoice = {
  cardId: string;
  cardName: string;
  currentStampCount: number;
  totalStamps: number;
};

export function BusinessScanScreen() {
  const [scanMode, setScanMode] = useState<ScanMode>("stamp");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [claimCode, setClaimCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDetectedRaw, setLastDetectedRaw] = useState("");
  const [cardPicker, setCardPicker] = useState<{
    open: boolean;
    customerName: string;
    customerCode: string;
    cards: StampCardChoice[];
    selectedCardId: string | null;
  }>({
    open: false,
    customerName: "",
    customerCode: "",
    cards: [],
    selectedCardId: null,
  });
  const [popup, setPopup] = useState<{
    open: boolean;
    variant: "success" | "error" | "info";
    title: string;
    subtitle: string;
  }>({
    open: false,
    variant: "info",
    title: "",
    subtitle: "",
  });
  const isStampMode = scanMode === "stamp";
  const actionInFlightRef = useRef(false);
  const popupOpenRef = useRef(false);

  useEffect(() => {
    popupOpenRef.current = popup.open;
  }, [popup.open]);

  const closeCardPicker = useCallback(() => {
    setCardPicker({
      open: false,
      customerName: "",
      customerCode: "",
      cards: [],
      selectedCardId: null,
    });
  }, []);

  const processStamp = useCallback(
    async (
      rawInput: string,
      source: "camera" | "manual" | "selection",
      selectedCardId?: string,
    ) => {
    const normalized = rawInput.trim();
    if (!normalized) {
      return;
    }

    if (actionInFlightRef.current || popupOpenRef.current) {
      return;
    }

    actionInFlightRef.current = true;
    setIsProcessing(true);
    setLastDetectedRaw(normalized.toUpperCase());

    try {
      const result = await addStampByCustomerCodeAction({
        rawInput: normalized,
        selectedCardId,
      });
      if (!result.ok) {
        if (result.reason === "select_card") {
          setCardPicker({
            open: true,
            customerName: result.customerName,
            customerCode: result.customerCode,
            cards: result.cards,
            selectedCardId: result.cards[0]?.cardId ?? null,
          });
          return;
        }

        setPopup({
          open: true,
          variant: "error",
          title: "Unable to add stamp",
          subtitle: result.error,
        });
        return;
      }

      setPopup({
        open: true,
        variant: "success",
        title: "Stamp added",
        subtitle: `${result.customerName} now has ${result.currentStampCount}/${result.totalStamps} stamps on ${result.cardName}.`,
      });
      closeCardPicker();

      if (source === "manual" || source === "selection") {
        setClaimCode("");
        setShowManualEntry(false);
      }
    } catch {
      setPopup({
        open: true,
        variant: "error",
        title: "Unable to add stamp",
        subtitle: "Something went wrong. Please try again.",
      });
    } finally {
      actionInFlightRef.current = false;
      setIsProcessing(false);
    }
    },
    [closeCardPicker],
  );

  const processRewardRedeem = useCallback(
    async (rawInput: string, source: "camera" | "manual") => {
      const normalized = rawInput.trim();
      if (!normalized) {
        return;
      }

      if (actionInFlightRef.current || popupOpenRef.current) {
        return;
      }

      actionInFlightRef.current = true;
      setIsProcessing(true);
      setLastDetectedRaw(normalized.toUpperCase());

      try {
        const result = await redeemRewardByClaimCodeAction(normalized);
        if (!result.ok) {
          setPopup({
            open: true,
            variant: "error",
            title: "Unable to redeem reward",
            subtitle: result.error,
          });
          return;
        }

        setPopup({
          open: true,
          variant: "success",
          title: "Reward redeemed",
          subtitle: `${result.rewardDescription} has been claimed (${result.claimCode}).`,
        });

        if (source === "manual") {
          setClaimCode("");
          setShowManualEntry(false);
        }
      } catch {
        setPopup({
          open: true,
          variant: "error",
          title: "Unable to redeem reward",
          subtitle: "Something went wrong. Please try again.",
        });
      } finally {
        actionInFlightRef.current = false;
        setIsProcessing(false);
      }
    },
    [],
  );

  const handleCameraScan = useCallback((decodedText: string) => {
    if (!isStampMode) {
      void processRewardRedeem(decodedText, "camera");
      return;
    }

    void processStamp(decodedText, "camera");
  }, [isStampMode, processRewardRedeem, processStamp]);

  const handleManualSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isStampMode) {
      void processStamp(claimCode, "manual");
      return;
    }

    void processRewardRedeem(claimCode, "manual");
  };

  const confirmSelectedCard = () => {
    if (!cardPicker.selectedCardId || !cardPicker.customerCode) {
      return;
    }

    void processStamp(cardPicker.customerCode, "selection", cardPicker.selectedCardId);
  };

  return (
    <section className="pb-2 pt-[max(24px,env(safe-area-inset-top))]">
      <ScreenOverlayLoader
        visible={isProcessing}
        title={isStampMode ? "Adding stamp" : "Redeeming reward"}
        description={
          isStampMode
            ? "Please wait while we verify the customer and card..."
            : "Please wait while we verify and confirm the claim..."
        }
      />
      <StatusPopup
        open={popup.open}
        variant={popup.variant}
        title={popup.title}
        subtitle={popup.subtitle}
        onConfirm={() =>
          setPopup((previous) => ({
            ...previous,
            open: false,
          }))
        }
      />
      <AddStampCardPickerModal
        open={cardPicker.open}
        customerName={cardPicker.customerName}
        customerCode={cardPicker.customerCode}
        cards={cardPicker.cards}
        selectedCardId={cardPicker.selectedCardId}
        isSubmitting={isProcessing}
        onSelect={(cardId) =>
          setCardPicker((previous) => ({
            ...previous,
            selectedCardId: cardId,
          }))
        }
        onConfirm={confirmSelectedCard}
        onCancel={closeCardPicker}
      />
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#777187]">
        Business
      </p>
      <h1 className="mt-2 font-heading text-[26px] font-semibold tracking-[-0.035em] text-[#322D45]">
        Scan &amp; Process
      </h1>

      <div
        className="mt-5 grid grid-cols-2 gap-1.5 rounded-full border border-[#E4DFF5] bg-white p-1.5 shadow-[0_8px_24px_rgba(50,45,69,0.08)]"
        role="tablist"
        aria-label="Scan action"
      >
        <BusinessScanPillButton
          variant={isStampMode ? "mint" : "ghost"}
          size="md"
          role="tab"
          aria-selected={isStampMode}
          onClick={() => setScanMode("stamp")}
          className={
            isStampMode
              ? "w-full border-0 px-3"
              : "w-full border-0 bg-transparent px-3 text-[#5F5A70] shadow-none hover:bg-[#F1EFF8]"
          }
        >
          Add Stamp
        </BusinessScanPillButton>
        <BusinessScanPillButton
          variant={!isStampMode ? "peach" : "ghost"}
          size="md"
          role="tab"
          aria-selected={!isStampMode}
          onClick={() => {
            setScanMode("reward");
            closeCardPicker();
          }}
          className={
            isStampMode
              ? "w-full border-0 bg-transparent px-3 text-[#5F5A70] shadow-none hover:bg-[#F1EFF8]"
              : "w-full border-0 px-3"
          }
        >
          Redeem Reward
        </BusinessScanPillButton>
      </div>

      <div className="mb-5 mt-7 text-center">
        <p className="font-display text-lg font-semibold tracking-[-0.02em] text-[#322D45]">
          {isStampMode ? "Scan customer pass" : "Scan reward pass"}
        </p>
        <p className="mt-1.5 text-sm leading-6 text-[#6F6A7D]">
          {isStampMode
            ? "Align the QR code to add one visit."
            : "Align the QR code to confirm redemption."}
        </p>
      </div>

      <div className="relative h-[42vh] min-h-[336px] max-h-[400px] overflow-hidden rounded-[28px] border-2 border-dashed border-[#BEB7D6] bg-[#ECEAF3] shadow-[0_8px_24px_rgba(50,45,69,0.08)]">
        <div
          className="absolute inset-0 opacity-40"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(50,45,69,0.10) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <BusinessScanCameraView onScan={handleCameraScan} />
        <div className="pointer-events-none absolute inset-0 bg-white/25" aria-hidden="true" />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <span className="absolute left-0 top-0 h-12 w-12 rounded-tl-[22px] border-l-[5px] border-t-[5px] border-[#322D45]" />
          <span className="absolute right-0 top-0 h-12 w-12 rounded-tr-[22px] border-r-[5px] border-t-[5px] border-[#322D45]" />
          <span className="absolute bottom-0 left-0 h-12 w-12 rounded-bl-[22px] border-b-[5px] border-l-[5px] border-[#322D45]" />
          <span className="absolute bottom-0 right-0 h-12 w-12 rounded-br-[22px] border-b-[5px] border-r-[5px] border-[#322D45]" />
          <span className="absolute left-[8%] right-[8%] top-1/2 h-0.5 animate-pulse bg-[#9FE0C7] shadow-[0_0_12px_rgba(159,224,199,0.9)]" />
        </div>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#322D45] px-3 py-1.5 text-white shadow-sm">
          <ScanLine className="h-3.5 w-3.5 text-[#9FE0C7]" aria-hidden="true" />
          <span className="text-[11px] font-medium tracking-wide">Ready to scan</span>
        </div>
      </div>

      <section aria-labelledby="manual-entry-heading" className="mt-5">
        <h2 id="manual-entry-heading" className="sr-only">
          Manual claim code entry
        </h2>
        {!showManualEntry ? (
          <button
            type="button"
            onClick={() => setShowManualEntry(true)}
            className="mx-auto flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-[#4F4962] underline decoration-[#9FE0C7] decoration-2 underline-offset-4 transition-colors hover:text-[#322D45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FE0C7]"
          >
            <Keyboard className="h-4 w-4" aria-hidden="true" />
            <span>{isStampMode ? "Enter customer code instead" : "Enter claim code instead"}</span>
          </button>
        ) : (
          <form
            className="rounded-[20px] border border-[#E4DFF5] bg-white p-3 shadow-[0_8px_24px_rgba(50,45,69,0.08)]"
            onSubmit={handleManualSubmit}
          >
            <label
              htmlFor="claim-code"
              className="mb-2 block px-1 text-xs font-medium text-[#625D70]"
            >
              {isStampMode ? "Customer personal code" : "Customer claim code"}
            </label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Keyboard
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777184]"
                  aria-hidden="true"
                />
                <input
                  id="claim-code"
                  value={claimCode}
                  onChange={(event) => setClaimCode(event.target.value.toUpperCase())}
                  disabled={isProcessing}
                  autoComplete="off"
                  inputMode="text"
                  maxLength={64}
                  placeholder={isStampMode ? "APP:CUSTOMER:PASS:PKL4821ABC" : "PKLY-4821"}
                  className="h-11 w-full rounded-xl border border-[#DCD7EA] bg-[#F7F8FB] pl-10 pr-3 font-mono text-sm font-bold uppercase tracking-[0.12em] text-[#322D45] placeholder:text-[#9993A6] focus:border-[#9FE0C7] focus:outline-none focus:ring-2 focus:ring-[#9FE0C7]/30"
                />
              </div>
              <button
                type="submit"
                aria-label={isStampMode ? "Add stamp by customer code" : "Process claim code"}
                disabled={!claimCode.trim() || isProcessing}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#9FE0C7] text-[#322D45] transition-transform active:scale-95 disabled:opacity-40"
              >
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </form>
        )}
      </section>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#767181]">
        <ShieldCheck className="h-4 w-4 text-[#65A98F]" aria-hidden="true" />
        <span>Codes are verified before changes are applied</span>
      </div>

      {lastDetectedRaw.trim() ? (
        <p className="mt-3 text-center font-mono text-[11px] font-medium tracking-[0.04em] text-[#5F5A70]">
          Detected: {lastDetectedRaw.trim().toUpperCase()}
        </p>
      ) : null}
    </section>
  );
}
