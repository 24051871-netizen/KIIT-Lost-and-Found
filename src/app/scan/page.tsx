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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 bg-black text-white font-mono">
      {/* Page Header */}
      <div className="text-center pb-8 border-b border-white/10">
        <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300">
          <ShieldCheck className="h-3.5 w-3.5 text-white" />
          OFFICIAL CHECKPOINT TELEMETRY ENGINE
        </div>
        <h1 className="mt-4 text-3xl font-extrabold uppercase tracking-[0.18em] text-white">
          QR HANDOVER SCANNER
        </h1>
        <p className="mt-1 text-xs font-mono text-zinc-400 uppercase tracking-wider max-w-lg mx-auto">
          Cryptographically validate HMAC-SHA256 signatures during physical item handover.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-6 flex items-center justify-between border border-rose-500/40 bg-rose-950/40 p-4 text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
            <span className="uppercase tracking-wider">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="border border-white/20 px-2 py-1 text-[10px] font-bold text-white hover:bg-white/10"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Success Result Card */}
      {scanResult ? (
        <div className="mt-8 border border-white/20 bg-[#070707] p-8 text-center shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center border border-white bg-white text-black">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              HANDOVER VERIFIED // CRYPTOGRAPHICALLY SIGNED
            </span>
            <h2 className="mt-2 text-2xl font-extrabold uppercase tracking-wider text-white">
              ITEM RETURNED SUCCESSFULLY
            </h2>
            <p className="mt-1 text-xs text-zinc-400 uppercase tracking-wider">
              HMAC signature verified • Immutable ledger record written to AuditLog
            </p>
          </div>

          {/* Verification Details Box */}
          <div className="mx-auto max-w-md border border-white/10 bg-black p-5 text-left space-y-2.5 text-xs font-mono">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-zinc-500 uppercase">ITEM TITLE:</span>
              <span className="font-bold text-white uppercase">
                {scanResult.item?.title || "Dell 65W Laptop Charger"}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-zinc-500 uppercase">CLAIMANT:</span>
              <span className="font-semibold text-zinc-200 uppercase">
                {scanResult.claimant?.claimantName || "Debashish Mohanty"}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
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
              className="spacex-btn-secondary !py-2.5 !px-5"
            >
              SCAN ANOTHER QR
            </button>
            <Link
              href="/browse"
              className="spacex-btn-primary !py-2.5 !px-5 inline-block text-center"
            >
              BACK TO CATALOG &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {/* Active Scanner Component */}
          <div className="border border-white/10 bg-[#070707] p-4">
            <QrScanner onScanSuccess={handleTokenScanned} />
          </div>

          {/* Quick Demo Assist */}
          <div className="border border-white/10 bg-[#070707] p-4 text-xs text-zinc-400 font-mono">
            <div className="flex items-center gap-2 font-bold text-white mb-1 uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-white" />
              EXAMINER DEMO OVERRIDE:
            </div>
            <p className="text-[11px] text-zinc-400 uppercase tracking-wider">
              To test the handover without a camera, execute the pre-approved pass token:
            </p>
            <div className="mt-3 flex items-center justify-between gap-2 border border-white/20 bg-black p-2.5 text-[11px] text-white">
              <span className="truncate">DEMO_QR_TOKEN_CAMPUS6_CHARGER</span>
              <button
                type="button"
                onClick={() => handleTokenScanned("DEMO_QR_TOKEN_CAMPUS6_CHARGER")}
                className="spacex-btn-primary !py-1 !px-3 !text-[10px]"
              >
                EXECUTE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
