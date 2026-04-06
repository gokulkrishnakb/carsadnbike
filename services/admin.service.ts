import { api } from "@/lib/api";
import type {
  AdListResponse,
  AdPlacement,
  Advertisement,
  AdminStats,
  AdminUser,
  AdminUserListResponse,
  Listing,
  ListingListResponse,
  Role,
} from "@/types";

interface AdCreate {
  title: string;
  description?: string;
  image_url?: string;
  link_url: string;
  placement: AdPlacement;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
}

type AdUpdate = Partial<AdCreate>;

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const res = await api.get<AdminStats>("/admin/stats");
    return res.data;
  },

  async listUsers(page = 1, size = 20): Promise<AdminUserListResponse> {
    const res = await api.get<AdminUserListResponse>("/admin/users", { params: { page, size } });
    return res.data;
  },

  async updateUserRole(userId: string, role: Role): Promise<AdminUser> {
    const res = await api.put<AdminUser>(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  async updateUserStatus(userId: string, is_active: boolean): Promise<AdminUser> {
    const res = await api.put<AdminUser>(`/admin/users/${userId}/status`, { is_active });
    return res.data;
  },

  async listListings(page = 1, size = 20, status?: string): Promise<ListingListResponse> {
    const res = await api.get<ListingListResponse>("/admin/listings", {
      params: { page, size, ...(status ? { status_filter: status } : {}) },
    });
    return res.data;
  },

  async updateListingStatus(listingId: string, status: string): Promise<Listing> {
    const res = await api.put<Listing>(`/admin/listings/${listingId}/status`, { status });
    return res.data;
  },

  async deleteListing(listingId: string): Promise<void> {
    await api.delete(`/admin/listings/${listingId}`);
  },

  async listAds(placement?: AdPlacement, page = 1, size = 50): Promise<AdListResponse> {
    const res = await api.get<AdListResponse>("/admin/ads", {
      params: { ...(placement ? { placement } : {}), page, size },
    });
    return res.data;
  },

  async createAd(data: AdCreate): Promise<Advertisement> {
    const res = await api.post<Advertisement>("/admin/ads", data);
    return res.data;
  },

  async updateAd(adId: string, data: AdUpdate): Promise<Advertisement> {
    const res = await api.put<Advertisement>(`/admin/ads/${adId}`, data);
    return res.data;
  },

  async deleteAd(adId: string): Promise<void> {
    await api.delete(`/admin/ads/${adId}`);
  },
};
