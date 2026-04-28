"use client";

import { useState } from "react";
import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MapPin, Calendar, Gauge, Tag, MessageSquare,
  ChevronLeft, ChevronRight, Share2, Heart, CheckCircle2,
  CalendarPlus, Shield, Star, Clock, Phone
} from "lucide-react";
import { listingsService } from "@/services/listings.service";
import { chatService } from "@/services/chat.service";
import { wishlistService } from "@/services/wishlist.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NewSellerWarning } from "@/features/safety/safety-banner";
import { AdSlot } from "@/components/ads/ad-slot";
import { ListingCard } from "@/features/listings/listing-card";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { formatPrice, formatMileage, formatDate, imageUrl } from "@/lib/utils";
import { toast } from "sonner";

const CONDITION_BADGE = { new: "success", used: "secondary", certified: "warning" } as const;

function addToCalendar(title: string, note: string) {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(10, 0, 0, 0);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 30);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Call seller: ${title}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: note,
  });
  window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank");
}

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [imgIndex, setImgIndex] = useState(0);
  const [contactLoading, setContactLoading] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingsService.get(id),
  });

  const { data: similarData } = useQuery({
    queryKey: ["similar", listing?.vehicle_type],
    queryFn: () => listingsService.list({ vehicle_type: listing!.vehicle_type, status: "active", size: 5 }),
    enabled: !!listing,
  });

  const similarListings = (similarData?.items ?? []).filter((l) => l.id !== id).slice(0, 4);

  const { data: wishlistStatus } = useQuery({
    queryKey: ["wishlist-status", id],
    queryFn: () => wishlistService.getStatus(id),
    enabled: !!user,
  });

  const wishlisted = wishlistStatus?.wishlisted ?? false;

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      if (wishlisted) await wishlistService.remove(id);
      else await wishlistService.add(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-status", id] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(wishlisted ? "Removed from saved" : "Saved to wishlist");
    },
    onError: () => toast.error("Failed to update"),
  });

  const handleWishlist = () => {
    if (!user) { router.push("/auth/login"); return; }
    wishlistMutation.mutate();
  };

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

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4 py-4 animate-pulse">
        <div className="h-5 w-28 bg-slate-200 rounded-lg" />
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 h-80 bg-slate-200 rounded-2xl" />
          <div className="lg:col-span-2 space-y-4">
            <div className="h-52 bg-slate-200 rounded-2xl" />
            <div className="h-36 bg-slate-200 rounded-2xl" />
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
        <p className="text-slate-500 text-sm mb-6">This listing may have been removed.</p>
        <Link href="/main/listings"><Button variant="secondary">Browse vehicles</Button></Link>
      </div>
    );
  }

  const images = listing.images.length > 0 ? listing.images : ["/placeholder-car.jpg"];
  const isMine = user?.id === listing.user_id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto pb-28 sm:pb-10">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium mb-5 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to listings
      </button>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: images + description */}
        <div className="lg:col-span-3 space-y-4">
          {/* Main image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 shadow-md">
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIndex}
                src={imageUrl(images[imgIndex])}
                alt={listing.title}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-car.jpg"; }}
              />
            </AnimatePresence>

            {listing.status === "sold" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white text-slate-900 font-black px-6 py-2 rounded-full text-sm tracking-wide">SOLD</span>
              </div>
            )}

            {images.length > 1 && (
              <>
                <button onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all">
                  <ChevronLeft className="h-5 w-5 text-slate-700" />
                </button>
                <button onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all">
                  <ChevronRight className="h-5 w-5 text-slate-700" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setImgIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${i === imgIndex ? "bg-white w-6" : "bg-white/50 w-1.5 hover:bg-white/80"}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setImgIndex(i)}
                  className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === imgIndex ? "border-blue-600 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <img src={imageUrl(img)} alt="" className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-car.jpg"; }} />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-3">About this vehicle</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          {/* Ad slot */}
          <AdSlot placement="listing_detail" />
        </div>

        {/* Right: details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Price & title card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex gap-2 flex-wrap">
                <Badge variant={CONDITION_BADGE[listing.condition] ?? "default"}>
                  {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
                </Badge>
                <Badge variant="outline" className="capitalize">{listing.vehicle_type}</Badge>
                {listing.status !== "active" && (
                  <Badge variant={listing.status === "sold" ? "destructive" : "default"}>{listing.status}</Badge>
                )}
              </div>
              <button
                onClick={handleWishlist}
                disabled={wishlistMutation.isPending}
                className={`p-2 rounded-xl transition-all ${wishlisted ? "bg-red-50 text-red-500" : "text-slate-300 hover:text-red-400 hover:bg-red-50"}`}
                aria-label={wishlisted ? "Remove from saved" : "Save listing"}
              >
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-red-500" : ""}`} />
              </button>
            </div>

            <h1 className="text-xl font-black text-slate-900 mb-1 leading-snug">{listing.title}</h1>
            <p className="text-slate-500 text-sm mb-4">{listing.make} {listing.model}</p>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Asking Price</p>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{formatPrice(listing.price)}</p>
          </div>

          {/* Specs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Specifications</h3>
            <div className="grid grid-cols-2 gap-3">
              <SpecItem icon={<Calendar className="h-4 w-4" />} label="Year" value={String(listing.year)} />
              <SpecItem icon={<Gauge className="h-4 w-4" />} label="Mileage" value={formatMileage(listing.mileage)} />
              <SpecItem icon={<MapPin className="h-4 w-4" />} label="Location" value={listing.location} />
              <SpecItem icon={<Tag className="h-4 w-4" />} label="Listed" value={formatDate(listing.created_at)} />
            </div>
          </div>

          {/* Seller card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Seller</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-lg shrink-0">
                S
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-sm">Private Seller</p>
                <p className="text-xs text-slate-500">Member since 2024</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Identity verified</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Shield className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span>AI fraud detection passed</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>Usually replies within 1 hour</span>
              </div>
            </div>
          </div>

          {/* Safety */}
          <NewSellerWarning />

          {/* Desktop CTAs */}
          {!isMine && listing.status === "active" && (
            <div className="hidden sm:flex flex-col gap-2">
              <Button size="lg" className="w-full gap-2 rounded-xl shadow-sm" loading={contactLoading} onClick={handleContact}>
                <MessageSquare className="h-5 w-5" /> Chat with Seller
              </Button>
              <Button variant="secondary" size="lg" className="w-full gap-2 rounded-xl"
                onClick={() => addToCalendar(listing.title, `Call about: ${listing.title} at ${formatPrice(listing.price)}`)}>
                <CalendarPlus className="h-5 w-5" /> Add Call Reminder
              </Button>
            </div>
          )}

          {isMine && (
            <Link href={`/main/listings/${id}/edit`} className="hidden sm:block">
              <Button variant="secondary" size="lg" className="w-full rounded-xl">Edit Listing</Button>
            </Link>
          )}

          {/* Share */}
          <button
            onClick={() => navigator.share?.({ title: listing.title, url: window.location.href })}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700 transition-colors w-full justify-center py-2"
          >
            <Share2 className="h-4 w-4" /> Share this listing
          </button>
        </div>
      </div>

      {/* Similar listings */}
      {similarListings.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Similar vehicles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile sticky CTA */}
      {!isMine && listing.status === "active" && (
        <div className="fixed bottom-16 left-0 right-0 sm:hidden bg-white border-t border-slate-200 px-4 py-3 flex gap-2 z-30 shadow-lg">
          <button
            onClick={handleWishlist}
            disabled={wishlistMutation.isPending}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
              wishlisted ? "border-red-300 bg-red-50 text-red-500" : "border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-500"
            }`}
            aria-label="Save"
          >
            <Heart className={`h-5 w-5 ${wishlisted ? "fill-red-500" : ""}`} />
          </button>
          <Button size="lg" className="flex-1 gap-2 rounded-xl" loading={contactLoading} onClick={handleContact}>
            <MessageSquare className="h-5 w-5" /> Chat with Seller
          </Button>
        </div>
      )}
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
        <p className="text-sm text-slate-800 font-semibold mt-0.5">{value}</p>
      </div>
    </div>
  );
}
