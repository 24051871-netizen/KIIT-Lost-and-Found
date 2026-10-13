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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Campus Lost &amp; Found Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search active reports across all 24 KIIT campuses and hostel complexes.
          </p>
        </div>
        <Link
          href="/report"
          className="inline-flex items-center gap-1.5 rounded-xl bg-kiit-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-kiit-700 transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Report Item
        </Link>
      </div>

      {/* Filter Controls Bar */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keyword (e.g. 2105128, Casio, Dell, KP-7, lab coat)..."
              className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-kiit-700 dark:hover:bg-kiit-600"
          >
            Search
          </button>
        </form>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Campus */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              KIIT Campus / Zone
            </label>
            <select
              value={campusId}
              onChange={(e) => setCampusId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Item Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Report Type
            </label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="ALL">All Reports (Lost &amp; Found)</option>
              <option value="LOST">Lost (Seeking owner/finder)</option>
              <option value="FOUND">Found (Awaiting owner claim)</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Resolution Status
            </label>
            <div className="flex gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-kiit-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active (Unresolved)</option>
                <option value="CLAIM_PENDING">Claim in Review</option>
                <option value="RETURNED">Returned / Handed Over</option>
              </select>

              <button
                type="button"
                onClick={handleReset}
                title="Reset all filters"
                className="rounded-xl border border-slate-200 px-2.5 py-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mt-8 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">
          Showing {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Grid */}
      <div className="mt-4">
        {loading ? (
          <div className="py-24 text-center text-xs text-slate-400">Loading catalog items...</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
            <AlertCircle className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
              No matching records found
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Try broadening your filter criteria or search query.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
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
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-slate-500">Loading catalog...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
