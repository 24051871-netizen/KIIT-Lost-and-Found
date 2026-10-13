"use client";

import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CheckCircle2, AlertTriangle, KeyRound, Loader2, RefreshCw } from "lucide-react";

interface QrScannerProps {
  onScanSuccess: (token: string) => void;
}

export default function QrScanner({ onScanSuccess }: QrScannerProps) {
  const [manualToken, setManualToken] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanner = async () => {
    setCameraError(null);
    try {
      const scanner = new Html5Qrcode("qr-reader-container");
      html5QrCodeRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          scanner.stop().then(() => {
            setCameraActive(false);
            onScanSuccess(decodedText);
          });
        },
        () => {
          // ignore transient frame decode misses
        }
      );

      setCameraActive(true);
    } catch (err: any) {
      console.warn("Camera start failed:", err);
      setCameraError(
        "Camera access unavailable or blocked. Please paste the QR token manually below."
      );
      setCameraActive(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      await html5QrCodeRef.current.stop();
      setCameraActive(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    onScanSuccess(manualToken.trim());
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="h-5 w-5 text-kiit-600" />
            Live Handover Camera Scanner
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hold the claimant&apos;s digital QR code in front of the lens to verify the handover.
          </p>
        </div>

        <div>
          {cameraActive ? (
            <button
              onClick={stopScanner}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            >
              Stop Camera
            </button>
          ) : (
            <button
              onClick={startScanner}
              className="inline-flex items-center gap-1.5 rounded-xl bg-kiit-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-kiit-700 transition-colors"
            >
              <Camera className="h-4 w-4" />
              Start Camera Scanner
            </button>
          )}
        </div>
      </div>

      {/* Camera Video Viewport */}
      <div className="relative min-h-[260px] w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
        <div id="qr-reader-container" className="w-full max-w-sm" />

        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 text-slate-300 space-y-2">
            <Camera className="h-10 w-10 text-slate-500" />
            <p className="text-sm font-semibold">Camera is currently inactive</p>
            <p className="text-xs text-slate-400 max-w-xs">
              Click &quot;Start Camera Scanner&quot; above or enter the verification token manually below.
            </p>
          </div>
        )}
      </div>

      {cameraError && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Manual Token Verification (Examiner & Desktop friendly) */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <KeyRound className="h-4 w-4 text-kiit-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Manual Token Verification / Quick Test
          </h4>
        </div>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Paste token, e.g. DEMO_QR_TOKEN_CAMPUS6_CHARGER or KIIT-HANDOVER.ey..."
            className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-kiit-700 dark:hover:bg-kiit-600 shrink-0"
          >
            Verify Handover &rarr;
          </button>
        </form>
      </div>
    </div>
  );
}
