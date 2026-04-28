"use client";

import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Search, ArrowRight, Heart, MapPin, ChevronRight,
  Car, Bike, Truck, Shield, MessageSquare, Zap, Plus,
  DollarSign, Calculator, BarChart3, Gauge, TrendingUp,
  Sparkles, Play, ChevronDown, Scale
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { listingsService } from "@/services/listings.service";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

/* ══════════════════════════════════════════════════════════════
   ENHANCED CARTRADE-STYLE DESIGN
   - Improved visual hierarchy
   - Better whitespace
   - Distinct user intent sections
   - Modern interactions
   ══════════════════════════════════════════════════════════════ */

const POPULAR_BRANDS = [
  { name: "Toyota", logo: "/brands/toyota.svg" },
  { name: "Honda", logo: "/brands/honda.svg" },
  { name: "BMW", logo: "/brands/bmw.svg" },
  { name: "Mercedes", logo: "/brands/mercedes.svg" },
  { name: "Audi", logo: "/brands/audi.svg" },
  { name: "Ford", logo: "/brands/ford.svg" },
  { name: "Hyundai", logo: "/brands/hyundai.svg" },
  { name: "Kia", logo: "/brands/kia.svg" },
  { name: "Tesla", logo: "/brands/tesla.svg" },
  { name: "Nissan", logo: "/brands/nissan.svg" },
];

const PRICE_RANGES = [
  { label: "Under $10K", min: 0, max: 10000 },
  { label: "$10K - $25K", min: 10000, max: 25000 },
  { label: "$25K - $50K", min: 25000, max: 50000 },
  { label: "$50K - $100K", min: 50000, max: 100000 },
  { label: "Above $100K", min: 100000, max: null },
];

const BODY_TYPES = [
  { label: "SUV", value: "suv", icon: "🚙" },
  { label: "Sedan", value: "sedan", icon: "🚗" },
  { label: "Hatchback", value: "hatchback", icon: "🚘" },
  { label: "Truck", value: "truck", icon: "🛻" },
  { label: "Coupe", value: "coupe", icon: "🏎️" },
  { label: "Electric", value: "electric", icon: "⚡" },
];

