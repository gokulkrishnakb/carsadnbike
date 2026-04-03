"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, LayoutGrid, List, ChevronDown } from "lucide-react";
import { listingsService } from "@/services/listings.service";
import { searchService } from "@/services/search.service";
import { ListingCard } from "@/features/listings/listing-card";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { FilterSidebar } from "@/features/search/filter-sidebar";
import { SearchBar } from "@/features/search/search-bar";
import { Button } from "@/components/ui/button";
import type { SearchFilters } from "@/types";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "created_at_desc", label: "Newest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "year_desc", label: "Year: Newest" },
] as const;

function ListingsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("q") ?? undefined,
    sort: "created_at_desc",
    page: 1,
    size: PAGE_SIZE,
  });

  const hasQuery = Boolean(filters.query);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["listings", filters],
    queryFn: ({ pageParam = 1 }) => {
      const f = { ...filters, page: pageParam as number };
      if (hasQuery) return searchService.search(f);
      return listingsService.list({ ...f, status: "active" });
    },
    initialPageParam: 1,
    getNextPageParam: (last, pages) => {
      const loaded = pages.flatMap((p) => p.items).length;
      return loaded < last.total ? pages.length + 1 : undefined;
    },
  });

  const allListings = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  const handleFiltersChange = useCallback((f: SearchFilters) => setFilters(f), []);

  const handleSearch = useCallback((query: string) => {
    setFilters((f) => ({ ...f, query: query || undefined, page: 1 }));
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    router.replace(`/main/listings?${params.toString()}`, { scroll: false });
  }, [router]);

  const activeFilterCount = [
    filters.vehicle_type, filters.condition, filters.min_price,
    filters.min_year, filters.max_year, filters.make, filters.location,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1">
          <SearchBar
            defaultValue={filters.query ?? ""}
            onSearch={handleSearch}
            placeholder="Search by make, model, or keyword…"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Filter toggle */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(true)}
            className="lg:hidden gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold leading-none">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sort ?? "created_at_desc"}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as SearchFilters["sort"], page: 1 }))}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 shadow-sm cursor-pointer font-medium transition-colors hover:border-slate-300"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => setView("grid")}
              className={`p-2.5 transition-colors ${view === "grid" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"}`}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2.5 transition-colors border-l border-slate-200 ${view === "list" ? "bg-blue-600 text-white border-blue-600" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"}`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-7">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-24">
            <FilterSidebar filters={filters} onChange={handleFiltersChange} />
          </div>
        </aside>

        {/* Listings */}
        <div className="flex-1 min-w-0">
          {/* Result count */}
          <div className="flex items-center justify-between mb-5">
            {isLoading ? (
              <div className="skeleton h-4 w-32 rounded-lg" />
            ) : (
              <p className="text-sm text-slate-500">
                <span className="text-slate-900 font-bold">{total.toLocaleString()}</span>{" "}
                vehicle{total !== 1 ? "s" : ""} found
              </p>
            )}
            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters({ query: filters.query, sort: filters.sort, page: 1, size: PAGE_SIZE })}
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                <X className="h-3 w-3" /> Clear all filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className={`grid gap-5 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}
            </div>
          ) : allListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-5">
                <span className="text-3xl">🔍</span>
              </div>
              <p className="text-lg font-bold text-slate-900 mb-1">No vehicles found</p>
              <p className="text-sm text-slate-500">Try adjusting your filters or search terms</p>
              {activeFilterCount > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-5"
                  onClick={() => setFilters({ query: filters.query, sort: filters.sort, page: 1, size: PAGE_SIZE })}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className={`grid gap-5 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {allListings.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          )}

          {hasNextPage && (
            <div className="flex justify-center mt-10">
              <Button
                variant="secondary"
                size="lg"
                loading={isFetchingNextPage}
                onClick={() => fetchNextPage()}
                className="px-10"
              >
                Load more vehicles
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-80 bg-white border-l border-slate-200 z-50 overflow-y-auto shadow-2xl lg:hidden"
            >
              <div className="p-6">
                <FilterSidebar
                  filters={filters}
                  onChange={handleFiltersChange}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense>
      <ListingsPageInner />
    </Suspense>
  );
}
