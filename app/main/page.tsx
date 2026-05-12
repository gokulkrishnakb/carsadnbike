"use client";

import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search, ArrowRight, Heart, MapPin, ChevronRight,
  Car, Bike, Truck, Shield, MessageSquare, Zap, Plus,
  DollarSign, Calculator, BarChart3, Gauge, TrendingUp,
  Sparkles, Play, ChevronDown, Scale, Fuel, Battery, Leaf, Flame, Calendar, Eye,
  X, Crosshair, Building2, Check, ExternalLink, CheckCircle, IndianRupee, Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

/* ══════════════════════════════════════════════════════════════
   ENHANCED CARTRADE-STYLE DESIGN
   - Improved visual hierarchy
   - Better whitespace
   - Distinct user intent sections
   - Modern interactions
   ══════════════════════════════════════════════════════════════ */

const POPULAR_BRANDS = [
  { name: "Toyota", logo: "/brands/toyota.svg" },
  { name: "Honda", logo: "/brands/honda.svg" },
  { name: "BMW", logo: "/brands/bmw.svg" },
  { name: "Mercedes", logo: "/brands/mercedes.svg" },
  { name: "Audi", logo: "/brands/audi.svg" },
  { name: "Ford", logo: "/brands/ford.svg" },
  { name: "Hyundai", logo: "/brands/hyundai.svg" },
  { name: "Kia", logo: "/brands/kia.svg" },
  { name: "Tesla", logo: "/brands/tesla.svg" },
  { name: "Nissan", logo: "/brands/nissan.svg" },
];

const PRICE_RANGES = [
  { label: "Under $10K", min: 0, max: 10000 },
  { label: "$10K - $25K", min: 10000, max: 25000 },
  { label: "$25K - $50K", min: 25000, max: 50000 },
  { label: "$50K - $100K", min: 50000, max: 100000 },
  { label: "Above $100K", min: 100000, max: null },
];

const BODY_TYPES = [
  { label: "SUV", value: "suv", icon: "🚙" },
  { label: "Sedan", value: "sedan", icon: "🚗" },
  { label: "Hatchback", value: "hatchback", icon: "🚘" },
  { label: "Truck", value: "truck", icon: "🛻" },
  { label: "Coupe", value: "coupe", icon: "🏎️" },
  { label: "Electric", value: "electric", icon: "⚡" },
];

const FUEL_TYPES = [
  { name: "Petrol", icon: Fuel, count: 12500, color: "bg-orange-500" },
  { name: "Diesel", icon: Flame, count: 8200, color: "bg-gray-600" },
  { name: "Electric", icon: Battery, count: 3400, color: "bg-green-500" },
  { name: "Hybrid", icon: Leaf, count: 5100, color: "bg-teal-500" },
];

