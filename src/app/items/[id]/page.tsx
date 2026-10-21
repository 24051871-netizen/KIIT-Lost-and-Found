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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 bg-black text-white">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/browse"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> &lt; RETURN TO TELEMETRY CATALOG
        </Link>
      </div>

      {notification && (
        <div className="mb-6 border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-mono text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="uppercase tracking-wider">{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 font-bold">
            &times;
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image & Location Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative h-80 sm:h-96 w-full overflow-hidden border border-white/10 bg-black">
            <Image
              src={displayImage}
              alt={item.title}
              fill
              priority
              className={`object-cover opacity-90 ${
                isSensitive && !isReturned ? "filter blur-[6px] select-none pointer-events-none transition-all" : ""
              }`}
            />

            {/* Top badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest border ${
                  isFound
                    ? "border-emerald-500/80 bg-emerald-950/90 text-emerald-300"
                    : "border-rose-500/80 bg-rose-950/90 text-rose-300"
                }`}
              >
                [{item.itemType}]
              </span>

              {isReturned ? (
                <span className="flex items-center gap-1.5 border border-blue-400 bg-blue-950/90 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-blue-300">
                  <CheckCircle2 className="h-3.5 w-3.5" /> HANDOVER COMPLETED
                </span>
              ) : isApproved ? (
                <span className="flex items-center gap-1.5 border border-amber-400 bg-amber-950/90 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-amber-300">
                  <Clock className="h-3.5 w-3.5" /> AWAITING SAFE ZONE SCAN
                </span>
              ) : null}
            </div>

            {isSensitive && !isReturned && (
              <div className="absolute bottom-4 left-4 border border-white/20 bg-black/90 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-300 backdrop-blur flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-white" />
                PII PROTECTED // ROLL &amp; PHOTO MASKED
              </div>
            )}
          </div>

          {/* Micro-Location & Campus Card */}
          <div className="border border-white/10 bg-[#070707] p-6 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-white" />
              CAMPUS SPATIAL COORDINATES
            </h3>
            <div className="border border-white/10 bg-white/[0.02] p-4 font-mono space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 uppercase tracking-wider">CAMPUS ZONE:</span>
                <span className="font-semibold text-white uppercase">{item.campusName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 uppercase tracking-wider">SPECIFIC LANDMARK:</span>
                <span className="font-semibold text-zinc-200">
                  {item.specificLocation}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 uppercase tracking-wider">TIMESTAMP:</span>
                <span className="text-zinc-400">
                  {new Date(item.createdAt).toLocaleString("en-IN").toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          {/* Zero-Trust Security Protocol Card (ZK-MOP) */}
          <div className="border border-white/10 bg-[#070707] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-white" />
                ZERO-TRUST OWNERSHIP PROTOCOL (ZK-MOP)
              </h3>
              <span className="border border-emerald-400 bg-emerald-950/60 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-300 uppercase tracking-widest">
                ACTIVE DEFENSE
              </span>
            </div>

            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              Multi-vector cryptographic matching and physical Safe Zone challenge prevents false claims and description guessing:
            </p>

            <div className="space-y-2 text-xs">
              {/* Tier 1: Roll Lock */}
              <div
                className={`p-3 border flex items-start gap-3 ${
                  item.category === "KIIT_ID_CARD"
                    ? "border-white/40 bg-white/5"
                    : "border-white/10 bg-white/[0.01] opacity-60"
                }`}
              >
                <div className="mt-0.5 border border-white/20 p-1 text-white">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold font-mono uppercase text-xs text-white flex items-center gap-2">
                    TIER 1: INSTITUTIONAL ROLL LOCK
                    {item.category === "KIIT_ID_CARD" && (
                      <span className="text-[9px] text-emerald-400 font-mono">
                        [ACTIVE]
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    Restricted strictly to the student roll holder. Mismatched KIIT emails are rejected at API level.
                  </p>
                </div>
              </div>

              {/* Tier 2: SHA-256 Serial Hash */}
              <div
                className={`p-3 border flex items-start gap-3 ${
                  item.hardwareIdentifierHash
                    ? "border-white/40 bg-white/5"
                    : "border-white/10 bg-white/[0.01] opacity-60"
                }`}
              >
                <div className="mt-0.5 border border-white/20 p-1 text-white">
                  <KeyRound className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold font-mono uppercase text-xs text-white flex items-center gap-2">
                    TIER 2: SHA-256 HARDWARE SERIAL MATCHING
                    {item.hardwareIdentifierHash && (
                      <span className="text-[9px] text-white font-mono">
                        [HASH STORED]
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    Zero-knowledge cryptographic matching against Serial/IMEI without exposing plaintext publicly.
                  </p>
                </div>
              </div>

              {/* Tier 3: Pre-Loss Evidence */}
              <div className="p-3 border border-white/10 bg-white/[0.01] opacity-70 flex items-start gap-3">
                <div className="mt-0.5 border border-white/20 p-1 text-white">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold font-mono uppercase text-xs text-white">
                    TIER 3: PRE-LOSS DIGITAL EVIDENCE
                  </p>
                  <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    Supports claimant retail invoices, GST purchase bills, or pre-loss timestamped photos.
                  </p>
                </div>
              </div>

              {/* Tier 4: Safe Zone Physical Unlock */}
              <div
                className={`p-3 border flex items-start gap-3 ${
                  item.category === "ELECTRONICS"
                    ? "border-white/40 bg-white/5"
                    : "border-white/10 bg-white/[0.01] opacity-60"
                }`}
              >
                <div className="mt-0.5 border border-white/20 p-1 text-white">
                  <Smartphone className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-bold font-mono uppercase text-xs text-white flex items-center gap-2">
                    TIER 4: PHYSICAL UNLOCK CHALLENGE
                    {item.category === "ELECTRONICS" && (
                      <span className="text-[9px] text-blue-400 font-mono">
                        [MANDATE]
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    Claimant must physically unlock device biometric/passcode in front of the Campus Security Guard.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-white/15 bg-white/5 p-3 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 text-white" />
              <span>
                <strong>ANTI-BRUTE-FORCE:</strong> 3 failed attempts lock claimant account and initiate academic disciplinary review under KIIT Statute 14.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Actions & Double-Blind Verification (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-white/10 bg-[#070707] p-6 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                CATEGORY // {item.category.replace(/_/g, " ")}
              </span>
              <h1 className="mt-1 text-2xl font-extrabold uppercase tracking-wider text-white">
                {item.title}
              </h1>
            </div>

            <p className="text-xs text-zinc-300 font-mono leading-relaxed">
              {item.description}
            </p>

            {/* Reporter Meta */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center border border-white/20 bg-white/5 font-mono text-white text-xs">
                {item.contactName[0]}
              </div>
              <div className="text-xs font-mono">
                <p className="font-semibold text-white uppercase">{item.contactName}</p>
                <p className="text-[10px] text-zinc-500">
                  {item.reporterHostel ? `HOSTEL: ${item.reporterHostel}` : "KIIT MEMBER"} //{" "}
                  {item.contactEmail}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              {isReturned ? (
                <div className="border border-blue-500/40 bg-blue-950/30 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-6 w-6 text-blue-400" />
                  <p className="mt-2 text-xs font-mono uppercase tracking-widest text-blue-200">
                    HANDOVER RESOLVED &amp; VERIFIED
                  </p>
                  <p className="text-[11px] font-mono text-zinc-400 mt-1">
                    Returned via QR code verification at campus checkpoint.
                  </p>
                </div>
              ) : isApproved ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setQrModalOpen(true)}
                    className="spacex-btn-primary w-full text-center"
                  >
                    <QrCode className="h-4 w-4 inline mr-2" />
                    VIEW HANDOVER QR PASS
                  </button>
                  <Link
                    href={`/scan`}
                    className="spacex-btn-secondary w-full text-center block"
                  >
                    SCAN QR TO COMPLETE HANDOVER &rarr;
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setClaimModalOpen(true)}
                  className="spacex-btn-primary w-full text-center"
                >
                  <ShieldCheck className="h-4 w-4 inline mr-2" />
                  CLAIM THIS ITEM (PROVE OWNERSHIP)
                </button>
              )}

              {/* Community Moderation: Flag Suspicious / Spam Listing */}
              {!isReturned && (
                <button
                  type="button"
                  onClick={handleFlagItem}
                  disabled={flagging || hasFlagged}
                  className="w-full flex items-center justify-center gap-1.5 pt-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-rose-400 transition-colors"
                >
                  <Flag className="h-3.5 w-3.5" />
                  {hasFlagged
                    ? "REPORTED FOR SECURITY REVIEW"
                    : item.flagCount && item.flagCount > 0
                    ? `REPORTED SUSPICIOUS (${item.flagCount} FLAGS)`
                    : "FLAG AS SUSPICIOUS OR SPAM LISTING"}
                </button>
              )}
            </div>
          </div>

          {/* Double-Blind Challenge Info Card */}
          {item.secretChallengeQuestion && !isReturned && (
            <div className="border border-white/20 bg-black p-5 space-y-2 font-mono">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <HelpCircle className="h-4 w-4 text-white" />
                OWNERSHIP CHALLENGE QUESTION
              </div>
              <p className="text-xs text-zinc-300 italic">
                &ldquo;{item.secretChallengeQuestion}&rdquo;
              </p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Submit matching answer during verification to release handover pass.
              </p>
            </div>
          )}

          {/* Active Claims Review List (Visible in Demo / Finder mode) */}
          {claims.length > 0 && (
            <div className="border border-white/10 bg-[#070707] p-5 space-y-3 font-mono">
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-white">
                SUBMITTED CLAIMS ({claims.length})
              </h4>
              <div className="space-y-2.5">
                {claims.map((claim) => (
                  <div
                    key={claim._id}
                    className="p-3 border border-white/10 bg-black text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white uppercase">
                          {claim.claimantName}
                        </span>
                        <p className="text-[10px] text-zinc-500">{claim.claimantEmail}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {claim.proofType && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 border border-white/20 bg-white/5 text-zinc-300">
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
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 border ${
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
                    <div className="text-[11px] text-zinc-400 bg-white/[0.02] border border-white/10 p-2.5 space-y-1">
                      <div>
                        <span className="text-zinc-500 uppercase tracking-wider">Answer:</span> {claim.challengeAnswer}
                      </div>
                      {claim.hardwareSerialSubmitted && (
                        <div>
                          <span className="text-zinc-500 uppercase tracking-wider">Serial:</span>{" "}
                          <span className="font-mono text-[10px] bg-white/10 px-1 py-0.5 text-white">
                            {claim.hardwareSerialSubmitted.length > 4
                              ? `••••${claim.hardwareSerialSubmitted.slice(-4)}`
                              : claim.hardwareSerialSubmitted}
                          </span>
                        </div>
                      )}
                      {claim.physicalUnlockConfirmed && (
                        <div className="text-[10px] text-blue-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Pledged physical unlock at Campus Safe Zone
                        </div>
                      )}
                      {claim.proofDescription && (
                        <div className="pt-0.5">
                          <span className="text-zinc-500 uppercase tracking-wider">Proof Note:</span> {claim.proofDescription}
                        </div>
                      )}
                    </div>
                    {claim.status === "PENDING" && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleReviewClaim(claim._id, "APPROVE")}
                          className="flex-1 border border-emerald-500 bg-emerald-950/80 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 hover:bg-emerald-900"
                        >
                          Approve &amp; Issue QR
                        </button>
                        <button
                          onClick={() => handleReviewClaim(claim._id, "REJECT")}
                          className="flex-1 border border-white/20 bg-white/5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
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
