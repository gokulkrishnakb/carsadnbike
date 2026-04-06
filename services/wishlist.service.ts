import { api } from "@/lib/api";
import type { WishlistResponse, WishlistStatusResponse } from "@/types";

export const wishlistService = {
  async getWishlist(): Promise<WishlistResponse> {
    const res = await api.get<WishlistResponse>("/wishlist/");
    return res.data;
  },

  async getStatus(listingId: string): Promise<WishlistStatusResponse> {
    const res = await api.get<WishlistStatusResponse>(`/wishlist/${listingId}/status`);
    return res.data;
  },

  async add(listingId: string): Promise<WishlistStatusResponse> {
    const res = await api.post<WishlistStatusResponse>(`/wishlist/${listingId}`);
    return res.data;
  },

  async remove(listingId: string): Promise<void> {
    await api.delete(`/wishlist/${listingId}`);
  },
};
