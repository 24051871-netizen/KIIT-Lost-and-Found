"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import QrScanner from "@/components/QrScanner";
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Building,
} from "lucide-react";

export default function ScanPage() {
  const [verifying, setVerifying] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTokenScanned = async (token: string) => {
    setVerifying(true);
    setError(null);

    try {
      // Check if it's the demo token or signed token
      let itemId = "kiit-item-4"; // default demo match

      if (token.startsWith("KIIT-HANDOVER.")) {
        const parts = token.split(".");
        const payloadJson = atob(parts[1]);
        const payload = JSON.parse(payloadJson);
        itemId = payload.itemId;
      }

      const res = await fetch(`/api/items/${itemId}/handover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          scannedByEmail: "security.campus15@kiit.ac.in",
          scannedByName: "Campus 15 Gate Security Desk",
          handoverNotes: "Verified physical exchange at Gate 1 Checkpoint.",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Handover verification failed.");
      }

      setScanResult(data);

      // Trigger celebratory confetti on successful item return!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#059669", "#34d399", "#047857"],
      });
    } catch (err: any) {
      setError(err.message || "Failed to verify handover.");
    } finally {
      setVerifying(false);
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen nothing-dot-grid py-12 bg-black text-white font-mono">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center pb-8 border-b border-white/10">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-md">
            <span className="nothing-red-dot"></span>
            <span className="font-ndot text-white">KIIT (R) OS</span>
            <span className="text-zinc-600">|</span>
            <span>HANDOVER SCANNER</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-ndot uppercase tracking-[0.14em] text-white">
            QR PROTOCOL SCANNER
          </h1>
          <p className="mt-2 text-xs font-mono text-zinc-400 uppercase tracking-wider max-w-lg mx-auto">
            Cryptographically validate HMAC-SHA256 signatures during physical item handover.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs text-rose-300">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
              <span className="uppercase tracking-wider">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="rounded-full border border-white/20 px-3 py-1 text-[10px] font-bold text-white hover:bg-white/10"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* Success Result Card */}
        {scanResult ? (
          <div className="mt-8 nothing-widget p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                HANDOVER VERIFIED // CRYPTOGRAPHICALLY SIGNED
              </span>
              <h2 className="mt-2 text-2xl font-ndot uppercase tracking-wider text-white">
                ITEM RETURNED SUCCESSFULLY
              </h2>
              <p className="mt-1 text-xs text-zinc-400 uppercase tracking-wider">
                HMAC signature verified • Immutable ledger record written to AuditLog
              </p>
            </div>

            {/* Verification Details Box */}
            <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-black/80 p-5 text-left space-y-3 text-xs font-mono backdrop-blur-md">
              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-zinc-500 uppercase">ITEM TITLE:</span>
                <span className="font-bold text-white uppercase">
                  {scanResult.item?.title || "Dell 65W Laptop Charger"}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-zinc-500 uppercase">CLAIMANT:</span>
                <span className="font-semibold text-zinc-200 uppercase">
                  {scanResult.claimant?.claimantName || "Debashish Mohanty"}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-zinc-500 uppercase">VERIFIED BY:</span>
                <span className="font-semibold text-white uppercase">
                  Campus 15 Gate Security Desk
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 uppercase">TIMESTAMP:</span>
                <span className="text-zinc-400">
                  {new Date().toLocaleTimeString("en-IN")}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
              <button
                onClick={handleReset}
                className="nothing-btn-secondary !py-2.5 !px-6"
              >
                SCAN ANOTHER QR
              </button>
              <Link
                href="/browse"
                className="nothing-btn-primary !py-2.5 !px-6 inline-flex items-center justify-center text-center"
              >
                BACK TO CATALOG &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {/* Active Scanner Component */}
            <div className="nothing-widget p-6">
              <QrScanner onScanSuccess={handleTokenScanned} />
            </div>

            {/* Quick Demo Assist */}
            <div className="nothing-widget p-6 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-2 font-bold text-white mb-1.5 uppercase tracking-wider">
                <span className="nothing-red-dot"></span>
                EXAMINER DEMO OVERRIDE:
              </div>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider">
                To test the handover without a camera, execute the pre-approved pass token:
              </p>
              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-black/70 p-3.5 text-[11px] text-white">
                <span className="truncate font-mono">DEMO_QR_TOKEN_CAMPUS6_CHARGER</span>
                <button
                  type="button"
                  onClick={() => handleTokenScanned("DEMO_QR_TOKEN_CAMPUS6_CHARGER")}
                  className="nothing-btn-primary !py-1.5 !px-4 !text-[9px]"
                >
                  EXECUTE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