function HomeInner() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("used");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [showAiTooltip, setShowAiTooltip] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["featured-listings"],
    queryFn: () => listingsService.list({ status: "active", size: 8 }),
    staleTime: 60 * 1000,
  });

  const listings = data?.items ?? [];

  // Show AI tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowAiTooltip(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedMake) params.set("make", selectedMake);
    if (activeTab === "new") params.set("condition", "new");
    if (activeTab === "bikes") params.set("type", "bike");
    router.push(`/main/listings?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION - Premium Car Marketplace Feel
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1a1d2e]/60" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          {/* Hero Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 tracking-tight" style={{ color: 'white' }}>
              Find Your Perfect <span style={{ color: '#d02326' }}>Ride</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-4">
              Browse thousands of verified vehicles from trusted sellers
            </p>
            <Link
              href="/main/listings/new"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#d02326] text-white font-semibold rounded hover:bg-[#b81f22] transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Sell Your Vehicle
            </Link>
          </div>

          {/* Enhanced Tabs - Larger, More Prominent */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab("used")}
              className={`relative px-8 py-4 text-base font-bold rounded transition-all duration-300 flex items-center gap-3 ${
                activeTab === "used"
                  ? "bg-[#d02326] text-white shadow-lg shadow-red-500/30 scale-105"
                  : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
              }`}
            >
              <Car className="w-5 h-5" />
              Used Cars
            </button>
            <button
              onClick={() => setActiveTab("bikes")}
              className={`relative px-8 py-4 text-base font-bold rounded transition-all duration-300 flex items-center gap-3 ${
                activeTab === "bikes"
                  ? "bg-[#d02326] text-white shadow-lg shadow-red-500/30 scale-105"
                  : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
              }`}
            >
              <Bike className="w-5 h-5" />
              Bikes
            </button>
          </div>

          {/* Enhanced Search Container - Solid White with Shadow */}
          <div className="bg-white rounded shadow-2xl p-6 lg:p-8 max-w-4xl mx-auto">
            <form onSubmit={handleSearch}>
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                {/* Make Select */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-[#56586a] uppercase tracking-wider mb-2">Make</label>
                  <select
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#f8f9fa] border-2 border-gray-200 rounded text-[#272a41] text-sm font-medium focus:outline-none focus:border-[#d02326] focus:ring-4 focus:ring-red-100 transition-all cursor-pointer"
                  >
                    <option value="">All Makes</option>
                    {POPULAR_BRANDS.map((b) => (
                      <option key={b.name} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Model/Keyword Input */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-[#56586a] uppercase tracking-wider mb-2">Model / Keyword</label>
                  <input
                    type="text"
                    placeholder="e.g. Camry, Civic, SUV..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#f8f9fa] border-2 border-gray-200 rounded text-[#272a41] text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#d02326] focus:ring-4 focus:ring-red-100 transition-all"
                  />
                </div>

                {/* Budget Select */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-[#56586a] uppercase tracking-wider mb-2">Budget</label>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#f8f9fa] border-2 border-gray-200 rounded text-[#272a41] text-sm font-medium focus:outline-none focus:border-[#d02326] focus:ring-4 focus:ring-red-100 transition-all cursor-pointer"
                  >
                    <option value="">Any Price</option>
                    {PRICE_RANGES.map((p) => (
                      <option key={p.label} value={p.min}>{p.label}</option>
                    ))}
                  </select>
                </div>

                {/* Search Button - First Row */}
                <div className="md:col-span-2 flex items-end">
                  <button
                    type="submit"
                    className="w-full px-6 py-3.5 bg-[#d02326] text-white font-bold rounded hover:bg-[#b81f22] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02]"
                  >
                    <Search className="w-5 h-5" />
                    <span className="hidden lg:inline">Search</span>
                  </button>
                </div>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          POPULAR BRANDS - Grayscale to Color on Hover
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#272a41]">Search by Brand</h2>
              <p className="text-[#56586a] mt-1">Find vehicles from your favorite manufacturers</p>
            </div>
            <Link href="/main/listings" className="text-[#d02326] font-semibold hover:underline flex items-center gap-1">
              All Brands <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {POPULAR_BRANDS.map((brand) => (
              <Link
                key={brand.name}
                href={`/main/listings?make=${brand.name}`}
                className="group flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-white rounded border-2 border-gray-200 flex items-center justify-center mb-2 group-hover:border-[#d02326] group-hover:shadow-lg transition-all duration-300 p-2">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-[#56586a] group-hover:text-[#272a41] transition-colors text-center">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURED LISTINGS - Card UI with Rounded Corners & Shadows
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#272a41]">Featured Vehicles</h2>
              <p className="text-[#56586a] mt-1">Hand-picked selections just for you</p>
            </div>
            <Link href="/main/listings" className="text-[#d02326] font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded-lg animate-pulse w-3/4" />
                    <div className="h-7 bg-gray-200 rounded-lg animate-pulse w-1/2" />
                    <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.slice(0, 4).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          WHY CHOOSE US - More Spacious
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#272a41]">Why Choose CarsAndBikes?</h2>
            <p className="text-[#56586a] mt-2 max-w-xl mx-auto">Join thousands of satisfied customers who found their perfect vehicle</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-[#272a41] text-lg mb-2">Verified Sellers</h3>
              <p className="text-sm text-[#56586a] leading-relaxed">Every seller is verified for your safety and peace of mind</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-[#272a41] text-lg mb-2">Best Prices</h3>
              <p className="text-sm text-[#56586a] leading-relaxed">Compare prices and get the best deals in the market</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-[#272a41] text-lg mb-2">Direct Chat</h3>
              <p className="text-sm text-[#56586a] leading-relaxed">Connect directly with sellers for quick negotiations</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-[#272a41] text-lg mb-2">Quick Process</h3>
              <p className="text-sm text-[#56586a] leading-relaxed">List or buy a vehicle in just a few minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA - Sell Your Vehicle
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        {/* Background with car image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#272a41]/95 to-[#272a41]/80" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-[#d02326] text-white text-xs font-bold uppercase tracking-wider rounded mb-4">
                Free Listing
              </span>
              <h2 className="text-4xl font-bold mb-4 leading-tight" style={{ color: 'white' }}>
                Ready to Sell<br />Your Vehicle?
              </h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Join thousands of sellers who trust CarsAndBikes. List your vehicle for free and connect with serious buyers instantly.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/main/listings/new"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#d02326] text-white font-bold rounded hover:bg-[#b81f22] transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                >
                  <Plus className="w-5 h-5" />
                  Post Free Ad
                </Link>
                <Link
                  href="/main/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded p-6 border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#d02326] rounded flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Quick & Easy</p>
                    <p className="text-gray-400 text-sm">List in under 5 minutes</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {["Free vehicle listing", "Reach thousands of buyers", "Secure messaging system", "Get best market price"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          AI CHATBOT BUTTON
          ═══════════════════════════════════════════════════════════ */}
      <Link
        href="/main/chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#d02326] text-white rounded-full shadow-lg shadow-red-500/30 flex items-center justify-center hover:bg-[#b81f22] hover:scale-110 transition-all duration-300"
      >
        <MessageSquare className="w-6 h-6" />
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ENHANCED LISTING CARD - Modern Card UI
   ══════════════════════════════════════════════════════════════ */

function ListingCard({ listing }: { listing: any }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const imageUrl = listing.images?.[0]
    ? listing.images[0].startsWith("http")
      ? listing.images[0]
      : `${process.env.NEXT_PUBLIC_API_URL || ""}/uploads/${listing.images[0]}`
    : "/placeholder-car.jpg";

  return (
    <Link href={`/main/listings/${listing.id}`}>
      <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#d02326]/30 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-car.jpg"; }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
          >
            <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-[#d02326] text-[#d02326]" : "text-gray-500"}`} />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {listing.condition === "new" && (
              <span className="px-2.5 py-1 bg-[#d02326] text-white text-xs font-bold rounded-full">
                New
              </span>
            )}
            {listing.featured && (
              <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-bold text-[#272a41] mb-2 line-clamp-1 group-hover:text-[#d02326] transition-colors text-lg">
            {listing.year} {listing.make} {listing.model}
          </h3>

          {/* Price */}
          <p className="text-2xl font-bold text-[#d02326] mb-3">
            {formatPrice(listing.price)}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-[#56586a] mb-4">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4" />
              {listing.mileage?.toLocaleString() || "0"} mi
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {listing.location?.split(",")[0] || "USA"}
            </span>
          </div>

          {/* CTA */}
          <button className="w-full py-3 border-2 border-[#d02326] text-[#d02326] text-sm font-bold rounded-xl hover:bg-[#d02326] hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
            View Details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </article>
    </Link>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa]" />}>
      <HomeInner />
    </Suspense>
  );
}
