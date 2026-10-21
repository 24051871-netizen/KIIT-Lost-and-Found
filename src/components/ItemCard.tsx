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
    <div className="group relative flex flex-col overflow-hidden nothing-widget !rounded-[28px] p-4 transition-all duration-300 hover:border-white/40 hover:-translate-y-1">
      {/* Top Image Preview & Badges */}
      <div className="relative h-48 w-full overflow-hidden rounded-[20px] bg-black border border-white/10">
        <Image
          src={displayImage}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100 ${
            isSensitive && !isReturned ? "filter blur-[6px] select-none pointer-events-none" : ""
          }`}
        />

        {/* Sensitive Blur Badge if applicable */}
        {isSensitive && !isReturned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none">
            <span className="flex items-center gap-1.5 rounded-full border border-white/30 bg-black/80 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-white backdrop-blur">
              <Lock className="h-3 w-3" /> PII PROTECTED
            </span>
          </div>
        )}

        {/* Item Type Badge (LOST / FOUND) */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`px-3 py-1 text-[10px] font-ndot uppercase tracking-widest rounded-full border backdrop-blur-md ${
              isFound
                ? "border-emerald-500/80 bg-black/80 text-emerald-300"
                : "border-rose-500/80 bg-black/80 text-rose-300"
            }`}
          >
            ( {item.itemType} )
          </span>

          {/* Status Badge */}
          {isReturned ? (
            <span className="flex items-center gap-1 rounded-full border border-blue-400 bg-black/80 px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-blue-300 backdrop-blur-md">
              <CheckCircle2 className="h-3 w-3" /> RESOLVED
            </span>
          ) : isPending ? (
            <span className="flex items-center gap-1 rounded-full border border-amber-400 bg-black/80 px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-amber-300 backdrop-blur-md">
              <Clock className="h-3 w-3" /> IN REVIEW
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/80 px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-zinc-300 backdrop-blur-md">
              <span className="nothing-red-dot"></span>
              LIVE
            </span>
          )}
        </div>

        {/* Double-Blind Challenge indicator */}
        {item.secretChallengeQuestion && !isReturned && (
          <div className="absolute bottom-3 right-3">
            <span
              title="Protected with Secret Verification Challenge"
              className="flex items-center gap-1 rounded-full border border-white/20 bg-black/80 px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-zinc-300 backdrop-blur-md"
            >
              <ShieldCheck className="h-3 w-3 text-white" />
              ZK-LOCK
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col pt-4 px-1">
        {/* Campus & Location */}
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-zinc-400 truncate">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-white" />
          <span className="truncate uppercase">{item.campusName}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm uppercase tracking-wider text-white line-clamp-1 group-hover:text-zinc-300 transition-colors">
          {item.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed flex-1 font-mono">
          {item.description}
        </p>

        {/* Micro-location detail */}
        <div className="mt-3.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-mono text-zinc-400">
          <span className="text-zinc-500 uppercase tracking-widest">SPOT //</span>{" "}
          {item.specificLocation}
        </div>

        {/* Bottom meta & CTA */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 tracking-wider">
            <Calendar className="h-3 w-3" />
            <span>{dateFormatted.toUpperCase()}</span>
          </div>

          <Link
            href={`/items/${item._id}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-white group-hover:translate-x-1 transition-transform"
          >
            {isReturned ? "INSPECT RECORD" : "INSPECT ITEM"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
