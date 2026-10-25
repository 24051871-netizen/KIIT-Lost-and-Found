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
  Building2,
  ArrowUpRight,
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
    <div className="flex flex-col gap-16 pb-28 text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="aurora-bg relative pt-16 pb-20 border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Ambient Live Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <span className="aura-dot-live"></span>
            <span>KIIT University • Zero-Trust Campus Recovery</span>
            <span className="text-emerald-500/40">|</span>
            <span className="text-slate-300 font-normal">Active Protocol</span>
          </div>

          <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            Recover What&apos;s Yours. <br />
            <span className="text-gradient-emerald">Safeguard What&apos;s Found.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            The intelligent property recovery network for KIIT students, faculty, and hostel residents. Protected by cryptographic ownership challenges and Safe Zone QR handovers.
          </p>

          {/* Search & Actions */}
          <div className="mx-auto mt-10 max-w-2xl space-y-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 blur opacity-60 group-hover:opacity-100 transition duration-300" />
              <div className="relative flex items-center rounded-full border border-white/15 bg-slate-950/80 backdrop-blur-2xl px-5 py-3.5 shadow-2xl">
                <Search className="h-5 w-5 text-emerald-400 shrink-0 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by keyword, roll number, gadget model, or hostel..."
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/report"
                className="aura-btn-primary w-full sm:w-auto text-center"
              >
                <PlusCircle className="h-4 w-4" />
                Report an Item
              </Link>
              <Link
                href="/browse"
                className="aura-btn-secondary w-full sm:w-auto text-center"
              >
                Browse All Telemetry &rarr;
              </Link>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              @kiit.ac.in Student Verified
            </span>
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-400" />
              SHA-256 Serial Hashing
            </span>
            <span className="flex items-center gap-2">
              <QrCode className="h-4 w-4 text-teal-400" />
              24 Safe Zone Checkpoints
            </span>
          </div>
        </div>
      </section>

      {/* Metrics HUD (Bento Style) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="aura-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Reported
              </span>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Layers className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-white tracking-tight">
              {stats.total.toString().padStart(2, "0")}
            </p>
            <span className="mt-1 block text-xs text-slate-400">
              Across 24 KIIT Campuses
            </span>
          </div>

          {/* Card 2 */}
          <div className="aura-card p-6 border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Verified Returns
              </span>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-emerald-400 tracking-tight">
              {stats.returned.toString().padStart(2, "0")}
            </p>
            <span className="mt-1 block text-xs text-slate-400">
              Resolved via QR Handover
            </span>
          </div>

          {/* Card 3 */}
          <div className="aura-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Recovery Rate
              </span>
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-white tracking-tight">
              {stats.recoveryRate}%
            </p>
            <span className="mt-1 block text-xs text-slate-400">
              Zero-Trust Protocol Efficiency
            </span>
          </div>

          {/* Card 4 */}
          <div className="aura-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                ID Cards Restored
              </span>
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Lock className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-white tracking-tight">
              {stats.idCardsRecovered.toString().padStart(2, "0")}
            </p>
            <span className="mt-1 block text-xs text-slate-400">
              Institutional Roll Lock
            </span>
          </div>
        </div>
      </section>

      {/* Explore By Category */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span className="aura-dot-live"></span>
            <h2 className="text-base font-bold text-white tracking-tight">
              Explore by Category
            </h2>
          </div>
          <Link
            href="/browse"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
          >
            View All Categories <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-5">
          {ITEM_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/browse?category=${cat.id}`}
              className="aura-card flex flex-col items-center justify-center p-4 text-center group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 text-slate-300 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 group-hover:text-emerald-300 transition-all">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="mt-2.5 text-xs font-medium text-slate-300 group-hover:text-white line-clamp-1 transition-colors">
                {cat.name.split("/")[0]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Campus Selector & Items Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="aura-dot-live"></span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Live Campus Feed
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Filter real-time sightings by school, hostel cluster, or campus checkpoint.
            </p>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
            {[
              { id: "ALL", label: "All Campuses" },
              { id: "campus-15", label: "Campus 15 (CSE)" },
              { id: "campus-3", label: "Campus 3 (Eng)" },
              { id: "campus-6", label: "Campus 6 (Library)" },
              { id: "food-court-chintan", label: "Food Court" },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCampus(c.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCampus === c.id
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
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
            <div className="py-20 text-center text-xs font-medium text-slate-500 tracking-wider">
              Syncing live sightings from KIIT database...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="aura-card p-12 text-center">
              <HelpCircle className="mx-auto h-12 w-12 text-slate-600" />
              <h3 className="mt-3 text-sm font-bold text-white">
                No Listings Active for Current Filter
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
                Try switching the campus filter or report a newly sighted item to initiate recovery.
              </p>
              <Link
                href="/report"
                className="mt-6 aura-btn-primary inline-flex !py-2.5 !px-5 !text-xs"
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
            className="aura-btn-secondary inline-flex !py-3 !px-8 text-xs font-semibold"
          >
            Explore Complete Catalog &rarr;
          </Link>
        </div>
      </section>

      {/* Campus Security Checkpoints & Safe Handover Hubs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="aura-card !rounded-[28px] p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 border-emerald-500/20 relative overflow-hidden">
          <div className="space-y-4 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <span className="aura-dot-live"></span>
              Safe Zone Handover Protocol
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Official Physical Handover Stations
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Never conduct unverified exchanges in unmonitored hostel rooms. Hand over found items at official Campus Gate Desks or Central Library circulation. Security Officers authenticate ownership via cryptographic QR scanner.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300 pt-2">
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
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto relative z-10">
            <Link
              href="/report"
              className="aura-btn-primary text-center"
            >
              + Initiate Report
            </Link>
            <Link
              href="/scan"
              className="aura-btn-secondary text-center"
            >
              Open QR Scanner &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
