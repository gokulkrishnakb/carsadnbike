"use client";

import { useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Car,
  Bike,
  ChevronDown,
  ChevronUp,
  Ban,
  CheckCircle,
  Eye,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldAlert,
  User,
  Building2,
  Flag,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Types
interface ClientListing {
  id: string;
  title: string;
  type: "car" | "bike";
  location: string;
  price: number;
  created_at: string;
}

interface SuspiciousClient {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: "user" | "dealer" | "admin";
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string;
  // Suspicious activity data
  total_listings: number;
  listings: ClientListing[];
  unique_locations: string[];
  suspicion_score: number; // 0-100
  suspicion_reasons: string[];
  flags: {
    multiple_locations: boolean;
    rapid_posting: boolean;
    duplicate_content: boolean;
    price_anomaly: boolean;
    unverified_contact: boolean;
  };
}

// Dummy suspicious clients data
const SUSPICIOUS_CLIENTS: SuspiciousClient[] = [
  {
    id: "client-1",
    email: "quickseller99@gmail.com",
    full_name: "Raj Kumar",
    phone: "+91 98765 43210",
    role: "user",
    is_active: true,
    is_verified: false,
    created_at: "2024-03-15T10:00:00Z",
    last_login: "2024-03-28T14:30:00Z",
    total_listings: 12,
    listings: [
      { id: "l1", title: "2023 Honda City ZX", type: "car", location: "Mumbai, MH", price: 1250000, created_at: "2024-03-20T10:00:00Z" },
      { id: "l2", title: "2022 Maruti Swift VXI", type: "car", location: "Delhi, DL", price: 650000, created_at: "2024-03-20T11:00:00Z" },
      { id: "l3", title: "2024 Hyundai Creta SX", type: "car", location: "Bangalore, KA", price: 1850000, created_at: "2024-03-21T09:00:00Z" },
      { id: "l4", title: "2023 Royal Enfield Classic", type: "bike", location: "Chennai, TN", price: 195000, created_at: "2024-03-21T10:30:00Z" },
      { id: "l5", title: "2022 KTM Duke 390", type: "bike", location: "Pune, MH", price: 285000, created_at: "2024-03-22T08:00:00Z" },
    ],
    unique_locations: ["Mumbai, MH", "Delhi, DL", "Bangalore, KA", "Chennai, TN", "Pune, MH"],
    suspicion_score: 85,
    suspicion_reasons: [
      "12 listings across 5 different cities in 1 week",
      "Unverified phone number",
      "Prices 15-20% below market average",
      "Similar description patterns across listings",
    ],
    flags: {
      multiple_locations: true,
      rapid_posting: true,
      duplicate_content: true,
      price_anomaly: true,
      unverified_contact: true,
    },
  },
  {
    id: "client-2",
    email: "autodealer.fake@yahoo.com",
    full_name: "Premium Auto Sales",
    phone: "+91 99887 76655",
    role: "dealer",
    is_active: true,
    is_verified: true,
    created_at: "2024-02-01T08:00:00Z",
    last_login: "2024-03-27T16:45:00Z",
    total_listings: 28,
    listings: [
      { id: "l6", title: "2024 BMW 3 Series", type: "car", location: "Hyderabad, TG", price: 4500000, created_at: "2024-03-18T10:00:00Z" },
      { id: "l7", title: "2023 Mercedes C-Class", type: "car", location: "Kolkata, WB", price: 5200000, created_at: "2024-03-19T11:00:00Z" },
      { id: "l8", title: "2024 Audi A4", type: "car", location: "Ahmedabad, GJ", price: 4800000, created_at: "2024-03-20T09:00:00Z" },
    ],
    unique_locations: ["Hyderabad, TG", "Kolkata, WB", "Ahmedabad, GJ", "Jaipur, RJ", "Lucknow, UP"],
    suspicion_score: 72,
    suspicion_reasons: [
      "Dealer operating across 5 states without branch offices",
      "Stock photos detected in 60% of listings",
      "No physical showroom address provided",
    ],
    flags: {
      multiple_locations: true,
      rapid_posting: false,
      duplicate_content: true,
      price_anomaly: false,
      unverified_contact: false,
    },
  },
  {
    id: "client-3",
    email: "bike.flipper@hotmail.com",
    full_name: "Amit Sharma",
    phone: undefined,
    role: "user",
    is_active: true,
    is_verified: false,
    created_at: "2024-03-25T14:00:00Z",
    last_login: "2024-03-28T09:15:00Z",
    total_listings: 8,
    listings: [
      { id: "l9", title: "2023 Yamaha R15 V4", type: "bike", location: "Noida, UP", price: 165000, created_at: "2024-03-26T10:00:00Z" },
      { id: "l10", title: "2024 Bajaj Pulsar NS200", type: "bike", location: "Gurgaon, HR", price: 142000, created_at: "2024-03-26T10:30:00Z" },
      { id: "l11", title: "2023 TVS Apache RTR 200", type: "bike", location: "Faridabad, HR", price: 128000, created_at: "2024-03-26T11:00:00Z" },
    ],
    unique_locations: ["Noida, UP", "Gurgaon, HR", "Faridabad, HR", "Greater Noida, UP"],
    suspicion_score: 68,
    suspicion_reasons: [
      "8 bike listings in 3 days - new account",
      "No phone number provided",
      "All listings in NCR region but different cities",
      "Prices consistently below market rate",
    ],
    flags: {
      multiple_locations: true,
      rapid_posting: true,
      duplicate_content: false,
      price_anomaly: true,
      unverified_contact: true,
    },
  },
  {
    id: "client-4",
    email: "genuine.seller@gmail.com",
    full_name: "Priya Patel",
    phone: "+91 88776 54321",
    role: "user",
    is_active: true,
    is_verified: true,
    created_at: "2024-01-10T12:00:00Z",
    last_login: "2024-03-28T11:00:00Z",
    total_listings: 3,
    listings: [
      { id: "l12", title: "2020 Honda Activa 6G", type: "bike", location: "Surat, GJ", price: 65000, created_at: "2024-02-15T10:00:00Z" },
      { id: "l13", title: "2019 Maruti Alto K10", type: "car", location: "Surat, GJ", price: 320000, created_at: "2024-03-01T11:00:00Z" },
      { id: "l14", title: "2021 Hyundai i20 Asta", type: "car", location: "Surat, GJ", price: 720000, created_at: "2024-03-20T09:00:00Z" },
    ],
    unique_locations: ["Surat, GJ"],
    suspicion_score: 15,
    suspicion_reasons: [],
    flags: {
      multiple_locations: false,
      rapid_posting: false,
      duplicate_content: false,
      price_anomaly: false,
      unverified_contact: false,
    },
  },
  {
    id: "client-5",
    email: "deals.unlimited@gmail.com",
    full_name: "Vikram Singh",
    phone: "+91 77665 54433",
    role: "user",
    is_active: false,
    is_verified: false,
    created_at: "2024-03-10T09:00:00Z",
    last_login: "2024-03-20T15:30:00Z",
    total_listings: 15,
    listings: [
      { id: "l15", title: "2024 Tata Nexon EV", type: "car", location: "Chandigarh, CH", price: 1400000, created_at: "2024-03-12T10:00:00Z" },
      { id: "l16", title: "2023 MG ZS EV", type: "car", location: "Mohali, PB", price: 2100000, created_at: "2024-03-12T11:00:00Z" },
    ],
    unique_locations: ["Chandigarh, CH", "Mohali, PB", "Panchkula, HR", "Ambala, HR"],
    suspicion_score: 92,
    suspicion_reasons: [
      "Account suspended - multiple fraud reports",
      "15 listings posted in 2 days",
      "Reported by 4 different users for fake listings",
      "Payment requests outside platform",
    ],
    flags: {
      multiple_locations: true,
      rapid_posting: true,
      duplicate_content: true,
      price_anomaly: true,
      unverified_contact: true,
    },
  },
];

function getSuspicionLevel(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: "High Risk", color: "text-red-700", bg: "bg-red-100" };
  if (score >= 50) return { label: "Medium Risk", color: "text-amber-700", bg: "bg-amber-100" };
  if (score >= 25) return { label: "Low Risk", color: "text-yellow-700", bg: "bg-yellow-100" };
  return { label: "Safe", color: "text-emerald-700", bg: "bg-emerald-100" };
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

function ClientCard({ client }: { client: SuspiciousClient }) {
  const [expanded, setExpanded] = useState(false);
  const level = getSuspicionLevel(client.suspicion_score);

  const handleSuspend = () => {
    toast.success(`${client.full_name} has been suspended`);
  };

  const handleClearFlag = () => {
    toast.success(`Flags cleared for ${client.full_name}`);
  };

  return (
    <div className={`bg-white border ${client.suspicion_score >= 50 ? "border-amber-200" : "border-slate-200"} shadow-sm`}>
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
            client.role === "dealer" ? "bg-purple-100" : "bg-slate-100"
          }`}>
            {client.role === "dealer" ? (
              <Building2 className="w-6 h-6 text-purple-600" />
            ) : (
              <User className="w-6 h-6 text-slate-600" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900">{client.full_name}</h3>
              <Badge variant={client.role === "dealer" ? "default" : "secondary"}>
                {client.role}
              </Badge>
              {!client.is_active && (
                <Badge variant="destructive">Suspended</Badge>
              )}
              {!client.is_verified && (
                <Badge variant="outline" className="text-amber-600 border-amber-300">
                  Unverified
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{client.email}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
              {client.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {client.phone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Joined {formatDate(client.created_at)}
              </span>
              {client.last_login && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last seen {formatDate(client.last_login)}
                </span>
              )}
            </div>
          </div>

          {/* Risk Score */}
          <div className="text-right shrink-0">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${level.bg} ${level.color}`}>
              {client.suspicion_score >= 50 ? (
                <ShieldAlert className="w-3.5 h-3.5" />
              ) : (
                <Shield className="w-3.5 h-3.5" />
              )}
              {level.label}
            </div>
            <p className="text-xs text-slate-400 mt-1">Score: {client.suspicion_score}/100</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">{client.total_listings} listings</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">{client.unique_locations.length} locations</span>
          </div>
          {client.flags.multiple_locations && (
            <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
              <Flag className="w-3 h-3" />
              Multi-location
            </span>
          )}
          {client.flags.rapid_posting && (
            <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              <AlertTriangle className="w-3 h-3" />
              Rapid posting
            </span>
          )}
          {client.flags.price_anomaly && (
            <span className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
              <AlertTriangle className="w-3 h-3" />
              Price anomaly
            </span>
          )}
        </div>

        {/* Suspicion Reasons */}
        {client.suspicion_reasons.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Suspicious Activity Detected</p>
            <ul className="space-y-1">
              {client.suspicion_reasons.map((reason, i) => (
                <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="gap-1"
          >
            <Eye className="w-4 h-4" />
            View Listings
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          {client.is_active && client.suspicion_score >= 50 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleSuspend}
              className="gap-1"
            >
              <Ban className="w-4 h-4" />
              Suspend Account
            </Button>
          )}
          {client.suspicion_score >= 25 && client.suspicion_score < 80 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClearFlag}
              className="gap-1"
            >
              <CheckCircle className="w-4 h-4" />
              Clear Flags
            </Button>
          )}
          <Button variant="ghost" size="sm" className="gap-1 ml-auto">
            <Mail className="w-4 h-4" />
            Contact
          </Button>
        </div>
      </div>

      {/* Expanded Listings */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 p-5">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Recent Listings ({client.listings.length} shown of {client.total_listings})
          </h4>
          <div className="space-y-2">
            {client.listings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center gap-4 bg-white p-3 border border-slate-200 rounded"
              >
                <div className={`w-8 h-8 rounded flex items-center justify-center ${
                  listing.type === "car" ? "bg-blue-50" : "bg-green-50"
                }`}>
                  {listing.type === "car" ? (
                    <Car className={`w-4 h-4 text-blue-600`} />
                  ) : (
                    <Bike className={`w-4 h-4 text-green-600`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{listing.title}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {listing.location}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">{formatPrice(listing.price)}</p>
                  <p className="text-xs text-slate-400">{formatDate(listing.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <p className="text-xs text-slate-500 flex-1">
              Locations: {client.unique_locations.join(" • ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminClientsPage() {
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "safe">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "dealer">("all");

  const filteredClients = SUSPICIOUS_CLIENTS.filter((client) => {
    // Role filter
    if (roleFilter !== "all" && client.role !== roleFilter) return false;

    // Risk filter
    if (filter === "high" && client.suspicion_score < 80) return false;
    if (filter === "medium" && (client.suspicion_score < 50 || client.suspicion_score >= 80)) return false;
    if (filter === "safe" && client.suspicion_score >= 25) return false;

    return true;
  });

  const highRiskCount = SUSPICIOUS_CLIENTS.filter((c) => c.suspicion_score >= 80).length;
  const mediumRiskCount = SUSPICIOUS_CLIENTS.filter((c) => c.suspicion_score >= 50 && c.suspicion_score < 80).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Risk Monitor</h1>
          <p className="text-slate-500 text-sm mt-1">
            Track high-risk accounts and suspicious activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          {highRiskCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span className="text-sm font-bold text-red-700">{highRiskCount} High Risk</span>
            </div>
          )}
          {mediumRiskCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-700">{mediumRiskCount} Medium Risk</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Risk Level:</span>
          <div className="flex gap-1">
            {[
              { value: "all", label: "All" },
              { value: "high", label: "High Risk" },
              { value: "medium", label: "Medium" },
              { value: "safe", label: "Safe" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value as typeof filter)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  filter === opt.value
                    ? "bg-[#9b111e] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Type:</span>
          <div className="flex gap-1">
            {[
              { value: "all", label: "All Users" },
              { value: "user", label: "Normal Users" },
              { value: "dealer", label: "Dealers/Agents" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRoleFilter(opt.value as typeof roleFilter)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  roleFilter === opt.value
                    ? "bg-[#9b111e] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-4">
        {filteredClients.length === 0 ? (
          <div className="bg-white border border-slate-200 p-12 text-center">
            <Shield className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No suspicious clients found</h3>
            <p className="text-sm text-slate-500">All clients matching your filters appear to be legitimate.</p>
          </div>
        ) : (
          filteredClients
            .sort((a, b) => b.suspicion_score - a.suspicion_score)
            .map((client) => <ClientCard key={client.id} client={client} />)
        )}
      </div>
    </div>
  );
}
