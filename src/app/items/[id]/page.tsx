"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Item, Claim } from "@/types";
import DoubleBlindChallengeModal from "@/components/DoubleBlindChallengeModal";
import QrCodeModal from "@/components/QrCodeModal";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Lock,
  QrCode,
  User,
  ArrowLeft,
  AlertTriangle,
  HelpCircle,
  Building,
  KeyRound,
  FileText,
  Smartphone,
  ShieldAlert,
  Flag,
} from "lucide-react";

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const itemId = resolvedParams.id;
  const { data: session } = useSession();

  const [item, setItem] = useState<Item | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [flagging, setFlagging] = useState(false);
  const [hasFlagged, setHasFlagged] = useState(false);

  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/items/${itemId}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load item.");
      }
      setItem(data.item);
      if (data.claims) {
        setClaims(data.claims);
      }
    } catch (e: any) {
      setError(e.message || "Could not fetch item");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSuccess = (msg: string) => {
    setNotification(msg);
    fetchItemDetails();
  };

  const handleReviewClaim = async (claimId: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch(`/api/items/${itemId}/verify-claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimId,
          action,
          reviewerEmail: session?.user?.email || "finder@kiit.ac.in",
          reviewerName: session?.user?.name || "Item Reporter",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification(data.message);
        fetchItemDetails();
      }
    } catch (err) {
      console.error("Review claim error:", err);
    }
  };

  const handleFlagItem = async () => {
    if (hasFlagged) return;
    if (
      !confirm(
        "Report this listing as suspicious, spam, or fake for campus security review?"
      )
    )
      return;

    try {
      setFlagging(true);
      const res = await fetch(`/api/items/${itemId}/flag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: "SPAM",
          reporterEmail: session?.user?.email || "anonymous_student@kiit.ac.in",
          notes: "Reported via web item detail page.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setHasFlagged(true);
        setNotification(data.message);
        fetchItemDetails();
      }
    } catch (err) {
      console.error("Flag error:", err);
    } finally {
      setFlagging(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-xs text-slate-500">
        Loading item records...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Item Not Found</h2>
        <p className="mt-1 text-xs text-slate-500">{error || "This item record could not be found."}</p>
        <Link
          href="/browse"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-kiit-600 px-4 py-2 text-xs font-semibold text-white"
        >
          &larr; Back to Catalog
        </Link>
      </div>
    );
  }

  const isFound = item.itemType === "FOUND";
  const isReturned = item.status === "RETURNED";
  const isApproved = item.status === "CLAIM_APPROVED";
  const isSensitive = item.category === "KIIT_ID_CARD" || item.category === "WALLET_DOCS";

  const fallbackImage =
    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80";
  const displayImage =
    item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : fallbackImage;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/browse"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-kiit-600 dark:text-slate-400 dark:hover:text-kiit-400"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>
      </div>

      {notification && (
        <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 font-bold">
            &times;
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image & Location Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
            <Image
              src={displayImage}
              alt={item.title}
              fill
              priority
              className={`object-cover ${
                isSensitive && !isReturned ? "filter blur-[6px] select-none pointer-events-none transition-all" : ""
              }`}
            />

            {/* Top badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span
                className={`rounded-lg px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow ${
                  isFound ? "bg-emerald-600" : "bg-rose-600"
                }`}
              >
                {item.itemType}
              </span>

              {isReturned ? (
                <span className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow">
                  <CheckCircle2 className="h-4 w-4" /> Handover Complete
                </span>
              ) : isApproved ? (
                <span className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow">
                  <Clock className="h-4 w-4" /> Awaiting Handover Scan
                </span>
              ) : null}
            </div>

            {isSensitive && !isReturned && (
              <div className="absolute bottom-4 left-4 rounded-xl bg-slate-900/80 px-3 py-1 text-xs text-white backdrop-blur flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                PII Protected (Roll number &amp; photo masked)
              </div>
            )}
          </div>

          {/* Micro-Location & Campus Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-kiit-600" />
              Location on KIIT Campus
            </h3>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Campus Zone:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{item.campusName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Specific Landmark:</span>
                <span className="font-semibold text-kiit-700 dark:text-kiit-400">
                  {item.specificLocation}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Date Logged:</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {new Date(item.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Zero-Trust Security Protocol Card (ZK-MOP) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Zero-Trust Ownership Protocol (ZK-MOP)
              </h3>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase tracking-wider">
                Active Defense
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              To eliminate false ownership claims and subjective description guessing, this item is protected by multi-factor cryptographic and physical verification:
            </p>

            <div className="space-y-2 text-xs">
              {/* Tier 1: Roll Lock */}
              <div
                className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  item.category === "KIIT_ID_CARD"
                    ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20"
                    : "border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-850 opacity-70"
                }`}
              >
                <div className="mt-0.5 rounded-md bg-emerald-100 p-1 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Tier 1: Institutional Roll Lock
                    {item.category === "KIIT_ID_CARD" && (
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        (Active &amp; Enforced)
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Restricted strictly to the student roll holder. Mismatched KIIT emails are rejected at API level.
                  </p>
                </div>
              </div>

              {/* Tier 2: SHA-256 Serial Hash */}
              <div
                className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  item.hardwareIdentifierHash
                    ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20"
                    : "border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-850 opacity-70"
                }`}
              >
                <div className="mt-0.5 rounded-md bg-kiit-100 p-1 text-kiit-700 dark:bg-kiit-900/60 dark:text-kiit-300">
                  <KeyRound className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Tier 2: SHA-256 Hardware Serial Matching
                    {item.hardwareIdentifierHash && (
                      <span className="text-[10px] font-semibold text-kiit-600 dark:text-kiit-400">
                        (Hash Active)
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Deterministic zero-knowledge verification against device Serial or IMEI without exposing numbers publicly.
                  </p>
                </div>
              </div>

              {/* Tier 3: Pre-Loss Evidence */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-850 opacity-80 flex items-start gap-2.5">
                <div className="mt-0.5 rounded-md bg-amber-100 p-1 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Tier 3: Pre-Loss Invoice / Documentation
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports claimant retail invoices, purchase receipts, or pre-loss timestamped photos.
                  </p>
                </div>
              </div>

              {/* Tier 4: Safe Zone Physical Unlock */}
              <div
                className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  item.category === "ELECTRONICS"
                    ? "border-blue-300 bg-blue-50/60 dark:border-blue-900 dark:bg-blue-950/20"
                    : "border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-850 opacity-70"
                }`}
              >
                <div className="mt-0.5 rounded-md bg-blue-100 p-1 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  <Smartphone className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Tier 4: Physical Unlock Challenge
                    {item.category === "ELECTRONICS" && (
                      <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                        (Safe Zone Mandate)
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Claimant must physically unlock device with passcode/biometric in front of the Campus Safe Zone Guard.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-900 dark:text-amber-300 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
              <span>
                <strong>Anti-Brute-Force:</strong> 3 failed attempts lock claimant account and initiate academic disciplinary review under KIIT Statute 14.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Actions & Double-Blind Verification (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-kiit-700 dark:text-kiit-400">
                {item.category.replace(/_/g, " ")}
              </span>
              <h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                {item.title}
              </h1>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {item.description}
            </p>

            {/* Reporter Meta */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-kiit-100 text-kiit-800 font-bold text-xs dark:bg-kiit-950 dark:text-kiit-300">
                {item.contactName[0]}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">{item.contactName}</p>
                <p className="text-[11px] text-slate-500">
                  {item.reporterHostel ? `Hostel: ${item.reporterHostel}` : "KIIT Member"} •{" "}
                  {item.contactEmail}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              {isReturned ? (
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-center dark:bg-blue-950/30 dark:border-blue-900">
                  <CheckCircle2 className="mx-auto h-7 w-7 text-blue-600 dark:text-blue-400" />
                  <p className="mt-2 text-xs font-bold text-blue-900 dark:text-blue-200">
                    Handover Resolved &amp; Verified
                  </p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">
                    Returned via QR code verification at campus checkpoint.
                  </p>
                </div>
              ) : isApproved ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setQrModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-kiit-600 py-3 text-xs font-bold text-white shadow-md shadow-kiit-600/30 hover:bg-kiit-700 transition-all"
                  >
                    <QrCode className="h-4 w-4" />
                    View Handover QR Pass
                  </button>
                  <Link
                    href={`/scan`}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    Scan QR to Complete Handover &rarr;
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setClaimModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-kiit-600 py-3 text-xs font-bold text-white shadow-md shadow-kiit-600/30 hover:bg-kiit-700 transition-all"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Claim This Item (Prove Ownership)
                </button>
              )}

              {/* Community Moderation: Flag Suspicious / Spam Listing */}
              {!isReturned && (
                <button
                  type="button"
                  onClick={handleFlagItem}
                  disabled={flagging || hasFlagged}
                  className="w-full flex items-center justify-center gap-1.5 pt-2 text-[11px] font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                >
                  <Flag className="h-3.5 w-3.5" />
                  {hasFlagged
                    ? "Reported for Security Review"
                    : item.flagCount && item.flagCount > 0
                    ? `Reported Suspicious (${item.flagCount} flags)`
                    : "Flag as Suspicious or Spam Listing"}
                </button>
              )}
            </div>
          </div>

          {/* Double-Blind Challenge Info Card */}
          {item.secretChallengeQuestion && !isReturned && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-900/60 dark:bg-amber-950/20 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200 font-bold text-xs">
                <HelpCircle className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                Ownership Challenge Question
              </div>
              <p className="text-xs text-amber-950 dark:text-amber-300 italic">
                &ldquo;{item.secretChallengeQuestion}&rdquo;
              </p>
              <p className="text-[10px] text-amber-800/80 dark:text-amber-400">
                You must provide the correct answer during the claim step to receive your handover QR pass.
              </p>
            </div>
          )}

          {/* Active Claims Review List (Visible in Demo / Finder mode) */}
          {claims.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Submitted Claims ({claims.length})
              </h4>
              <div className="space-y-2.5">
                {claims.map((claim) => (
                  <div
                    key={claim._id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {claim.claimantName}
                        </span>
                        <p className="text-[10px] text-slate-500">{claim.claimantEmail}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {claim.proofType && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-kiit-50 text-kiit-700 dark:bg-kiit-950 dark:text-kiit-300 border border-kiit-200 dark:border-kiit-900">
                            {claim.proofType === "HARDWARE_SERIAL_HASH"
                              ? "Serial Hash"
                              : claim.proofType === "INSTITUTIONAL_ROLL_MATCH"
                              ? "Roll Match"
                              : claim.proofType === "PHYSICAL_DEVICE_UNLOCK"
                              ? "Unlock Pledged"
                              : claim.proofType === "PRE_LOSS_INVOICE_PROOF"
                              ? "Invoice Proof"
                              : "Double-Blind"}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            claim.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : claim.status === "REJECTED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {claim.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg space-y-1">
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Answer/Input:</span> {claim.challengeAnswer}
                      </div>
                      {claim.hardwareSerialSubmitted && (
                        <div>
                          <span className="font-bold text-slate-700 dark:text-slate-300">Submitted Serial:</span>{" "}
                          <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">
                            {claim.hardwareSerialSubmitted.length > 4
                              ? `••••${claim.hardwareSerialSubmitted.slice(-4)}`
                              : claim.hardwareSerialSubmitted}
                          </span>
                        </div>
                      )}
                      {claim.physicalUnlockConfirmed && (
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Pledged physical unlock at Campus Safe Zone
                        </div>
                      )}
                      {claim.proofDescription && (
                        <div className="pt-0.5">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Proof Note:</span> {claim.proofDescription}
                        </div>
                      )}
                    </div>
                    {claim.status === "PENDING" && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleReviewClaim(claim._id, "APPROVE")}
                          className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700"
                        >
                          Approve &amp; Issue QR
                        </button>
                        <button
                          onClick={() => handleReviewClaim(claim._id, "REJECT")}
                          className="flex-1 rounded-lg bg-slate-200 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Claim Modal */}
      <DoubleBlindChallengeModal
        item={item}
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        onClaimSuccess={handleClaimSuccess}
        defaultEmail={session?.user?.email || "2105128@kiit.ac.in"}
        defaultName={session?.user?.name || "Aman Sharma"}
        defaultRoll={(session?.user as any)?.rollNumber || "2105128"}
      />

      {/* QR Code Handover Modal */}
      <QrCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        token={item.qrTokenHash || "DEMO_QR_TOKEN_CAMPUS6_CHARGER"}
        itemTitle={item.title}
        claimantName={item.claimedBy?.name || "Verified Student"}
        expiresAt={item.qrExpiresAt}
      />
    </div>
  );
}
