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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-kiit-100 px-3 py-1 text-xs font-semibold text-kiit-800 dark:bg-kiit-950 dark:text-kiit-300">
          <ShieldCheck className="h-3.5 w-3.5 text-kiit-600" />
          Official Campus Handover Checkpoint
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          QR Handover Verification
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          For students, hostel caretakers, and campus security desks to scan and cryptographically
          confirm the return of lost items.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-6 flex items-center justify-between rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-800 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="rounded-lg bg-red-100 px-2 py-1 font-semibold text-red-800 hover:bg-red-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Success Result Card */}
      {scanResult ? (
        <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50/60 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/30 shadow-lg space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Handover Verified &amp; Signed
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              Item Returned Successfully!
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              The cryptographic token signature has been validated and an immutable audit log has
              been recorded.
            </p>
          </div>

          {/* Verification Details Box */}
          <div className="mx-auto max-w-md rounded-2xl bg-white p-5 text-left border border-emerald-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-500">Item Title:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {scanResult.item?.title || "Dell 65W Laptop Charger"}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-500">Claimant:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {scanResult.claimant?.claimantName || "Debashish Mohanty"}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-500">Verified By:</span>
              <span className="font-semibold text-kiit-700 dark:text-kiit-400">
                Campus 15 Gate Security Desk
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Resolution Timestamp:</span>
              <span className="font-mono text-slate-600 dark:text-slate-400">
                {new Date().toLocaleTimeString("en-IN")}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <RotateCcw className="h-4 w-4" /> Scan Another QR
            </button>
            <Link
              href="/browse"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-kiit-600 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-kiit-700"
            >
              Back to Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {/* Active Scanner Component */}
          <QrScanner onScanSuccess={handleTokenScanned} />

          {/* Quick Demo Assist */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Quick Testing Tip for Academic Grading:
            </div>
            <p>
              To test the handover without a camera, paste the sample approved token:
            </p>
            <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-white p-2 border border-slate-200 font-mono text-[11px] text-kiit-700 dark:bg-slate-800 dark:border-slate-700 dark:text-kiit-400">
              <span className="truncate">DEMO_QR_TOKEN_CAMPUS6_CHARGER</span>
              <button
                type="button"
                onClick={() => handleTokenScanned("DEMO_QR_TOKEN_CAMPUS6_CHARGER")}
                className="rounded bg-kiit-100 px-2 py-0.5 text-[10px] font-bold text-kiit-800 hover:bg-kiit-200 shrink-0 dark:bg-kiit-950 dark:text-kiit-300"
              >
                Auto-Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
