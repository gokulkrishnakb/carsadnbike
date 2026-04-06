"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
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
  { value: "price_asc",       label: "Price: Low → High" },
  { value: "price_desc",      label: "Price: High → Low" },
  { value: "year_desc",       label: "Year: Newest" },
] as const;

function ListingsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("q") ?? undefined,
    vehicle_type: (searchParams.get("type") as SearchFilters["vehicle_type"]) ?? undefined,
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
    <div className="space-y-5">
      {/* Search + controls bar */}
      <div className="flex gap-2 items-stretch">
        <div className="flex-1">
          <SearchBar
            defaultValue={filters.query ?? ""}
            onSearch={handleSearch}
            placeholder="Make, model, keyword…"
          />
        </div>

        {/* Sort */}
        <div className="relative shrink-0">
          <select
            value={filters.sort ?? "created_at_desc"}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as SearchFilters["sort"], page: 1 }))}
            className="appearance-none h-full bg-white border border-slate-200 pl-3 pr-8 text-sm text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer font-medium hover:border-slate-300 transition-colors min-h-[44px]"
            aria-label="Sort listings"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Filter toggle — mobile */}
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden flex items-center gap-1.5 bg-white border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:border-slate-400 transition-colors min-h-[44px] shrink-0"
          aria-label={`Filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ""}`}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center" aria-hidden="true">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0" aria-label="Filters">
          <div className="bg-white border border-slate-200 p-5 sticky top-20">
            <FilterSidebar filters={filters} onChange={handleFiltersChange} />
          </div>
        </aside>

        {/* Listings area */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Result count + clear */}
          <div className="flex items-center justify-between h-8">
            {isLoading ? (
              <div className="h-3.5 w-32 bg-slate-100 animate-pulse" />
            ) : (
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-900">{total.toLocaleString()}</span>{" "}
                vehicle{total !== 1 ? "s" : ""}
              </p>
            )}
            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters({ query: filters.query, sort: filters.sort, page: 1, size: PAGE_SIZE })}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold min-h-[32px] px-1"
                aria-label="Clear all active filters"
              >
                <X className="h-3 w-3" aria-hidden="true" /> Clear filters
              </button>
            )}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading listings">
              {Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}
            </div>
          ) : allListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center" role="status">
              <p className="text-4xl mb-4" aria-hidden="true">🔍</p>
              <p className="text-base font-bold text-slate-900 mb-1">No vehicles found</p>
              <p className="text-sm text-slate-500 mb-5">Try adjusting your filters or search terms</p>
              {activeFilterCount > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setFilters({ query: filters.query, sort: filters.sort, page: 1, size: PAGE_SIZE })}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {allListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="secondary"
                size="lg"
                loading={isFetchingNextPage}
                onClick={() => fetchNextPage()}
                className="px-10 min-h-[48px]"
              >
                Load more
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
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-80 bg-white border-l border-slate-200 z-50 overflow-y-auto lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Search filters"
            >
              <div className="p-5">
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
