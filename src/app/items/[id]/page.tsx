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
  Sparkles,
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
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="glass-card px-8 py-6 rounded-2xl flex items-center gap-3 text-slate-300 text-sm">
          <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          Loading verified item records...
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="glass-card p-8 rounded-3xl max-w-md w-full border border-rose-500/20 shadow-2xl">
          <AlertTriangle className="mx-auto h-12 w-12 text-rose-400 mb-3" />
          <h2 className="text-xl font-bold text-white">Item Record Not Found</h2>
          <p className="mt-2 text-sm text-slate-400">{error || "This item record could not be found or has been archived."}</p>
          <Link
            href="/browse"
            className="mt-6 inline-flex items-center gap-2 btn-emerald text-sm py-2.5 px-5"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Catalog
          </Link>
        </div>
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
    <div className="min-h-screen cyber-grid py-8 sm:py-12 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0e1322]/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-emerald-500/40 hover:bg-[#12192e] transition-all backdrop-blur-md shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-emerald-400" /> Back to Campus Feed
          </Link>
        </div>

        {notification && (
          <div className="mb-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs text-emerald-200 flex items-center justify-between backdrop-blur-md shadow-lg shadow-emerald-950/30">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span className="font-medium">{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-emerald-400 hover:text-emerald-200 text-lg leading-none p-1 font-bold"
            >
              &times;
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image, Coordinates & ZK-MOP Protocol (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual Header / Image */}
            <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-3xl glass-card border border-white/10 shadow-2xl">
              <Image
                src={displayImage}
                alt={item.title}
                fill
                priority
                className={`object-cover ${
                  isSensitive && !isReturned
                    ? "filter blur-[8px] select-none pointer-events-none transition-all duration-300"
                    : ""
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent opacity-80" />

              {/* Status pills top */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md shadow-lg ${
                    isFound
                      ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-300"
                      : "border-rose-500/40 bg-rose-950/80 text-rose-300"
                  }`}
                >
                  {isFound ? "FOUND ITEM" : "LOST REPORT"}
                </span>

                {isReturned ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-950/80 px-3 py-1 text-xs font-semibold text-sky-300 backdrop-blur-md">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" /> Handover Completed
                  </span>
                ) : isApproved ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-950/80 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md animate-pulse">
                    <Clock className="h-3.5 w-3.5 text-amber-400" /> Awaiting Safe Zone Scan
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#07090e]/80 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-md">
                    <span className="live-beacon"></span>
                    Live on Network
                  </span>
                )}
              </div>

              {isSensitive && !isReturned && (
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-amber-500/30 bg-[#07090e]/90 px-4 py-2.5 text-xs text-amber-200 backdrop-blur flex items-center gap-2.5 shadow-xl">
                  <Lock className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>PII Protection Active:</strong> Roll number and face photo masked until roll match ownership is verified.
                  </span>
                </div>
              )}
            </div>

            {/* Campus Spatial Coordinates Card */}
            <div className="glass-card p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-sm tracking-wide text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  Campus Spatial Coordinates
                </h3>
                <span className="text-[11px] font-mono font-medium text-emerald-400/90 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  GPS CHECKPOINT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-slate-400 text-[11px]">Campus Zone</span>
                  <p className="font-semibold text-white text-sm">{item.campusName}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-slate-400 text-[11px]">Specific Landmark</span>
                  <p className="font-semibold text-slate-200 text-sm">{item.specificLocation}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 sm:col-span-2">
                  <span className="text-slate-400 text-[11px]">Registered Timestamp</span>
                  <p className="font-mono text-slate-300">
                    {new Date(item.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Zero-Trust Protocol (ZK-MOP) */}
            <div className="glass-card p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      Zero-Trust Protocol (ZK-MOP)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Multi-vector proof verification eliminates false claims
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 text-[10px] font-semibold text-emerald-300">
                  Active Defense
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Tier 1: Roll Lock */}
                <div
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    item.category === "KIIT_ID_CARD"
                      ? "border-emerald-500/40 bg-emerald-950/20"
                      : "border-white/5 bg-white/[0.01] opacity-70"
                  }`}
                >
                  <div className="mt-0.5 rounded-xl border border-white/10 bg-[#0d121f] p-2 text-emerald-400 shrink-0">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">
                        Tier 1: Institutional Roll Lock
                      </p>
                      {item.category === "KIIT_ID_CARD" && (
                        <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                          Active For This Item
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Restricted strictly to the student roll holder. Mismatched KIIT emails are rejected at API level.
                    </p>
                  </div>
                </div>

                {/* Tier 2: SHA-256 Serial Hash */}
                <div
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    item.hardwareIdentifierHash
                      ? "border-emerald-500/40 bg-emerald-950/20"
                      : "border-white/5 bg-white/[0.01] opacity-70"
                  }`}
                >
                  <div className="mt-0.5 rounded-xl border border-white/10 bg-[#0d121f] p-2 text-cyan-400 shrink-0">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">
                        Tier 2: SHA-256 Hardware Serial Matching
                      </p>
                      {item.hardwareIdentifierHash && (
                        <span className="text-[10px] text-cyan-400 font-medium px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                          Hash Stored
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Zero-knowledge cryptographic matching against Serial/IMEI without exposing plaintext publicly.
                    </p>
                  </div>
                </div>

                {/* Tier 3: Pre-Loss Evidence */}
                <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.01] opacity-80 flex items-start gap-3.5">
                  <div className="mt-0.5 rounded-xl border border-white/10 bg-[#0d121f] p-2 text-violet-400 shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">
                      Tier 3: Pre-Loss Digital Evidence
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Supports claimant retail invoices, GST purchase bills, or pre-loss timestamped photos.
                    </p>
                  </div>
                </div>

                {/* Tier 4: Safe Zone Physical Unlock */}
                <div
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    item.category === "ELECTRONICS"
                      ? "border-emerald-500/40 bg-emerald-950/20"
                      : "border-white/5 bg-white/[0.01] opacity-70"
                  }`}
                >
                  <div className="mt-0.5 rounded-xl border border-white/10 bg-[#0d121f] p-2 text-amber-400 shrink-0">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">
                        Tier 4: Physical Unlock Challenge
                      </p>
                      {item.category === "ELECTRONICS" && (
                        <span className="text-[10px] text-amber-400 font-medium px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Claimant must physically unlock device biometric/passcode in front of the Campus Security Guard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-3.5 text-xs text-amber-300 flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400" />
                <span className="leading-snug">
                  <strong>Anti-Brute-Force Guard:</strong> 3 failed attempts lock the claimant account and trigger Proctorial Disciplinary Review under KIIT Statute 14.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Actions & Double-Blind Verification (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 sm:p-7 space-y-5">
              <div>
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 px-2.5 py-0.5 rounded-full mb-2">
                  {item.category.replace(/_/g, " ")}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  {item.title}
                </h1>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {/* Reporter Meta */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 font-bold text-sm shadow-inner">
                  {item.contactName[0]?.toUpperCase()}
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white">{item.contactName}</p>
                  <p className="text-slate-400">
                    {item.reporterHostel ? `Hostel: ${item.reporterHostel}` : "KIIT Campus Member"} &bull;{" "}
                    {item.contactEmail}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {isReturned ? (
                  <div className="rounded-2xl border border-sky-500/30 bg-sky-950/30 p-4 text-center">
                    <CheckCircle2 className="mx-auto h-6 w-6 text-sky-400" />
                    <p className="mt-2 text-xs font-bold uppercase tracking-wider text-sky-200">
                      Handover Resolved &amp; Verified
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Returned via dual cryptographic QR verification at Campus Safe Zone.
                    </p>
                  </div>
                ) : isApproved ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => setQrModalOpen(true)}
                      className="w-full btn-emerald text-center py-3 text-sm flex items-center justify-center gap-2"
                    >
                      <QrCode className="h-4 w-4" />
                      View Handover QR Pass
                    </button>
                    <Link
                      href={`/scan`}
                      className="w-full btn-secondary text-center block py-2.5 text-xs font-semibold"
                    >
                      Scan QR at Safe Zone to Finalize &rarr;
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => setClaimModalOpen(true)}
                    className="w-full btn-emerald text-center py-3 text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Claim This Item (Prove Ownership)
                  </button>
                )}

                {/* Community Moderation: Flag Suspicious / Spam */}
                {!isReturned && (
                  <button
                    type="button"
                    onClick={handleFlagItem}
                    disabled={flagging || hasFlagged}
                    className="w-full flex items-center justify-center gap-1.5 pt-2 text-xs font-medium text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Flag className="h-3.5 w-3.5" />
                    {hasFlagged
                      ? "Reported for Security Review"
                      : item.flagCount && item.flagCount > 0
                      ? `Reported Suspicious (${item.flagCount} flags)`
                      : "Flag as suspicious or spam listing"}
                  </button>
                )}
              </div>
            </div>

            {/* Double-Blind Challenge Info Card */}
            {item.secretChallengeQuestion && !isReturned && (
              <div className="glass-card p-6 space-y-2 border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wide">
                  <Sparkles className="h-4 w-4" />
                  Ownership Challenge Question
                </div>
                <p className="text-sm text-slate-200 italic font-serif">
                  &ldquo;{item.secretChallengeQuestion}&rdquo;
                </p>
                <p className="text-xs text-slate-400">
                  Submit matching answer during verification to release your handover pass.
                </p>
              </div>
            )}

            {/* Active Claims Review List (Visible in Demo / Finder mode) */}
            {claims.length > 0 && (
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="live-beacon"></span>
                    Submitted Claims ({claims.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">Finder / Admin Review</span>
                </div>

                <div className="space-y-3">
                  {claims.map((claim) => (
                    <div
                      key={claim._id}
                      className="p-4 rounded-2xl border border-white/10 bg-[#0a0d16]/80 text-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-white">
                            {claim.claimantName}
                          </span>
                          <p className="text-[11px] text-slate-400">{claim.claimantEmail}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {claim.proofType && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-slate-300">
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
                            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                              claim.status === "APPROVED"
                                ? "border-emerald-500 bg-emerald-950/80 text-emerald-300"
                                : claim.status === "REJECTED"
                                ? "border-rose-500 bg-rose-950/80 text-rose-300"
                                : "border-amber-500 bg-amber-950/80 text-amber-300"
                            }`}
                          >
                            {claim.status}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 bg-white/[0.02] border border-white/5 p-3 rounded-xl space-y-1">
                        <div>
                          <span className="text-slate-400 font-medium">Answer:</span>{" "}
                          <span className="text-white">{claim.challengeAnswer}</span>
                        </div>
                        {claim.hardwareSerialSubmitted && (
                          <div>
                            <span className="text-slate-400 font-medium">Serial:</span>{" "}
                            <span className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-emerald-300">
                              {claim.hardwareSerialSubmitted.length > 4
                                ? `••••${claim.hardwareSerialSubmitted.slice(-4)}`
                                : claim.hardwareSerialSubmitted}
                            </span>
                          </div>
                        )}
                        {claim.physicalUnlockConfirmed && (
                          <div className="text-[11px] text-sky-400 flex items-center gap-1 pt-0.5">
                            <CheckCircle2 className="h-3 w-3" /> Pledged physical unlock at Campus Safe Zone
                          </div>
                        )}
                        {claim.proofDescription && (
                          <div className="pt-0.5">
                            <span className="text-slate-400 font-medium">Proof Note:</span> {claim.proofDescription}
                          </div>
                        )}
                      </div>

                      {claim.status === "PENDING" && (
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleReviewClaim(claim._id, "APPROVE")}
                            className="flex-1 rounded-xl border border-emerald-500/50 bg-emerald-600/30 hover:bg-emerald-600/50 py-2 text-xs font-semibold text-emerald-200 transition-colors shadow-sm"
                          >
                            Approve &amp; Issue QR
                          </button>
                          <button
                            onClick={() => handleReviewClaim(claim._id, "REJECT")}
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
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
    </div>
  );
}
