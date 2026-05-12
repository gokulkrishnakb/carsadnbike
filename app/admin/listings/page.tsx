"use client";

import { useState, useMemo } from "react";
import { Trash2, ChevronLeft, ChevronRight, Search, Filter, X, Car, Bike, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";

const STATUS_BADGE = {
  active: "success",
  pending: "secondary",
  sold: "warning",
  archived: "destructive",
} as const;

const STATUSES = ["active", "pending", "sold", "archived"];

// Dummy listings data
const DUMMY_LISTINGS = [
  { id: "1", title: "2023 BMW 3 Series M Sport", make: "BMW", model: "3 Series", year: 2023, price: 4500000, status: "active", type: "car", condition: "used", created_at: "2024-03-15T10:00:00Z", seller_name: "Raj Kumar", location: "Mumbai", is_featured: true },
  { id: "2", title: "2024 Honda Civic RS Turbo", make: "Honda", model: "Civic", year: 2024, price: 2800000, status: "active", type: "car", condition: "new", created_at: "2024-03-20T11:00:00Z", seller_name: "Amit Sharma", location: "Delhi", is_featured: false },
  { id: "3", title: "2022 Royal Enfield Classic 350", make: "Royal Enfield", model: "Classic 350", year: 2022, price: 195000, status: "pending", type: "bike", condition: "used", created_at: "2024-03-18T09:30:00Z", seller_name: "Priya Patel", location: "Bangalore" },
  { id: "4", title: "2023 Toyota Fortuner Legender", make: "Toyota", model: "Fortuner", year: 2023, price: 4200000, status: "active", type: "car", condition: "used", created_at: "2024-03-12T14:20:00Z", seller_name: "Vikram Singh", location: "Pune" },
  { id: "5", title: "2024 KTM Duke 390", make: "KTM", model: "Duke 390", year: 2024, price: 285000, status: "sold", type: "bike", condition: "new", created_at: "2024-03-10T08:45:00Z", seller_name: "Auto Deals Mumbai", location: "Mumbai" },
  { id: "6", title: "2021 Hyundai Creta SX(O)", make: "Hyundai", model: "Creta", year: 2021, price: 1450000, status: "active", type: "car", condition: "used", created_at: "2024-03-08T16:10:00Z", seller_name: "Car Sellers Pune", location: "Pune" },
  { id: "7", title: "2023 Mercedes C-Class AMG", make: "Mercedes", model: "C-Class", year: 2023, price: 6200000, status: "active", type: "car", condition: "new", created_at: "2024-03-25T12:30:00Z", seller_name: "Luxury Cars Delhi", location: "Delhi" },
  { id: "8", title: "2022 Yamaha R15 V4", make: "Yamaha", model: "R15 V4", year: 2022, price: 165000, status: "pending", type: "bike", condition: "used", created_at: "2024-03-22T10:15:00Z", seller_name: "Bike Flipper", location: "Chennai" },
  { id: "9", title: "2024 Maruti Swift VXI", make: "Maruti", model: "Swift", year: 2024, price: 750000, status: "active", type: "car", condition: "new", created_at: "2024-03-28T14:00:00Z", seller_name: "Maruti Dealer", location: "Hyderabad" },
  { id: "10", title: "2020 Honda Activa 6G", make: "Honda", model: "Activa 6G", year: 2020, price: 65000, status: "sold", type: "bike", condition: "used", created_at: "2024-03-05T09:20:00Z", seller_name: "Quick Seller", location: "Surat" },
  { id: "11", title: "2023 Audi A4 Premium Plus", make: "Audi", model: "A4", year: 2023, price: 5500000, status: "active", type: "car", condition: "new", created_at: "2024-03-27T11:45:00Z", seller_name: "Premium Cars", location: "Bangalore" },
  { id: "12", title: "2022 Bajaj Pulsar NS200", make: "Bajaj", model: "Pulsar NS200", year: 2022, price: 142000, status: "pending", type: "bike", condition: "used", created_at: "2024-03-19T15:30:00Z", seller_name: "Bike Specialist", location: "Kolkata" },
  { id: "13", title: "2024 Tata Nexon EV Max", make: "Tata", model: "Nexon EV", year: 2024, price: 1800000, status: "active", type: "car", condition: "new", created_at: "2024-03-26T13:10:00Z", seller_name: "EV Hub", location: "Mumbai" },
  { id: "14", title: "2021 TVS Apache RTR 200", make: "TVS", model: "Apache RTR 200", year: 2021, price: 128000, status: "archived", type: "bike", condition: "used", created_at: "2024-02-28T10:00:00Z", seller_name: "Speed Motors", location: "Ahmedabad" },
  { id: "15", title: "2023 Volkswagen Virtus GT", make: "Volkswagen", model: "Virtus", year: 2023, price: 1950000, status: "active", type: "car", condition: "new", created_at: "2024-03-24T09:50:00Z", seller_name: "VW Dealer", location: "Jaipur" },
  { id: "16", title: "2022 Suzuki Gixxer SF 250", make: "Suzuki", model: "Gixxer SF 250", year: 2022, price: 175000, status: "sold", type: "bike", condition: "used", created_at: "2024-03-14T14:25:00Z", seller_name: "Two Wheeler Hub", location: "Pune" },
  { id: "17", title: "2024 MG Hector Plus", make: "MG", model: "Hector Plus", year: 2024, price: 2200000, status: "active", type: "car", condition: "new", created_at: "2024-03-23T16:40:00Z", seller_name: "MG Showroom", location: "Delhi" },
  { id: "18", title: "2023 Hero Splendor Plus", make: "Hero", model: "Splendor Plus", year: 2023, price: 72000, status: "active", type: "bike", condition: "new", created_at: "2024-03-21T08:15:00Z", seller_name: "Hero Dealer", location: "Lucknow" },
  { id: "19", title: "2021 Nissan Magnite Turbo", make: "Nissan", model: "Magnite", year: 2021, price: 950000, status: "pending", type: "car", condition: "used", created_at: "2024-03-17T12:05:00Z", seller_name: "Nissan Hub", location: "Chandigarh" },
  { id: "20", title: "2024 Kawasaki Ninja 300", make: "Kawasaki", model: "Ninja 300", year: 2024, price: 340000, status: "active", type: "bike", condition: "new", created_at: "2024-03-29T10:30:00Z", seller_name: "Superbike Dealer", location: "Bangalore" },
  { id: "21", title: "2022 Kia Seltos GTX Plus", make: "Kia", model: "Seltos", year: 2022, price: 1650000, status: "active", type: "car", condition: "used", created_at: "2024-03-16T13:50:00Z", seller_name: "Kia Motors", location: "Chennai" },
  { id: "22", title: "2023 Ola S1 Pro Electric", make: "Ola", model: "S1 Pro", year: 2023, price: 145000, status: "sold", type: "bike", condition: "new", created_at: "2024-03-11T11:20:00Z", seller_name: "EV Scooters", location: "Hyderabad" },
  { id: "23", title: "2024 Mahindra Thar 4X4", make: "Mahindra", model: "Thar", year: 2024, price: 1750000, status: "active", type: "car", condition: "new", created_at: "2024-03-30T15:10:00Z", seller_name: "Mahindra Dealer", location: "Mumbai" },
  { id: "24", title: "2021 Harley Davidson Street 750", make: "Harley Davidson", model: "Street 750", year: 2021, price: 520000, status: "archived", type: "bike", condition: "used", created_at: "2024-03-01T09:40:00Z", seller_name: "Harley Showroom", location: "Delhi" },
  { id: "25", title: "2023 Jeep Compass Limited", make: "Jeep", model: "Compass", year: 2023, price: 3200000, status: "active", type: "car", condition: "new", created_at: "2024-03-28T17:00:00Z", seller_name: "Jeep Dealer", location: "Pune" },
];

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminListingsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [conditionFilter, setConditionFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const SIZE = 7;
  const qc = useQueryClient();

  const toggleFeaturedMutation = useMutation({
    mutationFn: (listingId: string) => adminService.toggleFeatured(listingId),
    onSuccess: () => {
      toast.success("Featured status updated");
      // In real app, this would invalidate queries
    },
    onError: () => toast.error("Failed to update featured status"),
  });

  // Filter and search logic
  const filteredListings = useMemo(() => {
    return DUMMY_LISTINGS.filter((listing) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          listing.title.toLowerCase().includes(query) ||
          listing.make.toLowerCase().includes(query) ||
          listing.model.toLowerCase().includes(query) ||
          listing.seller_name.toLowerCase().includes(query) ||
          listing.location.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter && listing.status !== statusFilter) return false;

      // Type filter
      if (typeFilter && listing.type !== typeFilter) return false;

      // Condition filter
      if (conditionFilter && listing.condition !== conditionFilter) return false;

      return true;
    });
  }, [searchQuery, statusFilter, typeFilter, conditionFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / SIZE);
  const paginatedListings = filteredListings.slice((page - 1) * SIZE, page * SIZE);

  // Reset page when filters change
  const handleFilterChange = () => {
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setTypeFilter("");
    setConditionFilter("");
    setPage(1);
  };

  const handleStatusChange = (listingId: string, newStatus: string) => {
    toast.success(`Listing status updated to ${newStatus}`);
    // In real app, this would call API
  };

  const handleDeleteListing = (listingId: string, title: string) => {
    if (confirm(`Delete "${title}" permanently?`)) {
      toast.success("Listing deleted successfully");
      // In real app, this would call API
    }
  };

  const handleToggleFeatured = (listingId: string) => {
    toggleFeaturedMutation.mutate(listingId);
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (statusFilter ? 1 : 0) +
    (typeFilter ? 1 : 0) +
    (conditionFilter ? 1 : 0);

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Listings</h1>
          <p className="text-slate-500 text-sm mt-1">
            {filteredListings.length} of {DUMMY_LISTINGS.length} listings
            {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active)`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? "default" : "secondary"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-white text-[#9b111e] rounded-full text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-1">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title, make, model, seller, or location..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleFilterChange();
          }}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#9b111e] focus:ring-2 focus:ring-[#9b111e]/10"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              handleFilterChange();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-2 block uppercase tracking-wider">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  handleFilterChange();
                }}
                className="w-full text-sm border border-slate-200 bg-white px-3 py-2 rounded-lg text-slate-700 focus:outline-none focus:border-[#9b111e] focus:ring-2 focus:ring-[#9b111e]/10"
              >
                <option value="">All Statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-2 block uppercase tracking-wider">
                Vehicle Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  handleFilterChange();
                }}
                className="w-full text-sm border border-slate-200 bg-white px-3 py-2 rounded-lg text-slate-700 focus:outline-none focus:border-[#9b111e] focus:ring-2 focus:ring-[#9b111e]/10"
              >
                <option value="">All Types</option>
                <option value="car">Cars</option>
                <option value="bike">Bikes</option>
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-2 block uppercase tracking-wider">
                Condition
              </label>
              <select
                value={conditionFilter}
                onChange={(e) => {
                  setConditionFilter(e.target.value);
                  handleFilterChange();
                }}
                className="w-full text-sm border border-slate-200 bg-white px-3 py-2 rounded-lg text-slate-700 focus:outline-none focus:border-[#9b111e] focus:ring-2 focus:ring-[#9b111e]/10"
              >
                <option value="">All Conditions</option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Title
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                Type
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                Price
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden xl:table-cell">
                Seller
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                Listed
              </th>
              <th className="text-right px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedListings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-12 h-12 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">No listings found</p>
                    <p className="text-xs text-slate-400">Try adjusting your filters or search query</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900 truncate max-w-xs">
                      {listing.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {listing.make} {listing.model} · {listing.year}
                    </p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      {listing.type === "car" ? (
                        <Car className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <Bike className="w-3.5 h-3.5 text-green-600" />
                      )}
                      <span className="text-xs font-medium text-slate-600 capitalize">
                        {listing.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-700 font-medium hidden md:table-cell">
                    {formatPrice(listing.price)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={STATUS_BADGE[listing.status] ?? "default"}>
                        {listing.status}
                      </Badge>
                      {listing.is_featured && (
                        <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                          <Star className="w-3 h-3 mr-1 fill-white" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden xl:table-cell">
                    <p className="text-sm text-slate-700">{listing.seller_name}</p>
                    <p className="text-xs text-slate-400">{listing.location}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-500 hidden sm:table-cell">
                    {formatDate(listing.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={listing.status}
                        onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                        className="text-xs border border-slate-200 bg-white px-2 py-1 rounded text-slate-700 focus:outline-none focus:border-[#9b111e] focus:ring-1 focus:ring-[#9b111e]/10"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleToggleFeatured(listing.id)}
                        className={`p-1.5 transition-colors ${
                          listing.is_featured
                            ? "text-amber-500 hover:text-amber-600"
                            : "text-slate-400 hover:text-amber-500"
                        }`}
                        title={listing.is_featured ? "Remove from featured" : "Mark as featured"}
                      >
                        <Star className={`h-4 w-4 ${listing.is_featured ? "fill-amber-500" : ""}`} />
                      </button>
                      <button
                        onClick={() => handleDeleteListing(listing.id, listing.title)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-500">
              Showing {(page - 1) * SIZE + 1}-
              {Math.min(page * SIZE, filteredListings.length)} of {filteredListings.length}
            </p>
            <div className="flex gap-1">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={`min-w-[32px] ${page === pageNum ? 'bg-[#9b111e] hover:bg-[#7b0d18]' : ''}`}
                >
                  {pageNum}
                </Button>
              ))}

              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
