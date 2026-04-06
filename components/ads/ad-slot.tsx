"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { adsService } from "@/services/ads.service";
import type { AdPlacement } from "@/types";

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
}

export function AdSlot({ placement, className = "" }: AdSlotProps) {
  const { data } = useQuery({
    queryKey: ["ads", placement],
    queryFn: () => adsService.list(placement),
    staleTime: 5 * 60 * 1000,
  });

  const ads = data?.items ?? [];
  // Pick a random ad from the available ones
  const ad = ads.length > 0 ? ads[Math.floor(Math.random() * ads.length)] : null;

  useEffect(() => {
    if (ad) adsService.trackImpression(ad.id);
  }, [ad?.id]);

  if (!ad) return null;

  return (
    <a
      href={ad.link_url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => adsService.trackClick(ad.id)}
      className={`group block border border-dashed border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all overflow-hidden ${className}`}
    >
      {ad.image_url ? (
        <div className="relative">
          <img src={ad.image_url} alt={ad.title} className="w-full object-cover" />
          <span className="absolute top-2 right-2 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide">
            Ad
          </span>
        </div>
      ) : null}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Sponsored</p>
            <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-700">{ad.title}</p>
            {ad.description && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{ad.description}</p>
            )}
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-400 shrink-0 mt-1" />
        </div>
      </div>
    </a>
  );
}

export function AdSlotPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center py-6 ${className}`}>
      <p className="text-xs text-slate-300 font-medium uppercase tracking-widest">Advertisement</p>
    </div>
  );
}
