"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Item } from "@/types";
import ItemCard from "@/components/ItemCard";
import { KIIT_CAMPUSES, ITEM_CATEGORIES } from "@/lib/kiit-data";
import {
  ShieldCheck,
  Search,
  PlusCircle,
  QrCode,
  CheckCircle2,
  Sparkles,
  MapPin,
  TrendingUp,
  ArrowRight,
  Lock,
  Layers,
  HelpCircle,
} from "lucide-react";

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState({
    total: 6,
    lost: 3,
    found: 3,
    returned: 1,
    idCardsRecovered: 1,
    recoveryRate: 33,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCampus, setSelectedCampus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchItems();
    fetchStats();
  }, [selectedCampus]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const url =
        selectedCampus === "ALL"
          ? "/api/items"
          : `/api/items?campusId=${encodeURIComponent(selectedCampus)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.items) {
        setItems(data.items);
      }
    } catch (e) {
      console.error("Failed to fetch items:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (e) {
      console.error("Failed to fetch stats:", e);
    }
  };

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.specificLocation.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-14 pb-24 bg-black text-white nothing-dot-grid min-h-screen">
      {/* Hero Section (Nothing OS + SpaceX Aesthetic) */}
      <section className="relative overflow-hidden border-b border-white/10 pt-16 pb-20 nothing-radial-glow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Mission Telemetry Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.04] px-4 py-1.5 text-xs font-mono tracking-[0.22em] uppercase text-zinc-300 backdrop-blur-md">
            <span className="nothing-red-dot"></span>
            <span className="font-ndot text-[11px] text-white">KIIT (R) OS 2.5</span>
            <span className="text-zinc-600">|</span>
            <span className="text-[10px] text-zinc-400">TELEMETRY ACTIVE</span>
          </div>

          <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-ndot uppercase tracking-[0.14em] text-white leading-tight">
            LOST PROPERTY <br />
            <span className="text-zinc-500">RECOVERY SYSTEM.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xs sm:text-sm text-zinc-400 font-mono tracking-wide leading-relaxed">
            Carl Pei inspired dot-matrix recovery protocol for KIIT University. Protected with Zero-Knowledge Double Blind challenges, SHA-256 cryptographic hardware hashes, and HMAC handover passes.
          </p>

          {/* Nothing OS Stadium Pill Search & Actions */}
          <div className="mx-auto mt-10 max-w-2xl space-y-4">
            <div className="relative">
              <Search className="absolute left-5 top-4 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH RECOVERY TELEMETRY (ROLL NUMBER, GADGET, HOSTEL)..."
                className="w-full rounded-full border border-white/20 bg-zinc-950/80 pl-12 pr-6 py-4 text-xs font-mono uppercase tracking-wider text-white shadow-2xl backdrop-blur-xl focus:border-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/report"
                className="nothing-btn-primary w-full sm:w-auto text-center"
              >
                + REPORT PROPERTY
              </Link>
              <Link
                href="/browse"
                className="nothing-btn-secondary w-full sm:w-auto text-center"
              >
                EXPLORE CATALOG &rarr;
              </Link>
            </div>
          </div>

          {/* Telemetry Status Bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-[11px] font-mono tracking-widest uppercase text-zinc-500">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
              KIIT STUDENT OAUTH
            </span>
            <span className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-white" />
              SHA-256 + HMAC-256
            </span>
            <span className="flex items-center gap-2">
              <QrCode className="h-3.5 w-3.5 text-white" />
              24 CHECKPOINTS
            </span>
          </div>
        </div>
      </section>

      {/* Nothing OS Glyph Telemetry Metrics (HUD) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="nothing-widget p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                ( 0 1 ) LOGGED
              </span>
              <div className="nothing-dial">
                <span className="text-[11px] font-ndot text-zinc-400">01</span>
              </div>
            </div>
            <p className="mt-3 text-3xl font-ndot tracking-wider text-white">
              {stats.total.toString().padStart(2, "0")}
            </p>
            <span className="mt-2 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              ACROSS 24 CAMPUSES
            </span>
          </div>

          {/* Card 2 */}
          <div className="nothing-widget p-6 border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400">
                ( 0 2 ) RETURNED
              </span>
              <div className="nothing-dial !border-emerald-500/40">
                <span className="text-[11px] font-ndot text-emerald-400">OK</span>
              </div>
            </div>
            <p className="mt-3 text-3xl font-ndot tracking-wider text-emerald-400">
              {stats.returned.toString().padStart(2, "0")}
            </p>
            <span className="mt-2 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              VERIFIED VIA QR PASS
            </span>
          </div>

          {/* Card 3 */}
          <div className="nothing-widget p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300">
                ( 0 3 ) RECOVERY
              </span>
              <div className="nothing-dial">
                <span className="text-[11px] font-ndot text-white">%</span>
              </div>
            </div>
            <p className="mt-3 text-3xl font-ndot tracking-wider text-white">
              {stats.recoveryRate}%
            </p>
            <span className="mt-2 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              SYSTEM EFFICIENCY
            </span>
          </div>

          {/* Card 4 */}
          <div className="nothing-widget p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300">
                ( 0 4 ) ID CARDS
              </span>
              <div className="nothing-dial">
                <span className="nothing-red-dot"></span>
              </div>
            </div>
            <p className="mt-3 text-3xl font-ndot tracking-wider text-white">
              {stats.idCardsRecovered.toString().padStart(2, "0")}
            </p>
            <span className="mt-2 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              ROLL LOCK SECURED
            </span>
          </div>
        </div>
      </section>

      {/* Explore By Category */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="nothing-red-dot"></span>
            <h2 className="text-sm font-ndot uppercase tracking-[0.16em] text-white">
              PROPERTY CATEGORIES
            </h2>
          </div>
          <Link
            href="/browse"
            className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white"
          >
            VIEW ALL &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-5">
          {ITEM_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/browse?category=${cat.id}`}
              className="nothing-widget flex flex-col items-center justify-center p-4 text-center group hover:border-white/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white group-hover:bg-white group-hover:text-black transition-all">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="mt-2.5 text-[10px] font-mono uppercase tracking-wider text-zinc-300 line-clamp-1">
                {cat.name.split("/")[0]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Campus Selector & Items Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="nothing-red-dot"></span>
              <h2 className="text-sm font-ndot uppercase tracking-[0.16em] text-white">
                LIVE TELEMETRY STREAM
              </h2>
            </div>
            <p className="text-xs font-mono text-zinc-400 mt-1 uppercase tracking-wider">
              Filter by specific school, hostel cluster, or campus checkpoint.
            </p>
          </div>

          {/* Quick Filter Stadium Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full p-1.5 rounded-full border border-white/10 bg-zinc-950/80">
            {[
              { id: "ALL", label: "ALL CAMPUSES" },
              { id: "campus-15", label: "CAMPUS 15 (CSE)" },
              { id: "campus-3", label: "CAMPUS 3 (MECH)" },
              { id: "campus-6", label: "CAMPUS 6 (LIB)" },
              { id: "food-court-chintan", label: "FOOD COURT" },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCampus(c.id)}
                className={`nothing-pill-tab whitespace-nowrap transition-all ${
                  selectedCampus === c.id
                    ? "bg-white text-black font-bold shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Item Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="py-20 text-center text-xs font-mono uppercase tracking-widest text-zinc-500">
              RECEIVING TELEMETRY FROM CLUSTER...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="nothing-widget p-12 text-center">
              <HelpCircle className="mx-auto h-10 w-10 text-zinc-600" />
              <h3 className="mt-3 text-xs font-mono uppercase tracking-widest text-white">
                NO LISTINGS ACTIVE FOR CURRENT FILTER
              </h3>
              <p className="mt-1 text-[11px] font-mono text-zinc-500">
                Switch campus filter or report a newly sighted lost/found item.
              </p>
              <Link
                href="/report"
                className="mt-6 nothing-btn-primary inline-flex !py-2.5 !px-5 !text-[10px]"
              >
                + REPORT AN ITEM
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/browse"
            className="nothing-btn-secondary inline-flex !py-3 !px-8 text-xs font-mono uppercase tracking-[0.2em]"
          >
            EXPLORE FULL TELEMETRY CATALOG &rarr;
          </Link>
        </div>
      </section>

      {/* Campus Security Checkpoints & Safe Handover Hubs (Nothing Acrylic Style) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="nothing-widget !rounded-[32px] p-8 sm:p-12 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 border-white/20">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300">
              <span className="nothing-red-dot"></span>
              SAFE ZONE PROTOCOL
            </div>
            <h3 className="text-2xl sm:text-3xl font-ndot uppercase tracking-[0.14em]">
              PHYSICAL HANDOVER STATIONS
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono leading-relaxed">
              Never conduct unverified exchanges. Deposit found items directly at Campus Gate Security Desks or Central Library circulation. Security Officers authenticate ownership via cryptographic QR scanner.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-400 pt-2">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" /> CAMPUS 15 GATE 1 DESK
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" /> CAMPUS 6 CENTRAL LIBRARY
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" /> KSAC STUDENT COUNTER
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/report"
              className="nothing-btn-primary text-center"
            >
              + INITIATE REPORT
            </Link>
            <Link
              href="/scan"
              className="nothing-btn-secondary text-center"
            >
              OPEN QR SCANNER &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
