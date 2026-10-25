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
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#10b981", "#34d399", "#06b6d4", "#3b82f6"],
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
    <div className="min-h-screen cyber-grid py-14 bg-[#06070a] text-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono font-medium text-emerald-300 backdrop-blur-xl">
            <span className="live-beacon"></span>
            <span>CHECKPOINT VERIFICATION ENGINE</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            QR Handover Scanner
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Cryptographically validate HMAC-SHA256 signatures during physical item handover at campus safe zones.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs text-rose-300">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Success Result Card */}
        {scanResult ? (
          <div className="mt-8 glass-card p-8 sm:p-10 text-center space-y-6 border-emerald-500/40 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                Handover Verified // Cryptographically Signed
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
                Item Returned Successfully
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                HMAC signature verified • Immutable ledger record written to AuditLog
              </p>
            </div>

            {/* Verification Details Box */}
            <div className="mx-auto max-w-md rounded-2xl border border-white/[0.08] bg-[#090c14] p-5 text-left space-y-3 text-xs backdrop-blur-md">
              <div className="flex justify-between border-b border-white/[0.08] pb-2.5">
                <span className="text-zinc-500 font-medium">Item Title:</span>
                <span className="font-semibold text-white">
                  {scanResult.item?.title || "Dell 65W Laptop Charger"}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/[0.08] pb-2.5">
                <span className="text-zinc-500 font-medium">Claimant:</span>
                <span className="font-semibold text-zinc-200">
                  {scanResult.claimant?.claimantName || "Debashish Mohanty"}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/[0.08] pb-2.5">
                <span className="text-zinc-500 font-medium">Verified By:</span>
                <span className="font-semibold text-emerald-400">
                  Campus 15 Gate Security Desk
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Timestamp:</span>
                <span className="text-zinc-400 font-mono">
                  {new Date().toLocaleTimeString("en-IN")}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
              <button
                onClick={handleReset}
                className="btn-secondary !py-2.5 !px-6"
              >
                Scan Another QR
              </button>
              <Link
                href="/browse"
                className="btn-emerald !py-2.5 !px-6 inline-flex items-center justify-center text-center"
              >
                Back to Catalog &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {/* Active Scanner Component */}
            <div className="glass-card p-6">
              <QrScanner onScanSuccess={handleTokenScanned} />
            </div>

            {/* Quick Demo Assist */}
            <div className="glass-card p-6 text-xs text-zinc-400">
              <div className="flex items-center gap-2 font-semibold text-white mb-1.5">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Examiner Demo Override:</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                To test the handover without a mobile camera, execute the pre-approved pass token:
              </p>
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#090c14] p-3 text-xs text-white">
                <span className="truncate font-mono text-zinc-300">DEMO_QR_TOKEN_CAMPUS6_CHARGER</span>
                <button
                  type="button"
                  onClick={() => handleTokenScanned("DEMO_QR_TOKEN_CAMPUS6_CHARGER")}
                  className="btn-emerald !py-1.5 !px-4 !text-xs"
                >
                  Execute
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
