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
  FileCheck2,
  Cpu,
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
    <div className="flex flex-col gap-16 pb-28 bg-[#06070a] text-white cyber-grid min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/[0.08] pt-20 pb-24 ambient-glow">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Mission Telemetry Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono font-medium text-emerald-300 backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <span className="live-beacon"></span>
            <span>24 CAMPUSES CONNECTED</span>
            <span className="text-emerald-500/40">|</span>
            <span className="text-zinc-400">ZERO-TRUST PROTOCOL</span>
          </div>

          <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
            Lost on Campus. <br />
            <span className="gradient-emerald">Recovered with Proof.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            The official Zero-Trust property recovery network for KIIT University students and faculty. Protected with SHA-256 hardware verification, concealed challenges, and cryptographic Safe Zone handovers.
          </p>

          {/* Search Capsule & Action Buttons */}
          <div className="mx-auto mt-10 max-w-2xl space-y-4">
            <div className="relative">
              <Search className="absolute left-5 top-4 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword, item model, roll number, or landmark..."
                className="w-full rounded-full border border-white/15 bg-white/[0.04] pl-12 pr-6 py-4 text-xs sm:text-sm text-white shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl focus:border-emerald-500/60 focus:bg-white/[0.07] focus:outline-none transition-all placeholder:text-zinc-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/report"
                className="btn-emerald w-full sm:w-auto text-center"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Report Lost / Found Item</span>
              </Link>
              <Link
                href="/browse"
                className="btn-secondary w-full sm:w-auto text-center"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-zinc-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Institutional @kiit.ac.in OAuth
            </span>
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-400" />
              SHA-256 Serial Hash Matching
            </span>
            <span className="flex items-center gap-2">
              <QrCode className="h-4 w-4 text-violet-400" />
              HMAC Single-Use Handover Passes
            </span>
          </div>
        </div>
      </section>

      {/* Real-time Telemetry Metrics HUD */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="glass-card p-6 border-white/[0.08] relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Total Logged
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-zinc-300 group-hover:scale-110 group-hover:text-white transition-all">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-white tracking-tight">
              {stats.total.toString().padStart(2, "0")}
            </p>
            <span className="mt-1 block text-xs text-zinc-500 font-medium">
              Across 24 KIIT Campuses
            </span>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Resolved Handovers
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-all">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-emerald-400 tracking-tight">
              {stats.returned.toString().padStart(2, "0")}
            </p>
            <span className="mt-1 block text-xs text-zinc-500 font-medium">
              Verified via QR Pass
            </span>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 border-white/[0.08] relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Recovery Rate
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-all">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-white tracking-tight">
              {stats.recoveryRate}%
            </p>
            <span className="mt-1 block text-xs text-zinc-500 font-medium">
              Protocol Efficiency
            </span>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-6 border-white/[0.08] relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
                ID Cards Restored
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-all">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-white tracking-tight">
              {stats.idCardsRecovered.toString().padStart(2, "0")}
            </p>
            <span className="mt-1 block text-xs text-zinc-500 font-medium">
              Roll Lock Protected
            </span>
          </div>
        </div>
      </section>

      {/* Explore By Category */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Explore Property by Category
            </h2>
          </div>
          <Link
            href="/browse"
            className="text-xs font-medium text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-5">
          {ITEM_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/browse?category=${cat.id}`}
              className="glass-card flex flex-col items-center justify-center p-4 text-center group hover:border-emerald-500/40 hover:bg-emerald-500/[0.03]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.04] text-zinc-300 border border-white/[0.06] group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="mt-3 text-xs font-medium text-zinc-300 group-hover:text-white line-clamp-1 transition-colors">
                {cat.name.split("/")[0]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Active Campus Stream & Items */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="live-beacon"></span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Active Campus Sighting Stream
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Real-time feed filtered by academic school, hostel block, or library checkpoint.
            </p>
          </div>

          {/* Quick Filter Stadium Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full p-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
            {[
              { id: "ALL", label: "All Campuses" },
              { id: "campus-15", label: "Campus 15 (CSE)" },
              { id: "campus-3", label: "Campus 3 (Civil/Mech)" },
              { id: "campus-6", label: "Campus 6 (Library)" },
              { id: "food-court-chintan", label: "Food Court" },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCampus(c.id)}
                className={`pill-tab whitespace-nowrap transition-all ${
                  selectedCampus === c.id
                    ? "bg-white text-zinc-950 font-bold shadow-md"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
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
            <div className="py-24 text-center text-xs font-mono text-zinc-500">
              Receiving live telemetry from KIIT cluster...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="glass-card p-14 text-center">
              <HelpCircle className="mx-auto h-12 w-12 text-zinc-600" />
              <h3 className="mt-4 text-sm font-semibold text-white">
                No active listings found for current filter
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Change your campus filter or report a newly sighted lost or found item.
              </p>
              <Link
                href="/report"
                className="mt-6 btn-emerald inline-flex !py-2.5 !px-5 !text-xs font-semibold"
              >
                + Report an Item
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
            className="btn-secondary inline-flex !py-3 !px-8 text-xs font-medium"
          >
            <span>Explore All Telemetry Records</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Campus Safe Zone Checkpoints & Physical Handover Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card !rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 border-emerald-500/20 relative overflow-hidden">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-medium text-emerald-300">
              <span className="live-beacon"></span>
              <span>CAMPUS SAFE ZONE PROTOCOL</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Official Physical Handover Stations
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              Never conduct unverified exchanges. Deposit found items directly at Campus Gate Security Desks or Central Library circulation. Security Officers authenticate ownership via cryptographic QR scanner.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-zinc-300 pt-2">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Campus 15 Gate 1 Desk
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Campus 6 Central Library
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> KSAC Student Counter
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/report"
              className="btn-emerald text-center"
            >
              + Report Item
            </Link>
            <Link
              href="/scan"
              className="btn-secondary text-center"
            >
              Open QR Scanner &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
