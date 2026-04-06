"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Gauge, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { listingsService } from "@/services/listings.service";
import { formatPrice, formatMileage, timeAgo, imageUrl } from "@/lib/utils";
import type { Listing } from "@/types";

const conditionVariant = {
  new: "success",
  used: "secondary",
  certified: "warning",
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
    <Link href={`/main/listings/${listing.id}`} className="block group">
      <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          {thumb ? (
            <Image
              src={imageUrl(thumb)}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <span className="text-4xl font-black text-slate-300">{listing.make[0]}</span>
            </div>
          )}

          {listing.status === "sold" && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-white text-black font-black text-sm px-4 py-1.5 tracking-widest">
                SOLD
              </span>
            </div>
          )}

          <div className="absolute top-2.5 left-2.5">
            <Badge variant={conditionVariant[listing.condition]}>
              {listing.condition === "certified" ? "CPO" : listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price — primary */}
          <p className="text-2xl font-black text-slate-900 tracking-tight mb-1">
            {formatPrice(listing.price)}
          </p>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
            {listing.year} {listing.make} {listing.model}
          </h3>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1 min-w-0">
              <Gauge className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{formatMileage(listing.mileage)}</span>
            </span>
            <span className="w-px h-3 bg-slate-200" />
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{listing.location}</span>
            </span>
            <span className="ml-auto text-slate-400 shrink-0">{timeAgo(listing.created_at)}</span>
          </div>

          {/* Owner actions */}
          {showActions && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
              <Link
                href={`/main/listings/${listing.id}/edit`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl text-slate-600 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-colors min-h-[44px]"
                aria-label="Edit listing"
              >
                <Edit2 className="h-3.5 w-3.5" /> Edit
              </Link>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl text-slate-600 hover:border-red-400 hover:text-red-700 hover:bg-red-50 transition-colors min-h-[44px]"
                aria-label="Delete listing"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
