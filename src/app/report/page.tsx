"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ImageUploader from "@/components/ImageUploader";
import { KIIT_CAMPUSES, ITEM_CATEGORIES, HOSTEL_LIST } from "@/lib/kiit-data";
import { ItemType, ItemCategory } from "@/types";
import {
  PlusCircle,
  ShieldCheck,
  MapPin,
  Lock,
  HelpCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

export default function ReportPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [itemType, setItemType] = useState<ItemType>("FOUND");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ItemCategory>("KIIT_ID_CARD");
  const [campusId, setCampusId] = useState("campus-15");
  const [specificLocation, setSpecificLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");

  // Contact Info
  const [contactName, setContactName] = useState(session?.user?.name || "Aman Sharma");
  const [contactEmail, setContactEmail] = useState(session?.user?.email || "2105128@kiit.ac.in");
  const [reporterRoll, setReporterRoll] = useState(
    (session?.user as any)?.rollNumber || "2105128"
  );
  const [reporterHostel, setReporterHostel] = useState("KP-7");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !specificLocation.trim()) {
      setError("Please fill in all required title, description, and specific location fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const campusObj = KIIT_CAMPUSES.find((c) => c.id === campusId);
    const campusName = campusObj ? campusObj.name : campusId;

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          itemType,
          category,
          campusId,
          campusName,
          specificLocation,
          imageUrls: imageUrl ? [imageUrl] : [],
          secretChallengeQuestion: secretQuestion || undefined,
          secretAnswer: secretAnswer || undefined,
          contactEmail,
          contactName,
          reporterRollNumber: reporterRoll,
          reporterHostel,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create item.");
      }

      router.push(`/items/${data.item._id}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen nothing-dot-grid py-12 bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Form Header */}
        <div className="text-center pb-8 border-b border-white/10">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-md">
            <span className="nothing-red-dot"></span>
            <span className="font-ndot text-white">KIIT (R) OS</span>
            <span className="text-zinc-600">|</span>
            <span>INTAKE PROTOCOL</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-ndot uppercase tracking-[0.14em] text-white">
            REPORT PROPERTY
          </h1>
          <p className="mt-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Telemetry intake with zero-knowledge ownership challenges and QR verification passes.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2.5 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs font-mono text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Anti-Spam & Listing Governance Notice */}
        <div className="mt-6 nothing-widget p-6 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="nothing-red-dot"></span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                ANTI-SPAM &amp; CATALOG GOVERNANCE
              </span>
            </div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest rounded-full border border-white/20 bg-white/5 px-3 py-1 text-zinc-300">
              QUOTA: 3 ACTIVE
            </span>
          </div>
          <p className="mt-3 text-[11px] text-zinc-400 leading-relaxed uppercase tracking-wider">
            Every submission is tied to verified KIIT Roll (<strong>{reporterRoll}</strong>). Submissions enforce a 3-item active quota, 5-minute cooldown, and duplicate detection under KIIT Disciplinary Statute 14.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Toggle Lost vs Found - Stadium Pill Segmented Control */}
          <div className="grid grid-cols-2 gap-3 p-1.5 rounded-full border border-white/15 bg-zinc-950/80 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setItemType("FOUND")}
              className={`py-3 text-xs font-ndot uppercase tracking-widest rounded-full transition-all ${
                itemType === "FOUND"
                  ? "bg-white text-black font-bold shadow-lg"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              ( FOUND ITEM )
            </button>
            <button
              type="button"
              onClick={() => setItemType("LOST")}
              className={`py-3 text-xs font-ndot uppercase tracking-widest rounded-full transition-all ${
                itemType === "LOST"
                  ? "bg-white text-black font-bold shadow-lg"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              ( LOST ITEM )
            </button>
          </div>

          {/* Section 1: Item Basic Info */}
          <div className="nothing-widget p-7 space-y-5 font-mono">
            <h2 className="font-bold text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <span className="nothing-red-dot"></span>
              01 // ITEM TELEMETRY &amp; DETAILS
            </h2>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                ITEM TITLE *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Casio fx-991CW Calculator, KIIT Smart ID Card (Roll 2205xxx)"
                className="w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-xs text-white focus:border-white focus:outline-none uppercase"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  CATEGORY CLASSIFICATION *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-xs text-white focus:border-white focus:outline-none uppercase"
                >
                  {ITEM_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  CAMPUS ZONE *
                </label>
                <select
                  value={campusId}
                  onChange={(e) => setCampusId(e.target.value)}
                  className="w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-xs text-white focus:border-white focus:outline-none uppercase"
                >
                  {KIIT_CAMPUSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                MICRO-LOCATION / LANDMARK *
              </label>
              <input
                type="text"
                required
                value={specificLocation}
                onChange={(e) => setSpecificLocation(e.target.value)}
                placeholder="e.g. Campus 15, Block B, 3rd Floor Lab 302, Bench 4"
                className="w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-xs text-white focus:border-white focus:outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                DETAILED DESCRIPTION (MIN 15 CHARS) *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide identifiable physical details (color, brand, distinguishing marks)..."
                className="w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-xs text-white focus:border-white focus:outline-none"
              />
            </div>

            {/* Cloudinary CDN Image Upload */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-2">
                PHOTOGRAPHIC PROOF (CLOUDINARY CDN)
              </label>
              <ImageUploader onImageUploaded={(url) => setImageUrl(url)} currentImage={imageUrl} />
            </div>
          </div>

          {/* Section 2: Double-Blind Ownership Challenge */}
          <div className="nothing-widget p-7 space-y-5 font-mono">
            <div className="flex items-start gap-3 pb-3 border-b border-white/10">
              <Lock className="h-4 w-4 text-white mt-0.5" />
              <div>
                <h2 className="font-bold text-xs uppercase tracking-[0.2em] text-white">
                  02 // DOUBLE-BLIND OWNERSHIP CHALLENGE
                </h2>
                <p className="text-[11px] text-zinc-400 mt-1 uppercase tracking-wider">
                  Specify an asymmetric verification challenge that only the legitimate owner can solve. Answer is hashed using SHA-256.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                CHALLENGE QUESTION (OPTIONAL)
              </label>
              <input
                type="text"
                value={secretQuestion}
                onChange={(e) => setSecretQuestion(e.target.value)}
                placeholder="e.g. What sticker is on the laptop lid? What key number is stamped?"
                className="w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-xs text-white focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                EXPECTED ANSWER (STORED AS SHA-256 HASH)
              </label>
              <input
                type="text"
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
                placeholder="e.g. GitHub Octocat, Room 402"
                className="w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-xs text-white focus:border-white focus:outline-none"
              />
              <span className="mt-1 block text-[10px] text-zinc-500 uppercase tracking-wider">
                Plaintext answer is never exposed in the public catalog.
              </span>
            </div>
          </div>

          {/* Section 3: Contact & Reporter Credentials */}
          <div className="nothing-widget p-7 space-y-5 font-mono">
            <h2 className="font-bold text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <span className="nothing-red-dot"></span>
              03 // REPORTER CREDENTIALS &amp; TELEMETRY
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-xs text-white focus:border-white focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  KIIT EMAIL (@KIIT.AC.IN)
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-xs text-white focus:border-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  KIIT ROLL NUMBER
                </label>
                <input
                  type="text"
                  value={reporterRoll}
                  onChange={(e) => setReporterRoll(e.target.value)}
                  placeholder="2105128"
                  className="w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-xs text-white focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">
                  HOSTEL / RESIDENCE
                </label>
                <select
                  value={reporterHostel}
                  onChange={(e) => setReporterHostel(e.target.value)}
                  className="w-full rounded-2xl border border-white/20 bg-zinc-950 px-4 py-3 text-xs text-white focus:border-white focus:outline-none uppercase"
                >
                  {HOSTEL_LIST.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="nothing-btn-primary w-full sm:w-auto text-center"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 inline mr-2 animate-spin" /> PUBLISHING TELEMETRY...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 inline mr-2" /> PUBLISH CAMPUS REPORT
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
