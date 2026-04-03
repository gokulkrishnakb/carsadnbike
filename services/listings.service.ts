import { api } from "@/lib/api";
import type { Listing, ListingListResponse } from "@/types";

export const listingsService = {
  async list(params?: Record<string, unknown>): Promise<ListingListResponse> {
    const res = await api.get<ListingListResponse>("/listings/", { params });
    return res.data;
  },

  async get(id: string): Promise<Listing> {
    const res = await api.get<Listing>(`/listings/${id}`);
    return res.data;
  },

  async create(data: Partial<Listing>): Promise<Listing> {
    const res = await api.post<Listing>("/listings/", data);
    return res.data;
  },

  async update(id: string, data: Partial<Listing>): Promise<Listing> {
    const res = await api.put<Listing>(`/listings/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/listings/${id}`);
  },

  async uploadImages(id: string, files: File[]): Promise<Listing> {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const res = await api.post<Listing>(`/listings/${id}/images`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
