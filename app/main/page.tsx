"use client";

import Link from "next/link";
import { Suspense, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Car, Bike, Truck, Package, ChevronLeft, ChevronRight, Shield, MessageSquare, TrendingUp, ArrowRight, Zap } from "lucide-react";
import { listingsService } from "@/services/listings.service";
import { ListingCard } from "@/features/listings/listing-card";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { imageUrl } from "@/lib/utils";

const CATEGORIES = [
  { icon: Car,     label: "Cars",   value: "car",   count: "1,000+", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-400" },
  { icon: Bike,    label: "Bikes",  value: "bike",  count: "1,000+", color: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 hover:border-violet-400" },
  { icon: Truck,   label: "Trucks", value: "truck", count: "1,000+", color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:border-orange-400" },
  { icon: Package, label: "Vans",   value: "van",   count: "1,000+", color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-400" },
];

const TRUST_ITEMS = [
  { icon: Shield,        title: "Verified Listings",    desc: "Every ad reviewed for authenticity" },
  { icon: MessageSquare, title: "Direct Seller Chat",   desc: "No middleman — talk directly" },
  { icon: Zap,           title: "Post in 60 Seconds",   desc: "Simple, fast listing process" },
  { icon: TrendingUp,    title: "4,000+ Active Ads",    desc: "New vehicles added daily" },
];

function FeaturedCarousel({ listings }: { listings: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {listings.map((listing) => (
          <div key={listing.id} className="snap-start shrink-0 w-[280px] sm:w-[300px]">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-9 h-9 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden sm:flex"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden sm:flex"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function HomeInner() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ["home-featured"],
    queryFn: () => listingsService.list({ status: "active", size: 10 }),
    staleTime: 2 * 60 * 1000,
  });

  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ["home-recent"],
    queryFn: () => listingsService.list({ status: "active", size: 6, page: 2 }),
    staleTime: 2 * 60 * 1000,
  });

  const featuredListings = featuredData?.items ?? [];
  const recentListings = recentData?.items ?? [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/main/listings?${params.toString()}`);
  };

  return (
    <div className="space-y-12 pb-8">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="-mx-4 sm:-mx-6 px-4 sm:px-6 py-14 sm:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">4,011 vehicles · Free to browse</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3">
            Find Your Perfect<br />
            <span className="text-blue-400">Vehicle Today</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mb-8 max-w-md mx-auto">
            Browse cars, bikes, trucks and vans from verified private sellers and dealers across the US.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Make, model, or keyword…"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base font-medium"
                aria-label="Search vehicles"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Browse by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map(({ icon: Icon, label, value, count, color }) => (
            <Link
              key={value}
              href={`/main/listings?type=${value}`}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all hover:shadow-md ${color}`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm">{label}</p>
                <p className="text-xs opacity-70 font-medium">{count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured ───────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Featured vehicles</h2>
          <Link href="/main/listings" className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {featuredLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[280px]"><ListingCardSkeleton /></div>
            ))}
          </div>
        ) : (
          <FeaturedCarousel listings={featuredListings} />
        )}
      </section>

      {/* ── Recently added ─────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recently added</h2>
          <Link href="/main/listings?sort=created_at_desc" className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
            See more <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recentLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* ── Trust strip ────────────────────────────────────── */}
      <section className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
        <h2 className="text-center text-base font-bold text-slate-900 mb-6">Why CarsAndBikes?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm font-bold text-slate-900">{title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Post CTA ───────────────────────────────────────── */}
      <section className="bg-blue-600 rounded-2xl p-8 sm:p-10 text-center text-white">
        <h2 className="text-2xl font-black mb-2">Ready to sell?</h2>
        <p className="text-blue-200 text-sm mb-6 max-w-sm mx-auto">
          Post your vehicle ad for free. Reach thousands of buyers instantly.
        </p>
        <Link
          href="/main/listings/new"
          className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3.5 rounded-xl transition-colors"
        >
          Post Free Ad <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  );
}
