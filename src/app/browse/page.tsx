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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 bg-black text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
            KIIT PROTOCOL // TELEMETRY DATABASE
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.18em] text-white">
            CAMPUS PROPERTY CATALOG
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1 uppercase tracking-wider">
            Active reports across 24 KIIT academic campuses, labs, and residential complexes.
          </p>
        </div>
        <Link
          href="/report"
          className="spacex-btn-primary !py-2.5 !px-5 self-start sm:self-auto"
        >
          + REPORT PROPERTY
        </Link>
      </div>

      {/* Filter Controls Bar (SpaceX Telemetry Filter) */}
      <div className="mt-6 border border-white/10 bg-[#070707] p-5 space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH BY KEYWORD, ROLL NUMBER, MODEL, SERIAL HASH..."
              className="w-full border border-white/20 bg-black pl-10 pr-4 py-2.5 text-xs font-mono uppercase tracking-wider text-white focus:border-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="spacex-btn-primary !py-2 !px-6"
          >
            EXECUTE
          </button>
        </form>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Campus */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
              CAMPUS ZONE
            </label>
            <select
              value={campusId}
              onChange={(e) => setCampusId(e.target.value)}
              className="w-full border border-white/20 bg-black px-3 py-2 text-xs font-mono uppercase text-white focus:border-white focus:outline-none"
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
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
              CATEGORY CLASSIFICATION
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-white/20 bg-black px-3 py-2 text-xs font-mono uppercase text-white focus:border-white focus:outline-none"
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
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
              LISTING VECTOR
            </label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full border border-white/20 bg-black px-3 py-2 text-xs font-mono uppercase text-white focus:border-white focus:outline-none"
            >
              <option value="ALL">ALL VECTORS (LOST &amp; FOUND)</option>
              <option value="LOST">LOST (SEEKING RECOVERY)</option>
              <option value="FOUND">FOUND (SAFE CUSTODY)</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
              LIFECYCLE STATUS
            </label>
            <div className="flex gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex-1 border border-white/20 bg-black px-3 py-2 text-xs font-mono uppercase text-white focus:border-white focus:outline-none"
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
                className="border border-white/20 px-3 py-2 bg-white/5 hover:bg-white hover:text-black transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mt-8 flex items-center justify-between pb-2 border-b border-white/10">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
          TELEMETRY RECORDS // {items.length} {items.length === 1 ? "ITEM LOCATED" : "ITEMS LOCATED"}
        </span>
      </div>

      {/* Grid */}
      <div className="mt-6">
        {loading ? (
          <div className="py-24 text-center text-xs font-mono uppercase tracking-widest text-zinc-500">
            RECEIVING TELEMETRY FROM MONGO CLUSTER...
          </div>
        ) : items.length === 0 ? (
          <div className="border border-white/10 p-12 text-center bg-[#060606]">
            <AlertCircle className="mx-auto h-10 w-10 text-zinc-600" />
            <h3 className="mt-3 text-xs font-mono uppercase tracking-widest text-white">
              NO MATCHING TELEMETRY RECORDS FOUND
            </h3>
            <p className="mt-1 text-xs font-mono text-zinc-500">
              Broaden query parameters or reset spatial filter filters.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 spacex-btn-secondary inline-block !py-2 !px-4 !text-[11px]"
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
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-slate-500">Loading catalog...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
