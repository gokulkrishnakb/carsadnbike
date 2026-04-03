import { api } from "@/lib/api";
import type { ListingListResponse, SearchFilters } from "@/types";

export const searchService = {
  async search(filters: SearchFilters): Promise<ListingListResponse> {
    const res = await api.get<ListingListResponse>("/search/", { params: filters });
    return res.data;
  },
};
