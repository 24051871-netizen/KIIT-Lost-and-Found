"use client";

import React, { useState } from "react";
import { Item, VerificationProofType } from "@/types";
import {
  ShieldCheck,
  HelpCircle,
  Loader2,
  X,
  Cpu,
  Receipt,
  Lock,
  AlertTriangle,
  Fingerprint,
} from "lucide-react";

interface DoubleBlindModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onClaimSuccess: (message: string) => void;
  defaultEmail?: string;
  defaultName?: string;
  defaultRoll?: string;
}

export default function DoubleBlindChallengeModal({
  item,
  isOpen,
  onClose,
  onClaimSuccess,
  defaultEmail = "2105128@kiit.ac.in",
  defaultName = "Aman Sharma",
  defaultRoll = "2105128",
}: DoubleBlindModalProps) {
  const isIdCard = item.category === "KIIT_ID_CARD";
  const isElectronics = item.category === "ELECTRONICS";

  const [proofType, setProofType] = useState<VerificationProofType>(
    isIdCard
      ? "INSTITUTIONAL_ROLL_MATCH"
      : isElectronics
      ? "HARDWARE_SERIAL_HASH"
      : "DOUBLE_BLIND_CHALLENGE"
  );

  const [email, setEmail] = useState(defaultEmail);
  const [name, setName] = useState(defaultName);
  const [rollNumber, setRollNumber] = useState(defaultRoll);
  const [answer, setAnswer] = useState("");
  const [hardwareSerial, setHardwareSerial] = useState("");
  const [proofDocUrl, setProofDocUrl] = useState("");
  const [physicalUnlockConfirmed, setPhysicalUnlockConfirmed] = useState(false);
  const [proofDetails, setProofDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (proofType === "DOUBLE_BLIND_CHALLENGE" && !answer.trim()) {
      setError("Please answer the verification challenge question to prove ownership.");
      return;
    }

    if (proofType === "HARDWARE_SERIAL_HASH" && !hardwareSerial.trim()) {
      setError("Please enter the device Hardware Serial Number or IMEI from your invoice/box.");
      return;
    }

    if (isElectronics && !physicalUnlockConfirmed) {
      setError("You must acknowledge that you can physically unlock the device at the Safe Zone.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/items/${item._id}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimantEmail: email,
          claimantName: name,
          claimantRollNumber: rollNumber,
          proofType,
          challengeAnswer: answer || hardwareSerial || "Institutional ID Match",
          hardwareSerialSubmitted: hardwareSerial || undefined,
          proofDocumentUrl: proofDocUrl || undefined,
          physicalUnlockConfirmed,
          proofDescription: proofDetails,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit claim.");
      }

      onClaimSuccess(data.message || "Claim verified and submitted successfully!");
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl aura-card p-6 md:p-8 text-white relative shadow-2xl border border-white/10 my-8">
        {/* Glow ambient background pill */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="aura-dot-live" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                Ownership Verification Protocol
              </h3>
              <p className="text-xs text-zinc-400">
                Zero-Trust Multi-Factor Engine • KIIT Campus Security
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Anti-fraud banner */}
        <div className="mt-4 rounded-xl bg-amber-500/10 p-3.5 border border-amber-500/25 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300 font-semibold">Anti-Fraud Protection:</strong> Claims are cryptographically bound to your institutional credentials. Fraudulent campus claims are permanently logged into the immutable audit ledger.
          </p>
        </div>

        {error && (
          <div className="mt-3 rounded-xl bg-rose-500/10 p-3.5 text-xs text-rose-300 border border-rose-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Select Proof Vector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Select Proof Vector (Verification Factor):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {isIdCard && (
                <button
                  type="button"
                  onClick={() => setProofType("INSTITUTIONAL_ROLL_MATCH")}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    proofType === "INSTITUTIONAL_ROLL_MATCH"
                      ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-semibold shadow-sm"
                      : "border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06]"
                  }`}
                >
                  <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Roll Identity Match</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setProofType("HARDWARE_SERIAL_HASH")}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  proofType === "HARDWARE_SERIAL_HASH"
                    ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-semibold shadow-sm"
                    : "border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06]"
                }`}
              >
                <Cpu className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Serial / IMEI Hash</span>
              </button>

              <button
                type="button"
                onClick={() => setProofType("DOUBLE_BLIND_CHALLENGE")}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  proofType === "DOUBLE_BLIND_CHALLENGE"
                    ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-semibold shadow-sm"
                    : "border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06]"
                }`}
              >
                <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Concealed Feature</span>
              </button>

              <button
                type="button"
                onClick={() => setProofType("PRE_LOSS_INVOICE_PROOF")}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  proofType === "PRE_LOSS_INVOICE_PROOF"
                    ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-semibold shadow-sm"
                    : "border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06]"
                }`}
              >
                <Receipt className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Purchase Invoice</span>
              </button>
            </div>
          </div>

          {/* Conditional Vector Inputs */}
          {proofType === "HARDWARE_SERIAL_HASH" && (
            <div className="rounded-xl aura-surface p-4 border border-white/10 space-y-2">
              <label className="block text-xs font-semibold text-zinc-200">
                Hardware Serial Number / IMEI (From Box or Bill):
              </label>
              <input
                type="text"
                required
                value={hardwareSerial}
                onChange={(e) => setHardwareSerial(e.target.value)}
                placeholder="e.g. NHQ5NSI002... or IMEI last 6 digits"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-emerald-500/60 focus:outline-none font-mono"
              />
              <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓ Zero-Knowledge:</span> Verified via SHA-256 hash matching intake records.
              </p>
            </div>
          )}

          {proofType === "DOUBLE_BLIND_CHALLENGE" && (
            <div className="rounded-xl aura-surface p-4 border border-white/10 space-y-2">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-zinc-400">
                    Finder&apos;s Concealed Challenge Question:
                  </p>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    &ldquo;{item.secretChallengeQuestion || "What specific concealed identifying mark, sticker, or engraving is on this item?"}&rdquo;
                  </p>
                </div>
              </div>
              <input
                type="text"
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your exact identifying answer..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-emerald-500/60 focus:outline-none"
              />
            </div>
          )}

          {proofType === "PRE_LOSS_INVOICE_PROOF" && (
            <div className="rounded-xl aura-surface p-4 border border-white/10 space-y-2">
              <label className="block text-xs font-semibold text-zinc-200">
                Purchase Invoice URL or Pre-Loss Photo Link:
              </label>
              <input
                type="url"
                value={proofDocUrl}
                onChange={(e) => setProofDocUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/... or Google Drive link"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-emerald-500/60 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-400">
                Cross-referenced by Campus Security In-Charge during physical handover.
              </p>
            </div>
          )}

          {proofType === "INSTITUTIONAL_ROLL_MATCH" && (
            <div className="rounded-xl bg-emerald-500/10 p-3.5 border border-emerald-500/25 flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-200 leading-relaxed">
                <strong>Zero-Trust Identity Match:</strong> This Smart ID Card is cryptographically locked to the student roll number. Your authenticated institutional email must strictly match.
              </p>
            </div>
          )}

          {/* Physical Device Unlock Acknowledgement */}
          {isElectronics && (
            <div className="rounded-xl border border-white/10 p-3.5 bg-white/[0.02]">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={physicalUnlockConfirmed}
                  onChange={(e) => setPhysicalUnlockConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 text-emerald-500 focus:ring-emerald-400 bg-black/40"
                />
                <span className="text-xs text-zinc-300 leading-snug">
                  <strong>Safe Zone Physical Unlock Mandate:</strong> I agree to physically unlock this gadget (PIN / Pattern / Biometrics) before campus officers release physical custody.
                </span>
              </label>
            </div>
          )}

          {/* Claimant Profile Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Claimant Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 px-3 py-2 text-xs bg-black/40 text-white focus:border-emerald-500/60 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Institutional Roll Number
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full rounded-xl border border-white/10 px-3 py-2 text-xs bg-black/40 text-white font-mono focus:border-emerald-500/60 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Verified Campus Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 px-3 py-2 text-xs bg-black/40 text-white font-mono focus:border-emerald-500/60 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="aura-btn-secondary !py-2.5 !px-5 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="aura-btn-primary !py-2.5 !px-6 text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Evaluating...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Submit Proof Vector
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}