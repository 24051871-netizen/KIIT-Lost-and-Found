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
    <div className="min-h-screen py-10 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="aura-dot-live"></span>
              <span className="text-xs font-semibold text-emerald-400">
                Live Directory • 24 Campuses
              </span>
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Campus Property Catalog
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Active verified lost &amp; found reports across all KIIT colleges, labs, and hostel clusters.
            </p>
          </div>
          <Link
            href="/report"
            className="aura-btn-primary !py-2.5 !px-6 self-start sm:self-auto text-xs"
          >
            <PlusCircle className="h-4 w-4" />
            Report Property
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-8 aura-card p-6 space-y-5">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-emerald-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, roll number, model, serial hash, or location..."
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-11 pr-5 py-3 text-sm text-white placeholder-slate-400 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>
            <button
              type="submit"
              className="aura-btn-primary !py-3 !px-7 text-xs"
            >
              Search Records
            </button>
          </form>

          {/* Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Campus */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Campus Zone
              </label>
              <select
                value={campusId}
                onChange={(e) => setCampusId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer"
              >
                <option value="ALL">All Campuses (1 to 24)</option>
                {KIIT_CAMPUSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Item Type (Lost vs Found) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status Vector
              </label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer"
              >
                <option value="ALL">All (Lost &amp; Found)</option>
                <option value="LOST">Lost (Seeking Recovery)</option>
                <option value="FOUND">Found (In Safe Custody)</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Lifecycle State
              </label>
              <div className="flex gap-2">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer"
                >
                  <option value="ALL">All States</option>
                  <option value="ACTIVE">Active (Unresolved)</option>
                  <option value="CLAIM_PENDING">Claim in Review</option>
                  <option value="RETURNED">Resolved / Returned</option>
                </select>

                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset all filters"
                  className="rounded-xl border border-white/10 px-3.5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all"
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
            <span className="aura-dot-live"></span>
            <span className="text-xs font-semibold text-slate-300">
              Showing {items.length} {items.length === 1 ? "Item Record" : "Item Records"}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="py-24 text-center text-xs font-medium text-slate-500">
              Fetching catalog entries from MongoDB...
            </div>
          ) : items.length === 0 ? (
            <div className="aura-card p-14 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-slate-600" />
              <h3 className="mt-3 text-base font-bold text-white">
                No Matching Property Records Found
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Broaden your search keywords or clear campus filters to see all reports.
              </p>
              <button
                onClick={handleReset}
                className="mt-6 aura-btn-secondary inline-flex !py-2.5 !px-5 !text-xs"
              >
                Reset Filter Settings
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
