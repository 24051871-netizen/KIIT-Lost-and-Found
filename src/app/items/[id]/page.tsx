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
        setNotification("Item flagged for campus security inspection.");
        fetchItemDetails();
      }
    } catch (err) {
      console.error("Flag item error:", err);
    } finally {
      setFlagging(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center text-xs font-medium text-slate-500">
        Loading item records...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-rose-500" />
        <h2 className="mt-3 text-lg font-bold text-white">Item Not Found</h2>
        <p className="mt-1 text-xs text-slate-400">{error || "This item record could not be found."}</p>
        <Link
          href="/browse"
          className="mt-6 aura-btn-primary inline-flex !py-2 !px-4 text-xs"
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
    <div className="min-h-screen py-10 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Catalog
          </Link>
        </div>

        {notification && (
          <div className="mb-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-medium text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-emerald-400 font-bold">
              &times;
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image & Location Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-[24px] border border-white/10 bg-slate-900 shadow-2xl">
              <Image
                src={displayImage}
                alt={item.title}
                fill
                priority
                className={`object-cover opacity-90 ${
                  isSensitive && !isReturned ? "filter blur-[7px] select-none pointer-events-none transition-all" : ""
                }`}
              />

              {/* Gradient Shadow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

              {/* Top badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span
                  className={`px-3.5 py-1 text-[11px] font-semibold tracking-wide rounded-full border backdrop-blur-xl shadow-lg ${
                    isFound
                      ? "border-emerald-500/40 bg-emerald-950/85 text-emerald-300"
                      : "border-rose-500/40 bg-rose-950/85 text-rose-300"
                  }`}
                >
                  {item.itemType}
                </span>

                {isReturned ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-blue-400/40 bg-blue-950/85 px-3 py-1 text-[10px] font-medium text-blue-300 backdrop-blur-xl shadow-lg">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Handover Completed
                  </span>
                ) : isApproved ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-950/85 px-3 py-1 text-[10px] font-medium text-amber-300 backdrop-blur-xl shadow-lg">
                    <Clock className="h-3.5 w-3.5" /> Ready for Safe Zone Scan
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-slate-950/85 px-3 py-1 text-[10px] font-medium text-emerald-400 backdrop-blur-xl shadow-lg">
                    <span className="aura-dot-live"></span>
                    Active Listing
                  </span>
                )}
              </div>

              {isSensitive && !isReturned && (
                <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-slate-950/90 px-3.5 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-md flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />
                  PII Protected • Roll &amp; Photo Masked
                </div>
              )}
            </div>

            {/* Micro-Location & Campus Card */}
            <div className="aura-card p-6 space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                Campus Spatial Coordinates
              </h3>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Campus Zone:</span>
                  <span className="font-semibold text-white">{item.campusName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Specific Landmark:</span>
                  <span className="font-medium text-slate-200">
                    {item.specificLocation}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Reported Timestamp:</span>
                  <span className="text-slate-400 font-mono">
                    {new Date(item.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Zero-Trust Security Protocol Card (ZK-MOP) */}
            <div className="aura-card p-6 space-y-4 border-emerald-500/20">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <h3 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Zero-Trust Verification Protocol (ZK-MOP)
                </h3>
                <span className="rounded-full border border-emerald-400/40 bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Active Defense
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Multi-vector cryptographic matching and physical Safe Zone challenge prevents false claims and description guessing:
              </p>

              <div className="space-y-2.5 text-xs">
                {/* Tier 1: Roll Lock */}
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                    item.category === "KIIT_ID_CARD"
                      ? "border-emerald-500/40 bg-emerald-500/[0.06]"
                      : "border-white/[0.06] bg-white/[0.01] opacity-70"
                  }`}
                >
                  <div className="mt-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-1.5 text-emerald-400">
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-white flex items-center gap-2">
                      Tier 1: Institutional Roll Lock
                      {item.category === "KIIT_ID_CARD" && (
                        <span className="text-[10px] text-emerald-400 font-mono">
                          [Active]
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Restricted strictly to the student roll holder. Mismatched KIIT emails are rejected at API level.
                    </p>
                  </div>
                </div>

                {/* Tier 2: SHA-256 Serial Hash */}
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                    item.hardwareIdentifierHash
                      ? "border-cyan-500/40 bg-cyan-500/[0.06]"
                      : "border-white/[0.06] bg-white/[0.01] opacity-70"
                  }`}
                >
                  <div className="mt-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-1.5 text-cyan-400">
                    <KeyRound className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-white flex items-center gap-2">
                      Tier 2: SHA-256 Hardware Serial Matching
                      {item.hardwareIdentifierHash && (
                        <span className="text-[10px] text-cyan-300 font-mono">
                          [Hash Stored]
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Zero-knowledge cryptographic matching against Serial/IMEI without exposing plaintext publicly.
                    </p>
                  </div>
                </div>

                {/* Tier 3: Pre-Loss Evidence */}
                <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.01] opacity-80 flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-white/5 border border-white/10 p-1.5 text-slate-300">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-white">
                      Tier 3: Pre-Loss Digital Evidence
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Supports claimant retail invoices, GST purchase bills, or pre-loss timestamped photos.
                    </p>
                  </div>
                </div>

                {/* Tier 4: Safe Zone Physical Unlock */}
                <div
                  className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                    item.category === "ELECTRONICS"
                      ? "border-violet-500/40 bg-violet-500/[0.06]"
                      : "border-white/[0.06] bg-white/[0.01] opacity-70"
                  }`}
                >
                  <div className="mt-0.5 rounded-lg bg-violet-500/10 border border-violet-500/20 p-1.5 text-violet-400">
                    <Smartphone className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-white flex items-center gap-2">
                      Tier 4: Physical Unlock Challenge
                      {item.category === "ELECTRONICS" && (
                        <span className="text-[10px] text-violet-300 font-mono">
                          [Mandated]
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Claimant must physically unlock device biometric/passcode in front of the Campus Security Guard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-[11px] text-slate-300 flex items-center gap-2.5">
                <ShieldAlert className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  <strong>Anti-Brute-Force:</strong> 3 failed attempts lock claimant account and initiate academic disciplinary review under KIIT Statute 14.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Actions & Double-Blind Verification (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="aura-card p-7 space-y-5">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  {item.category.replace(/_/g, " ")}
                </span>
                <h1 className="mt-2 text-2xl font-extrabold text-white tracking-tight">
                  {item.title}
                </h1>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {/* Reporter Meta */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
                  {item.contactName[0]}
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white">{item.contactName}</p>
                  <p className="text-[11px] text-slate-400">
                    {item.reporterHostel ? `Hostel: ${item.reporterHostel}` : "KIIT Member"} •{" "}
                    {item.contactEmail}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/[0.08] space-y-3">
                {isReturned ? (
                  <div className="rounded-xl border border-blue-500/30 bg-blue-950/30 p-4 text-center">
                    <CheckCircle2 className="mx-auto h-6 w-6 text-blue-400" />
                    <p className="mt-2 text-xs font-semibold text-blue-200">
                      Handover Resolved &amp; Verified
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Returned via QR code verification at campus checkpoint.
                    </p>
                  </div>
                ) : isApproved ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => setQrModalOpen(true)}
                      className="aura-btn-primary w-full text-center"
                    >
                      <QrCode className="h-4 w-4 inline mr-2" />
                      View Handover QR Pass
                    </button>
                    <Link
                      href={`/scan`}
                      className="aura-btn-secondary w-full text-center block"
                    >
                      Scan QR to Complete Handover &rarr;
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => setClaimModalOpen(true)}
                    className="aura-btn-primary w-full text-center"
                  >
                    <ShieldCheck className="h-4 w-4 inline mr-2" />
                    Claim this Item (Verify Ownership)
                  </button>
                )}

                {/* Community Moderation: Flag Suspicious / Spam Listing */}
                {!isReturned && (
                  <button
                    type="button"
                    onClick={handleFlagItem}
                    disabled={flagging || hasFlagged}
                    className="w-full flex items-center justify-center gap-1.5 pt-2 text-[11px] font-medium text-slate-400 hover:text-rose-400 transition-colors"
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
              <div className="aura-card p-6 space-y-2 border-cyan-500/20">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                  <HelpCircle className="h-4 w-4 text-cyan-400" />
                  Ownership Challenge Question
                </div>
                <p className="text-xs text-slate-200 italic">
                  &ldquo;{item.secretChallengeQuestion}&rdquo;
                </p>
                <p className="text-[11px] text-slate-400">
                  Submit matching answer during verification to release handover pass.
                </p>
              </div>
            )}

            {/* Active Claims Review List (Visible in Demo / Finder mode) */}
            {claims.length > 0 && (
              <div className="aura-card p-6 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="aura-dot-live"></span>
                  Submitted Claims ({claims.length})
                </h4>
                <div className="space-y-3">
                  {claims.map((claim) => (
                    <div
                      key={claim._id}
                      className="p-4 rounded-xl border border-white/10 bg-slate-900/80 text-xs space-y-2.5"
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
                                ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-300"
                                : claim.status === "REJECTED"
                                ? "border-rose-500/40 bg-rose-950/80 text-rose-300"
                                : "border-amber-500/40 bg-amber-950/80 text-amber-300"
                            }`}
                          >
                            {claim.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-300 bg-white/[0.03] border border-white/[0.06] p-3 rounded-lg space-y-1">
                        <div>
                          <span className="text-slate-400">Answer:</span> {claim.challengeAnswer}
                        </div>
                        {claim.hardwareSerialSubmitted && (
                          <div>
                            <span className="text-slate-400">Serial:</span>{" "}
                            <span className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-white">
                              {claim.hardwareSerialSubmitted.length > 4
                                ? `••••${claim.hardwareSerialSubmitted.slice(-4)}`
                                : claim.hardwareSerialSubmitted}
                            </span>
                          </div>
                        )}
                        {claim.physicalUnlockConfirmed && (
                          <div className="text-[11px] text-blue-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Pledged physical unlock at Campus Safe Zone
                          </div>
                        )}
                        {claim.proofDescription && (
                          <div className="pt-0.5">
                            <span className="text-slate-400">Proof Note:</span> {claim.proofDescription}
                          </div>
                        )}
                      </div>
                      {claim.status === "PENDING" && (
                        <div className="flex gap-2 pt-1.5">
                          <button
                            onClick={() => handleReviewClaim(claim._id, "APPROVE")}
                            className="flex-1 rounded-full border border-emerald-500/40 bg-emerald-950/80 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-900 transition-colors"
                          >
                            Approve &amp; Issue QR
                          </button>
                          <button
                            onClick={() => handleReviewClaim(claim._id, "REJECT")}
                            className="flex-1 rounded-full border border-white/20 bg-white/5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
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
