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
  Sparkles,
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
    <div className="group aura-card relative flex flex-col overflow-hidden p-4">
      {/* Top Image Preview & Badges */}
      <div className="relative h-52 w-full overflow-hidden rounded-[16px] bg-slate-900 border border-white/10">
        <Image
          src={displayImage}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100 ${
            isSensitive && !isReturned ? "filter blur-[7px] select-none pointer-events-none" : ""
          }`}
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Sensitive Blur Badge if applicable */}
        {isSensitive && !isReturned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
            <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/90 px-3.5 py-1 text-[11px] font-medium text-slate-200 shadow-xl">
              <Lock className="h-3.5 w-3.5 text-emerald-400" /> PII Protected Card
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold tracking-wide rounded-full border backdrop-blur-xl shadow-lg ${
              isFound
                ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-300"
                : "border-rose-500/40 bg-rose-950/80 text-rose-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isFound ? "bg-emerald-400" : "bg-rose-400"
              }`}
            />
            {item.itemType}
          </span>

          {/* Status Badge */}
          {isReturned ? (
            <span className="flex items-center gap-1 rounded-full border border-blue-400/40 bg-blue-950/80 px-2.5 py-1 text-[10px] font-medium text-blue-300 backdrop-blur-xl shadow-lg">
              <CheckCircle2 className="h-3 w-3" /> Returned
            </span>
          ) : isPending ? (
            <span className="flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-950/80 px-2.5 py-1 text-[10px] font-medium text-amber-300 backdrop-blur-xl shadow-lg">
              <Clock className="h-3 w-3" /> In Review
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-slate-950/80 px-2.5 py-1 text-[10px] font-medium text-emerald-400 backdrop-blur-xl shadow-lg">
              <span className="aura-dot-live"></span>
              Live
            </span>
          )}
        </div>

        {/* Double-Blind Challenge indicator */}
        {item.secretChallengeQuestion && !isReturned && (
          <div className="absolute bottom-3 right-3">
            <span
              title="Protected with Secret Verification Challenge"
              className="flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/80 px-2.5 py-1 text-[10px] font-medium text-slate-300 backdrop-blur-xl shadow-lg"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              ZK-Protected
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col pt-4 px-1">
        {/* Campus & Location */}
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-emerald-400/90 truncate">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <span className="truncate">{item.campusName}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-white tracking-tight line-clamp-1 group-hover:text-emerald-300 transition-colors">
          {item.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Micro-location detail */}
        <div className="mt-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-slate-300 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">Spot</span>
          <span className="font-medium text-slate-200 truncate ml-2 max-w-[200px]">
            {item.specificLocation}
          </span>
        </div>

        {/* Bottom meta & CTA */}
        <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar className="h-3.5 w-3.5" />
            <span>{dateFormatted}</span>
          </div>

          <Link
            href={`/items/${item._id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all"
          >
            {isReturned ? "View Record" : "Inspect Item"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
