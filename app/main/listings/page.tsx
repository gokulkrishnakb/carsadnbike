"use client";

import { Suspense, useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  X, ChevronDown, Search, Car, Bike, Truck, Grid3X3, List, Heart,
  MapPin, Gauge, Fuel, ArrowUpDown, Clock, Filter,
  ChevronRight, ChevronLeft, Calendar, Navigation, Loader2, SlidersHorizontal,
  Sparkles, Camera, Users, Shield, ChevronsLeft, ChevronsRight
} from "lucide-react";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { FilterSidebar } from "@/features/search/filter-sidebar";
import { formatPrice, formatMileage, timeAgo, imageUrl } from "@/lib/utils";
import type { SearchFilters, Listing } from "@/types";

// Dummy Listings Data - No backend needed
const DUMMY_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "2023 Toyota Camry XLE",
    make: "Toyota",
    model: "Camry",
    variant: "XLE Hybrid",
    year: 2023,
    price: 3500000,
    mileage: 12000,
    fuel_type: "Hybrid",
    transmission: "Automatic",
    condition: "new",
    location: "Mumbai",
    images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "2",
    title: "2022 Honda Civic Sport",
    make: "Honda",
    model: "Civic",
    variant: "Sport Turbo",
    year: 2022,
    price: 2800000,
    mileage: 25000,
    fuel_type: "Petrol",
    transmission: "CVT",
    condition: "used",
    location: "Delhi",
    images: ["https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "3",
    title: "2023 BMW 3 Series",
    make: "BMW",
    model: "3 Series",
    variant: "330i M Sport",
    year: 2023,
    price: 5500000,
    mileage: 8000,
    fuel_type: "Petrol",
    transmission: "Automatic",
    condition: "new",
    location: "Bangalore",
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "4",
    title: "2021 Mercedes-Benz C-Class",
    make: "Mercedes-Benz",
    model: "C-Class",
    variant: "C200 AMG Line",
    year: 2021,
    price: 4800000,
    mileage: 35000,
    fuel_type: "Petrol",
    transmission: "Automatic",
    condition: "used",
    location: "Chennai",
    images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "5",
    title: "2023 Hyundai Creta SX",
    make: "Hyundai",
    model: "Creta",
    variant: "SX(O) Diesel",
    year: 2023,
    price: 1800000,
    mileage: 5000,
    fuel_type: "Diesel",
    transmission: "Automatic",
    condition: "new",
    location: "Pune",
    images: ["https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "6",
    title: "2022 Maruti Suzuki Swift ZXi",
    make: "Maruti Suzuki",
    model: "Swift",
    variant: "ZXi+ AGS",
    year: 2022,
    price: 850000,
    mileage: 18000,
    fuel_type: "Petrol",
    transmission: "Automatic",
    condition: "used",
    location: "Hyderabad",
    images: ["https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: "7",
    title: "2023 Tata Nexon EV Max",
    make: "Tata",
    model: "Nexon EV",
    variant: "Max LR",
    year: 2023,
    price: 2200000,
    mileage: 3000,
    fuel_type: "Electric",
    transmission: "Automatic",
    condition: "new",
    location: "Ahmedabad",
    images: ["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "8",
    title: "2020 Audi Q5 Premium",
    make: "Audi",
    model: "Q5",
    variant: "45 TFSI Premium Plus",
    year: 2020,
    price: 4200000,
    mileage: 42000,
    fuel_type: "Petrol",
    transmission: "Automatic",
    condition: "used",
    location: "Kolkata",
    images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "9",
    title: "2023 Kia Seltos GTX+",
    make: "Kia",
    model: "Seltos",
    variant: "GTX+ Turbo DCT",
    year: 2023,
    price: 2100000,
    mileage: 8000,
    fuel_type: "Petrol",
    transmission: "DCT",
    condition: "new",
    location: "Mumbai",
    images: ["https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: "10",
    title: "2021 Mahindra XUV700 AX7",
    make: "Mahindra",
    model: "XUV700",
    variant: "AX7 L Diesel AWD",
    year: 2021,
    price: 2500000,
    mileage: 28000,
    fuel_type: "Diesel",
    transmission: "Automatic",
    condition: "used",
    location: "Delhi",
    images: ["https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
  {
    id: "11",
    title: "2022 Volkswagen Virtus GT",
    make: "Volkswagen",
    model: "Virtus",
    variant: "GT 1.5 TSI",
    year: 2022,
    price: 1900000,
    mileage: 15000,
    fuel_type: "Petrol",
    transmission: "DSG",
    condition: "used",
    location: "Bangalore",
    images: ["https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
  },
  {
    id: "12",
    title: "2023 MG Hector Plus Sharp",
    make: "MG",
    model: "Hector Plus",
    variant: "Sharp Pro CVT",
    year: 2023,
    price: 2300000,
    mileage: 6000,
    fuel_type: "Petrol",
    transmission: "CVT",
    condition: "new",
    location: "Chennai",
    images: ["https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
  },
  {
    id: "13",
    title: "2020 Ford Endeavour Titanium",
    make: "Ford",
    model: "Endeavour",
    variant: "Titanium+ 4x4 AT",
    year: 2020,
    price: 3200000,
    mileage: 45000,
    fuel_type: "Diesel",
    transmission: "Automatic",
    condition: "used",
    location: "Pune",
    images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 192).toISOString(),
  },
  {
    id: "14",
    title: "2023 Skoda Slavia Style",
    make: "Skoda",
    model: "Slavia",
    variant: "Style 1.5 TSI",
    year: 2023,
    price: 1750000,
    mileage: 4000,
    fuel_type: "Petrol",
    transmission: "DSG",
    condition: "new",
    location: "Hyderabad",
    images: ["https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 216).toISOString(),
  },
  {
    id: "15",
    title: "2021 Jeep Compass Model S",
    make: "Jeep",
    model: "Compass",
    variant: "Model S 4x4 Diesel",
    year: 2021,
    price: 2900000,
    mileage: 32000,
    fuel_type: "Diesel",
    transmission: "Automatic",
    condition: "used",
    location: "Ahmedabad",
    images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(),
  },
  {
    id: "16",
    title: "2023 Honda City e:HEV",
    make: "Honda",
    model: "City",
    variant: "e:HEV ZX CVT",
    year: 2023,
    price: 2000000,
    mileage: 2000,
    fuel_type: "Hybrid",
    transmission: "CVT",
    condition: "new",
    location: "Mumbai",
    images: ["https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 264).toISOString(),
  },
  {
    id: "17",
    title: "2019 BMW X1 sDrive20d",
    make: "BMW",
    model: "X1",
    variant: "sDrive20d M Sport",
    year: 2019,
    price: 2800000,
    mileage: 55000,
    fuel_type: "Diesel",
    transmission: "Automatic",
    condition: "used",
    location: "Delhi",
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 288).toISOString(),
  },
  {
    id: "18",
    title: "2023 Tata Harrier Fearless+",
    make: "Tata",
    model: "Harrier",
    variant: "Fearless+ Dark AT",
    year: 2023,
    price: 2400000,
    mileage: 7000,
    fuel_type: "Diesel",
    transmission: "Automatic",
    condition: "new",
    location: "Bangalore",
    images: ["https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 312).toISOString(),
  },
  {
    id: "19",
    title: "2022 Toyota Fortuner Legender",
    make: "Toyota",
    model: "Fortuner",
    variant: "Legender 4x4 AT",
    year: 2022,
    price: 4500000,
    mileage: 22000,
    fuel_type: "Diesel",
    transmission: "Automatic",
    condition: "used",
    location: "Chennai",
    images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 336).toISOString(),
  },
  {
    id: "20",
    title: "2023 Maruti Suzuki Brezza ZXi+",
    make: "Maruti Suzuki",
    model: "Brezza",
    variant: "ZXi+ AT",
    year: 2023,
    price: 1350000,
    mileage: 3000,
    fuel_type: "Petrol",
    transmission: "Automatic",
    condition: "new",
    location: "Pune",
    images: ["https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80"],
    status: "active",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 360).toISOString(),
  },
];

const PAGE_SIZE = 20;

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "created_at_desc", label: "Recently Added" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "year_desc", label: "Year: Newest First" },
  { value: "mileage_asc", label: "Mileage: Low to High" },
] as const;

const VEHICLE_TYPES = [
  { value: undefined, label: "All Vehicles", count: "12.5K+" },
  { value: "car", label: "Cars", icon: Car, count: "8.2K+" },
  { value: "bike", label: "Bikes", icon: Bike, count: "3.1K+" },
  { value: "truck", label: "Commercial", icon: Truck, count: "1.2K+" },
] as const;

const BUDGET_RANGES = [
  { label: "Under 3 Lakh", min: 0, max: 300000 },
  { label: "3-5 Lakh", min: 300000, max: 500000 },
  { label: "5-10 Lakh", min: 500000, max: 1000000 },
  { label: "10-15 Lakh", min: 1000000, max: 1500000 },
  { label: "15-25 Lakh", min: 1500000, max: 2500000 },
  { label: "25-50 Lakh", min: 2500000, max: 5000000 },
  { label: "50 Lakh+", min: 5000000, max: undefined },
];

const POPULAR_BRANDS = [
  { name: "Maruti Suzuki", logo: "/brands/maruti.png" },
  { name: "Hyundai", logo: "/brands/hyundai.png" },
  { name: "Tata", logo: "/brands/tata.png" },
  { name: "Mahindra", logo: "/brands/mahindra.png" },
  { name: "Honda", logo: "/brands/honda.png" },
  { name: "Toyota", logo: "/brands/toyota.png" },
  { name: "Kia", logo: "/brands/kia.png" },
  { name: "MG", logo: "/brands/mg.png" },
];

const ALL_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad",
  "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
  "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut",
  "Noida", "Chandigarh", "Guwahati", "Kochi", "Coimbatore", "Mysore"
];

const POPULAR_CITIES = [
  { name: "Mumbai", icon: "🏙️" },
  { name: "Delhi NCR", icon: "🏛️" },
  { name: "Bangalore", icon: "💻" },
  { name: "Chennai", icon: "🌊" },
  { name: "Hyderabad", icon: "🕌" },
  { name: "Pune", icon: "📚" },
];

function ListingsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);

  // Location state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") ?? "");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("q") ?? undefined,
    vehicle_type: (searchParams.get("type") as SearchFilters["vehicle_type"]) ?? undefined,
    condition: (searchParams.get("condition") as SearchFilters["condition"]) ?? undefined,
    sort: "created_at_desc",
    page: 1,
    size: PAGE_SIZE,
  });

  const hasQuery = Boolean(filters.query);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort dummy data based on filters
  const filteredListings = useMemo(() => {
    let result = [...DUMMY_LISTINGS];

    // Filter by search query
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.make.toLowerCase().includes(q) ||
        l.model.toLowerCase().includes(q)
      );
    }

    // Filter by vehicle type (car/bike/truck) - for now all are cars
    if (filters.vehicle_type) {
      // All dummy data is cars, so only filter if not car
      if (filters.vehicle_type !== "car") {
        result = [];
      }
    }

    // Filter by condition
    if (filters.condition) {
      result = result.filter(l => l.condition === filters.condition);
    }

    // Filter by price
    if (filters.min_price !== undefined) {
      result = result.filter(l => l.price >= filters.min_price!);
    }
    if (filters.max_price !== undefined) {
      result = result.filter(l => l.price <= filters.max_price!);
    }

    // Filter by city
    if (selectedCity) {
      result = result.filter(l => l.location.toLowerCase().includes(selectedCity.toLowerCase()));
    }

    // Filter by make
    if (filters.make) {
      result = result.filter(l => l.make.toLowerCase() === filters.make!.toLowerCase());
    }

    // Sort
    switch (filters.sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "year_desc":
        result.sort((a, b) => b.year - a.year);
        break;
      case "mileage_asc":
        result.sort((a, b) => a.mileage - b.mileage);
        break;
      case "created_at_desc":
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [filters, selectedCity]);

  const total = filteredListings.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const allListings = filteredListings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const isLoading = false; // No loading since we're using local data

  // Popup Ad State - Show from beginning
  const [showPopupAd, setShowPopupAd] = useState(true);

  // Show popup ad every 10 seconds after closing
  useEffect(() => {
    if (!showPopupAd) {
      const timer = setTimeout(() => {
        setShowPopupAd(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showPopupAd]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleFiltersChange = useCallback((f: SearchFilters) => {
    setFilters(f);
    setCurrentPage(1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, query: searchQuery || undefined, page: 1 }));
    setCurrentPage(1);
  };

  const handleTypeChange = (type: string | undefined) => {
    setFilters((f) => ({ ...f, vehicle_type: type as SearchFilters["vehicle_type"], page: 1 }));
    setCurrentPage(1);
  };

  const handleBudgetSelect = (budget: typeof BUDGET_RANGES[0]) => {
    setFilters((f) => ({ ...f, min_price: budget.min, max_price: budget.max, page: 1 }));
    setShowBudgetDropdown(false);
    setCurrentPage(1);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city === "Delhi NCR" ? "Delhi" : city);
    setShowLocationModal(false);
    setLocationSearch("");
    setCurrentPage(1);
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) return;
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.state_district || "";
          const match = ALL_CITIES.find(c => city.toLowerCase().includes(c.toLowerCase()));
          if (match) { setSelectedCity(match); setShowLocationModal(false); }
        } catch {} finally { setIsDetectingLocation(false); }
      },
      () => setIsDetectingLocation(false)
    );
  };

  const filteredCities = locationSearch
    ? ALL_CITIES.filter(c => c.toLowerCase().includes(locationSearch.toLowerCase())).slice(0, 8)
    : [];

  const currentSort = SORT_OPTIONS.find(o => o.value === filters.sort) || SORT_OPTIONS[1];
  const currentBudget = BUDGET_RANGES.find(b => b.min === filters.min_price && b.max === filters.max_price);
  const activeFilterCount = [filters.condition, filters.min_price, filters.max_price, filters.min_year, filters.max_year, filters.make].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Search Bar - Compact */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center h-14 gap-3">
            {/* Location */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-[#9b111e] transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#9b111e]" />
              <span className="max-w-[100px] truncate">{selectedCity || "All India"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <div className="w-px h-6 bg-gray-200" />

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex items-center">
              <div className="flex-1 flex items-center bg-gray-100 rounded-lg">
                <Search className="ml-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by brand, model, variant..."
                  className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none"
                />
                <button type="submit" className="px-4 py-2 bg-[#9b111e] text-white text-sm font-semibold rounded-r-lg hover:bg-[#7b0d18] transition-colors">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center h-12 gap-1 overflow-x-auto scrollbar-hide">
            {/* Vehicle Type Tabs */}
            {VEHICLE_TYPES.map((type) => {
              const isActive = filters.vehicle_type === type.value;
              return (
                <button
                  key={type.label}
                  onClick={() => handleTypeChange(type.value)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#9b111e] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {type.icon && <type.icon className="w-4 h-4" />}
                  {type.label}
                </button>
              );
            })}

            <div className="w-px h-5 bg-gray-200 mx-2" />

            {/* Budget Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowBudgetDropdown(!showBudgetDropdown)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  currentBudget ? "bg-red-50 text-[#9b111e] border border-[#9b111e]" : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                Budget {currentBudget ? `: ${currentBudget.label}` : ""}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {showBudgetDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowBudgetDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50"
                    >
                      {BUDGET_RANGES.map((budget) => (
                        <button
                          key={budget.label}
                          onClick={() => handleBudgetSelect(budget)}
                          className={`w-full px-4 py-2 text-left text-sm ${
                            currentBudget?.label === budget.label
                              ? "bg-red-50 text-[#9b111e] font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {budget.label}
                        </button>
                      ))}
                      {currentBudget && (
                        <>
                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={() => { setFilters(f => ({ ...f, min_price: undefined, max_price: undefined })); setShowBudgetDropdown(false); }}
                            className="w-full px-4 py-2 text-left text-sm text-[#9b111e] hover:bg-red-50"
                          >
                            Clear Budget
                          </button>
                        </>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* More Filters */}
            <button
              onClick={() => setShowFilters(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilterCount > 0
                  ? "bg-red-50 text-[#9b111e] border border-[#9b111e]"
                  : "text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              More Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-[#9b111e] text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex-1" />

            {/* Sort & View */}
            <div className="flex items-center gap-2">
              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{currentSort.label}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {showSortDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50"
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => { setFilters((f) => ({ ...f, sort: opt.value as any })); setShowSortDropdown(false); }}
                            className={`w-full px-4 py-2 text-left text-sm ${
                              filters.sort === opt.value ? "bg-red-50 text-[#9b111e] font-medium" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* View Toggle */}
              <div className="hidden md:flex items-center bg-gray-100 rounded p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                >
                  <Grid3X3 className={`w-4 h-4 ${viewMode === "grid" ? "text-[#9b111e]" : "text-gray-500"}`} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                >
                  <List className={`w-4 h-4 ${viewMode === "list" ? "text-[#9b111e]" : "text-gray-500"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Info Bar */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{total.toLocaleString()}</span> vehicles found
              {selectedCity && <span> in <span className="font-semibold">{selectedCity}</span></span>}
            </p>
            {(activeFilterCount > 0 || currentBudget || selectedCity) && (
              <button
                onClick={() => {
                  setFilters({ sort: filters.sort, page: 1, size: PAGE_SIZE });
                  setSelectedCity("");
                }}
                className="text-[#9b111e] font-medium hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        {isLoading ? (
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"}`}>
            {Array.from({ length: 10 }).map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        ) : allListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No vehicles found</h3>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => { setFilters({ sort: filters.sort, page: 1, size: PAGE_SIZE }); setSelectedCity(""); setSearchQuery(""); }}
              className="px-4 py-2 bg-[#9b111e] text-white text-sm font-semibold rounded-lg hover:bg-[#7b0d18]"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Listings Grid */}
            <div className={`grid gap-3 ${
              viewMode === "grid"
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "grid-cols-1 max-w-4xl"
            }`}>
              {allListings.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} viewMode={viewMode} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-8">
                {/* First Page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="First page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Previous */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 mx-2">
                  {getPageNumbers().map((page, idx) => (
                    page === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all ${
                          currentPage === page
                            ? "bg-[#9b111e] text-white"
                            : "border border-gray-200 text-gray-700 hover:border-[#9b111e] hover:text-[#9b111e]"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                {/* Next */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Last page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>

                {/* Page Info */}
                <span className="ml-4 text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4"
            onClick={() => setShowLocationModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Select City</h3>
                <button onClick={() => setShowLocationModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2.5">
                  <Search className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="Search city..."
                    className="flex-1 bg-transparent text-sm focus:outline-none"
                    autoFocus
                  />
                </div>

                <button
                  onClick={detectLocation}
                  disabled={isDetectingLocation}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:border-[#9b111e] hover:text-[#9b111e] transition-colors disabled:opacity-50"
                >
                  {isDetectingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                  Detect My Location
                </button>

                {locationSearch && filteredCities.length > 0 ? (
                  <div className="mt-3 divide-y divide-gray-100">
                    {filteredCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className="w-full px-3 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {city}
                      </button>
                    ))}
                  </div>
                ) : !locationSearch && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Popular Cities</p>
                    <div className="grid grid-cols-3 gap-2">
                      {POPULAR_CITIES.map((city) => (
                        <button
                          key={city.name}
                          onClick={() => handleCitySelect(city.name)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${
                            selectedCity === city.name || (city.name === "Delhi NCR" && selectedCity === "Delhi")
                              ? "border-[#9b111e] bg-red-50"
                              : "border-gray-200 hover:border-[#9b111e]"
                          }`}
                        >
                          <span className="text-lg">{city.icon}</span>
                          <span className="text-xs font-medium text-gray-700">{city.name}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => { setSelectedCity(""); setShowLocationModal(false); }}
                      className="w-full mt-3 py-2 text-sm font-medium text-gray-600 hover:text-[#9b111e]"
                    >
                      Show All India
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFilters(false)} className="fixed inset-0 bg-black/50 z-40" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar filters={filters} onChange={handleFiltersChange} onClose={() => setShowFilters(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Popup Ad - Bottom Right */}
      <AnimatePresence>
        {showPopupAd && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 z-50 w-80 bg-white shadow-2xl border border-gray-300 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPopupAd(false)}
              className="absolute top-2 right-2 z-10 w-8 h-8 bg-black/70 hover:bg-black flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Ad Content */}
            <div className="relative">
              {/* Ad Image */}
              <div className="relative h-44">
                <Image
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80"
                  alt="Premium Car Ad"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-2xl font-black text-white">MEGA SALE!</p>
                  <p className="text-sm text-white/90">Up to 50% Off Premium Listings</p>
                </div>
              </div>

              {/* Ad Details */}
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Limited Time Offer</p>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Premium Listings - 50% Off!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Feature your vehicle at the top and sell 3x faster. Offer ends soon!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPopupAd(false)}
                    className="flex-1 py-2.5 bg-[#9b111e] hover:bg-[#7a0d17] text-white text-sm font-bold transition-colors"
                  >
                    Get Offer Now
                  </button>
                  <button
                    onClick={() => setShowPopupAd(false)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>

              {/* Ad Badge */}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] font-medium">
                AD
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact Card - Professional Marketplace Style
function ListingCard({ listing, viewMode, index }: { listing: Listing; viewMode: "grid" | "list"; index: number }) {
  const [liked, setLiked] = useState(false);
  const thumb = listing.images[0];

  if (viewMode === "list") {
    return (
      <Link href={`/main/listings/${listing.id}`} className="flex bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group">
        <div className="relative w-56 shrink-0">
          {thumb ? (
            <Image src={imageUrl(thumb)} alt={listing.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Car className="w-10 h-10 text-gray-300" />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${listing.condition === "new" ? "bg-green-500" : "bg-gray-600"}`}>
              {listing.condition.toUpperCase()}
            </span>
          </div>
          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/70 text-white text-[10px] rounded flex items-center gap-1">
            <Camera className="w-3 h-3" /> {listing.images.length}
          </span>
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-[#9b111e] transition-colors">
                {listing.year} {listing.make} {listing.model}
              </h3>
              {listing.variant && <p className="text-sm text-gray-500">{listing.variant}</p>}
            </div>
            <p className="text-xl font-bold text-[#9b111e]">{formatPrice(listing.price)}</p>
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1"><Gauge className="w-4 h-4" /> {formatMileage(listing.mileage)}</span>
            <span className="flex items-center gap-1"><Fuel className="w-4 h-4" /> {listing.fuel_type || "Petrol"}</span>
            <span>{listing.transmission || "Manual"}</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {listing.location}</span>
            <span className="text-xs text-gray-400">{timeAgo(listing.created_at)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/main/listings/${listing.id}`} className="block bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group">
      <div className="relative aspect-[4/3]">
        {thumb ? (
          <Image
            src={imageUrl(thumb)}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Car className="w-10 h-10 text-gray-300" />
          </div>
        )}
        {/* Condition Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${listing.condition === "new" ? "bg-green-500" : "bg-gray-600"}`}>
            {listing.condition === "new" ? "NEW" : "USED"}
          </span>
        </div>
        {/* Heart */}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? "fill-[#9b111e] text-[#9b111e]" : "text-gray-500"}`} />
        </button>
        {/* Photo Count */}
        <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/70 text-white text-[10px] rounded flex items-center gap-1">
          <Camera className="w-3 h-3" /> {listing.images.length}
        </span>
        {/* Sold Overlay */}
        {listing.status === "sold" && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white text-black font-bold text-xs px-3 py-1 rounded">SOLD</span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-base font-bold text-[#9b111e]">{formatPrice(listing.price)}</p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-[#9b111e] transition-colors">
          {listing.year} {listing.make} {listing.model}
        </h3>
        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-500">
          <span>{formatMileage(listing.mileage)}</span>
          <span className="w-0.5 h-0.5 bg-gray-300 rounded-full" />
          <span>{listing.fuel_type || "Petrol"}</span>
          <span className="w-0.5 h-0.5 bg-gray-300 rounded-full" />
          <span>{listing.transmission || "Manual"}</span>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
          <span className="truncate flex items-center gap-0.5">
            <MapPin className="w-3 h-3 shrink-0" /> {listing.location}
          </span>
          <span className="shrink-0">{timeAgo(listing.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ListingsPage() {
  return (
    <Suspense>
      <ListingsPageInner />
    </Suspense>
  );
}
