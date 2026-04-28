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
  SiteSettings,
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

// Mock mode flag - set to true for frontend-only development
const MOCK_MODE = true;

// Dummy stats for mock mode
const DUMMY_STATS: AdminStats = {
  total_users: 1247,
  total_listings: 3842,
  active_listings: 2156,
  sold_listings: 1423,
  total_ads: 4,
  active_ads: 3,
};

// Dummy users for mock mode
const DUMMY_USERS: AdminUser[] = [
  {
    id: "user-1",
    email: "john.dealer@example.com",
    full_name: "John Anderson",
    role: "dealer",
    is_active: true,
    is_verified: true,
    created_at: "2024-01-15T10:00:00Z",
    last_login: "2024-03-28T14:30:00Z",
  },
  {
    id: "user-2",
    email: "sarah.admin@example.com",
    full_name: "Sarah Mitchell",
    role: "admin",
    is_active: true,
    is_verified: true,
    created_at: "2023-11-20T08:00:00Z",
    last_login: "2024-03-28T09:15:00Z",
  },
  {
    id: "user-3",
    email: "mike.buyer@example.com",
    full_name: "Mike Thompson",
    role: "user",
    is_active: true,
    is_verified: true,
    created_at: "2024-02-10T16:45:00Z",
    last_login: "2024-03-27T11:20:00Z",
  },
  {
    id: "user-4",
    email: "emma.seller@example.com",
    full_name: "Emma Davis",
    role: "user",
    is_active: false,
    is_verified: true,
    created_at: "2024-01-05T12:30:00Z",
    last_login: "2024-02-15T08:45:00Z",
  },
  {
    id: "user-5",
    email: "premium.motors@example.com",
    full_name: "Premium Motors Inc",
    role: "dealer",
    is_active: true,
    is_verified: true,
    created_at: "2023-12-01T09:00:00Z",
    last_login: "2024-03-28T16:00:00Z",
  },
  {
    id: "user-6",
    email: "alex.new@example.com",
    full_name: "Alex Johnson",
    role: "user",
    is_active: true,
    is_verified: false,
    created_at: "2024-03-25T14:20:00Z",
    last_login: "2024-03-26T10:30:00Z",
  },
];

// Dummy listings for mock mode
const DUMMY_LISTINGS: Listing[] = [
  {
    id: "listing-1",
    user_id: "user-1",
    title: "2024 BMW M3 Competition",
    description: "Brand new M3 with all options",
    make: "BMW",
    model: "M3",
    year: 2024,
    vehicle_type: "car",
    condition: "new",
    price: 85000,
    mileage: 150,
    location: "Los Angeles, CA",
    images: ["https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800"],
    status: "active",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
  },
  {
    id: "listing-2",
    user_id: "user-3",
    title: "2023 Tesla Model S Plaid",
    description: "Low mileage, full self-driving capable",
    make: "Tesla",
    model: "Model S",
    year: 2023,
    vehicle_type: "car",
    condition: "used",
    price: 92000,
    mileage: 8500,
    location: "San Francisco, CA",
    images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"],
    status: "active",
    created_at: "2024-03-18T14:30:00Z",
    updated_at: "2024-03-18T14:30:00Z",
  },
  {
    id: "listing-3",
    user_id: "user-5",
    title: "2022 Porsche 911 Carrera",
    description: "Certified pre-owned with warranty",
    make: "Porsche",
    model: "911",
    year: 2022,
    vehicle_type: "car",
    condition: "certified",
    price: 125000,
    mileage: 12000,
    location: "Miami, FL",
    images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"],
    status: "sold",
    created_at: "2024-02-10T09:00:00Z",
    updated_at: "2024-03-15T16:45:00Z",
  },
  {
    id: "listing-4",
    user_id: "user-1",
    title: "2024 Mercedes-AMG GT",
    description: "Stunning sports car, fully loaded",
    make: "Mercedes-Benz",
    model: "AMG GT",
    year: 2024,
    vehicle_type: "car",
    condition: "new",
    price: 145000,
    mileage: 50,
    location: "New York, NY",
    images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"],
    status: "draft",
    created_at: "2024-03-25T11:00:00Z",
    updated_at: "2024-03-25T11:00:00Z",
  },
  {
    id: "listing-5",
    user_id: "user-4",
    title: "2021 Honda CBR1000RR",
    description: "Superbike in excellent condition",
    make: "Honda",
    model: "CBR1000RR",
    year: 2021,
    vehicle_type: "bike",
    condition: "used",
    price: 18500,
    mileage: 5200,
    location: "Austin, TX",
    images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800"],
    status: "removed",
    created_at: "2024-01-20T08:30:00Z",
    updated_at: "2024-03-01T12:00:00Z",
  },
  {
    id: "listing-6",
    user_id: "user-5",
    title: "2023 Audi RS6 Avant",
    description: "Family supercar, pristine condition",
    make: "Audi",
    model: "RS6",
    year: 2023,
    vehicle_type: "car",
    condition: "used",
    price: 115000,
    mileage: 6800,
    location: "Chicago, IL",
    images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"],
    status: "active",
    created_at: "2024-03-22T15:00:00Z",
    updated_at: "2024-03-22T15:00:00Z",
  },
];

