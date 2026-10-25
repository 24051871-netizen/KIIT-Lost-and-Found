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
    <div className="min-h-screen cyber-grid py-14 bg-[#06070a] text-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Form Header */}
        <div className="text-center pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono font-medium text-emerald-300 backdrop-blur-xl">
            <span className="live-beacon"></span>
            <span>KIIT CAMPUS INTAKE ENGINE</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Report Lost or Found Property
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Intake engine protected with zero-knowledge ownership challenges and QR verification passes.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs font-medium text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Anti-Spam & Listing Governance Notice */}
        <div className="mt-6 glass-card p-6 border-emerald-500/20">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Anti-Spam &amp; Catalog Governance Rules
              </span>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              Active Quota: Max 3 Items
            </span>
          </div>
          <p className="mt-3 text-xs text-zinc-400 leading-relaxed font-normal">
            Every submission is bound to your verified KIIT Roll (<strong>{reporterRoll}</strong>). Submissions enforce a 3-item active quota, 5-minute velocity cooldown, and duplicate detection under KIIT Disciplinary Statute 14.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Toggle Lost vs Found */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
            <button
              type="button"
              onClick={() => setItemType("FOUND")}
              className={`py-3 text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-2 ${
                itemType === "FOUND"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>I Found an Item</span>
            </button>
            <button
              type="button"
              onClick={() => setItemType("LOST")}
              className={`py-3 text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-2 ${
                itemType === "LOST"
                  ? "bg-gradient-to-r from-rose-500 to-amber-500 text-black shadow-lg"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>I Lost an Item</span>
            </button>
          </div>

          {/* Section 1: Item Basic Info */}
          <div className="glass-card p-7 space-y-5">
            <h2 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <span className="live-beacon"></span>
              01 // Item Details &amp; Spatial Coordinates
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Casio fx-991CW Calculator, KIIT Smart ID Card, HP 65W Blue Charger"
                className="w-full glass-input px-4 py-3 text-xs sm:text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full glass-input px-4 py-3 text-xs text-white"
                >
                  {ITEM_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#0b0e17]">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Campus Zone *
                </label>
                <select
                  value={campusId}
                  onChange={(e) => setCampusId(e.target.value)}
                  className="w-full glass-input px-4 py-3 text-xs text-white"
                >
                  {KIIT_CAMPUSES.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0b0e17]">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Specific Landmark / Spot *
              </label>
              <input
                type="text"
                required
                value={specificLocation}
                onChange={(e) => setSpecificLocation(e.target.value)}
                placeholder="e.g. Campus 15, Block B, 3rd Floor Lab 302, Bench 4"
                className="w-full glass-input px-4 py-3 text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Detailed Description (Min 15 Characters) *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide identifiable physical details (color, brand, distinguishing marks)..."
                className="w-full glass-input px-4 py-3 text-xs sm:text-sm text-white"
              />
            </div>

            {/* Cloudinary CDN Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Photographic Proof (Cloudinary CDN)
              </label>
              <ImageUploader onImageUploaded={(url) => setImageUrl(url)} currentImage={imageUrl} />
            </div>
          </div>

          {/* Section 2: Double-Blind Ownership Challenge */}
          <div className="glass-card p-7 space-y-5">
            <div className="flex items-start gap-3 pb-3 border-b border-white/[0.08]">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5 shrink-0">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-bold text-xs uppercase tracking-wider text-white">
                  02 // Zero-Knowledge Double-Blind Challenge
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Specify an asymmetric verification question that only the real owner can solve. Answer is hashed using SHA-256.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Concealed Challenge Question (Optional)
              </label>
              <input
                type="text"
                value={secretQuestion}
                onChange={(e) => setSecretQuestion(e.target.value)}
                placeholder="e.g. What sticker is on the laptop lid? What brand of battery is inside the mouse?"
                className="w-full glass-input px-4 py-3 text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Expected Answer (Stored as SHA-256 Hash)
              </label>
              <input
                type="text"
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
                placeholder="e.g. GitHub Octocat, Blue Duracell, Room 402"
                className="w-full glass-input px-4 py-3 text-xs sm:text-sm text-white"
              />
              <span className="mt-1.5 block text-xs font-mono text-zinc-500">
                🔒 Plaintext answer is NEVER exposed in the public catalog.
              </span>
            </div>
          </div>

          {/* Section 3: Contact & Reporter Credentials */}
          <div className="glass-card p-7 space-y-5">
            <h2 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <span className="live-beacon"></span>
              03 // Reporter Institutional Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full glass-input px-4 py-3 text-xs sm:text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  KIIT Institutional Email (@kiit.ac.in)
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full glass-input px-4 py-3 text-xs sm:text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  KIIT Roll Number
                </label>
                <input
                  type="text"
                  value={reporterRoll}
                  onChange={(e) => setReporterRoll(e.target.value)}
                  placeholder="2105128"
                  className="w-full glass-input px-4 py-3 text-xs sm:text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Hostel / Residence
                </label>
                <select
                  value={reporterHostel}
                  onChange={(e) => setReporterHostel(e.target.value)}
                  className="w-full glass-input px-4 py-3 text-xs text-white"
                >
                  {HOSTEL_LIST.map((h) => (
                    <option key={h} value={h} className="bg-[#0b0e17]">
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
              className="btn-emerald w-full sm:w-auto text-center"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 inline mr-2 animate-spin" /> Publishing Telemetry...
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
