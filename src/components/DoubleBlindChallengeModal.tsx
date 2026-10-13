"use client";

import React, { useState } from "react";
import { Item } from "@/types";
import { ShieldAlert, HelpCircle, CheckCircle2, Loader2, X } from "lucide-react";

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
  const [email, setEmail] = useState(defaultEmail);
  const [name, setName] = useState(defaultName);
  const [rollNumber, setRollNumber] = useState(defaultRoll);
  const [answer, setAnswer] = useState("");
  const [proofDetails, setProofDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError("Please answer the verification challenge question to prove ownership.");
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
          challengeAnswer: answer,
          proofDescription: proofDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit claim.");
      }

      onClaimSuccess(data.message || "Claim submitted successfully!");
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-kiit-600" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Claim Ownership Verification
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="rounded-xl bg-kiit-50/70 p-3.5 border border-kiit-100 dark:bg-kiit-950/30 dark:border-kiit-900">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-4 w-4 text-kiit-700 dark:text-kiit-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-kiit-900 dark:text-kiit-200">
                  Finder&apos;s Secret Challenge Question:
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  &ldquo;{item.secretChallengeQuestion || "Please provide specific identifying marks, stickers, serial number, or contents."}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Your Answer to the Challenge <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="e.g., Red electrical tape, Batman sticker, 402, etc."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-kiit-600 focus:outline-none focus:ring-2 focus:ring-kiit-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Claimant Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                KIIT Roll Number
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="2105128"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              KIIT Email (@kiit.ac.in)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Additional Ownership Evidence (Optional)
            </label>
            <textarea
              rows={2}
              value={proofDetails}
              onChange={(e) => setProofDetails(e.target.value)}
              placeholder="e.g. Purchase bill reference, exact time misplaced, etc."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

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
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Submit Claim
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
