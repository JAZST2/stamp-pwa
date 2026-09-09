"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

type QrCameraViewProps = {
  onScan: (decodedText: string) => void;
};

const SCAN_DEBOUNCE_MS = 1500;
// Starting is deferred by a tick so a mount/cleanup/mount pair (React Strict
// Mode in development) cancels the first attempt before it opens a stream and
// appends a second <video> to the same container.
const START_DELAY_MS = 50;

async function resolveCameraConfig(): Promise<string | { facingMode: string }> {
  try {
    const cameras = await Html5Qrcode.getCameras();
    if (!cameras.length) {
      return { facingMode: "user" };
    }

    const rearCamera = cameras.find((camera) =>
      /back|rear|environment|world/i.test(camera.label),
    );
    if (rearCamera) {
      return rearCamera.id;
    }

    return cameras[0].id;
  } catch {
    return { facingMode: "user" };
  }
}

export function QrCameraView({ onScan }: QrCameraViewProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const lastScanAtRef = useRef(0);
  const onScanRef = useRef(onScan);
  const elementId = useId().replace(/[:]/g, "");

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    let isCancelled = false;
    let activeScanner: Html5Qrcode | null = null;

    // Only stops the passed instance: Html5Qrcode.clear() empties the whole
    // container, which would also remove a newer instance's video.
    const stopScanner = async (scanner: Html5Qrcode) => {
      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }
      } catch {
        // Best-effort cleanup only.
      }
    };

    const scanConfig = {
      fps: 12,
      qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
        const size = Math.max(160, Math.floor(minEdge * 0.68));
        return { width: size, height: size };
      },
    };

    const startTimeout = window.setTimeout(() => {
      void (async () => {
        const container = document.getElementById(elementId);

        if (isCancelled || !container) {
          return;
        }

        container.innerHTML = "";

        const scanner = new Html5Qrcode(elementId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });

        activeScanner = scanner;

        const preferredCamera = await resolveCameraConfig();
        const cameraAttempts: Array<string | { facingMode: string }> = [
          preferredCamera,
          { facingMode: "user" },
          { facingMode: "environment" },
        ];

        let started = false;
        for (const camera of cameraAttempts) {
          if (isCancelled) {
            return;
          }

          try {
            await scanner.start(
              camera,
              scanConfig,
              (decodedText) => {
                const now = Date.now();
                if (now - lastScanAtRef.current < SCAN_DEBOUNCE_MS) {
                  return;
                }

                lastScanAtRef.current = now;
                onScanRef.current(decodedText);
              },
              () => {
                // Ignored on purpose: frequent "no code found" signal.
              },
            );
            started = true;
            break;
          } catch {
            await stopScanner(scanner);
          }
        }

        if (isCancelled) {
          await stopScanner(scanner);
          return;
        }

        if (!started) {
          setCameraError(
            "Unable to access camera. Please allow camera permission to scan.",
          );
          return;
        }

        setHasStarted(true);
        setCameraError(null);
      })();
    }, START_DELAY_MS);

    return () => {
      isCancelled = true;
      window.clearTimeout(startTimeout);

      if (activeScanner) {
        void stopScanner(activeScanner);
      }
    };
  }, [elementId]);

  return (
    <>
      <div
        id={elementId}
        className="h-full w-full [&_canvas]:hidden [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
      />
      {!hasStarted && !cameraError ? (
        <p className="absolute inset-x-6 top-1/2 z-10 mx-auto w-fit -translate-y-1/2 rounded-full bg-[#322D45]/75 px-3.5 py-1.5 text-center text-[12px] font-medium tracking-[0.02em] text-white/85">
          Initializing camera...
        </p>
      ) : null}
      {cameraError ? (
        <p className="absolute inset-x-6 top-1/2 z-10 mx-auto w-fit -translate-y-1/2 rounded-2xl bg-[#322D45]/85 px-3.5 py-2 text-center text-[12px] font-medium leading-5 tracking-[0.02em] text-[#FFD6D6]">
          {cameraError}
        </p>
      ) : null}
    </>
  );
}