const POPULAR_USED_CARS = [
  { name: "Toyota Corolla", price: "Rs. 4.5 - 8.5 Lakh", image: "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=400&q=80", year: "2018-2023" },
  { name: "Honda Civic", price: "Rs. 5.2 - 9.8 Lakh", image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=400&q=80", year: "2019-2023" },
  { name: "Toyota Prius", price: "Rs. 6.0 - 12 Lakh", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400&q=80", year: "2017-2022" },
  { name: "Suzuki Swift", price: "Rs. 2.8 - 4.5 Lakh", image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=400&q=80", year: "2018-2023" },
  { name: "Nissan X-Trail", price: "Rs. 8.5 - 15 Lakh", image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=400&q=80", year: "2019-2023" },
  { name: "BMW 3 Series", price: "Rs. 12 - 25 Lakh", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80", year: "2018-2022" },
];

const LATEST_UPDATES = [
  {
    title: "Toyota Launches New Hybrid SUV in Sri Lanka",
    date: "2 hours ago",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=400&q=80",
    category: "Launch"
  },
  {
    title: "Electric Vehicle Tax Benefits Extended for 2025",
    date: "5 hours ago",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=400&q=80",
    category: "News"
  },
  {
    title: "Best Budget Cars Under Rs. 5 Lakh - Complete Guide",
    date: "1 day ago",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80",
    category: "Guide"
  },
  {
    title: "Honda Civic 2024 Review: Is It Worth the Price?",
    date: "2 days ago",
    image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=400&q=80",
    category: "Review"
  },
];

// Dummy Featured Vehicles Data
const FEATURED_LISTINGS = [
  {
    id: "1",
    title: "2023 Toyota Camry XLE",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    price: 3500000,
    mileage: 12000,
    location: "Mumbai, Maharashtra",
    condition: "new",
    featured: true,
    images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80"],
  },
  {
    id: "2",
    title: "2022 Honda Civic Sport",
    make: "Honda",
    model: "Civic",
    year: 2022,
    price: 2800000,
    mileage: 25000,
    location: "Delhi NCR",
    condition: "used",
    featured: true,
    images: ["https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=800&q=80"],
  },
  {
    id: "3",
    title: "2023 BMW 3 Series",
    make: "BMW",
    model: "3 Series",
    year: 2023,
    price: 5500000,
    mileage: 8000,
    location: "Bangalore, Karnataka",
    condition: "new",
    featured: true,
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"],
  },
  {
    id: "4",
    title: "2021 Mercedes-Benz C-Class",
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2021,
    price: 4800000,
    mileage: 35000,
    location: "Chennai, Tamil Nadu",
    condition: "used",
    featured: true,
    images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80"],
  },
  {
    id: "5",
    title: "2023 Hyundai Creta SX",
    make: "Hyundai",
    model: "Creta",
    year: 2023,
    price: 1800000,
    mileage: 5000,
    location: "Pune, Maharashtra",
    condition: "new",
    featured: false,
    images: ["https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80"],
  },
  {
    id: "6",
    title: "2022 Maruti Suzuki Swift ZXi",
    make: "Maruti Suzuki",
    model: "Swift",
    year: 2022,
    price: 850000,
    mileage: 18000,
    location: "Hyderabad, Telangana",
    condition: "used",
    featured: false,
    images: ["https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80"],
  },
  {
    id: "7",
    title: "2023 Tata Nexon EV Max",
    make: "Tata",
    model: "Nexon EV",
    year: 2023,
    price: 2200000,
    mileage: 3000,
    location: "Ahmedabad, Gujarat",
    condition: "new",
    featured: true,
    images: ["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80"],
  },
  {
    id: "8",
    title: "2020 Audi Q5 Premium",
    make: "Audi",
    model: "Q5",
    year: 2020,
    price: 4200000,
    mileage: 42000,
    location: "Kolkata, West Bengal",
    condition: "used",
    featured: false,
    images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80"],
  },
];

function HomeInner() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("used");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [showAiTooltip, setShowAiTooltip] = useState(false);
  const [showPopupAd, setShowPopupAd] = useState(true);

  // Using dummy data instead of backend API
  const listings = FEATURED_LISTINGS;
  const isLoading = false;

  // Show AI tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowAiTooltip(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedMake) params.set("make", selectedMake);
    if (activeTab === "new") params.set("condition", "new");
    if (activeTab === "bikes") params.set("type", "bike");
    router.push(`/main/listings?${params.toString()}`);
  };

  // State for filter dropdowns
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  const [showFuelDropdown, setShowFuelDropdown] = useState(false);
  const [showBodyDropdown, setShowBodyDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedBody, setSelectedBody] = useState("");
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1920&q=80",
  ];

  // Auto-change background image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Show popup ad every 10 seconds after closing
  useEffect(() => {
    if (!showPopupAd) {
      const timer = setTimeout(() => {
        setShowPopupAd(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showPopupAd]);

  const POPULAR_CITIES = [
    { name: "Mumbai", icon: "🏛️" },
    { name: "Delhi", icon: "🕌" },
    { name: "Bangalore", icon: "🏢" },
    { name: "Chennai", icon: "🛕" },
    { name: "Hyderabad", icon: "🏰" },
    { name: "Kolkata", icon: "🌉" },
    { name: "Pune", icon: "🏫" },
    { name: "Ahmedabad", icon: "🏗️" },
    { name: "Jaipur", icon: "🏯" },
    { name: "Lucknow", icon: "🕋" },
  ];

  const ALL_CITIES = [
    // Metro Cities
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad",
    // Tier 1 Cities
    "Jaipur", "Lucknow", "Chandigarh", "Kochi", "Indore", "Nagpur", "Coimbatore", "Surat",
    "Vadodara", "Goa", "Bhopal", "Patna", "Ranchi", "Guwahati", "Bhubaneswar", "Visakhapatnam",
    "Thiruvananthapuram", "Mysore", "Nashik", "Rajkot", "Vijayawada", "Madurai", "Varanasi",
    "Agra", "Meerut", "Faridabad", "Ludhiana", "Amritsar", "Jodhpur", "Raipur", "Dehradun",
    // Tier 2 Cities
    "Noida", "Gurgaon", "Ghaziabad", "Kanpur", "Nagpur", "Thane", "Navi Mumbai", "Pimpri-Chinchwad",
    "Aurangabad", "Solapur", "Jabalpur", "Gwalior", "Allahabad", "Bareilly", "Moradabad", "Aligarh",
    "Gorakhpur", "Jhansi", "Mathura", "Firozabad", "Udaipur", "Ajmer", "Kota", "Bikaner",
    "Bhilwara", "Alwar", "Bharatpur", "Sikar", "Pali", "Sriganganagar", "Hanumangarh",
    // South India
    "Mangalore", "Hubli", "Belgaum", "Gulbarga", "Davangere", "Bellary", "Shimoga", "Tumkur",
    "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul",
    "Thanjavur", "Tiruppur", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha",
    "Kannur", "Kottayam", "Malappuram", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam",
    "Khammam", "Mahbubnagar", "Nalgonda", "Guntur", "Nellore", "Kurnool", "Rajahmundry",
    "Tirupati", "Kadapa", "Kakinada", "Anantapur", "Vizianagaram", "Eluru", "Ongole",
    // North India
    "Saharanpur", "Muzaffarnagar", "Hapur", "Etawah", "Mirzapur", "Jaunpur", "Azamgarh",
    "Rampur", "Shahjahanpur", "Farrukhabad", "Mau", "Haridwar", "Rishikesh", "Roorkee",
    "Haldwani", "Rudrapur", "Kashipur", "Pithoragarh", "Shimla", "Solan", "Dharamshala",
    "Mandi", "Kullu", "Manali", "Jammu", "Srinagar", "Anantnag", "Baramulla", "Udhampur",
    // West India
    "Nanded", "Kolhapur", "Sangli", "Satara", "Ratnagiri", "Jalgaon", "Akola", "Amravati",
    "Latur", "Dhule", "Ahmednagar", "Chandrapur", "Parbhani", "Ichalkaranji", "Jalna",
    "Bhavnagar", "Jamnagar", "Junagadh", "Gandhidham", "Anand", "Nadiad", "Mehsana", "Morbi",
    "Porbandar", "Veraval", "Godhra", "Bharuch", "Navsari", "Valsad", "Vapi", "Silvassa", "Daman",
    // East India
    "Dhanbad", "Bokaro", "Jamshedpur", "Hazaribagh", "Deoghar", "Giridih", "Durgapur", "Asansol",
    "Siliguri", "Howrah", "Bardhaman", "Malda", "Kharagpur", "Haldia", "Cuttack", "Rourkela",
    "Berhampur", "Sambalpur", "Puri", "Balasore", "Baripada", "Jeypore", "Bhilai", "Bilaspur",
    "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Ambikapur", "Muzaffarpur", "Gaya", "Bhagalpur",
    "Darbhanga", "Purnia", "Arrah", "Begusarai", "Katihar", "Munger", "Saharsa", "Sasaram",
    // Northeast India
    "Agartala", "Imphal", "Shillong", "Aizawl", "Kohima", "Itanagar", "Gangtok", "Dibrugarh",
    "Jorhat", "Tezpur", "Silchar", "Tinsukia", "Nagaon", "Bongaigaon", "Dimapur", "Tura"
  ];

  // Also add state names for search
  const INDIAN_STATES_LIST = [
    "Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh", "Telangana", "Maharashtra",
    "Gujarat", "Rajasthan", "Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh",
    "Bihar", "West Bengal", "Odisha", "Jharkhand", "Chhattisgarh", "Assam", "Goa",
    "Himachal Pradesh", "Uttarakhand", "Jammu & Kashmir", "Delhi NCR"
  ];

  const ALL_LOCATIONS = [...ALL_CITIES, ...INDIAN_STATES_LIST];

  const filteredCities = citySearchQuery.length >= 1
    ? ALL_LOCATIONS.filter(city => city.toLowerCase().includes(citySearchQuery.toLowerCase())).slice(0, 10)
    : [];

  const detectCurrentLocation = () => {
    setIsDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const city = data.address?.city || data.address?.town || data.address?.state_district || data.address?.state;
            if (city) {
              // Try to match with our list or use the detected city
              const matchedCity = ALL_CITIES.find(s =>
                city.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(city.toLowerCase())
              );
              setSelectedCity(matchedCity || city);
            }
          } catch (error) {
            console.error("Error detecting location:", error);
          } finally {
            setIsDetectingLocation(false);
            setShowLocationDropdown(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsDetectingLocation(false);
        }
      );
    } else {
      setIsDetectingLocation(false);
    }
  };

  return (
    <div className="min-h-screen ">

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION - CarWale Style with Overlapping Search Card
          ═══════════════════════════════════════════════════════════ */}

      {/* Hero Background Container */}
      
      <section className="relative h-[450px] lg:h-[500px] ">
        {/* Background Image - Auto-changing carousel */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentBgIndex}
              src={HERO_IMAGES[currentBgIndex]}
              alt=""
              className="w-full h-full object-cover absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1d2e]/70 to-[#1a1d2e]/40" />
        </div>

        {/* Hero Text Overlay - Vertically Centered */}
        <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center">
          <div className="max-w-xl">
            <motion.h1
              className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight leading-tight"
              style={{ color: 'white' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Find Your Perfect <span className="text-[#9b111e]">Ride</span>
            </motion.h1>
            <motion.p
              className="text-gray-300 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Browse thousands of verified vehicles from trusted sellers across India
            </motion.p>
          </div>
        </div>
      </section>

      {/* Search Card - Overlapping with Negative Margin (CarWale Style) */}
      <section className="relative z-10 -mt-16 pb-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            className="bg-white rounded-md shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* ROW 1: Header & Location */}
            <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#9b111e] to-[#7b0d18]">
              <h3 className="text-base font-bold text-white">
                {activeTab === "bikes" ? "Find Your Right Bike" : "Find Your Right Car"}
              </h3>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowLocationDropdown(!showLocationDropdown);
                    setShowBudgetDropdown(false);
                    setShowFuelDropdown(false);
                    setShowBodyDropdown(false);
                  }}
                  className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors text-sm font-medium"
                >
                  <span>{activeTab === "bikes" ? "Bikes in" : "Cars in"}</span>
                  <span className="font-semibold">{selectedCity}</span>
                  <MapPin className="w-4 h-4" />
                </button>
                {/* City Selection Modal */}
                <AnimatePresence>
                  {showLocationDropdown && (
                    <>
                      {/* Modal Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { setShowLocationDropdown(false); setCitySearchQuery(""); }}
                        className="fixed inset-0 bg-black/50 z-40"
                      />

                      {/* Modal Container */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                          <h3 className="text-lg font-bold text-[#272a41]">Select your City</h3>
                          <button
                            onClick={() => { setShowLocationDropdown(false); setCitySearchQuery(""); }}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <X className="w-5 h-5 text-gray-500" />
                          </button>
                        </div>

                        {/* Search Area */}
                        <div className="px-6 py-4 border-b border-gray-100">
                          {/* Search Input Container */}
                          <div className="relative">
                            <div className="flex items-center gap-2 px-4 py-3 bg-[#f5f5f5] border border-gray-200 rounded-lg focus-within:border-[#9b111e] focus-within:bg-white transition-all">
                              <Search className="w-4 h-4 text-gray-400 shrink-0" />
                              {/* Selected City Tag */}
                              {selectedCity && !citySearchQuery && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-[#9b111e] text-white text-sm font-medium rounded shrink-0">
                                  {selectedCity}
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedCity(""); }}
                                    className="hover:bg-white/20 rounded"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              )}
                              <input
                                type="text"
                                placeholder={selectedCity ? "Change city..." : "Search for your city..."}
                                value={citySearchQuery}
                                onChange={(e) => setCitySearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none text-sm text-[#272a41] placeholder:text-gray-400 min-w-0 focus:outline-none focus:ring-0 focus:border-none [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-none"
                                style={{ outline: 'none', boxShadow: 'none' }}
                                autoFocus
                              />
                            </div>

                            {/* Search Suggestions Dropdown */}
                            {citySearchQuery.length >= 1 && (
                              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                {filteredCities.length > 0 ? (
                                  filteredCities.map((city) => (
                                    <button
                                      key={city}
                                      onClick={() => {
                                        setSelectedCity(city);
                                        setCitySearchQuery("");
                                        setShowLocationDropdown(false);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm text-[#272a41] hover:bg-[#f5f5f5] hover:text-[#9b111e] flex items-center gap-3 border-b border-gray-50 last:border-0"
                                    >
                                      <MapPin className="w-4 h-4 text-gray-400" />
                                      <span>
                                        <span className="font-medium">{city.slice(0, citySearchQuery.length)}</span>
                                        {city.slice(citySearchQuery.length)}
                                      </span>
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-4 py-3 text-sm text-gray-500">
                                    No cities found for "{citySearchQuery}"
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Detect Location Link */}
                          <button
                            onClick={detectCurrentLocation}
                            disabled={isDetectingLocation}
                            className="flex items-center gap-2 mt-4 text-sm text-[#0066cc] hover:text-[#9b111e] transition-colors font-medium"
                          >
                            {isDetectingLocation ? (
                              <>
                                <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                Detecting your location...
                              </>
                            ) : (
                              <>
                                <Crosshair className="w-4 h-4" />
                                Detect my location
                              </>
                            )}
                          </button>
                        </div>

                        {/* Popular Cities Grid */}
                        <div className="px-6 py-4">
                          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Popular Cities</h4>
                          <div className="grid grid-cols-5 gap-3">
                            {POPULAR_CITIES.map((city) => (
                              <button
                                key={city.name}
                                onClick={() => {
                                  setSelectedCity(city.name);
                                  setCitySearchQuery("");
                                  setShowLocationDropdown(false);
                                }}
                                className={`flex flex-col items-center p-3 rounded-xl transition-all hover:bg-gray-50 group ${
                                  selectedCity === city.name ? "bg-red-50 border border-[#9b111e]" : ""
                                }`}
                              >
                                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{city.icon}</span>
                                <span className={`text-xs font-medium text-center ${
                                  selectedCity === city.name ? "text-[#9b111e]" : "text-[#272a41] group-hover:text-[#9b111e]"
                                }`}>
                                  {city.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ROW 2: Toggle + Search Input */}
            <div className="px-5 py-4">
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-3">
                  {/* Toggle: Car/Bike */}
                  <div className="flex items-center bg-[#f5f5f5] rounded-lg p-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveTab("car")}
                      className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-1.5 ${
                        activeTab === "car" || activeTab === "used" || activeTab === "new"
                          ? "bg-[#9b111e] text-white"
                          : "text-[#666] hover:text-[#272a41]"
                      }`}
                    >
                      <Car className="w-4 h-4" />
                      Car
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("bikes")}
                      className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-1.5 ${
                        activeTab === "bikes"
                          ? "bg-[#9b111e] text-white"
                          : "text-[#666] hover:text-[#272a41]"
                      }`}
                    >
                      <Bike className="w-4 h-4" />
                      Bike
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={activeTab === "bikes" ? "Type bike name, e.g. Honda CBR" : "Type car name, e.g. Toyota Corolla"}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-4 pr-12 py-2.5 bg-white border border-gray-300 rounded-lg text-[#272a41] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#9b111e] focus:shadow-[0_2px_4px_2px_hsla(0,0%,84%,.5)] transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#9b111e] transition-colors"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* ROW 3: Filter Pills */}
            <div className="px-5 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {/* Budget */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBudgetDropdown(!showBudgetDropdown);
                      setShowFuelDropdown(false);
                      setShowBodyDropdown(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                      selectedBudget
                        ? "border-[#9b111e] bg-red-50 text-[#9b111e]"
                        : "border-gray-300 text-[#666] hover:border-[#9b111e] hover:text-[#9b111e]"
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    {selectedBudget ? PRICE_RANGES.find(p => p.min.toString() === selectedBudget)?.label : "Budget"}
                  </button>
                  {showBudgetDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20">
                      <button
                        type="button"
                        onClick={() => { setSelectedBudget(""); setShowBudgetDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-[#666] hover:bg-gray-50 hover:text-[#9b111e]"
                      >
                        Any Budget
                      </button>
                      {PRICE_RANGES.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => { setSelectedBudget(p.min.toString()); setShowBudgetDropdown(false); }}
                          className="w-full px-4 py-2 text-left text-sm text-[#272a41] hover:bg-gray-50 hover:text-[#9b111e]"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Body Type */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBodyDropdown(!showBodyDropdown);
                      setShowBudgetDropdown(false);
                      setShowFuelDropdown(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                      selectedBody
                        ? "border-[#9b111e] bg-red-50 text-[#9b111e]"
                        : "border-gray-300 text-[#666] hover:border-[#9b111e] hover:text-[#9b111e]"
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    {selectedBody ? BODY_TYPES.find(b => b.value === selectedBody)?.label : "Body Type"}
                  </button>
                  {showBodyDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20">
                      <button
                        type="button"
                        onClick={() => { setSelectedBody(""); setShowBodyDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-[#666] hover:bg-gray-50 hover:text-[#9b111e]"
                      >
                        Any Body Type
                      </button>
                      {BODY_TYPES.map((b) => (
                        <button
                          key={b.value}
                          type="button"
                          onClick={() => { setSelectedBody(b.value); setShowBodyDropdown(false); }}
                          className="w-full px-4 py-2 text-left text-sm text-[#272a41] hover:bg-gray-50 hover:text-[#9b111e] flex items-center gap-2"
                        >
                          <span>{b.icon}</span> {b.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fuel Type */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFuelDropdown(!showFuelDropdown);
                      setShowBudgetDropdown(false);
                      setShowBodyDropdown(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                      selectedFuel
                        ? "border-[#9b111e] bg-red-50 text-[#9b111e]"
                        : "border-gray-300 text-[#666] hover:border-[#9b111e] hover:text-[#9b111e]"
                    }`}
                  >
                    <Fuel className="w-4 h-4" />
                    {selectedFuel || "Fuel Type"}
                  </button>
                  {showFuelDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20">
                      <button
                        type="button"
                        onClick={() => { setSelectedFuel(""); setShowFuelDropdown(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-[#666] hover:bg-gray-50 hover:text-[#9b111e]"
                      >
                        Any Fuel Type
                      </button>
                      {["Petrol", "Diesel", "Electric", "Hybrid", "CNG"].map((fuel) => (
                        <button
                          key={fuel}
                          type="button"
                          onClick={() => { setSelectedFuel(fuel); setShowFuelDropdown(false); }}
                          className="w-full px-4 py-2 text-left text-sm text-[#272a41] hover:bg-gray-50 hover:text-[#9b111e]"
                        >
                          {fuel}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Transmission */}
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-300 text-sm font-medium text-[#666] whitespace-nowrap hover:border-[#9b111e] hover:text-[#9b111e] transition-all"
                >
                  <Gauge className="w-4 h-4" />
                  Transmission
                </button>

                {/* All Filters */}
                <Link
                  href="/main/listings"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-300 text-sm font-medium text-[#666] whitespace-nowrap hover:border-[#9b111e] hover:text-[#9b111e] transition-all"
                >
                  <Scale className="w-4 h-4" />
                  All Filters
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURED LISTINGS - Card UI with Rounded Corners & Shadows
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#272a41]">Featured Vehicles</h2>
              <p className="text-[#56586a] mt-1">Hand-picked selections just for you</p>
            </div>
            <Link href="/main/listings" className="text-[#9b111e] font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded-lg animate-pulse w-3/4" />
                    <div className="h-7 bg-gray-200 rounded-lg animate-pulse w-1/2" />
                    <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.slice(0, 4).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CARS BY FUEL TYPE
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#272a41]">Cars by Fuel Type</h2>
              <p className="text-[#56586a] mt-1">Find vehicles that match your preference</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FUEL_TYPES.map((fuel, i) => (
              <motion.div
                key={fuel.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link
                  href={`/main/listings?fuel=${fuel.name.toLowerCase()}`}
                  className="group block bg-[#f8f9fa] rounded-2xl p-6 border border-gray-100 hover:border-[#9b111e] hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-14 h-14 ${fuel.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <fuel.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-[#272a41] text-lg mb-1 group-hover:text-[#9b111e] transition-colors">{fuel.name}</h3>
                  <p className="text-[#56586a] text-sm">{fuel.count.toLocaleString()} cars available</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          THIRD-PARTY AD BANNER
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Sponsored Label */}
          <div className="flex items-center justify-center mb-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Sponsored</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Background Car Image */}
              <div className="absolute inset-0 opacity-30">
                <img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80"
                  alt="Car Insurance Ad"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800" />
              </div>

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-10">
                {/* Left Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Brand Logo/Name */}
                  <div className="mb-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-lg font-black text-blue-600">SecureShield Insurance</span>
                    </div>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                    Comprehensive Car Insurance
                  </h2>
                  <p className="text-white/90 text-lg mb-2 max-w-xl">
                    Starting at just ₹2,999/year
                  </p>
                  <p className="text-white/80 text-sm mb-6 max-w-xl">
                    Get instant quotes • Zero paperwork • Claim settled in 24 hours
                  </p>

                  <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                    <span className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-bold shadow-lg group-hover:scale-105 transition-all">
                      Get Free Quote
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Right Benefits */}
                <div className="flex-shrink-0">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                      <CheckCircle className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white text-xs font-semibold">Instant Coverage</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                      <Shield className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white text-xs font-semibold">100% Claim Rate</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                      <IndianRupee className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white text-xs font-semibold">Best Prices</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                      <Users className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white text-xs font-semibold">2M+ Customers</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AD Badge */}
              <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded">
                ADVERTISEMENT
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          POPULAR USED CARS IN SRI LANKA
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#272a41]">Popular Used Cars in Sri Lanka</h2>
              <p className="text-[#56586a] mt-1">Most searched vehicles this month</p>
            </div>
            <Link href="/main/listings?condition=used" className="text-[#9b111e] font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_USED_CARS.map((car, i) => (
              <motion.div
                key={car.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  href={`/main/listings?q=${encodeURIComponent(car.name)}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#9b111e] hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#272a41] text-sm mb-1 group-hover:text-[#9b111e] transition-colors line-clamp-1">{car.name}</h3>
                    <p className="text-[#9b111e] text-xs font-semibold mb-1">{car.price}</p>
                    <p className="text-[#56586a] text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {car.year}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          LATEST CAR UPDATES / NEWS
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#272a41]">Latest Car Updates</h2>
              <p className="text-[#56586a] mt-1">News, reviews, and buying guides</p>
            </div>
            <Link href="#" className="text-[#9b111e] font-semibold hover:underline flex items-center gap-1">
              All News <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LATEST_UPDATES.map((article, i) => (
              <motion.article
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group bg-[#f8f9fa] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#9b111e] text-white text-xs font-bold rounded">
                    {article.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#272a41] text-sm mb-2 line-clamp-2 group-hover:text-[#9b111e] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-[#56586a] text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          POPULAR BRANDS - Premium Design with Grayscale Effect
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-[#9b111e] font-semibold text-sm uppercase tracking-wider">Trusted Brands</span>
            <h2 className="text-3xl font-bold text-[#272a41] mt-2">Shop by Brand</h2>
          </div>

          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {POPULAR_BRANDS.map((brand, i) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  href={`/main/listings?make=${brand.name}`}
                  className="group flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-[#f8f9fa] rounded-2xl border border-gray-100 flex items-center justify-center p-3 group-hover:border-[#9b111e] group-hover:shadow-lg group-hover:shadow-red-500/10 transition-all duration-300 group-hover:scale-105">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <span className="mt-2 text-xs font-medium text-gray-500 group-hover:text-[#272a41] transition-colors">
                    {brand.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          IMMERSIVE 3D CAR SHOWCASE - Parallax Gallery
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-0 bg-[#0a0a0a] relative overflow-hidden min-h-[80vh]">
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />

        {/* Animated grid lines */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `linear-gradient(rgba(155,17,30,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(155,17,30,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center top'
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[60vh]">
            {/* Left - Big typography */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#9b111e]/20 border border-[#9b111e]/30 rounded-full mb-6"
                animate={{ boxShadow: ["0 0 20px rgba(155,17,30,0)", "0 0 20px rgba(155,17,30,0.5)", "0 0 20px rgba(155,17,30,0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="w-2 h-2 bg-[#9b111e] rounded-full animate-pulse" />
                <span className="text-[#9b111e] text-sm font-semibold">LIVE AUCTIONS</span>
              </motion.div>

              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-6">
                <motion.span
                  className="block text-white"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  DRIVE
                </motion.span>
                <motion.span
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-[#9b111e] to-[#ff4444]"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  YOUR
                </motion.span>
                <motion.span
                  className="block text-white"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  DREAM
                </motion.span>
              </h2>

              <motion.p
                className="text-gray-400 text-lg md:text-xl max-w-md mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                Experience the future of car buying. Immersive 360° views, live auctions, and instant deals.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
              >
                <Link href="/main/listings">
                  <motion.button
                    className="group relative px-8 py-4 bg-[#9b111e] text-white font-bold rounded-full overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Explore Now
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#ff4444] to-[#9b111e]"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </Link>
                <motion.button
                  className="px-8 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right - Floating car cards in 3D space */}
            <div className="relative h-[500px] hidden lg:block perspective-1000">
              {[
                { img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80", name: "BMW M4", price: "₹85L", z: 100, x: 0, y: 0, rotate: -15 },
                { img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80", name: "Mercedes AMG", price: "₹1.2Cr", z: 50, x: 180, y: 100, rotate: 10 },
                { img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=400&q=80", name: "Audi RS7", price: "₹1.8Cr", z: 0, x: 60, y: 250, rotate: -5 },
              ].map((car, i) => (
                <motion.div
                  key={car.name}
                  className="absolute w-64 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                  style={{
                    left: car.x,
                    top: car.y,
                    zIndex: 30 - i * 10
                  }}
                  initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: car.rotate }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.3, duration: 0.8, type: "spring" }}
                  whileHover={{
                    scale: 1.1,
                    rotateY: 0,
                    zIndex: 50,
                    boxShadow: "0 50px 100px -20px rgba(155,17,30,0.5)"
                  }}
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <div className="relative">
                    <img src={car.img} alt={car.name} className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-bold">{car.name}</p>
                      <p className="text-[#9b111e] font-black text-xl">{car.price}</p>
                    </div>
                    {/* Glowing border on hover */}
                    <motion.div
                      className="absolute inset-0 border-2 border-[#9b111e] rounded-2xl opacity-0"
                      whileHover={{ opacity: 1 }}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Floating badges */}
              <motion.div
                className="absolute top-10 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-sm px-4 py-2 rounded-full shadow-lg"
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🔥 HOT DEAL
              </motion.div>

              <motion.div
                className="absolute bottom-20 right-20 bg-white/10 backdrop-blur-sm text-white font-semibold text-sm px-4 py-2 rounded-full border border-white/20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  12 buyers viewing
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          INFINITE BRAND MARQUEE - Smooth Scrolling Logos
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white overflow-hidden border-y border-gray-100">
        <div className="mb-8 text-center">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Trusted by Major Brands</h3>
        </div>

        <div className="relative">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

          <motion.div
            className="flex gap-16 items-center"
            animate={{ x: [0, -1920] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(3)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-16 items-center shrink-0">
                {["Toyota", "Honda", "BMW", "Mercedes", "Audi", "Hyundai", "Kia", "Tata", "Mahindra", "Maruti"].map((brand) => (
                  <motion.div
                    key={`${setIndex}-${brand}`}
                    className="text-3xl font-black text-gray-200 hover:text-[#9b111e] transition-colors cursor-pointer whitespace-nowrap"
                    whileHover={{ scale: 1.1 }}
                  >
                    {brand}
                  </motion.div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SUCCESS STORIES - Cinematic Video Cards
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-[#272a41]">
                Real Stories,<br />
                <span className="text-[#9b111e]">Real People</span>
              </h2>
            </div>
            <p className="text-gray-500 max-w-md">
              Join thousands of happy customers who found their perfect ride through our platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Vikram & Family",
                story: "Found our dream SUV for road trips",
                video: "https://images.unsplash.com/photo-1449965408869-ebd13bc9c185?auto=format&fit=crop&w=600&q=80",
                car: "Toyota Fortuner",
                saved: "₹2.5L saved"
              },
              {
                name: "Priya Sharma",
                story: "Sold my car in just 24 hours!",
                video: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80",
                car: "Honda City",
                saved: "Best price guaranteed"
              },
              {
                name: "Rahul & Team",
                story: "Fleet of 10 cars for our startup",
                video: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80",
                car: "Hyundai Verna",
                saved: "Bulk discount"
              },
            ].map((item, i) => (
              <motion.div
                key={item.name}
                className="group relative rounded-3xl overflow-hidden cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="aspect-[4/5] relative">
                  <img
                    src={item.video}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  {/* Play button */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-[#9b111e] text-white text-xs font-bold rounded-full">
                        {item.saved}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mb-1">{item.car}</p>
                    <h3 className="text-white text-xl font-bold mb-1">{item.story}</h3>
                    <p className="text-white/60 text-sm">— {item.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          LOCATION-BASED DEALS - Interactive Map Preview
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        {/* Dot grid background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle, #9b111e 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                <span className="text-white">Deals Near</span> <span className="text-[#9b111e]">You</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Find amazing deals in your city. We're present in 500+ cities across India.
              </p>

              {/* City pills */}
              <div className="flex flex-wrap gap-3 mb-8">
                {["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"].map((city, i) => (
                  <motion.button
                    key={city}
                    className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                      i === 0
                        ? "bg-[#9b111e] text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {city}
                  </motion.button>
                ))}
              </div>

              <div className="space-y-4">
                {[
                  { title: "2023 BMW 5 Series", location: "Andheri, Mumbai", price: "₹62L", discount: "15% off" },
                  { title: "2022 Mercedes E-Class", location: "Bandra, Mumbai", price: "₹58L", discount: "12% off" },
                  { title: "2023 Audi Q5", location: "Powai, Mumbai", price: "₹55L", discount: "10% off" },
                ].map((deal, i) => (
                  <motion.div
                    key={deal.title}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#9b111e]/50 transition-colors cursor-pointer group"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{ x: 10 }}
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#9b111e] to-[#7b0d18] flex items-center justify-center shrink-0">
                      <Car className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate group-hover:text-[#9b111e] transition-colors">{deal.title}</p>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {deal.location}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white font-bold">{deal.price}</p>
                      <p className="text-green-400 text-sm">{deal.discount}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Map visualization */}
            <motion.div
              className="relative h-[500px] hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              {/* Abstract India map shape */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-80 h-96">
                  {/* Glowing dots for cities */}
                  {[
                    { name: "Mumbai", x: "30%", y: "55%", size: "lg" },
                    { name: "Delhi", x: "45%", y: "25%", size: "lg" },
                    { name: "Bangalore", x: "40%", y: "75%", size: "md" },
                    { name: "Chennai", x: "55%", y: "80%", size: "md" },
                    { name: "Hyderabad", x: "45%", y: "60%", size: "md" },
                    { name: "Kolkata", x: "70%", y: "45%", size: "sm" },
                    { name: "Pune", x: "28%", y: "60%", size: "sm" },
                  ].map((city, i) => (
                    <motion.div
                      key={city.name}
                      className="absolute"
                      style={{ left: city.x, top: city.y }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                    >
                      <motion.div
                        className={`rounded-full bg-[#9b111e] ${
                          city.size === "lg" ? "w-6 h-6" : city.size === "md" ? "w-4 h-4" : "w-3 h-3"
                        }`}
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(155,17,30,0.4)",
                            "0 0 0 20px rgba(155,17,30,0)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      />
                      <span className="absolute left-full ml-2 text-white text-xs font-semibold whitespace-nowrap">
                        {city.name}
                      </span>
                    </motion.div>
                  ))}

                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                    <motion.line
                      x1="30%" y1="55%" x2="45%" y2="25%"
                      stroke="rgba(155,17,30,0.3)"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    />
                    <motion.line
                      x1="30%" y1="55%" x2="40%" y2="75%"
                      stroke="rgba(155,17,30,0.3)"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS - Animated Cards Carousel
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#f8f9fa] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#9b111e] font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#272a41] mt-3">
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Rahul Sharma",
                role: "Bought BMW 3 Series",
                avatar: "RS",
                rating: 5,
                text: "Found my dream car within a week! The process was smooth and the seller was verified. Highly recommend CarsAndBikes!",
                color: "from-blue-500 to-blue-600"
              },
              {
                name: "Priya Patel",
                role: "Sold Honda City",
                avatar: "PP",
                rating: 5,
                text: "Sold my car at the best price in just 3 days. The platform made it super easy to connect with genuine buyers.",
                color: "from-purple-500 to-purple-600"
              },
              {
                name: "Amit Kumar",
                role: "Bought Hyundai Creta",
                avatar: "AK",
                rating: 5,
                text: "Amazing experience! The chat feature helped me negotiate directly with the seller. Got a great deal!",
                color: "from-[#9b111e] to-[#7b0d18]"
              },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                className="bg-white rounded-2xl p-6 shadow-lg relative overflow-hidden group"
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
              >
                {/* Quote mark */}
                <div className="absolute top-4 right-4 text-6xl text-gray-100 font-serif">"</div>

                {/* Rating stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <motion.span
                      key={j}
                      className="text-yellow-400 text-lg"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + j * 0.1 }}
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>

                <p className="text-[#56586a] mb-6 relative z-10 leading-relaxed">"{testimonial.text}"</p>

                <div className="flex items-center gap-3">
                  <motion.div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div>
                    <p className="font-bold text-[#272a41]">{testimonial.name}</p>
                    <p className="text-sm text-[#56586a]">{testimonial.role}</p>
                  </div>
                </div>

                {/* Hover gradient overlay */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COMPARE VEHICLES - Interactive Feature Showcase
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #9b111e 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#9b111e] font-semibold text-sm uppercase tracking-wider">Smart Tools</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#272a41] mt-3 mb-6">
                Compare Vehicles <br />Side by Side
              </h2>
              <p className="text-[#56586a] mb-8 leading-relaxed">
                Make informed decisions with our powerful comparison tool. Compare specifications, features, prices, and more across multiple vehicles at once.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Gauge, text: "Compare performance & specifications" },
                  { icon: DollarSign, text: "Price comparison across dealers" },
                  { icon: Shield, text: "Safety ratings & features" },
                  { icon: Fuel, text: "Fuel efficiency analysis" },
                ].map((item, i) => (
                  <motion.div
                    key={item.text}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"
                      whileHover={{ scale: 1.1, backgroundColor: "#9b111e" }}
                    >
                      <item.icon className="w-5 h-5 text-[#9b111e] group-hover:text-white" />
                    </motion.div>
                    <span className="text-[#272a41] font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="mt-8 px-8 py-4 bg-[#9b111e] text-white font-bold rounded-xl hover:bg-[#7b0d18] transition-colors shadow-lg shadow-red-500/25 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Scale className="w-5 h-5" />
                Start Comparing
              </motion.button>
            </motion.div>

            {/* Right - Animated Cards */}
            <motion.div
              className="relative h-[400px] hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Floating car cards */}
              {[
                { name: "BMW 3 Series", price: "₹55L", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=300&q=80", x: 0, y: 0, rotate: -5 },
                { name: "Mercedes C-Class", price: "₹58L", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=300&q=80", x: 150, y: 80, rotate: 5 },
                { name: "Audi A4", price: "₹52L", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=300&q=80", x: 60, y: 200, rotate: -3 },
              ].map((car, i) => (
                <motion.div
                  key={car.name}
                  className="absolute w-56 bg-white rounded-2xl shadow-2xl overflow-hidden"
                  style={{ left: car.x, top: car.y }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [car.rotate, car.rotate + 2, car.rotate]
                  }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                >
                  <img src={car.image} alt={car.name} className="w-full h-28 object-cover" />
                  <div className="p-3">
                    <h4 className="font-bold text-[#272a41] text-sm">{car.name}</h4>
                    <p className="text-[#9b111e] font-bold">{car.price}</p>
                  </div>
                </motion.div>
              ))}

              {/* VS Badge */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#9b111e] rounded-full flex items-center justify-center shadow-xl z-20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white font-black text-lg">VS</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          APP DOWNLOAD - Animated Phone Mockup
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-[#9b111e] to-[#7b0d18] relative overflow-hidden">
        {/* Animated background shapes */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white/90 text-sm font-medium">Coming Soon</span>
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Get the App,<br />
                <span className="text-white/80">Find Your Ride</span>
              </h2>

              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Download our mobile app for a seamless experience. Browse listings, chat with sellers, and close deals — all from your pocket.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  className="flex items-center gap-3 px-6 py-3 bg-black rounded-xl hover:bg-gray-900 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-white/60 text-xs">Download on the</p>
                    <p className="text-white font-semibold">App Store</p>
                  </div>
                </motion.button>

                <motion.button
                  className="flex items-center gap-3 px-6 py-3 bg-black rounded-xl hover:bg-gray-900 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-white/60 text-xs">Get it on</p>
                    <p className="text-white font-semibold">Google Play</p>
                  </div>
                </motion.button>
              </div>

              {/* Download stats */}
              <div className="flex items-center gap-8 mt-10">
                <div>
                  <p className="text-3xl font-black text-white">4.8</p>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">⭐</span>
                    ))}
                  </div>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div>
                  <p className="text-3xl font-black text-white">1M+</p>
                  <p className="text-white/60 text-sm">Downloads</p>
                </div>
              </div>
            </motion.div>

            {/* Right - Phone Mockup */}
            <motion.div
              className="relative flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="relative w-64 h-[500px]"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Phone frame */}
                <div className="absolute inset-0 bg-black rounded-[3rem] shadow-2xl">
                  <div className="absolute inset-2 bg-white rounded-[2.5rem] overflow-hidden">
                    {/* Screen content */}
                    <div className="h-full bg-gradient-to-b from-gray-50 to-white p-4">
                      {/* Status bar */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-medium">9:41</span>
                        <div className="flex gap-1">
                          <div className="w-4 h-2 bg-gray-400 rounded-sm" />
                          <div className="w-4 h-2 bg-gray-400 rounded-sm" />
                          <div className="w-6 h-3 bg-green-500 rounded-sm" />
                        </div>
                      </div>

                      {/* App header */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-[#9b111e] rounded-lg flex items-center justify-center">
                          <Car className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-sm text-gray-900">CarsAndBikes</span>
                      </div>

                      {/* Mini car cards */}
                      {[1, 2, 3].map((_, i) => (
                        <motion.div
                          key={i}
                          className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-2 flex gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.2 }}
                        >
                          <div className="w-16 h-12 bg-gray-100 rounded-lg" />
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded w-3/4 mb-1" />
                            <div className="h-3 bg-[#9b111e] rounded w-1/2" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  {/* Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" />
                </div>

                {/* Floating elements around phone */}
                <motion.div
                  className="absolute -left-8 top-20 w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center"
                  animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Heart className="w-6 h-6 text-[#9b111e]" />
                </motion.div>

                <motion.div
                  className="absolute -right-6 top-40 w-12 h-12 bg-white rounded-xl shadow-xl flex items-center justify-center"
                  animate={{ y: [0, 10, 0], rotate: [5, -5, 5] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                >
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                </motion.div>

                <motion.div
                  className="absolute -left-4 bottom-32 w-10 h-10 bg-green-500 rounded-full shadow-xl flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA - Sell Your Vehicle (Beautiful Design)
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-0 relative overflow-hidden">
        {/* Split Design - Dark left, Image right */}
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Left Side - Content */}
          <div className="lg:w-1/2 bg-[#0f1219] relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#9b111e]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#9b111e]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative h-full flex items-center px-8 lg:px-16 py-16 lg:py-0">
              <div className="max-w-lg">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#9b111e]/10 border border-[#9b111e]/30 rounded-full mb-6">
                  <span className="w-2 h-2 bg-[#9b111e] rounded-full animate-pulse" />
                  <span className="text-[#9b111e] text-sm font-semibold">100% Free Listing</span>
                </div>

                {/* Heading */}
                <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                  <span className="text-white">Ready to Sell</span>
                  <span className="block text-[#9b111e]">Your Vehicle?</span>
                </h2>

                {/* Description */}
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  Join thousands of sellers who trust CarsAndBikes. List your vehicle for free and connect with serious buyers instantly.
                </p>

                {/* Stats */}
                <div className="flex gap-8 mb-8">
                  <div>
                    <p className="text-3xl font-black text-white">50K+</p>
                    <p className="text-sm text-gray-500">Active Buyers</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">24hr</p>
                    <p className="text-sm text-gray-500">Avg. Response</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">98%</p>
                    <p className="text-sm text-gray-500">Success Rate</p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={user ? "/main/listings/new" : "/auth/login"}
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-[#9b111e] text-white font-bold rounded-xl hover:bg-[#b81f22] transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105"
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Post Free Ad
                  </Link>
                  <Link
                    href="/main/dashboard"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    Learn More
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image with features overlay */}
          <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-0">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80"
                alt="Sell your car"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0f1219] lg:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1219] via-transparent to-transparent lg:hidden" />
            </div>

            {/* Floating Features Card */}
            <div className="absolute bottom-8 left-8 right-8 lg:bottom-12 lg:left-12 lg:right-auto lg:w-80">
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#9b111e] rounded-xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Quick & Easy</p>
                    <p className="text-gray-500 text-sm">List in under 5 minutes</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: "✓", text: "Free vehicle listing" },
                    { icon: "✓", text: "Reach thousands of buyers" },
                    { icon: "✓", text: "Secure messaging system" },
                    { icon: "✓", text: "Get best market price" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 text-xs font-bold">{item.icon}</span>
                      </div>
                      <span className="text-gray-700 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="absolute top-8 right-8 hidden lg:block">
              <div className="bg-white/90 backdrop-blur-xl rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white" />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">2,000+ sellers</p>
                    <p className="text-xs text-gray-500">this month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popup Ad - Bottom Right */}
      <AnimatePresence>
        {showPopupAd && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-80 bg-white shadow-2xl border border-gray-300 overflow-hidden"
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
                <img
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80"
                  alt="Premium Car Ad"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-2xl font-black text-white">SELL FASTER!</p>
                  <p className="text-sm text-white/90">List Your Car Today</p>
                </div>
              </div>

              {/* Ad Details */}
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Special Offer</p>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Free Premium Listing - First Month!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get featured placement and reach thousands of buyers instantly.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPopupAd(false)}
                    className="flex-1 py-2.5 bg-[#9b111e] hover:bg-[#7a0d17] text-white text-sm font-bold transition-colors"
                  >
                    List Now
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

/* ══════════════════════════════════════════════════════════════
   ENHANCED LISTING CARD - Modern Card UI
   ══════════════════════════════════════════════════════════════ */

function ListingCard({ listing }: { listing: any }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const imageUrl = listing.images?.[0]
    ? listing.images[0].startsWith("http")
      ? listing.images[0]
      : `${process.env.NEXT_PUBLIC_API_URL || ""}/uploads/${listing.images[0]}`
    : "/placeholder-car.jpg";

  return (
    <Link href={`/main/listings/${listing.id}`}>
      <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#9b111e]/30 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-car.jpg"; }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
          >
            <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-[#9b111e] text-[#9b111e]" : "text-gray-500"}`} />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {listing.condition === "new" && (
              <span className="px-2.5 py-1 bg-[#9b111e] text-white text-xs font-bold rounded-full">
                New
              </span>
            )}
            {listing.featured && (
              <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-bold text-[#272a41] mb-2 line-clamp-1 group-hover:text-[#9b111e] transition-colors text-lg">
            {listing.year} {listing.make} {listing.model}
          </h3>

          {/* Price */}
          <p className="text-2xl font-bold text-[#9b111e] mb-3">
            {formatPrice(listing.price)}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-[#56586a] mb-4">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4" />
              {listing.mileage?.toLocaleString() || "0"} km
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {listing.location?.split(",")[0] || "Sri Lanka"}
            </span>
          </div>

          {/* CTA */}
          <button className="w-full py-3 border-2 border-[#9b111e] text-[#9b111e] text-sm font-bold rounded-xl hover:bg-[#9b111e] hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
            View Details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </article>
    </Link>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa]" />}>
      <HomeInner />
    </Suspense>
  );
}
