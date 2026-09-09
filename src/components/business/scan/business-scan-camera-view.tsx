"use client";

import { QrCameraView } from "@/components/customer/scan-join/qr-camera-view";

type BusinessScanCameraViewProps = {
  onScan: (decodedText: string) => void;
};

export function BusinessScanCameraView({ onScan }: BusinessScanCameraViewProps) {
  return <QrCameraView onScan={onScan} />;
}
