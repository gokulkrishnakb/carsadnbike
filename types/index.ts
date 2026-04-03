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

// ── API responses ─────────────────────────────────────────────────
export interface ApiError {
  detail: string;
  status: number;
}
