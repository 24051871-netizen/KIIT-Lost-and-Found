"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Item } from "@/types";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function ItemCard({ item }: { item: Item }) {
  const isFound = item.itemType === "FOUND";
  const isReturned = item.status === "RETURNED";
  const isPending = item.status === "CLAIM_PENDING" || item.status === "CLAIM_APPROVED";
  const isSensitive = item.category === "KIIT_ID_CARD" || item.category === "WALLET_DOCS";

  const fallbackImage =
    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80";
  const displayImage =
    item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : fallbackImage;

  // Format date
  const dateFormatted = new Date(item.createdAt).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/40">
      {/* Top Image Preview & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={displayImage}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
            isSensitive && !isReturned ? "filter blur-[3px] hover:blur-none transition-all" : ""
          }`}
        />

        {/* Sensitive Blur Badge if applicable */}
        {isSensitive && !isReturned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none group-hover:opacity-0 transition-opacity">
            <span className="flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              <Lock className="h-3 w-3" /> PII Protected
            </span>
          </div>
        )}

        {/* Item Type Badge (LOST / FOUND) */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span
            className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm ${
              isFound ? "bg-emerald-600" : "bg-rose-600"
            }`}
          >
            {item.itemType}
          </span>

          {/* Status Badge */}
          {isReturned ? (
            <span className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5" /> Returned
            </span>
          ) : isPending ? (
            <span className="flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              <Clock className="h-3.5 w-3.5" /> Claim Active
            </span>
          ) : null}
        </div>

        {/* Double-Blind Challenge indicator */}
        {item.secretChallengeQuestion && !isReturned && (
          <div className="absolute bottom-3 right-3">
            <span
              title="Protected with Secret Verification Challenge"
              className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-800 shadow backdrop-blur dark:bg-slate-900/90 dark:text-slate-200"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-kiit-600" />
              Verified Claim Required
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Campus & Location */}
        <div className="mb-2 flex items-center gap-1.5 text-xs text-kiit-700 dark:text-kiit-400 font-medium truncate">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{item.campusName}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-kiit-600 transition-colors">
          {item.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Micro-location detail */}
        <div className="mt-3 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Spot:</span>{" "}
          {item.specificLocation}
        </div>

        {/* Bottom meta & CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="h-3 w-3" />
            <span>{dateFormatted}</span>
          </div>

          <Link
            href={`/items/${item._id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-kiit-600 hover:text-kiit-700 group-hover:translate-x-0.5 transition-transform"
          >
            {isReturned ? "View Record" : "View Details"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
