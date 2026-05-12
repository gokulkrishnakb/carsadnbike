"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
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
  Image as ImageIcon,
  Users,
  ChevronDown,
  ChevronUp,
  Flag,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Types
interface DuplicateUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: "user" | "dealer" | "admin";
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  listing_id: string;
  listing_title: string;
  listing_price: number;
  posted_date: string;
}

interface DuplicateImageGroup {
  id: string;
  image_url: string;
  image_hash: string; // Perceptual hash for detecting similar images
  total_uploads: number;
  unique_users: number;
  users: DuplicateUser[];
  risk_level: "critical" | "high" | "medium" | "low";
  first_upload: string;
  last_upload: string;
}

// Dummy data - In production, this would come from backend image analysis
const DUPLICATE_IMAGE_GROUPS: DuplicateImageGroup[] = [
  {
    id: "dup-1",
    image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    image_hash: "a1b2c3d4e5f6",
    total_uploads: 4,
    unique_users: 4,
    first_upload: "2024-03-15T10:00:00Z",
    last_upload: "2024-03-28T14:30:00Z",
    risk_level: "critical",
    users: [
      {
        id: "user-1",
        email: "rajkumar99@gmail.com",
        full_name: "Raj Kumar",
        phone: "+91 98765 43210",
        role: "user",
        is_active: true,
        is_verified: false,
        created_at: "2024-03-15T10:00:00Z",
        listing_id: "list-1",
        listing_title: "2023 BMW 3 Series - Pristine Condition",
        listing_price: 4500000,
        posted_date: "2024-03-15T10:00:00Z",
      },
      {
        id: "user-2",
        email: "autodeals.mumbai@yahoo.com",
        full_name: "Auto Deals Mumbai",
        phone: "+91 99887 76655",
        role: "dealer",
        is_active: true,
        is_verified: false,
        created_at: "2024-03-18T08:00:00Z",
        listing_id: "list-2",
        listing_title: "2024 BMW 330i M Sport - Best Price",
        listing_price: 5200000,
        posted_date: "2024-03-20T11:00:00Z",
      },
      {
        id: "user-3",
        email: "quicksale.delhi@gmail.com",
        full_name: "Quick Sale Delhi",
        phone: undefined,
        role: "user",
        is_active: true,
        is_verified: false,
        created_at: "2024-03-22T14:00:00Z",
        listing_id: "list-3",
        listing_title: "BMW 3 Series 2023 - Urgent Sale",
        listing_price: 4200000,
        posted_date: "2024-03-25T09:00:00Z",
      },
      {
        id: "user-4",
        email: "premium.cars.bangalore@hotmail.com",
        full_name: "Premium Cars Bangalore",
        phone: "+91 88776 54321",
        role: "dealer",
        is_active: true,
        is_verified: true,
        created_at: "2024-02-01T12:00:00Z",
        listing_id: "list-4",
        listing_title: "2023 BMW 3 Series - Excellent Condition",
        listing_price: 4800000,
        posted_date: "2024-03-28T14:30:00Z",
      },
    ],
  },
  {
    id: "dup-2",
    image_url: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=800&q=80",
    image_hash: "b2c3d4e5f6g7",
    total_uploads: 3,
    unique_users: 3,
    first_upload: "2024-03-20T10:00:00Z",
    last_upload: "2024-03-27T16:45:00Z",
    risk_level: "high",
    users: [
      {
        id: "user-5",
        email: "honda.specialist@gmail.com",
        full_name: "Amit Sharma",
        phone: "+91 77665 54433",
        role: "user",
        is_active: true,
        is_verified: false,
        created_at: "2024-03-10T09:00:00Z",
        listing_id: "list-5",
        listing_title: "2022 Honda Civic - Single Owner",
        listing_price: 2800000,
        posted_date: "2024-03-20T10:00:00Z",
      },
      {
        id: "user-6",
        email: "carsellers.pune@yahoo.com",
        full_name: "Car Sellers Pune",
        phone: "+91 91827 36455",
        role: "dealer",
        is_active: true,
        is_verified: true,
        created_at: "2024-01-15T08:00:00Z",
        listing_id: "list-6",
        listing_title: "Honda Civic 2022 - Top Variant",
        listing_price: 2950000,
        posted_date: "2024-03-23T11:00:00Z",
      },
      {
        id: "user-7",
        email: "deals.unlimited@gmail.com",
        full_name: "Deals Unlimited",
        phone: undefined,
        role: "user",
        is_active: false,
        is_verified: false,
        created_at: "2024-03-25T14:00:00Z",
        listing_id: "list-7",
        listing_title: "2022 Honda Civic Sport - Great Deal",
        listing_price: 2650000,
        posted_date: "2024-03-27T16:45:00Z",
      },
    ],
  },
  {
    id: "dup-3",
    image_url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
    image_hash: "c3d4e5f6g7h8",
    total_uploads: 2,
    unique_users: 2,
    first_upload: "2024-03-18T10:00:00Z",
    last_upload: "2024-03-26T11:00:00Z",
    risk_level: "medium",
    users: [
      {
        id: "user-8",
        email: "luxury.cars.delhi@gmail.com",
        full_name: "Luxury Cars Delhi",
        phone: "+91 98123 45678",
        role: "dealer",
        is_active: true,
        is_verified: true,
        created_at: "2024-02-10T12:00:00Z",
        listing_id: "list-8",
        listing_title: "2024 Mercedes C-Class - Brand New",
        listing_price: 6200000,
        posted_date: "2024-03-18T10:00:00Z",
      },
      {
        id: "user-9",
        email: "merc.specialist@hotmail.com",
        full_name: "Vikram Singh",
        phone: "+91 88990 01122",
        role: "user",
        is_active: true,
        is_verified: false,
        created_at: "2024-03-20T09:00:00Z",
        listing_id: "list-9",
        listing_title: "Mercedes C-Class 2024 - Like New",
        listing_price: 5800000,
        posted_date: "2024-03-26T11:00:00Z",
      },
    ],
  },
];

