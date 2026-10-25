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
    <div className="glass-card group relative flex flex-col overflow-hidden p-4">
      {/* Top Image Preview & Badges */}
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-[#090c14] border border-white/[0.08]">
        <Image
          src={displayImage}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100 ${
            isSensitive && !isReturned ? "filter blur-[6px] select-none pointer-events-none" : ""
          }`}
        />

        {/* Sensitive Blur Badge if applicable */}
        {isSensitive && !isReturned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none backdrop-blur-sm">
            <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-3 py-1 text-[11px] font-mono text-zinc-200">
              <Lock className="h-3 w-3 text-emerald-400" /> PII Protected
            </span>
          </div>
        )}

        {/* Item Type Badge (LOST / FOUND) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-3 py-1 text-[11px] font-semibold rounded-full border backdrop-blur-xl shadow-lg flex items-center gap-1.5 ${
              isFound
                ? "border-emerald-500/40 bg-[#061e16]/85 text-emerald-300"
                : "border-rose-500/40 bg-[#240c10]/85 text-rose-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isFound ? "bg-emerald-400" : "bg-rose-400"
              }`}
            ></span>
            {item.itemType}
          </span>

          {/* Status Badge */}
          {isReturned ? (
            <span className="flex items-center gap-1 rounded-full border border-sky-500/40 bg-[#071927]/85 px-2.5 py-1 text-[10px] font-medium text-sky-300 backdrop-blur-xl">
              <CheckCircle2 className="h-3 w-3" /> Returned
            </span>
          ) : isPending ? (
            <span className="flex items-center gap-1 rounded-full border border-amber-500/40 bg-[#291b06]/85 px-2.5 py-1 text-[10px] font-medium text-amber-300 backdrop-blur-xl">
              <Clock className="h-3 w-3" /> In Review
            </span>
          ) : null}
        </div>

        {/* Double-Blind Challenge indicator */}
        {item.secretChallengeQuestion && !isReturned && (
          <div className="absolute bottom-3 right-3">
            <span
              title="Protected with Secret Verification Challenge"
              className="flex items-center gap-1 rounded-full border border-white/20 bg-black/85 px-2.5 py-0.5 text-[10px] font-mono text-zinc-300 backdrop-blur-xl shadow-md"
            >
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              ZK-Challenge
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col pt-4 px-1">
        {/* Campus & Location */}
        <div className="mb-2 flex items-center gap-1.5 text-xs text-zinc-400 truncate font-medium">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <span className="truncate">{item.campusName}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
          {item.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Micro-location detail */}
        <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs font-mono text-zinc-300 flex items-center gap-1.5">
          <span className="text-zinc-500 font-semibold text-[10px] uppercase">Spot:</span>
          <span className="truncate text-zinc-300">{item.specificLocation}</span>
        </div>

        {/* Bottom meta & CTA */}
        <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>{dateFormatted}</span>
          </div>

          <Link
            href={`/items/${item._id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 group-hover:translate-x-1 transition-all"
          >
            <span>{isReturned ? "Inspect Record" : "View Details"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
