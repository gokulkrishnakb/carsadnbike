"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, Plus, Upload, Eye, Heart, MessageSquare, TrendingUp,
  Package, Clock, CheckCircle, Edit, ChevronRight, FileSpreadsheet,
  AlertCircle, X, ImagePlus, MapPin, IndianRupee, Gauge, ChevronLeft,
  MoreHorizontal, ExternalLink, Trash2, Video, Fuel, Settings2, Users,
  Shield, Wrench, FileText, ChevronDown, ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import { listingsService } from "@/services/listings.service";
import { useAuthStore } from "@/store/auth.store";
import { formatPrice, formatMileage, imageUrl } from "@/lib/utils";

type BulkVehicle = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: "new" | "used" | "certified";
  vehicle_type: "car" | "bike" | "truck" | "van";
  location: string;
  description: string;
  images: File[];
  previews: string[];
  video: File | null;
  videoPreview: string | null;
  // New specs fields
  fuel_type: "petrol" | "diesel" | "electric" | "hybrid" | "cng" | "lpg" | "";
  transmission: "manual" | "automatic" | "cvt" | "dct" | "";
  color: string;
  seats: number;
  owners: number;
  // Insurance & Service
  insurance_valid: boolean;
  insurance_expiry: string;
  last_service_date: string;
  service_history: boolean;
  // Documents
  rc_available: boolean;
  fitness_valid: boolean;
  rto: string;
  // UI state
  expanded: boolean;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isPending } = useAuthStore();
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkVehicles, setBulkVehicles] = useState<BulkVehicle[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "pending" | "sold">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentAd, setCurrentAd] = useState(0);
  const itemsPerPage = 8;

  const ads = [
    {
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80",
      subtitle: "Limited Time Offer",
      title: "Boost Your Listings - Get 3x More Views!",
      description: "Premium placement for just ₹99/week",
      cta: "Upgrade Now"
    },
    {
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80",
      subtitle: "New Feature",
      title: "AI-Powered Pricing - Sell Faster!",
      description: "Get the best price recommendation instantly",
      cta: "Try Now"
    },
    {
      image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=400&q=80",
      subtitle: "Special Deal",
      title: "List 5 Vehicles, Pay for 3!",
      description: "Bulk listing discount for dealers",
      cta: "Get Offer"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const { data: listingsData, isLoading, refetch } = useQuery({
    queryKey: ["my-listings", user?.id],
    queryFn: () => listingsService.list({ seller_id: user?.id, size: 50 }),
    enabled: !!user?.id,
  });

  const myListings = listingsData?.items ?? [];

  // Stats
  const totalListings = myListings.length;
  const activeListings = myListings.filter(l => l.status === "active").length;
  const pendingListings = myListings.filter(l => l.status === "pending").length;
  const soldListings = myListings.filter(l => l.status === "sold").length;
  const totalViews = myListings.reduce((acc, l) => acc + (l.views || 0), 0);
  const totalValue = myListings.reduce((acc, l) => acc + (l.price || 0), 0);

  // Filter listings based on active tab
  const filteredListings = myListings.filter(l => {
    if (activeTab === "all") return true;
    return l.status === activeTab;
  });

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTabChange = (tab: "all" | "active" | "pending" | "sold") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  if (!isPending && !user) {
    router.push("/auth/login");
    return null;
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#9b111e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAgent = user?.role === "agent" || user?.role === "admin";

  // Bulk upload functions
  const addBulkVehicle = () => {
    const newVehicle: BulkVehicle = {
      id: Date.now().toString(),
      title: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      condition: "used",
      vehicle_type: "car",
      location: "",
      description: "",
      images: [],
      previews: [],
      video: null,
      videoPreview: null,
      fuel_type: "",
      transmission: "",
      color: "",
      seats: 5,
      owners: 1,
      insurance_valid: false,
      insurance_expiry: "",
      last_service_date: "",
      service_history: false,
      rc_available: true,
      fitness_valid: true,
      rto: "",
      expanded: false,
      status: "pending",
    };
    setBulkVehicles(prev => [...prev, newVehicle]);
  };

  const updateBulkVehicle = (id: string, field: keyof BulkVehicle, value: any) => {
    setBulkVehicles(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleBulkImages = (id: string, files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files).filter(f => f.type.startsWith("image/")).slice(0, 10);
    const previews: string[] = [];
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target?.result as string);
        if (previews.length === fileArray.length) {
          setBulkVehicles(prev => prev.map(v =>
            v.id === id ? { ...v, images: [...v.images, ...fileArray].slice(0, 10), previews: [...v.previews, ...previews].slice(0, 10) } : v
          ));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleBulkVideo = (id: string, file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video must be under 100MB");
      return;
    }
    const url = URL.createObjectURL(file);
    setBulkVehicles(prev => prev.map(v =>
      v.id === id ? { ...v, video: file, videoPreview: url } : v
    ));
  };

  const removeBulkVideo = (id: string) => {
    setBulkVehicles(prev => prev.map(v => {
      if (v.id === id && v.videoPreview) {
        URL.revokeObjectURL(v.videoPreview);
        return { ...v, video: null, videoPreview: null };
      }
      return v;
    }));
  };

  const removeBulkVehicle = (id: string) => setBulkVehicles(prev => prev.filter(v => v.id !== id));

  const uploadAllVehicles = async () => {
    if (bulkVehicles.length === 0) { toast.error("Add at least one vehicle"); return; }
    const invalid = bulkVehicles.find(v => !v.make || !v.model || !v.price);
    if (invalid) { toast.error("Fill all required fields"); return; }
    setIsUploading(true);
    for (const vehicle of bulkVehicles) {
      updateBulkVehicle(vehicle.id, "status", "uploading");
      try {
        const listing = await listingsService.create({
          title: vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          make: vehicle.make, model: vehicle.model, year: vehicle.year, price: vehicle.price,
          mileage: vehicle.mileage, condition: vehicle.condition, vehicle_type: vehicle.vehicle_type,
          location: vehicle.location, description: vehicle.description,
          // New fields
          fuel_type: vehicle.fuel_type || undefined,
          transmission: vehicle.transmission || undefined,
          color: vehicle.color || undefined,
          seats: vehicle.seats || undefined,
          owners: vehicle.owners || undefined,
          insurance_valid: vehicle.insurance_valid,
          insurance_expiry: vehicle.insurance_expiry || undefined,
          last_service_date: vehicle.last_service_date || undefined,
          service_history: vehicle.service_history,
          rc_available: vehicle.rc_available,
          fitness_valid: vehicle.fitness_valid,
          rto: vehicle.rto || undefined,
        });
        if (vehicle.images.length > 0) await listingsService.uploadImages(listing.id, vehicle.images);
        // TODO: Upload video when backend supports it
        // if (vehicle.video) await listingsService.uploadVideo(listing.id, vehicle.video);
        updateBulkVehicle(vehicle.id, "status", "success");
      } catch (error: any) {
        updateBulkVehicle(vehicle.id, "status", "error");
        updateBulkVehicle(vehicle.id, "error", error.message || "Failed");
      }
    }
    setIsUploading(false);
    toast.success("Bulk upload completed!");
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-lg font-bold text-gray-900">My Listings</h1>
              <p className="text-xs text-gray-500">Manage your vehicle inventory</p>
            </div>
            <div className="flex items-center gap-2">
              {isAgent && (
                <button
                  onClick={() => { setShowBulkUpload(true); if (bulkVehicles.length === 0) addBulkVehicle(); }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Bulk Upload
                </button>
              )}
              <Link
                href="/main/listings/new"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#9b111e] hover:bg-[#7b0d18] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Vehicle</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Ad Banner */}
        <div className="mb-6 relative overflow-hidden bg-gradient-to-r from-[#9b111e] to-[#d4343f] shadow-lg flex">
          {/* Ad Image */}
          <div className="hidden md:block w-64 h-40 relative shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAd}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={ads[currentAd].image}
                  alt="Ad"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#9b111e]" />
          </div>

          {/* Ad Content */}
          <div className="flex-1 p-6 flex items-center justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAd}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-medium">AD</span>
                  <p className="text-white/80 text-sm font-medium">{ads[currentAd].subtitle}</p>
                </div>
                <h3 className="text-white text-xl font-bold">{ads[currentAd].title}</h3>
                <p className="text-white/70 text-sm mt-1">{ads[currentAd].description}</p>
              </motion.div>
            </AnimatePresence>
            <div className="hidden sm:block">
              <button className="px-5 py-2.5 bg-white text-[#9b111e] font-bold text-sm hover:bg-gray-100 transition-colors shadow-md">
                {ads[currentAd].cta}
              </button>
            </div>
          </div>

          {/* Ad Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {ads.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentAd(i)}
                className={`w-2 h-2 transition-all ${currentAd === i ? "bg-white w-4" : "bg-white/40"}`}
              />
            ))}
          </div>

          {/* Mobile CTA */}
          <button className="sm:hidden absolute bottom-4 right-4 px-4 py-2 bg-white text-[#9b111e] font-bold text-sm hover:bg-gray-100 transition-colors shadow-md">
            {ads[currentAd].cta}
          </button>
        </div>

        {/* Main Listings Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-1">
              {[
                { key: "all", label: "All", count: totalListings },
                { key: "active", label: "Active", count: activeListings },
                { key: "pending", label: "Pending", count: pendingListings },
                { key: "sold", label: "Sold", count: soldListings },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 text-xs ${activeTab === tab.key ? "text-gray-300" : "text-gray-400"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Pagination Info */}
            {filteredListings.length > 0 && (
              <p className="text-xs text-gray-500 hidden sm:block">
                {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredListings.length)} of {filteredListings.length}
              </p>
            )}
          </div>

          {/* Listings */}
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#9b111e] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-1">No {activeTab !== "all" ? activeTab : ""} listings</h3>
              <p className="text-sm text-gray-500 mb-4">
                {activeTab === "all" ? "Start by adding your first vehicle" : `You don't have any ${activeTab} listings`}
              </p>
              <Link
                href="/main/listings/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#9b111e] text-white font-medium text-sm rounded-lg hover:bg-[#7b0d18] transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Vehicle
              </Link>
            </div>
          ) : (
            <>
              {/* Grid View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                {paginatedListings.map((listing, i) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
                    onClick={() => router.push(`/main/listings/${listing.id}`)}
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                      {listing.images?.[0] ? (
                        <Image
                          src={imageUrl(listing.images[0])}
                          alt={listing.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${
                        listing.status === "active" ? "bg-emerald-500 text-white" :
                        listing.status === "pending" ? "bg-amber-500 text-white" :
                        listing.status === "sold" ? "bg-gray-800 text-white" : "bg-red-500 text-white"
                      }`}>
                        {listing.status}
                      </div>
                      {/* Views */}
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 text-white flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {listing.views || 0}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#9b111e] transition-colors">
                        {listing.year} {listing.make} {listing.model}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-0.5">
                          <Gauge className="w-3 h-3" />
                          {formatMileage(listing.mileage)}
                        </span>
                        <span>•</span>
                        <span className="truncate">{listing.location}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <p className="text-lg font-bold text-[#9b111e]">{formatPrice(listing.price)}</p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/main/listings/${listing.id}/edit`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/main/listings/${listing.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {showBulkUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isUploading && setShowBulkUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Bulk Upload</h2>
                  <p className="text-sm text-gray-500">Add multiple vehicles at once</p>
                </div>
                <button
                  onClick={() => !isUploading && setShowBulkUpload(false)}
                  disabled={isUploading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {bulkVehicles.map((vehicle, index) => (
                  <BulkVehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    index={index}
                    onUpdate={updateBulkVehicle}
                    onRemove={removeBulkVehicle}
                    onImagesAdd={handleBulkImages}
                    onVideoAdd={handleBulkVideo}
                    onVideoRemove={removeBulkVideo}
                    disabled={isUploading}
                  />
                ))}

                <button
                  onClick={addBulkVehicle}
                  disabled={isUploading}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#9b111e] hover:text-[#9b111e] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 bg-white"
                >
                  <Plus className="w-5 h-5" /> Add Another Vehicle
                </button>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{bulkVehicles.length}</span> vehicle{bulkVehicles.length !== 1 ? "s" : ""} ready
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowBulkUpload(false)}
                    disabled={isUploading}
                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={uploadAllVehicles}
                    disabled={isUploading || bulkVehicles.length === 0}
                    className="px-5 py-2 bg-[#9b111e] text-white font-semibold rounded-lg hover:bg-[#7b0d18] transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload className="w-4 h-4" /> Upload All</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BulkVehicleCard({ vehicle, index, onUpdate, onRemove, onImagesAdd, onVideoAdd, onVideoRemove, disabled }: {
  vehicle: BulkVehicle; index: number;
  onUpdate: (id: string, field: keyof BulkVehicle, value: any) => void;
  onRemove: (id: string) => void;
  onImagesAdd: (id: string, files: FileList | null) => void;
  onVideoAdd: (id: string, file: File | null) => void;
  onVideoRemove: (id: string) => void;
  disabled: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const statusStyles = {
    pending: "border-gray-200 bg-white",
    uploading: "border-blue-300 bg-blue-50",
    success: "border-emerald-300 bg-emerald-50",
    error: "border-red-300 bg-red-50",
  };

  return (
    <div className={`border rounded-xl p-4 transition-all ${statusStyles[vehicle.status]}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-gray-900 text-white text-xs font-bold rounded-lg flex items-center justify-center">
            {index + 1}
          </span>
          <span className="font-medium text-gray-900">{vehicle.make && vehicle.model ? `${vehicle.make} ${vehicle.model}` : `Vehicle ${index + 1}`}</span>
          {vehicle.status === "uploading" && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
          {vehicle.status === "success" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
          {vehicle.status === "error" && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {vehicle.error}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdate(vehicle.id, "expanded", !vehicle.expanded)}
            disabled={disabled}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
          >
            {vehicle.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={() => onRemove(vehicle.id)} disabled={disabled} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Basic Fields (Always visible) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {[
          { key: "make", label: "Make", placeholder: "Toyota", required: true },
          { key: "model", label: "Model", placeholder: "Camry", required: true },
          { key: "year", label: "Year", type: "number" },
          { key: "price", label: "Price (₹)", type: "number", placeholder: "500000", required: true },
          { key: "mileage", label: "Mileage (km)", type: "number", placeholder: "35000" },
          { key: "location", label: "Location", placeholder: "Mumbai" },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}{field.required && " *"}</label>
            <input
              type={field.type || "text"}
              value={(vehicle as any)[field.key] || ""}
              onChange={(e) => onUpdate(vehicle.id, field.key as keyof BulkVehicle, field.type === "number" ? parseInt(e.target.value) || 0 : e.target.value)}
              disabled={disabled}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] disabled:opacity-50"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Condition</label>
          <select value={vehicle.condition} onChange={(e) => onUpdate(vehicle.id, "condition", e.target.value)} disabled={disabled}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] disabled:opacity-50">
            <option value="used">Used</option>
            <option value="new">New</option>
            <option value="certified">Certified</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
          <select value={vehicle.vehicle_type} onChange={(e) => onUpdate(vehicle.id, "vehicle_type", e.target.value)} disabled={disabled}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] disabled:opacity-50">
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="truck">Truck</option>
          </select>
        </div>
      </div>

      {/* Expanded Fields */}
      <AnimatePresence>
        {vehicle.expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Specifications */}
            <div className="pt-3 border-t border-gray-100 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <Settings2 className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Specifications</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select value={vehicle.fuel_type} onChange={(e) => onUpdate(vehicle.id, "fuel_type", e.target.value)} disabled={disabled}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] disabled:opacity-50">
                    <option value="">Select</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="cng">CNG</option>
                    <option value="lpg">LPG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Transmission</label>
                  <select value={vehicle.transmission} onChange={(e) => onUpdate(vehicle.id, "transmission", e.target.value)} disabled={disabled}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] disabled:opacity-50">
                    <option value="">Select</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                    <option value="cvt">CVT</option>
                    <option value="dct">DCT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    value={vehicle.color}
                    onChange={(e) => onUpdate(vehicle.id, "color", e.target.value)}
                    disabled={disabled}
                    placeholder="White"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Seats</label>
                  <input
                    type="number"
                    value={vehicle.seats || ""}
                    onChange={(e) => onUpdate(vehicle.id, "seats", parseInt(e.target.value) || 0)}
                    disabled={disabled}
                    placeholder="5"
                    min={1}
                    max={50}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Owners</label>
                  <input
                    type="number"
                    value={vehicle.owners || ""}
                    onChange={(e) => onUpdate(vehicle.id, "owners", parseInt(e.target.value) || 0)}
                    disabled={disabled}
                    placeholder="1"
                    min={1}
                    max={10}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Insurance & Service */}
            <div className="pt-3 border-t border-gray-100 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Insurance & Service</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg">
                  <input
                    type="checkbox"
                    id={`insurance-${vehicle.id}`}
                    checked={vehicle.insurance_valid}
                    onChange={(e) => onUpdate(vehicle.id, "insurance_valid", e.target.checked)}
                    disabled={disabled}
                    className="w-4 h-4 text-[#9b111e] border-gray-300 rounded focus:ring-[#9b111e]"
                  />
                  <label htmlFor={`insurance-${vehicle.id}`} className="text-sm text-gray-700">Insurance Valid</label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Insurance Expiry</label>
                  <input
                    type="date"
                    value={vehicle.insurance_expiry}
                    onChange={(e) => onUpdate(vehicle.id, "insurance_expiry", e.target.value)}
                    disabled={disabled || !vehicle.insurance_valid}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last Service Date</label>
                  <input
                    type="date"
                    value={vehicle.last_service_date}
                    onChange={(e) => onUpdate(vehicle.id, "last_service_date", e.target.value)}
                    disabled={disabled}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] disabled:opacity-50"
                  />
                </div>
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg">
                  <input
                    type="checkbox"
                    id={`service-${vehicle.id}`}
                    checked={vehicle.service_history}
                    onChange={(e) => onUpdate(vehicle.id, "service_history", e.target.checked)}
                    disabled={disabled}
                    className="w-4 h-4 text-[#9b111e] border-gray-300 rounded focus:ring-[#9b111e]"
                  />
                  <label htmlFor={`service-${vehicle.id}`} className="text-sm text-gray-700">Service History</label>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="pt-3 border-t border-gray-100 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Documents</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg">
                  <input
                    type="checkbox"
                    id={`rc-${vehicle.id}`}
                    checked={vehicle.rc_available}
                    onChange={(e) => onUpdate(vehicle.id, "rc_available", e.target.checked)}
                    disabled={disabled}
                    className="w-4 h-4 text-[#9b111e] border-gray-300 rounded focus:ring-[#9b111e]"
                  />
                  <label htmlFor={`rc-${vehicle.id}`} className="text-sm text-gray-700">RC Available</label>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg">
                  <input
                    type="checkbox"
                    id={`fitness-${vehicle.id}`}
                    checked={vehicle.fitness_valid}
                    onChange={(e) => onUpdate(vehicle.id, "fitness_valid", e.target.checked)}
                    disabled={disabled}
                    className="w-4 h-4 text-[#9b111e] border-gray-300 rounded focus:ring-[#9b111e]"
                  />
                  <label htmlFor={`fitness-${vehicle.id}`} className="text-sm text-gray-700">Fitness Valid</label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">RTO</label>
                  <input
                    type="text"
                    value={vehicle.rto}
                    onChange={(e) => onUpdate(vehicle.id, "rto", e.target.value)}
                    disabled={disabled}
                    placeholder="MH-01"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Images and Video */}
      <div className="flex flex-wrap items-start gap-4 pt-3 border-t border-gray-100">
        {/* Images */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <ImagePlus className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-500 font-medium">Images ({vehicle.previews.length}/10)</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {vehicle.previews.map((preview, i) => (
              <div key={i} className="w-12 h-9 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img src={preview} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {vehicle.previews.length < 10 && (
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={disabled}
                className="w-12 h-9 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-[#9b111e] hover:text-[#9b111e] transition-colors disabled:opacity-50">
                <ImagePlus className="w-4 h-4" />
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onImagesAdd(vehicle.id, e.target.files)} disabled={disabled} />
          </div>
        </div>

        {/* Video */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-500 font-medium">Video (max 100MB)</span>
          </div>
          {vehicle.videoPreview ? (
            <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-900 group">
              <video src={vehicle.videoPreview} className="w-full h-full object-cover" />
              <button
                onClick={() => onVideoRemove(vehicle.id)}
                disabled={disabled}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="w-5 h-5 text-white/70" />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={disabled}
              className="w-24 h-16 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#9b111e] hover:text-[#9b111e] transition-colors disabled:opacity-50"
            >
              <Video className="w-4 h-4 mb-1" />
              <span className="text-[10px]">Add Video</span>
            </button>
          )}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => onVideoAdd(vehicle.id, e.target.files?.[0] || null)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Expand hint when collapsed */}
      {!vehicle.expanded && (
        <button
          onClick={() => onUpdate(vehicle.id, "expanded", true)}
          className="mt-3 text-xs text-[#9b111e] hover:underline flex items-center gap-1"
        >
          <ChevronDown className="w-3 h-3" /> Show more options (specs, insurance, documents)
        </button>
      )}
    </div>
  );
}
