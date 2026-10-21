"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Item, ItemType, ItemCategory } from "@/types";
import ItemCard from "@/components/ItemCard";
import { KIIT_CAMPUSES, ITEM_CATEGORIES } from "@/lib/kiit-data";
import { Search, Filter, RotateCcw, AlertCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function BrowseContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [campusId, setCampusId] = useState("ALL");
  const [category, setCategory] = useState(initialCategory);
  const [itemType, setItemType] = useState<string>("ALL");
  const [status, setStatus] = useState<string>("ALL");

  useEffect(() => {
    fetchFilteredItems();
  }, [campusId, category, itemType, status]);

  const fetchFilteredItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (campusId !== "ALL") params.append("campusId", campusId);
      if (category !== "ALL") params.append("category", category);
      if (itemType !== "ALL") params.append("itemType", itemType);
      if (status !== "ALL") params.append("status", status);

      const res = await fetch(`/api/items?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.items) {
        setItems(data.items);
      }
    } catch (e) {
      console.error("Filter query failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredItems();
  };

  const handleReset = () => {
    setSearch("");
    setCampusId("ALL");
    setCategory("ALL");
    setItemType("ALL");
    setStatus("ALL");
  };

  return (
    <div className="min-h-screen nothing-dot-grid py-10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="nothing-red-dot"></span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                KIIT (R) OS // RECOVERY DATABASE
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-4xl font-ndot uppercase tracking-[0.14em] text-white">
              PROPERTY CATALOG
            </h1>
            <p className="text-xs font-mono text-zinc-400 mt-1 uppercase tracking-wider">
              Active reports across 24 KIIT academic campuses, labs, and residential complexes.
            </p>
          </div>
          <Link
            href="/report"
            className="nothing-btn-primary !py-2.5 !px-6 self-start sm:self-auto"
          >
            + REPORT PROPERTY
          </Link>
        </div>

        {/* Filter Controls Bar (Nothing OS Stadium Widget) */}
        <div className="mt-8 nothing-widget p-6 space-y-5">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH BY KEYWORD, ROLL NUMBER, MODEL, SERIAL HASH..."
                className="w-full rounded-full border border-white/20 bg-zinc-950/80 pl-11 pr-5 py-3 text-xs font-mono uppercase tracking-wider text-white focus:border-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="nothing-btn-primary !py-3 !px-7"
            >
              SEARCH &rarr;
            </button>
          </form>

          {/* Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Campus */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                CAMPUS ZONE
              </label>
              <select
                value={campusId}
                onChange={(e) => setCampusId(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-zinc-950 px-3.5 py-2.5 text-xs font-mono uppercase text-white focus:border-white focus:outline-none"
              >
                <option value="ALL">ALL CAMPUSES (1 TO 24)</option>
                {KIIT_CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                CATEGORY CLASSIFICATION
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-zinc-950 px-3.5 py-2.5 text-xs font-mono uppercase text-white focus:border-white focus:outline-none"
              >
                <option value="ALL">ALL CATEGORIES</option>
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Item Type (Lost vs Found) */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                LISTING VECTOR
              </label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-zinc-950 px-3.5 py-2.5 text-xs font-mono uppercase text-white focus:border-white focus:outline-none"
              >
                <option value="ALL">ALL VECTORS (LOST &amp; FOUND)</option>
                <option value="LOST">LOST (SEEKING RECOVERY)</option>
                <option value="FOUND">FOUND (SAFE CUSTODY)</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                LIFECYCLE STATUS
              </label>
              <div className="flex gap-2">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex-1 rounded-2xl border border-white/20 bg-zinc-950 px-3.5 py-2.5 text-xs font-mono uppercase text-white focus:border-white focus:outline-none"
                >
                  <option value="ALL">ALL STATUSES</option>
                  <option value="ACTIVE">ACTIVE (UNRESOLVED)</option>
                  <option value="CLAIM_PENDING">CLAIM IN REVIEW</option>
                  <option value="RETURNED">RESOLVED / RETURNED</option>
                </select>

                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset all filters"
                  className="rounded-2xl border border-white/20 px-3.5 py-2.5 bg-white/5 hover:bg-white hover:text-black transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mt-10 flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="nothing-red-dot"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-300">
              RECORDS // {items.length} {items.length === 1 ? "ITEM LOCATED" : "ITEMS LOCATED"}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="py-24 text-center text-xs font-mono uppercase tracking-widest text-zinc-500">
              RECEIVING TELEMETRY FROM MONGO CLUSTER...
            </div>
          ) : items.length === 0 ? (
            <div className="nothing-widget p-12 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-zinc-600" />
              <h3 className="mt-3 text-xs font-mono uppercase tracking-widest text-white">
                NO MATCHING TELEMETRY RECORDS FOUND
              </h3>
              <p className="mt-1 text-xs font-mono text-zinc-500">
                Broaden query parameters or reset spatial filter filters.
              </p>
              <button
                onClick={handleReset}
                className="mt-6 nothing-btn-secondary inline-flex !py-2.5 !px-5 !text-[10px]"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-slate-500">Loading catalog...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
