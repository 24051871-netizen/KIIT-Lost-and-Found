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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Form Header */}
      <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-kiit-100 px-3 py-1 text-xs font-semibold text-kiit-800 dark:bg-kiit-950 dark:text-kiit-300">
          <ShieldCheck className="h-3.5 w-3.5 text-kiit-600" />
          Verified KIIT Campus Network
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Report an Item
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Help recover lost belongings with double-blind ownership challenges and secure QR verification.
        </p>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Toggle Lost vs Found */}
        <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => setItemType("FOUND")}
            className={`py-3 text-xs font-bold rounded-xl transition-all ${
              itemType === "FOUND"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
            }`}
          >
            I Found an Item (In Campus)
          </button>
          <button
            type="button"
            onClick={() => setItemType("LOST")}
            className={`py-3 text-xs font-bold rounded-xl transition-all ${
              itemType === "LOST"
                ? "bg-rose-600 text-white shadow"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
            }`}
          >
            I Lost an Item (Seeking Recovery)
          </button>
        </div>

        {/* Section 1: Item Basic Info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-kiit-600 text-[11px] text-white">
              1
            </span>
            Item Details
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Item Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Casio fx-991CW Calculator, KIIT Smart ID Card (Roll 2205xxx)"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                KIIT Campus Zone <span className="text-red-500">*</span>
              </label>
              <select
                value={campusId}
                onChange={(e) => setCampusId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Micro-Location / Landmark <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={specificLocation}
              onChange={(e) => setSpecificLocation(e.target.value)}
              placeholder="e.g. Campus 15, Block B, 3rd Floor Lab 302, Bench 4"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe color, condition, model, or circumstances under which it was found or lost..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Cloudinary CDN Image Upload */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Item Photograph (Cloudinary CDN)
            </label>
            <ImageUploader onImageUploaded={(url) => setImageUrl(url)} currentImage={imageUrl} />
          </div>
        </div>

        {/* Section 2: Double-Blind Ownership Challenge (Key 2026 Innovation) */}
        <div className="rounded-2xl border border-kiit-200 bg-kiit-50/40 p-6 dark:border-kiit-900 dark:bg-kiit-950/20 space-y-4">
          <div className="flex items-start gap-2">
            <Lock className="h-5 w-5 text-kiit-700 dark:text-kiit-400 mt-0.5" />
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                Double-Blind Ownership Verification
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Set a secret question that only the true owner can answer (e.g. &ldquo;What sticker is on the back?&rdquo; or &ldquo;What is the roll number punched inside?&rdquo;). This prevents fraudulent claims!
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Secret Challenge Question
            </label>
            <input
              type="text"
              value={secretQuestion}
              onChange={(e) => setSecretQuestion(e.target.value)}
              placeholder="e.g. What sticker is on the cover? What key number is engraved?"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Expected Secret Answer (Used for instant matching &amp; pre-approval)
            </label>
            <input
              type="text"
              value={secretAnswer}
              onChange={(e) => setSecretAnswer(e.target.value)}
              placeholder="e.g. Batman, 402, Red tape"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <span className="mt-1 block text-[10px] text-slate-500">
              This answer is never shown publicly. It is hashed for automated verification.
            </span>
          </div>
        </div>

        {/* Section 3: Contact & Reporter Credentials */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-kiit-600 text-[11px] text-white">
              3
            </span>
            Reporter Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                KIIT Email Address (@kiit.ac.in)
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                KIIT Roll Number
              </label>
              <input
                type="text"
                value={reporterRoll}
                onChange={(e) => setReporterRoll(e.target.value)}
                placeholder="2105128"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Hostel / Residence
              </label>
              <select
                value={reporterHostel}
                onChange={(e) => setReporterHostel(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-kiit-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-kiit-600/30 hover:bg-kiit-700 disabled:opacity-50 transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Publishing Report...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" /> Publish Campus Report
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
