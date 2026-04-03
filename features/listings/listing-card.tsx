"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Gauge, Calendar, Edit2, Trash2, Heart } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { listingsService } from "@/services/listings.service";
import { formatPrice, formatMileage, timeAgo, imageUrl } from "@/lib/utils";
import type { Listing } from "@/types";

const conditionVariant = {
  new: "success",
  used: "default",
  certified: "amber",
} as const;

const conditionLabel = {
  new: "New",
  used: "Used",
  certified: "CPO",
} as const;

export function ListingCard({
  listing,
  index = 0,
  showActions = false,
}: {
  listing: Listing;
  index?: number;
  showActions?: boolean;
}) {
  const router = useRouter();
  const thumb = listing.images[0];

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Delete this listing?")) return;
    try {
      await listingsService.delete(listing.id);
      toast.success("Listing removed");
      router.refresh();
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link href={`/main/listings/${listing.id}`} className="block group">
        <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 hover:border-slate-300 transition-all duration-300 shadow-sm">

          {/* Image */}
          <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
            {thumb ? (
              <Image
                src={imageUrl(thumb)}
                alt={listing.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <span className="text-6xl font-black text-slate-300 tracking-tighter">
                  {listing.make[0]}
                </span>
                <span className="text-xs text-slate-400 font-medium mt-1">{listing.make}</span>
              </div>
            )}

            {/* Sold overlay */}
            {listing.status === "sold" && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-white text-slate-900 font-bold text-sm px-5 py-2 rounded-full shadow-lg">
                  SOLD
                </span>
              </div>
            )}

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

            {/* Top badges */}
            <div className="absolute top-3 left-3">
              <Badge variant={conditionVariant[listing.condition]}>
                {conditionLabel[listing.condition]}
              </Badge>
            </div>

            {/* Wishlist */}
            <button
              onClick={(e) => e.preventDefault()}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-white"
            >
              <Heart className="h-4 w-4 text-slate-500 hover:text-red-500 transition-colors" />
            </button>

            {/* Year badge on bottom */}
            <div className="absolute bottom-2.5 left-3">
              <span className="text-[11px] font-bold text-white/90 tracking-wide">{listing.year}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-slate-900 text-[15px] leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors mb-0.5">
              {listing.title}
            </h3>
            <p className="text-[13px] text-slate-500 mb-3 font-medium">
              {listing.make} · {listing.model}
            </p>

            {/* Specs row */}
            <div className="flex items-center gap-3 text-[12px] text-slate-400 mb-3">
              <span className="flex items-center gap-1">
                <Gauge className="h-3.5 w-3.5 shrink-0" />
                {formatMileage(listing.mileage)}
              </span>
              <span className="w-px h-3 bg-slate-200" />
              <span className="flex items-center gap-1 truncate">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{listing.location}</span>
              </span>
            </div>

            {/* Price row */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                {formatPrice(listing.price)}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">{timeAgo(listing.created_at)}</span>
            </div>

            {/* Owner actions */}
            {showActions && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                <Link
                  href={`/main/listings/${listing.id}/edit`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl text-slate-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
