"use client";

import React, { useState } from "react";
import { Item, VerificationProofType } from "@/types";
import {
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  Loader2,
  X,
  Cpu,
  Receipt,
  Smartphone,
  Lock,
  AlertOctagon,
  Sparkles,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-xl glass-card !bg-[#0b0e17]/95 p-6 sm:p-7 text-slate-100 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl border border-emerald-500/30 bg-emerald-950/50 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                Ownership Verification Protocol
              </h3>
              <p className="text-[11px] text-slate-400">
                Zero-Trust Multi-Vector Matching &bull; KIIT Security
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Security Warning Banner */}
        <div className="mt-4 rounded-2xl bg-amber-950/30 p-3.5 border border-amber-500/20 flex items-start gap-3">
          <AlertOctagon className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-200 leading-relaxed">
            <strong>Anti-Fraud Protocol:</strong> Claims are cryptographically bound to your KIIT Roll Number. False claims on campus property are logged in the immutable Audit Ledger and referred to the Proctorial Board under University Disciplinary Statute 14.
          </p>
        </div>

        {error && (
          <div className="mt-3 rounded-2xl bg-rose-950/40 p-3.5 text-xs text-rose-300 border border-rose-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Select Proof Vector */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              Select Verification Proof Vector:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {isIdCard ? (
                <button
                  type="button"
                  onClick={() => setProofType("INSTITUTIONAL_ROLL_MATCH")}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    proofType === "INSTITUTIONAL_ROLL_MATCH"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold shadow-inner"
                      : "border-white/10 bg-[#0d121f] text-slate-300 hover:border-white/20"
                  }`}
                >
                  <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Roll Number Identity Match</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setProofType("HARDWARE_SERIAL_HASH")}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  proofType === "HARDWARE_SERIAL_HASH"
                    ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold shadow-inner"
                    : "border-white/10 bg-[#0d121f] text-slate-300 hover:border-white/20"
                }`}
              >
                <Cpu className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Serial Number / IMEI (ZK Hash)</span>
              </button>

              <button
                type="button"
                onClick={() => setProofType("DOUBLE_BLIND_CHALLENGE")}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  proofType === "DOUBLE_BLIND_CHALLENGE"
                    ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold shadow-inner"
                    : "border-white/10 bg-[#0d121f] text-slate-300 hover:border-white/20"
                }`}
              >
                <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Hidden Feature Challenge</span>
              </button>

              <button
                type="button"
                onClick={() => setProofType("PRE_LOSS_INVOICE_PROOF")}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  proofType === "PRE_LOSS_INVOICE_PROOF"
                    ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold shadow-inner"
                    : "border-white/10 bg-[#0d121f] text-slate-300 hover:border-white/20"
                }`}
              >
                <Receipt className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Purchase Bill / Pre-Loss Photo</span>
              </button>
            </div>
          </div>

          {/* Conditional Vector Inputs */}
          {proofType === "HARDWARE_SERIAL_HASH" && (
            <div className="rounded-2xl bg-white/[0.02] p-4 border border-white/10 space-y-2">
              <label className="block text-xs font-semibold text-slate-200">
                Hardware Serial Number / IMEI (From Box or Bill):
              </label>
              <input
                type="text"
                required
                value={hardwareSerial}
                onChange={(e) => setHardwareSerial(e.target.value)}
                placeholder="e.g. NHQ5NSI002..., SN: 84920392, or IMEI digits"
                className="w-full rounded-xl border border-white/10 bg-[#0a0d16] px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400">
                🔒 <strong>Zero-Knowledge:</strong> Serial number is never displayed publicly. The server computes a SHA-256 cryptographic hash to match against intake records.
              </p>
            </div>
          )}

          {proofType === "DOUBLE_BLIND_CHALLENGE" && (
            <div className="rounded-2xl bg-emerald-950/20 p-4 border border-emerald-500/20 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-emerald-300">
                    Concealed Ownership Challenge:
                  </p>
                  <p className="text-xs font-serif italic text-white mt-0.5">
                    &ldquo;{item.secretChallengeQuestion || "What specific concealed identifying mark, engraving, or sticker is on this item?"}&rdquo;
                  </p>
                </div>
              </div>
              <input
                type="text"
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter the exact answer to prove ownership..."
                className="w-full rounded-xl border border-white/10 bg-[#0a0d16] px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {proofType === "PRE_LOSS_INVOICE_PROOF" && (
            <div className="rounded-2xl bg-white/[0.02] p-4 border border-white/10 space-y-2">
              <label className="block text-xs font-semibold text-slate-200">
                Purchase Invoice URL or Pre-Loss Photo Link:
              </label>
              <input
                type="url"
                value={proofDocUrl}
                onChange={(e) => setProofDocUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/... or Google Drive link"
                className="w-full rounded-xl border border-white/10 bg-[#0a0d16] px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Document will be cross-referenced by the Campus Security Guard during physical handover.
              </p>
            </div>
          )}

          {proofType === "INSTITUTIONAL_ROLL_MATCH" && (
            <div className="rounded-2xl bg-emerald-950/30 p-4 border border-emerald-500/30 flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-200 leading-relaxed">
                <strong>Zero-Trust Identity Lock:</strong> This Smart ID Card is locked to the official student roll number extracted from the card. Your authenticated institutional email must strictly match this roll number to unlock recovery.
              </p>
            </div>
          )}

          {/* Physical Device Unlock Challenge Acknowledgement (For Electronics) */}
          {isElectronics && (
            <div className="rounded-2xl border border-amber-500/20 p-3.5 bg-amber-950/20">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={physicalUnlockConfirmed}
                  onChange={(e) => setPhysicalUnlockConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-[#0a0d16] text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs text-amber-200 leading-snug">
                  <strong>Safe Zone Physical Unlock Mandate:</strong> I acknowledge that for electronic gadgets, I MUST physically unlock this device (PIN / Pattern / Fingerprint / Face ID) in front of the Campus Security Officer at Campus 15 Gate or Central Library before physical custody is released.
                </span>
              </label>
            </div>
          )}

          {/* Claimant Profile (Immutable) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Claimant Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0a0d16] px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Institutional Roll Number
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0a0d16] px-3.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Verified Institutional Email (@kiit.ac.in)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0a0d16] px-3.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary !py-2.5 !px-5 !text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-emerald !py-2.5 !px-6 !text-xs font-semibold flex items-center gap-1.5"
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
