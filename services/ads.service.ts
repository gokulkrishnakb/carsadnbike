import { api } from "@/lib/api";
import type { AdListResponse, AdPlacement, Advertisement } from "@/types";

export const adsService = {
  async list(placement?: AdPlacement): Promise<AdListResponse> {
    const res = await api.get<AdListResponse>("/ads/", {
      params: placement ? { placement } : undefined,
    });
    return res.data;
  },

  async trackImpression(adId: string): Promise<void> {
    await api.post(`/ads/${adId}/impression`).catch(() => {}); // fire-and-forget
  },

  async trackClick(adId: string): Promise<void> {
    await api.post(`/ads/${adId}/click`).catch(() => {});
  },
};
