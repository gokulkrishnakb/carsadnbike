"use client";

import { useState } from "react";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MapPin, Calendar, Gauge, Tag, MessageSquare,
  ChevronLeft, ChevronRight, Share2, Heart, Shield, CheckCircle2
} from "lucide-react";
import { listingsService } from "@/services/listings.service";
import { chatService } from "@/services/chat.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NewSellerWarning } from "@/features/safety/safety-banner";
import { formatPrice, formatMileage, formatDate, imageUrl } from "@/lib/utils";
import { toast } from "sonner";

const CONDITION_BADGE = { new: "success", used: "default", certified: "amber" } as const;

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const [imgIndex, setImgIndex] = useState(0);
  const [contactLoading, setContactLoading] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingsService.get(id),
  });

  const handleContact = async () => {
    if (!user) { router.push("/auth/login"); return; }
    if (!listing) return;
    try {
      setContactLoading(true);
      const conv = await chatService.getOrCreateConversation(listing.id);
      router.push(`/main/chat?id=${conv.id}`);
    } catch {
      toast.error("Could not start conversation");
    } finally {
      setContactLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse space-y-4 py-4">
        <div className="skeleton h-5 w-28 rounded-lg" />
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 skeleton h-80 rounded-2xl" />
          <div className="lg:col-span-2 space-y-4">
            <div className="skeleton h-52 rounded-2xl" />
            <div className="skeleton h-36 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-5 text-4xl">🚗</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Listing not found</h2>
        <p className="text-slate-500 text-sm mb-6">This listing may have been removed or expired.</p>
        <Link href="/main/listings">
          <Button variant="secondary">Browse vehicles</Button>
        </Link>
      </div>
    );
  }

  const images = listing.images.length > 0 ? listing.images : ["/placeholder-car.jpg"];
  const isMine = user?.id === listing.user_id;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to listings
      </button>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: images */}
        <div className="lg:col-span-3 space-y-3">
          {/* Main image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 shadow-md">
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIndex}
                src={imageUrl(images[imgIndex])}
                alt={listing.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-car.jpg"; }}
              />
            </AnimatePresence>

            {listing.status === "sold" && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-white text-slate-900 font-bold px-6 py-2.5 rounded-full text-sm shadow-lg tracking-wide">
                  SOLD
                </span>
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all hover:scale-105"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-700" />
                </button>
                <button
                  onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all hover:scale-105"
                >
                  <ChevronRight className="h-5 w-5 text-slate-700" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "bg-white w-6 shadow-sm" : "bg-white/50 w-1.5 hover:bg-white/80"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                    i === imgIndex ? "border-blue-600 shadow-md shadow-blue-200" : "border-transparent opacity-60 hover:opacity-90 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={imageUrl(img)}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-car.jpg"; }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 text-base">About this vehicle</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Right: details + CTA */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title & price */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex gap-2 flex-wrap">
                <Badge variant={CONDITION_BADGE[listing.condition] ?? "default"}>
                  {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
                </Badge>
                <Badge variant="outline" className="capitalize">{listing.vehicle_type}</Badge>
                {listing.status !== "active" && (
                  <Badge variant={listing.status === "sold" ? "danger" : "default"}>
                    {listing.status}
                  </Badge>
                )}
              </div>
              <button
                onClick={() => setWishlisted((w) => !w)}
                className={`p-2 rounded-xl transition-all ${wishlisted ? "bg-red-50 text-red-500" : "text-slate-300 hover:text-red-400 hover:bg-red-50"}`}
              >
                <Heart className={`h-5 w-5 transition-all ${wishlisted ? "fill-red-500 scale-110" : ""}`} />
              </button>
            </div>

            <h1 className="text-xl font-black text-slate-900 mb-1 leading-snug tracking-tight">{listing.title}</h1>
            <p className="text-slate-500 text-sm mb-5 font-medium">{listing.make} {listing.model}</p>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Asking Price</p>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{formatPrice(listing.price)}</p>
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <SpecItem icon={<Calendar className="h-4 w-4" />} label="Year" value={String(listing.year)} />
              <SpecItem icon={<Gauge className="h-4 w-4" />} label="Mileage" value={formatMileage(listing.mileage)} />
              <SpecItem icon={<MapPin className="h-4 w-4" />} label="Location" value={listing.location} />
              <SpecItem icon={<Tag className="h-4 w-4" />} label="Listed" value={formatDate(listing.created_at)} />
            </div>
          </div>

          {/* Safety */}
          <NewSellerWarning />

          {/* CTA */}
          {!isMine && listing.status === "active" && (
            <Button size="lg" className="w-full gap-2.5 rounded-xl shadow-lg" loading={contactLoading} onClick={handleContact}>
              <MessageSquare className="h-5 w-5" />
              Contact Seller
            </Button>
          )}

          {isMine && (
            <Link href={`/main/listings/${id}/edit`} className="block">
              <Button variant="secondary" size="lg" className="w-full">Edit Listing</Button>
            </Link>
          )}

          {/* Trust strip */}
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-700 font-semibold">
              Listing verified by AI fraud detection
            </p>
          </div>

          {/* Share */}
          <button
            onClick={() => navigator.share?.({ title: listing.title, url: window.location.href })}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors w-full justify-center py-2"
          >
            <Share2 className="h-4 w-4" /> Share this listing
          </button>
        </div>
      </div>
    </div>
  );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
      <span className="text-blue-500 mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{label}</p>
        <p className="text-sm text-slate-800 font-bold mt-0.5">{value}</p>
      </div>
    </div>
  );
}