// Dummy ads data for mock mode
const DUMMY_ADS: Advertisement[] = [
  {
    id: "ad-1",
    title: "Premium Car Insurance - Get 20% Off",
    description: "Protect your vehicle with our comprehensive coverage. Limited time offer!",
    image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
    link_url: "https://example.com/insurance",
    placement: "homepage",
    is_active: true,
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    impressions: 45230,
    clicks: 1284,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-03-20T14:30:00Z",
  },
  {
    id: "ad-2",
    title: "Auto Finance - Low Interest Rates",
    description: "Get approved in minutes. Rates as low as 3.9% APR.",
    image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    link_url: "https://example.com/finance",
    placement: "listings_top",
    is_active: true,
    start_date: "2024-02-01",
    end_date: "2024-11-30",
    impressions: 32150,
    clicks: 876,
    created_at: "2024-02-10T09:00:00Z",
    updated_at: "2024-03-18T11:20:00Z",
  },
  {
    id: "ad-3",
    title: "Certified Pre-Owned Vehicles",
    description: "Shop our selection of certified pre-owned cars with warranty included.",
    image_url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop",
    link_url: "https://example.com/certified",
    placement: "listings_sidebar",
    is_active: false,
    start_date: "2024-01-01",
    end_date: "2024-06-30",
    impressions: 18920,
    clicks: 423,
    created_at: "2024-01-05T08:00:00Z",
    updated_at: "2024-02-28T16:45:00Z",
  },
  {
    id: "ad-4",
    title: "Free Vehicle History Report",
    description: "Check any vehicle's history before you buy. Instant results.",
    image_url: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=300&fit=crop",
    link_url: "https://example.com/history-report",
    placement: "listing_detail",
    is_active: true,
    start_date: "2024-03-01",
    end_date: "2024-12-31",
    impressions: 28450,
    clicks: 1567,
    created_at: "2024-03-01T12:00:00Z",
    updated_at: "2024-03-25T10:15:00Z",
  },
];

