"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { wishlistService } from "@/services/wishlist.service";
import { useAuthStore } from "@/store/auth.store";
import { ListingCard } from "@/features/listings/listing-card";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
    enabled: !!user,
  });

  const listings = data?.items ?? [];

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-slate-100 border border-slate-200 flex items-center justify-center mb-5">
          <Heart className="h-7 w-7 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Sign in to view your wishlist</h2>
        <p className="text-slate-500 text-sm mb-6">Save vehicles you're interested in and come back to them later.</p>
        <Link href="/auth/login">
          <Button>Sign in</Button>
        </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Wishlist</h1>
        <p className="text-sm text-slate-500 mt-1">Vehicles you've saved</p>
      </div>

      {isLoading ? (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-slate-100 border border-slate-200 flex items-center justify-center mb-5">
            <Heart className="h-7 w-7 text-slate-300" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">No saved vehicles</h2>
          <p className="text-sm text-slate-500 mb-6">
            Tap the heart icon on any listing to save it here.
          </p>
          <Link href="/main/listings">
            <Button variant="secondary">Browse vehicles</Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">{listings.length}</span> saved vehicle{listings.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
