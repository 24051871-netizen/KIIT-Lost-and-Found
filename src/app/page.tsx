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
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-kiit-50/80 via-white to-transparent pt-12 pb-16 dark:from-kiit-950/20 dark:via-slate-950 dark:to-transparent border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-kiit-200 bg-white px-3.5 py-1 text-xs font-semibold text-kiit-800 shadow-sm dark:border-kiit-800 dark:bg-kiit-950 dark:text-kiit-300">
            <Sparkles className="h-3.5 w-3.5 text-kiit-600" />
            <span>KIIT Deemed to be University • Campus Recovery System</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
            Lost Something in Campus? <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-kiit-700 via-kiit-600 to-emerald-500 bg-clip-text text-transparent">
              Claim it with QR Proof.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300 leading-relaxed">
            The dedicated platform for KIIT students, faculty, and hostel residents. Double-blind
            ownership verification prevents fraudulent claims, and cryptographically signed QR codes
            verify physical handovers.
          </p>

          {/* Quick Search & Actions */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID cards, calculators, chargers, keys..."
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm shadow-sm focus:border-kiit-600 focus:outline-none focus:ring-2 focus:ring-kiit-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <Link
                href="/report"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-kiit-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-kiit-600/20 hover:bg-kiit-700 transition-colors shrink-0"
              >
                <PlusCircle className="h-4 w-4" />
                Report Lost / Found
              </Link>
            </div>
          </div>

          {/* Key Trust Signals */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-kiit-600" />
              Restricted to @kiit.ac.in
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-kiit-600" />
              Double-Blind Ownership Checks
            </span>
            <span className="flex items-center gap-1.5">
              <QrCode className="h-4 w-4 text-kiit-600" />
              Signed QR Handover Audit
            </span>
          </div>
        </div>
      </section>

      {/* Live Campus Recovery Metrics */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Reported
            </span>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.total}
            </p>
            <span className="mt-1 block text-[11px] text-slate-400">Items across campuses</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Items Returned
            </span>
            <p className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats.returned}
            </p>
            <span className="mt-1 block text-[11px] text-slate-400">Verified via QR scan</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Recovery Rate
            </span>
            <p className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              {stats.recoveryRate}%
            </p>
            <span className="mt-1 block text-[11px] text-slate-400">Resolution efficiency</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-kiit-700 uppercase tracking-wider">
              KIIT ID Cards
            </span>
            <p className="mt-2 text-3xl font-extrabold text-kiit-700 dark:text-kiit-400">
              {stats.idCardsRecovered}
            </p>
            <span className="mt-1 block text-[11px] text-slate-400">Protected roll numbers</span>
          </div>
        </div>
      </section>

      {/* Explore By Category */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Common Lost &amp; Found Categories
          </h2>
          <Link
            href="/browse"
            className="text-xs font-semibold text-kiit-600 hover:text-kiit-700 dark:text-kiit-400"
          >
            See all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {ITEM_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/browse?category=${cat.id}`}
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-kiit-500 hover:shadow-md transition-all text-center dark:border-slate-800 dark:bg-slate-900 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-kiit-100 group-hover:text-kiit-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-kiit-950 dark:group-hover:text-kiit-400 transition-colors">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="mt-2 text-[11px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                {cat.name.split("/")[0]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Campus Selector & Items Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recent Campus Activity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Filter by specific KIIT school, hostel cluster, or central library.
            </p>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedCampus("ALL")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCampus === "ALL"
                  ? "bg-kiit-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              All Campuses
            </button>
            <button
              onClick={() => setSelectedCampus("campus-15")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCampus === "campus-15"
                  ? "bg-kiit-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              Campus 15 (CSE)
            </button>
            <button
              onClick={() => setSelectedCampus("campus-3")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCampus === "campus-3"
                  ? "bg-kiit-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              Campus 3 (Mech/Civil)
            </button>
            <button
              onClick={() => setSelectedCampus("campus-6")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCampus === "campus-6"
                  ? "bg-kiit-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              Campus 6 (Library)
            </button>
            <button
              onClick={() => setSelectedCampus("food-court-chintan")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCampus === "food-court-chintan"
                  ? "bg-kiit-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              Kathajodi / Food Court
            </button>
          </div>
        </div>

        {/* Item Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="py-20 text-center text-sm text-slate-500">
              Loading campus listings...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
              <HelpCircle className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-3 text-base font-bold text-slate-800 dark:text-slate-200">
                No items found for this selection
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Try switching the campus filter or report a new lost/found item.
              </p>
              <Link
                href="/report"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-kiit-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-kiit-700"
              >
                <PlusCircle className="h-4 w-4" /> Report an Item
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

        <div className="mt-8 text-center">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 text-sm font-semibold text-kiit-700 hover:text-kiit-800 dark:text-kiit-400"
          >
            View Complete Filterable Catalog &rarr;
          </Link>
        </div>
      </section>

      {/* Campus Security Checkpoints & Safe Handover Hubs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-kiit-950 p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 border border-slate-800">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-kiit-500/20 px-3 py-1 text-xs font-semibold text-kiit-300 border border-kiit-500/30">
              <ShieldCheck className="h-4 w-4 text-kiit-400" />
              Official Campus Safe Zones
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Prefer Handing Over at Campus Gate Security?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              If you don&apos;t wish to meet in person, deposit the found item at your campus security desk or hostel caretaker office. Security staff can scan the owner&apos;s QR code directly upon collection.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-kiit-400" /> Campus 15 Gate 1 Security Desk
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-kiit-400" /> Campus 6 Central Library Circulation Desk
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-kiit-400" /> KSAC Student Desk
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/report"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-kiit-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-kiit-600/30 hover:bg-kiit-500 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Report Found Item Now
            </Link>
            <Link
              href="/scan"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-xs font-semibold text-slate-200 hover:bg-slate-700/80 transition-colors"
            >
              <QrCode className="h-4 w-4 text-kiit-400" />
              Open Security QR Scanner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
