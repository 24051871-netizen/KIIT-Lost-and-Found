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
    <div className="flex flex-col gap-12 pb-20 bg-black text-white">
      {/* Hero Section (SpaceX Atmospheric Dark Mode) */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black pt-16 pb-20 spacex-grid spacex-radial-glow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Mission Telemetry Badge */}
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-mono tracking-[0.2em] uppercase text-zinc-300">
            <Sparkles className="h-3.5 w-3.5 text-white" />
            <span>KIIT CAMPUS RECOVERY // SYSTEM ACTIVE</span>
          </div>

          <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-[0.18em] text-white">
            LOST PROPERTY <br />
            <span className="text-zinc-500">VERIFIED HANDOVER.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-zinc-400 font-mono tracking-wide leading-relaxed">
            Zero-Trust ownership verification protocol built for KIIT students, faculty, and hostel residents across 24 campuses. Protected with SHA-256 hardware hashes and HMAC handover passes.
          </p>

          {/* SpaceX Action Buttons & Search */}
          <div className="mx-auto mt-10 max-w-2xl space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-4 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH RECOVERY TELEMETRY (ROLL, GADGET, CHARGER, HOSTEL)..."
                className="w-full border border-white/20 bg-black/80 pl-11 pr-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white shadow-2xl focus:border-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/report"
                className="spacex-btn-primary w-full sm:w-auto text-center"
              >
                + REPORT PROPERTY
              </Link>
              <Link
                href="/browse"
                className="spacex-btn-secondary w-full sm:w-auto text-center"
              >
                EXPLORE CATALOG &rarr;
              </Link>
            </div>
          </div>

          {/* Telemetry Status Bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-[11px] font-mono tracking-widest uppercase text-zinc-500">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
              AUTH: @KIIT.AC.IN ONLY
            </span>
            <span className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-white" />
              ENCRYPTION: SHA-256 + HMAC
            </span>
            <span className="flex items-center gap-2">
              <QrCode className="h-3.5 w-3.5 text-white" />
              SAFE ZONES: 24 CHECKPOINTS
            </span>
          </div>
        </div>
      </section>

      {/* SpaceX Mission Telemetry Metrics (HUD) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="border border-white/10 bg-[#070707] p-5 shadow-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
              01 // TOTAL LOGGED
            </span>
            <p className="mt-2 text-3xl font-extrabold font-mono tracking-tight text-white">
              {stats.total.toString().padStart(2, "0")}
            </p>
            <span className="mt-1 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              ACROSS 24 CAMPUSES
            </span>
          </div>

          <div className="border border-white/10 bg-[#070707] p-5 shadow-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400">
              02 // RESOLVED HANDOVERS
            </span>
            <p className="mt-2 text-3xl font-extrabold font-mono tracking-tight text-emerald-400">
              {stats.returned.toString().padStart(2, "0")}
            </p>
            <span className="mt-1 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              VERIFIED VIA QR PASS
            </span>
          </div>

          <div className="border border-white/10 bg-[#070707] p-5 shadow-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300">
              03 // RECOVERY RATE
            </span>
            <p className="mt-2 text-3xl font-extrabold font-mono tracking-tight text-white">
              {stats.recoveryRate}%
            </p>
            <span className="mt-1 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              PROTOCOL EFFICIENCY
            </span>
          </div>

          <div className="border border-white/10 bg-[#070707] p-5 shadow-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300">
              04 // ID CARDS RESTORED
            </span>
            <p className="mt-2 text-3xl font-extrabold font-mono tracking-tight text-white">
              {stats.idCardsRecovered.toString().padStart(2, "0")}
            </p>
            <span className="mt-1 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              ROLL LOCK SECURED
            </span>
          </div>
        </div>
      </section>

      {/* Explore By Category */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
            PROPERTY CATEGORIES
          </h2>
          <Link
            href="/browse"
            className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white"
          >
            VIEW ALL &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mt-4">
          {ITEM_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/browse?category=${cat.id}`}
              className="flex flex-col items-center justify-center p-3.5 border border-white/10 bg-[#060606] hover:border-white transition-all text-center group"
            >
              <div className="flex h-9 w-9 items-center justify-center border border-white/20 bg-white/5 text-white group-hover:bg-white group-hover:text-black transition-colors">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="mt-2 text-[10px] font-mono uppercase tracking-wider text-zinc-300 line-clamp-1">
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
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
              ACTIVE TELEMETRY FEED // RECENT SIGHTINGS
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-1 uppercase tracking-wider">
              Filter by specific school, hostel cluster, or campus checkpoint.
            </p>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {[
              { id: "ALL", label: "ALL CAMPUSES" },
              { id: "campus-15", label: "CAMPUS 15 (CSE)" },
              { id: "campus-3", label: "CAMPUS 3 (MECH/CIVIL)" },
              { id: "campus-6", label: "CAMPUS 6 (LIBRARY)" },
              { id: "food-court-chintan", label: "FOOD COURT" },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCampus(c.id)}
                className={`border px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest whitespace-nowrap transition-colors ${
                  selectedCampus === c.id
                    ? "border-white bg-white text-black font-bold"
                    : "border-white/15 bg-white/5 text-zinc-400 hover:border-white/40 hover:text-white"
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
            <div className="border border-white/10 p-12 text-center bg-[#060606]">
              <HelpCircle className="mx-auto h-10 w-10 text-zinc-600" />
              <h3 className="mt-3 text-xs font-mono uppercase tracking-widest text-white">
                NO LISTINGS ACTIVE FOR CURRENT FILTER
              </h3>
              <p className="mt-1 text-[11px] font-mono text-zinc-500">
                Switch campus filter or report a newly sighted lost/found item.
              </p>
              <Link
                href="/report"
                className="mt-6 spacex-btn-primary inline-block !py-2 !px-4 !text-[11px]"
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

        <div className="mt-10 text-center">
          <Link
            href="/browse"
            className="spacex-btn-secondary inline-block !py-3 !px-8 text-xs font-mono uppercase tracking-[0.2em]"
          >
            EXPLORE FULL TELEMETRY CATALOG &rarr;
          </Link>
        </div>
      </section>

      {/* Campus Security Checkpoints & Safe Handover Hubs (SpaceX Launch Control Style) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border border-white/20 bg-gradient-to-b from-[#0c0c0c] to-black p-8 sm:p-12 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
              CAMPUS SAFE ZONE PROTOCOL
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.15em]">
              OFFICIAL PHYSICAL HANDOVER STATIONS
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
              className="spacex-btn-primary text-center"
            >
              + INITIATE REPORT
            </Link>
            <Link
              href="/scan"
              className="spacex-btn-secondary text-center"
            >
              OPEN QR SCANNER &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