function getRiskLevelInfo(level: string): { label: string; color: string; bg: string; border: string } {
  switch (level) {
    case "critical":
      return { label: "Critical Risk", color: "text-red-700", bg: "bg-red-100", border: "border-red-300" };
    case "high":
      return { label: "High Risk", color: "text-orange-700", bg: "bg-orange-100", border: "border-orange-300" };
    case "medium":
      return { label: "Medium Risk", color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-300" };
    default:
      return { label: "Low Risk", color: "text-yellow-700", bg: "bg-yellow-100", border: "border-yellow-300" };
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

function DuplicateImageCard({ group }: { group: DuplicateImageGroup }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const riskInfo = getRiskLevelInfo(group.risk_level);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === group.users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(group.users.map((u) => u.id));
    }
  };

  const handleSuspendSelected = () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }
    toast.success(`${selectedUsers.length} account(s) suspended for fraudulent activity`);
    setSelectedUsers([]);
  };

  const handleFlagListing = () => {
    toast.success("All listings with this image have been flagged for review");
  };

  const handleRemoveListings = () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }
    toast.success(`${selectedUsers.length} listing(s) removed from platform`);
    setSelectedUsers([]);
  };

  return (
    <div className={`bg-white border-2 ${riskInfo.border} shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-start gap-4">
          {/* Image Preview */}
          <div className="relative w-32 h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0 border-2 border-slate-200">
            <Image
              src={group.image_url}
              alt="Duplicate car image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-1 left-1 flex items-center gap-1 px-1.5 py-0.5 bg-white/90 rounded text-[10px] font-bold text-slate-700">
              <ImageIcon className="w-3 h-3" />
              ID: {group.image_hash.slice(0, 8)}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${riskInfo.bg} ${riskInfo.color} border ${riskInfo.border}`}>
                <ShieldAlert className="w-3.5 h-3.5" />
                {riskInfo.label}
              </div>
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="w-3 h-3" />
                Duplicate Detected
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Total Uploads</p>
                <p className="text-lg font-bold text-slate-900">{group.total_uploads}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Unique Users</p>
                <p className="text-lg font-bold text-red-600 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {group.unique_users}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">First Upload</p>
                <p className="text-xs font-semibold text-slate-700">{formatDate(group.first_upload)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Last Upload</p>
                <p className="text-xs font-semibold text-slate-700">{formatDate(group.last_upload)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Message */}
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Fraud Detection Alert</p>
              <p className="text-sm text-red-700">
                This image has been uploaded by <strong>{group.unique_users} different accounts</strong>, indicating potential fraudulent activity or unauthorized listing duplication.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="gap-1"
          >
            <Eye className="w-4 h-4" />
            View All Users ({group.users.length})
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFlagListing}
            className="gap-1"
          >
            <Flag className="w-4 h-4" />
            Flag All Listings
          </Button>
          {selectedUsers.length > 0 && (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleSuspendSelected}
                className="gap-1"
              >
                <Ban className="w-4 h-4" />
                Suspend ({selectedUsers.length})
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveListings}
                className="gap-1"
              >
                <AlertTriangle className="w-4 h-4" />
                Remove Listings ({selectedUsers.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Expanded User List */}
      {expanded && (
        <div className="border-t-2 border-slate-200 bg-slate-50">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Users Who Uploaded This Image
              </h4>
              <Button variant="ghost" size="sm" onClick={handleSelectAll} className="text-xs">
                {selectedUsers.length === group.users.length ? "Deselect All" : "Select All"}
              </Button>
            </div>

            <div className="space-y-3">
              {group.users.map((user) => (
                <div
                  key={user.id}
                  className={`bg-white border-2 ${
                    selectedUsers.includes(user.id) ? "border-[#9b111e] bg-red-50" : "border-slate-200"
                  } rounded-lg p-4 transition-all`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="mt-1 w-4 h-4 text-[#9b111e] border-slate-300 rounded focus:ring-[#9b111e]"
                    />

                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      user.role === "dealer" ? "bg-purple-100" : "bg-slate-100"
                    }`}>
                      {user.role === "dealer" ? (
                        <Building2 className="w-5 h-5 text-purple-600" />
                      ) : (
                        <User className="w-5 h-5 text-slate-600" />
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h5 className="font-bold text-slate-900">{user.full_name}</h5>
                        <Badge variant={user.role === "dealer" ? "default" : "secondary"} className="text-xs">
                          {user.role}
                        </Badge>
                        {!user.is_active && <Badge variant="destructive" className="text-xs">Suspended</Badge>}
                        {!user.is_verified && (
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                            Unverified
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mb-2">{user.email}</p>

                      {/* Listing Info */}
                      <div className="bg-slate-50 border border-slate-200 rounded p-2 mb-2">
                        <p className="text-xs font-semibold text-slate-700 mb-1">{user.listing_title}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="font-bold text-[#9b111e]">{formatPrice(user.listing_price)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Posted: {formatDate(user.posted_date)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        {user.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Joined {formatDate(user.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button variant="ghost" size="sm" className="gap-1 h-8 text-xs">
                        <ExternalLink className="w-3 h-3" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 h-8 text-xs">
                        <Mail className="w-3 h-3" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminClientsPage() {
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all");

  const filteredGroups = DUPLICATE_IMAGE_GROUPS.filter((group) => {
    if (filter === "all") return true;
    return group.risk_level === filter;
  });

  const criticalCount = DUPLICATE_IMAGE_GROUPS.filter((g) => g.risk_level === "critical").length;
  const highCount = DUPLICATE_IMAGE_GROUPS.filter((g) => g.risk_level === "high").length;
  const totalDuplicates = DUPLICATE_IMAGE_GROUPS.reduce((sum, g) => sum + g.total_uploads, 0);
  const totalUsers = DUPLICATE_IMAGE_GROUPS.reduce((sum, g) => sum + g.unique_users, 0);

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-[#9b111e]" />
            Duplicate Image Detection
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Identify and take action on fraudulent listings with duplicate car images
          </p>
        </div>

        <div className="flex items-center gap-3">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border-2 border-red-300 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-bold text-red-700">{criticalCount} Critical</span>
            </div>
          )}
          {highCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border-2 border-orange-300 rounded-lg">
              <ShieldAlert className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-bold text-orange-700">{highCount} High Risk</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Duplicate Images Found
            </p>
            <ImageIcon className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{DUPLICATE_IMAGE_GROUPS.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Across {totalDuplicates} total uploads</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Suspicious Users
            </p>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-red-600">{totalUsers}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Uploading same images</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Risk Level
            </p>
            <Shield className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-red-600">{criticalCount + highCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Critical & High risk cases</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap bg-white border border-slate-200 rounded-lg p-4">
        <span className="text-sm font-semibold text-slate-700">Filter by Risk Level:</span>
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "all", label: "All Cases" },
            { value: "critical", label: "Critical" },
            { value: "high", label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as typeof filter)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === opt.value
                  ? "bg-[#9b111e] text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duplicate Image Groups */}
      <div className="space-y-6">
        {filteredGroups.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
            <Shield className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No duplicate images found</h3>
            <p className="text-sm text-slate-500">
              {filter === "all"
                ? "All uploaded images appear to be unique."
                : `No ${filter} risk duplicates detected.`}
            </p>
          </div>
        ) : (
          filteredGroups
            .sort((a, b) => {
              const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
              return riskOrder[b.risk_level] - riskOrder[a.risk_level];
            })
            .map((group) => <DuplicateImageCard key={group.id} group={group} />)
        )}
      </div>
    </div>
  );
}
