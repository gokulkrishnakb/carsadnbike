// ── Auth ──────────────────────────────────────────────────────────
export type Role = "user" | "dealer" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ── Listing ───────────────────────────────────────────────────────
export type VehicleType = "car" | "bike" | "truck" | "van";
export type Condition   = "new" | "used" | "certified";
export type ListingStatus = "draft" | "active" | "sold" | "removed";

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  make: string;
  model: string;
  year: number;
  vehicle_type: VehicleType;
  condition: Condition;
  price: number;
  mileage: number;
  location: string;
  images: string[];
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface ListingListResponse {
  items: Listing[];
  total: number;
  page: number;
  size: number;
}

// ── Search ────────────────────────────────────────────────────────
export interface SearchFilters {
  query?: string;
  vehicle_type?: VehicleType;
  condition?: Condition;
  make?: string;
  min_price?: number;
  max_price?: number;
  min_year?: number;
  max_year?: number;
  location?: string;
  district?: string;
  sort?: "price_asc" | "price_desc" | "year_desc" | "created_at_desc";
  page?: number;
  size?: number;
}

// ── Chat ──────────────────────────────────────────────────────────
export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export interface Conversation {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_image?: string;
  other_user: User;
  last_message?: ChatMessage;
  unread_count: number;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;               // decrypted on client
  status: MessageStatus;
  created_at: string;
  is_flagged?: boolean;          // safety system
  safety_warnings?: string[];
}

// ── Notifications ─────────────────────────────────────────────────
export type NotificationType =
  | "new_message"
  | "new_bid"
  | "bid_accepted"
  | "bid_rejected"
  | "listing_updated"
  | "listing_sold"
  | "listing_created";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  payload: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  unread: number;
}

// ── Wishlist ──────────────────────────────────────────────────────
export interface WishlistResponse {
  items: Listing[];
  total: number;
}

export interface WishlistStatusResponse {
  listing_id: string;
  wishlisted: boolean;
}

// ── Advertisements ────────────────────────────────────────────────
export type AdPlacement = "homepage" | "listings_top" | "listings_sidebar" | "listing_detail";

export interface Advertisement {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  link_url: string;
  placement: AdPlacement;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  impressions: number;
  clicks: number;
  created_at: string;
  updated_at: string;
}

export interface AdListResponse {
  items: Advertisement[];
  total: number;
}

// ── Admin ─────────────────────────────────────────────────────────
export interface AdminStats {
  total_users: number;
  total_listings: number;
  active_listings: number;
  sold_listings: number;
  total_ads: number;
  active_ads: number;
}

export interface AdminUser extends User {
  last_login?: string;
}

export interface AdminUserListResponse {
  items: AdminUser[];
  total: number;
}

// ── Site Settings ─────────────────────────────────────────────────
export interface SiteSettings {
  site_name: string;
  logo_url?: string;
  favicon_url?: string;
  support_email?: string;
  support_phone?: string;
  address?: string;
  social_facebook?: string;
  social_twitter?: string;
  social_instagram?: string;
  social_youtube?: string;
  meta_description?: string;
  maintenance_mode?: boolean;
}

// ── API responses ─────────────────────────────────────────────────
export interface ApiError {
  detail: string;
  status: number;
}
