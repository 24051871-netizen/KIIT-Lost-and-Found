"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Item, ItemType, ItemCategory } from "@/types";
import ItemCard from "@/components/ItemCard";
import { KIIT_CAMPUSES, ITEM_CATEGORIES } from "@/lib/kiit-data";
import { Search, Filter, RotateCcw, AlertCircle, PlusCircle, Sparkles } from "lucide-react";
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
    <div className="min-h-screen cyber-grid py-12 bg-[#06070a] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="live-beacon"></span>
              <span className="text-xs font-mono font-medium text-emerald-400">
                KIIT PROTOCOL // RECOVERY REPOSITORY
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Campus Property Catalog
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Active lost and found telemetry across all 24 KIIT academic schools, labs, and residences.
            </p>
          </div>
          <Link
            href="/report"
            className="btn-emerald !py-2.5 !px-5 self-start sm:self-auto text-xs font-semibold"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Report Item</span>
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-8 glass-card p-6 space-y-5">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by keyword, roll number, brand, model, or landmark..."
                className="w-full glass-input pl-11 pr-5 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-500"
              />
            </div>
            <button
              type="submit"
              className="btn-primary !py-3 !px-7 text-xs font-semibold"
            >
              Search
            </button>
          </form>

          {/* Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Campus */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Campus Location
              </label>
              <select
                value={campusId}
                onChange={(e) => setCampusId(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 text-xs text-white"
              >
                <option value="ALL" className="bg-[#0b0e17]">All Campuses (1 to 24)</option>
                {KIIT_CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#0b0e17]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 text-xs text-white"
              >
                <option value="ALL" className="bg-[#0b0e17]">All Categories</option>
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#0b0e17]">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Item Type (Lost vs Found) */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Listing Type
              </label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 text-xs text-white"
              >
                <option value="ALL" className="bg-[#0b0e17]">All Types (Lost &amp; Found)</option>
                <option value="LOST" className="bg-[#0b0e17]">Lost (Seeking Recovery)</option>
                <option value="FOUND" className="bg-[#0b0e17]">Found (In Safe Custody)</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Lifecycle Status
              </label>
              <div className="flex gap-2">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex-1 glass-input px-3.5 py-2.5 text-xs text-white"
                >
                  <option value="ALL" className="bg-[#0b0e17]">All Statuses</option>
                  <option value="ACTIVE" className="bg-[#0b0e17]">Active (Unclaimed)</option>
                  <option value="CLAIM_PENDING" className="bg-[#0b0e17]">Claim in Review</option>
                  <option value="RETURNED" className="bg-[#0b0e17]">Returned / Resolved</option>
                </select>

                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset all filters"
                  className="glass-card px-3.5 py-2.5 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors rounded-xl flex items-center justify-center"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mt-10 flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="live-beacon"></span>
            <span className="text-xs font-mono text-zinc-300">
              Verified Records: {items.length} {items.length === 1 ? "Item Located" : "Items Located"}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="py-24 text-center text-xs font-mono text-zinc-500">
              Receiving live telemetry from MongoDB cluster...
            </div>
          ) : items.length === 0 ? (
            <div className="glass-card p-14 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-zinc-600" />
              <h3 className="mt-4 text-sm font-semibold text-white">
                No matching telemetry records found
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Broaden query parameters or reset category and campus filters.
              </p>
              <button
                onClick={handleReset}
                className="mt-6 btn-secondary inline-flex !py-2.5 !px-5 !text-xs font-medium"
              >
                Reset Filters
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
