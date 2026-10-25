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
  Sparkles,
  Info,
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
    <div className="min-h-screen py-12 text-slate-100">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Form Header */}
        <div className="text-center pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
            <span className="aura-dot-live"></span>
            <span>Intake Registry</span>
            <span className="text-emerald-500/40">|</span>
            <span className="text-slate-300 font-normal">Encrypted Protocol</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Report Property
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
            Log a lost or found possession into the campus network with Zero-Knowledge verification challenges and QR handover passes.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs font-medium text-rose-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Anti-Spam & Listing Governance Notice */}
        <div className="mt-6 aura-card p-5 border-emerald-500/20">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Anti-Spam &amp; Catalog Governance
              </span>
            </div>
            <span className="text-[11px] font-semibold tracking-wide rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-emerald-300">
              Active Quota: 3 Items Max
            </span>
          </div>
          <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
            Every submission is tied to verified KIIT Roll (<strong>{reporterRoll}</strong>). To prevent prank listings, the network enforces a 3-item active quota, 5-minute cooldown, and duplicate detection under KIIT Disciplinary Statute 14.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Toggle Lost vs Found */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setItemType("FOUND")}
              className={`py-3 text-xs font-bold rounded-xl transition-all ${
                itemType === "FOUND"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              I Found an Item
            </button>
            <button
              type="button"
              onClick={() => setItemType("LOST")}
              className={`py-3 text-xs font-bold rounded-xl transition-all ${
                itemType === "LOST"
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              I Lost an Item
            </button>
          </div>

          {/* Section 1: Item Basic Info */}
          <div className="aura-card p-7 space-y-5">
            <h2 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <span className="aura-dot-live"></span>
              Item Details &amp; Sighting Location
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Casio fx-991CW Calculator, KIIT Smart ID Card (Roll 2205xxx)"
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category Classification *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-xs text-slate-200 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer"
                >
                  {ITEM_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Campus Zone *
                </label>
                <select
                  value={campusId}
                  onChange={(e) => setCampusId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-xs text-slate-200 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer"
                >
                  {KIIT_CAMPUSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Micro-Location / Specific Landmark *
              </label>
              <input
                type="text"
                required
                value={specificLocation}
                onChange={(e) => setSpecificLocation(e.target.value)}
                placeholder="e.g. Campus 15, Block B, 3rd Floor Lab 302, Bench 4"
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Detailed Physical Description (Min 15 chars) *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide identifiable physical details (color, brand, distinguishing marks, scratches)..."
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            {/* Cloudinary CDN Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Photographic Proof (Cloudinary CDN)
              </label>
              <ImageUploader onImageUploaded={(url) => setImageUrl(url)} currentImage={imageUrl} />
            </div>
          </div>

          {/* Section 2: Double-Blind Ownership Challenge */}
          <div className="aura-card p-7 space-y-5 border-cyan-500/20">
            <div className="flex items-start gap-3 pb-3 border-b border-white/[0.08]">
              <Lock className="h-5 w-5 text-cyan-400 mt-0.5" />
              <div>
                <h2 className="font-bold text-sm text-white">
                  Concealed Ownership Challenge (Zero-Knowledge)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Specify an asymmetric question that only the authentic owner can solve. The plaintext answer is never shown publicly and stored as a SHA-256 hash.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Concealed Challenge Question (Optional)
              </label>
              <input
                type="text"
                value={secretQuestion}
                onChange={(e) => setSecretQuestion(e.target.value)}
                placeholder="e.g. What sticker is on the laptop lid? What brand of battery is inside?"
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Expected Answer (Stored as SHA-256 Hash)
              </label>
              <input
                type="text"
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
                placeholder="e.g. GitHub Octocat, Blue Duracell battery"
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
              <span className="mt-1.5 block text-[11px] text-slate-400">
                🔒 Plaintext answer is hashed before saving. Even database admins cannot view your secret answer.
              </span>
            </div>
          </div>

          {/* Section 3: Contact & Reporter Credentials */}
          <div className="aura-card p-7 space-y-5">
            <h2 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <span className="aura-dot-live"></span>
              Reporter Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-xs text-white focus:border-emerald-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  KIIT Email (@kiit.ac.in)
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-xs text-white focus:border-emerald-500/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  KIIT Roll Number
                </label>
                <input
                  type="text"
                  value={reporterRoll}
                  onChange={(e) => setReporterRoll(e.target.value)}
                  placeholder="2105128"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-xs text-white font-mono focus:border-emerald-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Hostel / Residence
                </label>
                <select
                  value={reporterHostel}
                  onChange={(e) => setReporterHostel(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-xs text-slate-200 focus:border-emerald-500/50 focus:outline-none cursor-pointer"
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
              className="aura-btn-primary w-full sm:w-auto text-center"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 inline mr-2 animate-spin" /> Publishing Report...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 inline mr-2" /> Publish Campus Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
