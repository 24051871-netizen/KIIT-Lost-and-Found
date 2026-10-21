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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-kiit-600" />
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Multi-Factor Ownership Verification Protocol
              </h3>
              <p className="text-[11px] text-slate-500">
                Zero-Trust Verification Engine • KIIT Security Standard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Security Alert Banner */}
        <div className="mt-3 rounded-xl bg-amber-50 p-3 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900 flex items-start gap-2.5">
          <AlertOctagon className="h-4 w-4 text-amber-700 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
            <strong>Anti-Fraud Warning:</strong> Claims are cryptographically bound to your KIIT Roll Number. False claims on campus property are logged in the immutable Audit Ledger and referred to the Proctorial Board under University Disciplinary Statute 14.
          </p>
        </div>

        {error && (
          <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Select Proof Vector */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1.5">
              Select Proof Vector (Verification Factor):
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {isIdCard ? (
                <button
                  type="button"
                  onClick={() => setProofType("INSTITUTIONAL_ROLL_MATCH")}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    proofType === "INSTITUTIONAL_ROLL_MATCH"
                      ? "border-kiit-600 bg-kiit-50 text-kiit-900 font-bold dark:bg-kiit-950/50 dark:text-kiit-300"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <Lock className="h-4 w-4 text-kiit-600" />
                  <span>Roll Number Identity Match</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setProofType("HARDWARE_SERIAL_HASH")}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  proofType === "HARDWARE_SERIAL_HASH"
                    ? "border-kiit-600 bg-kiit-50 text-kiit-900 font-bold dark:bg-kiit-950/50 dark:text-kiit-300"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <Cpu className="h-4 w-4 text-kiit-600" />
                <span>Serial Number / IMEI (Zero-Knowledge)</span>
              </button>

              <button
                type="button"
                onClick={() => setProofType("DOUBLE_BLIND_CHALLENGE")}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  proofType === "DOUBLE_BLIND_CHALLENGE"
                    ? "border-kiit-600 bg-kiit-50 text-kiit-900 font-bold dark:bg-kiit-950/50 dark:text-kiit-300"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <HelpCircle className="h-4 w-4 text-kiit-600" />
                <span>Hidden Feature Challenge</span>
              </button>

              <button
                type="button"
                onClick={() => setProofType("PRE_LOSS_INVOICE_PROOF")}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  proofType === "PRE_LOSS_INVOICE_PROOF"
                    ? "border-kiit-600 bg-kiit-50 text-kiit-900 font-bold dark:bg-kiit-950/50 dark:text-kiit-300"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <Receipt className="h-4 w-4 text-kiit-600" />
                <span>Purchase Bill / Pre-Loss Photo</span>
              </button>
            </div>
          </div>

          {/* Conditional Vector Inputs */}
          {proofType === "HARDWARE_SERIAL_HASH" && (
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 space-y-2">
              <label className="block text-xs font-semibold text-slate-900 dark:text-white">
                Hardware Serial Number / IMEI (From Box or Bill):
              </label>
              <input
                type="text"
                required
                value={hardwareSerial}
                onChange={(e) => setHardwareSerial(e.target.value)}
                placeholder="e.g. NHQ5NSI002..., SN: 84920392, or IMEI last 6 digits"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white font-mono"
              />
              <p className="text-[10px] text-slate-500">
                🔒 <strong>Zero-Knowledge:</strong> The serial number is never displayed publicly. The server computes a SHA-256 cryptographic hash to match against intake records.
              </p>
            </div>
          )}

          {proofType === "DOUBLE_BLIND_CHALLENGE" && (
            <div className="rounded-xl bg-kiit-50/70 p-3.5 border border-kiit-100 dark:bg-kiit-950/30 dark:border-kiit-900 space-y-2">
              <div className="flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-kiit-700 dark:text-kiit-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-kiit-900 dark:text-kiit-200">
                    Finder&apos;s Concealed Challenge Question:
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
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
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          )}

          {proofType === "PRE_LOSS_INVOICE_PROOF" && (
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 space-y-2">
              <label className="block text-xs font-semibold text-slate-900 dark:text-white">
                Purchase Invoice URL or Pre-Loss Photo Link (Cloudinary / Google Drive):
              </label>
              <input
                type="url"
                value={proofDocUrl}
                onChange={(e) => setProofDocUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/... or Google Drive public link"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <p className="text-[10px] text-slate-500">
                Uploaded document will be cross-referenced by the Campus Security In-Charge during physical handover.
              </p>
            </div>
          )}

          {proofType === "INSTITUTIONAL_ROLL_MATCH" && (
            <div className="rounded-xl bg-emerald-50 p-3.5 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                <strong>Zero-Trust Identity Lock:</strong> This Smart ID Card is locked to the official student roll number extracted from the card. Your authenticated institutional email must strictly match this roll number to unlock recovery.
              </p>
            </div>
          )}

          {/* Physical Device Unlock Challenge Acknowledgement (For Electronics) */}
          {isElectronics && (
            <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50 dark:bg-slate-800/40 dark:border-slate-700">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={physicalUnlockConfirmed}
                  onChange={(e) => setPhysicalUnlockConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-kiit-600 focus:ring-kiit-500"
                />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                  <strong>Safe Zone Physical Unlock Mandate:</strong> I acknowledge that for electronic gadgets, I MUST physically unlock this device (PIN / Pattern / Fingerprint / Face ID) in the presence of the Campus Security Officer at Campus 15 Gate or Central Library before physical custody is released.
                </span>
              </label>
            </div>
          )}

          {/* Claimant Profile (Immutable) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                Claimant Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                Institutional Roll Number
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
              Verified Email (@kiit.ac.in)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white font-mono"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-kiit-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-kiit-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Cryptographic Evaluation...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" /> Submit Multi-Factor Claim
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