export const adminService = {
  async getStats(): Promise<AdminStats> {
    if (MOCK_MODE) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return DUMMY_STATS;
    }
    const res = await api.get<AdminStats>("/admin/stats");
    return res.data;
  },

  async listUsers(page = 1, size = 20): Promise<AdminUserListResponse> {
    if (MOCK_MODE) {
      const start = (page - 1) * size;
      const end = start + size;
      return {
        items: DUMMY_USERS.slice(start, end),
        total: DUMMY_USERS.length,
      };
    }
    const res = await api.get<AdminUserListResponse>("/admin/users", { params: { page, size } });
    return res.data;
  },

  async updateUserRole(userId: string, role: Role): Promise<AdminUser> {
    if (MOCK_MODE) {
      const user = DUMMY_USERS.find((u) => u.id === userId);
      if (user) user.role = role;
      return user!;
    }
    const res = await api.put<AdminUser>(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  async updateUserStatus(userId: string, is_active: boolean): Promise<AdminUser> {
    if (MOCK_MODE) {
      const user = DUMMY_USERS.find((u) => u.id === userId);
      if (user) user.is_active = is_active;
      return user!;
    }
    const res = await api.put<AdminUser>(`/admin/users/${userId}/status`, { is_active });
    return res.data;
  },

  async listListings(page = 1, size = 20, status?: string): Promise<ListingListResponse> {
    if (MOCK_MODE) {
      const filtered = status
        ? DUMMY_LISTINGS.filter((l) => l.status === status)
        : DUMMY_LISTINGS;
      const start = (page - 1) * size;
      const end = start + size;
      return {
        items: filtered.slice(start, end),
        total: filtered.length,
        page,
        size,
      };
    }
    const res = await api.get<ListingListResponse>("/admin/listings", {
      params: { page, size, ...(status ? { status_filter: status } : {}) },
    });
    return res.data;
  },

  async updateListingStatus(listingId: string, status: string): Promise<Listing> {
    if (MOCK_MODE) {
      const listing = DUMMY_LISTINGS.find((l) => l.id === listingId);
      if (listing) listing.status = status as Listing["status"];
      return listing!;
    }
    const res = await api.put<Listing>(`/admin/listings/${listingId}/status`, { status });
    return res.data;
  },

  async deleteListing(listingId: string): Promise<void> {
    if (MOCK_MODE) {
      const index = DUMMY_LISTINGS.findIndex((l) => l.id === listingId);
      if (index > -1) DUMMY_LISTINGS.splice(index, 1);
      return;
    }
    await api.delete(`/admin/listings/${listingId}`);
  },

  async listAds(placement?: AdPlacement, page = 1, size = 50): Promise<AdListResponse> {
    if (MOCK_MODE) {
      // Return dummy data in mock mode
      const filtered = placement
        ? DUMMY_ADS.filter((ad) => ad.placement === placement)
        : DUMMY_ADS;
      return {
        items: filtered,
        total: filtered.length,
      };
    }
    const res = await api.get<AdListResponse>("/admin/ads", {
      params: { ...(placement ? { placement } : {}), page, size },
    });
    return res.data;
  },

  async createAd(data: AdCreate): Promise<Advertisement> {
    if (MOCK_MODE) {
      const newAd: Advertisement = {
        id: `ad-${Date.now()}`,
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        link_url: data.link_url,
        placement: data.placement,
        is_active: data.is_active ?? true,
        start_date: data.start_date,
        end_date: data.end_date,
        impressions: 0,
        clicks: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      DUMMY_ADS.push(newAd);
      return newAd;
    }
    const res = await api.post<Advertisement>("/admin/ads", data);
    return res.data;
  },

  async updateAd(adId: string, data: AdUpdate): Promise<Advertisement> {
    if (MOCK_MODE) {
      const ad = DUMMY_ADS.find((a) => a.id === adId);
      if (ad) {
        Object.assign(ad, data, { updated_at: new Date().toISOString() });
      }
      return ad!;
    }
    const res = await api.put<Advertisement>(`/admin/ads/${adId}`, data);
    return res.data;
  },

  async deleteAd(adId: string): Promise<void> {
    if (MOCK_MODE) {
      const index = DUMMY_ADS.findIndex((a) => a.id === adId);
      if (index > -1) DUMMY_ADS.splice(index, 1);
      return;
    }
    await api.delete(`/admin/ads/${adId}`);
  },

  // ── Site Settings ─────────────────────────────────────────────────
  async getSettings(): Promise<SiteSettings> {
    // Mock implementation for frontend-only mode
    // In production, this would be: const res = await api.get<SiteSettings>("/admin/settings");
    return {
      site_name: "CarsAndBikes",
      logo_url: "/logo.png",
      support_email: "support@carsandbikes.com",
      support_phone: "+1 (555) 123-4567",
      address: "123 Auto Street, Motor City, MC 12345",
      social_facebook: "https://facebook.com/carsandbikes",
      social_twitter: "https://twitter.com/carsandbikes",
      social_instagram: "https://instagram.com/carsandbikes",
      social_youtube: "",
      meta_description: "Buy and sell cars and bikes with ease",
      maintenance_mode: false,
    };
  },

  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    // Mock implementation for frontend-only mode
    // In production, this would be: const res = await api.put<SiteSettings>("/admin/settings", data);
    console.log("Settings updated:", data);
    return {
      site_name: data.site_name ?? "CarsAndBikes",
      logo_url: data.logo_url,
      support_email: data.support_email,
      support_phone: data.support_phone,
      address: data.address,
      social_facebook: data.social_facebook,
      social_twitter: data.social_twitter,
      social_instagram: data.social_instagram,
      social_youtube: data.social_youtube,
      meta_description: data.meta_description,
      maintenance_mode: data.maintenance_mode,
    };
  },

  async uploadLogo(file: File): Promise<{ url: string }> {
    // Mock implementation for frontend-only mode
    // In production, this would upload to a server and return the URL
    // const formData = new FormData();
    // formData.append("file", file);
    // const res = await api.post<{ url: string }>("/admin/settings/logo", formData);
    const url = URL.createObjectURL(file);
    return { url };
  },
};
