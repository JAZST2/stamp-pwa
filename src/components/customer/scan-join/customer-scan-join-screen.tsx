"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Keyboard, X } from "lucide-react";
import { joinStampCardAction } from "@/app/(customer)/scan/actions";
import { QrCameraView } from "@/components/customer/scan-join/qr-camera-view";
import { ScreenOverlayLoader } from "@/components/ui/screen-overlay-loader";
import { StatusPopup } from "@/components/ui/status-popup";
import { extractCardCodeFromScanInput } from "@/lib/customer/scan-join";

type ScanState = {
  code: string;
  source: "camera" | "manual" | null;
};

function resolveDisplayCode(rawValue: string) {
  if (rawValue.length <= 18) {
    return rawValue;
  }

  return `${rawValue.slice(0, 15)}...`;
}

type PopupState = {
  open: boolean;
  variant: "success" | "error" | "info";
  title: string;
  subtitle: string;
};

export function CustomerScanJoinScreen() {
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [popup, setPopup] = useState<PopupState>({
    open: false,
    variant: "info",
    title: "",
    subtitle: "",
  });
  const [scanState, setScanState] = useState<ScanState>({
    code: "",
    source: null,
  });
  const joinInFlightRef = useRef(false);
  const popupOpenRef = useRef(false);

  useEffect(() => {
    popupOpenRef.current = popup.open;
  }, [popup.open]);

  const handleJoin = useCallback(async (value: string, source: ScanState["source"]) => {
    const code = extractCardCodeFromScanInput(value) ?? value.trim().toUpperCase();
    if (!code) {
      setPopup({
        open: true,
        variant: "error",
        title: "Invalid code",
        subtitle: "Scan a valid QR code or enter a valid card code.",
      });
      return;
    }

    if (joinInFlightRef.current || popupOpenRef.current) {
      return;
    }

    joinInFlightRef.current = true;
    setIsJoining(true);
    setScanState({ code, source });

    try {
      const result = await joinStampCardAction(value);
      if (!result.ok) {
        setPopup({
          open: true,
          variant: "error",
          title: "Unable to join",
          subtitle: result.error,
        });
        return;
      }

      if (result.status === "already_joined") {
        setPopup({
          open: true,
          variant: "info",
          title: "Already joined",
          subtitle: `You are already a member of ${result.cardName}.`,
        });
        return;
      }

      setPopup({
        open: true,
        variant: "success",
        title: "Card joined",
        subtitle: `You successfully joined ${result.cardName}.`,
      });
      setManualCode("");
      setShowCodeEntry(false);
    } catch {
      setPopup({
        open: true,
        variant: "error",
        title: "Unable to join",
        subtitle: "Something went wrong. Please try again.",
      });
    } finally {
      joinInFlightRef.current = false;
      setIsJoining(false);
    }
  }, []);

  const onCameraScan = useCallback((decodedText: string) => {
    void handleJoin(decodedText, "camera");
  }, [handleJoin]);

  const detectedCodeLabel = useMemo(() => {
    if (!scanState.code) {
      return null;
    }

    return resolveDisplayCode(scanState.code);
  }, [scanState.code]);

  const submitCode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleJoin(manualCode, "manual");
  };

  return (
    <>
      <ScreenOverlayLoader
        visible={isJoining}
        title="Joining card"
        description="Please wait while we confirm your membership..."
      />
      <StatusPopup
        open={popup.open}
        variant={popup.variant}
        title={popup.title}
        subtitle={popup.subtitle}
        onConfirm={() => {
          setPopup((previous) => ({
            ...previous,
            open: false,
          }));
        }}
      />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#B9B4C9]/30 bg-[#F7F8FB]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[402px] items-center justify-center px-6 pt-[env(safe-area-inset-top)]">
          <strong className="font-display text-[21px] font-bold tracking-[-0.045em] text-[#322D45]">
            <span>Perkly</span>
            <span className="text-[#68B99B]">Ph</span>
          </strong>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[402px] px-5 pb-[116px] pt-[88px]">
        <section aria-labelledby="scan-heading">
          <div className="px-1">
            <h1
              id="scan-heading"
              className="font-display max-w-[330px] text-[27px] font-semibold leading-[1.16] tracking-[-0.035em] text-[#322D45]"
            >
              Scan to Join or Add Stamp
            </h1>
            <p className="mt-2 text-[15px] leading-6 text-[#746E86]">
              Point your camera at a business QR code.
            </p>
          </div>

          <div
            className="camera-surface relative mt-5 h-[48vh] min-h-[382px] max-h-[454px] overflow-hidden rounded-[20px] bg-[#322D45] shadow-[0_20px_42px_rgba(50,45,69,0.16)]"
            aria-label="Camera scanning area"
          >
            <QrCameraView onScan={onCameraScan} />
            <div className="pointer-events-none absolute inset-0 bg-[#322D45]/46" aria-hidden="true" />
            <div
              className="pointer-events-none absolute -left-12 top-10 h-52 w-52 rounded-full bg-[#9FE0C7]/7 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-[#E4DFF5]/10 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-8 top-7 flex items-center justify-between"
              aria-hidden="true"
            >
              <span className="font-mono text-[10px] tracking-[0.14em] text-white/42">
                QR SCANNER
              </span>
              <span className="h-2 w-2 rounded-full bg-[#9FE0C7] shadow-[0_0_12px_rgba(159,224,199,0.8)]" />
            </div>

            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[214px] w-[214px] -translate-x-1/2 -translate-y-1/2"
              aria-hidden="true"
            >
              <span className="absolute left-0 top-0 h-12 w-12 rounded-tl-[18px] border-l-[4px] border-t-[4px] border-[#9FE0C7]" />
              <span className="absolute right-0 top-0 h-12 w-12 rounded-tr-[18px] border-r-[4px] border-t-[4px] border-[#9FE0C7]" />
              <span className="absolute bottom-0 left-0 h-12 w-12 rounded-bl-[18px] border-b-[4px] border-l-[4px] border-[#9FE0C7]" />
              <span className="absolute bottom-0 right-0 h-12 w-12 rounded-br-[18px] border-b-[4px] border-r-[4px] border-[#9FE0C7]" />
              <span className="absolute left-4 right-4 top-1/2 h-px animate-pulse bg-[#9FE0C7]/75 shadow-[0_0_12px_2px_rgba(159,224,199,0.35)]" />
            </div>

            <p className="pointer-events-none absolute inset-x-6 bottom-7 text-center text-[12px] font-medium tracking-[0.02em] text-white/60">
              Hold steady - we will scan automatically
            </p>
          </div>

          {!showCodeEntry ? (
            <button
              type="button"
              onClick={() => setShowCodeEntry(true)}
              className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-full border border-white/60 bg-[#E4DFF5] px-6 text-[15px] font-medium text-[#322D45] shadow-[0_7px_18px_rgba(50,45,69,0.10)] transition hover:bg-[#DCD5F1] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#68B99B] active:scale-[0.985]"
              aria-expanded="false"
            >
              <Keyboard className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              <span>Enter code instead</span>
            </button>
          ) : (
            <form
              className="mt-5 rounded-[20px] border border-[#B9B4C9]/55 bg-[#E4DFF5] p-2 shadow-[0_7px_18px_rgba(50,45,69,0.10)]"
              onSubmit={submitCode}
            >
              <label className="sr-only" htmlFor="business-code">
                Business code
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCodeEntry(false)}
                  disabled={isJoining}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#625C74] transition hover:bg-white/50 focus-visible:outline-2 focus-visible:outline-[#68B99B]"
                  aria-label="Close code entry"
                >
                  <X className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                </button>
                <input
                  id="business-code"
                  autoFocus
                  value={manualCode}
                  onChange={(event) => setManualCode(event.target.value.toUpperCase())}
                  disabled={isJoining}
                  className="h-11 min-w-0 flex-1 rounded-full border border-[#B9B4C9]/60 bg-white px-4 font-mono text-sm uppercase tracking-[0.06em] text-[#322D45] outline-none placeholder:text-[#9B95A9] focus:border-[#68B99B] focus:ring-2 focus:ring-[#9FE0C7]/35"
                  placeholder="KAPE-1234"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={isJoining}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#9FE0C7] text-[#322D45] transition hover:bg-[#8DD4B8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#322D45] active:scale-95"
                  aria-label="Submit business code"
                >
                  <ArrowRight className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                </button>
              </div>
            </form>
          )}
          <p className="mt-3 text-center font-mono text-[12px] tracking-[0.04em] text-[#8A8498]">
            e.g. KAPE-1234
          </p>

          {detectedCodeLabel ? (
            <p className="mt-3 text-center text-[12px] font-medium tracking-[0.03em] text-[#5E586F]">
              {scanState.source === "camera" ? "Detected QR:" : "Entered code:"}{" "}
              <span className="font-mono uppercase text-[#322D45]">{detectedCodeLabel}</span>
            </p>
          ) : null}
        </section>
      </main>
    </>
  );
}
