"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { X, SlidersHorizontal, Navigation, Loader2, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import type { SearchFilters, Condition } from "@/types";

const CONDITIONS: { value: Condition; label: string }[] = [
  { value: "new", label: "Brand New" },
  { value: "used", label: "Used" },
  { value: "certified", label: "Certified Pre-Owned" },
];

const POPULAR_MAKES = [
  "Toyota",
  "Honda",
  "Nissan",
  "Suzuki",
  "Mitsubishi",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Hyundai",
  "Kia",
  "Ford",
  "Mazda",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

// Sri Lanka Provinces and Districts
const PROVINCES: Record<string, string[]> = {
  "Western": ["Colombo", "Gampaha", "Kalutara"],
  "Central": ["Kandy", "Matale", "Nuwara Eliya"],
  "Southern": ["Galle", "Matara", "Hambantota"],
  "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  "Eastern": ["Trincomalee", "Batticaloa", "Ampara"],
  "North Western": ["Kurunegala", "Puttalam"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  "Uva": ["Badulla", "Monaragala"],
  "Sabaragamuwa": ["Ratnapura", "Kegalle"],
};

const ALL_DISTRICTS = Object.values(PROVINCES).flat();

const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
const TRANSMISSIONS = ["Automatic", "Manual"];

interface FilterSidebarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onClose?: () => void;
}

export function FilterSidebar({ filters, onChange, onClose }: FilterSidebarProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    location: true,
    condition: true,
    price: true,
    make: false,
    year: false,
  });

  // Get districts for selected province
  const availableDistricts = selectedProvince ? PROVINCES[selectedProvince] : [];

  const set = useCallback(
    (patch: Partial<SearchFilters>) => onChange({ ...filters, ...patch, page: 1 }),
    [filters, onChange]
  );

  const reset = () => onChange({ page: 1 });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const activeCount = [
    filters.condition, filters.min_price, filters.max_price,
    filters.min_year, filters.max_year, filters.make, filters.district,
  ].filter(Boolean).length;

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const address = data.address || {};
          const locationParts = [
            address.county,
            address.state_district,
            address.state,
            address.city,
            address.town,
            address.village
          ].filter(Boolean);

          // Find matching district
          let matchedDistrict: string | undefined;
          let matchedProvince: string | undefined;

          for (const [province, districts] of Object.entries(PROVINCES)) {
            const found = districts.find(district =>
              locationParts.some(part =>
                part?.toLowerCase().includes(district.toLowerCase()) ||
                district.toLowerCase().includes(part?.toLowerCase() || "")
              )
            );
            if (found) {
              matchedDistrict = found;
              matchedProvince = province;
              break;
            }
          }

          if (matchedDistrict && matchedProvince) {
            setSelectedProvince(matchedProvince);
            set({ district: matchedDistrict });
          } else {
            alert("Could not match your location. Please select manually.");
          }
        } catch (error) {
          alert("Could not detect your location. Please select manually.");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      () => {
        setIsLoadingLocation(false);
        alert("Location access denied. Please select manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle province change - reset district when province changes
  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    set({ district: undefined }); // Reset district when province changes
  };

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-[#9b111e]" />
          <span className="font-bold text-[#272a41]">Filters</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#9b111e] text-white text-xs font-bold">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button onClick={reset} className="text-xs text-[#9b111e] hover:underline font-semibold">
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 lg:hidden">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {/* Location - Province & District */}
        <CollapsibleSection
          title="Location"
          isOpen={expandedSections.location}
          onToggle={() => toggleSection("location")}
          hasValue={!!filters.district || !!selectedProvince}
        >
          {/* Use My Location Button */}
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
            className="w-full mb-3 px-3 py-2.5 bg-[#9b111e] text-white rounded-lg text-sm font-semibold hover:bg-[#7b0d18] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoadingLocation ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Detecting...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                Use My Location
              </>
            )}
          </button>

          {/* Province Dropdown */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-medium">Province</label>
            <select
              value={selectedProvince}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#272a41] focus:outline-none focus:border-[#9b111e] font-medium"
            >
              <option value="">Select Province</option>
              {Object.keys(PROVINCES).map((province) => (
                <option key={province} value={province}>{province} Province</option>
              ))}
            </select>
          </div>

          {/* District Dropdown - Only show when province is selected */}
          <div className="space-y-2 mt-3">
            <label className="text-xs text-gray-500 font-medium">District</label>
            <select
              value={filters.district ?? ""}
              onChange={(e) => set({ district: e.target.value || undefined })}
              disabled={!selectedProvince}
              className={`w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#272a41] focus:outline-none focus:border-[#9b111e] font-medium ${
                !selectedProvince ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="">{selectedProvince ? "Select District" : "Select Province First"}</option>
              {availableDistricts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Selected Location Badge */}
          {(selectedProvince || filters.district) && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>
                {filters.district ? `${filters.district}, ` : ""}
                {selectedProvince ? `${selectedProvince} Province` : ""}
              </span>
              <button
                onClick={() => {
                  setSelectedProvince("");
                  set({ district: undefined });
                }}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </CollapsibleSection>

        {/* Condition */}
        <CollapsibleSection
          title="Condition"
          isOpen={expandedSections.condition}
          onToggle={() => toggleSection("condition")}
          hasValue={!!filters.condition}
        >
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => set({ condition: filters.condition === value ? undefined : value })}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                  filters.condition === value
                    ? "bg-[#9b111e] border-[#9b111e] text-white"
                    : "bg-white border-gray-200 text-[#56586a] hover:border-[#9b111e]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </CollapsibleSection>

        {/* Price Range */}
        <CollapsibleSection
          title="Price Range"
          isOpen={expandedSections.price}
          onToggle={() => toggleSection("price")}
          hasValue={!!(filters.min_price || filters.max_price)}
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.min_price ?? ""}
                  onChange={(e) => set({ min_price: e.target.value ? +e.target.value : undefined })}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#9b111e]"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Max Price</label>
                <input
                  type="number"
                  placeholder="Any"
                  value={filters.max_price ?? ""}
                  onChange={(e) => set({ max_price: e.target.value ? +e.target.value : undefined })}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#9b111e]"
                />
              </div>
            </div>
            {/* Quick Price Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Under 1M", min: 0, max: 1000000 },
                { label: "1M - 3M", min: 1000000, max: 3000000 },
                { label: "3M - 5M", min: 3000000, max: 5000000 },
                { label: "5M - 10M", min: 5000000, max: 10000000 },
                { label: "10M+", min: 10000000, max: undefined },
              ].map(({ label, min, max }) => {
                const active = filters.min_price === min && filters.max_price === max;
                return (
                  <button
                    key={label}
                    onClick={() => set(active ? { min_price: undefined, max_price: undefined } : { min_price: min, max_price: max })}
                    className={`px-2.5 py-1.5 rounded text-xs font-medium border transition-all ${
                      active
                        ? "bg-[#9b111e] border-[#9b111e] text-white"
                        : "bg-gray-50 border-gray-200 text-[#56586a] hover:border-[#9b111e]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </CollapsibleSection>

        {/* Make / Brand */}
        <CollapsibleSection
          title="Make / Brand"
          isOpen={expandedSections.make}
          onToggle={() => toggleSection("make")}
          hasValue={!!filters.make}
        >
          <div className="space-y-3">
            <input
              type="text"
              value={filters.make ?? ""}
              placeholder="Search make..."
              onChange={(e) => set({ make: e.target.value || undefined })}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#9b111e]"
            />
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_MAKES.slice(0, 8).map((make) => (
                <button
                  key={make}
                  onClick={() => set({ make: filters.make === make ? undefined : make })}
                  className={`px-2.5 py-1.5 rounded text-xs font-medium border transition-all ${
                    filters.make === make
                      ? "bg-[#9b111e] border-[#9b111e] text-white"
                      : "bg-gray-50 border-gray-200 text-[#56586a] hover:border-[#9b111e]"
                  }`}
                >
                  {make}
                </button>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        {/* Year Range */}
        <CollapsibleSection
          title="Year"
          isOpen={expandedSections.year}
          onToggle={() => toggleSection("year")}
          hasValue={!!(filters.min_year || filters.max_year)}
        >
          <div className="flex items-center gap-2">
            <select
              value={filters.min_year ?? ""}
              onChange={(e) => set({ min_year: e.target.value ? +e.target.value : undefined })}
              className="flex-1 bg-white border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#9b111e]"
            >
              <option value="">From</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <span className="text-gray-400">—</span>
            <select
              value={filters.max_year ?? ""}
              onChange={(e) => set({ max_year: e.target.value ? +e.target.value : undefined })}
              className="flex-1 bg-white border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#9b111e]"
            >
              <option value="">To</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </CollapsibleSection>

        {/* Show Results Button - Mobile Only */}
        {onClose && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#9b111e] text-white font-bold rounded-lg hover:bg-[#7b0d18] transition-colors"
            >
              Show Results
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

// Collapsible Section Component
function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  hasValue,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  hasValue?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className={`text-sm font-semibold ${hasValue ? "text-[#9b111e]" : "text-[#272a41]"}`}>
          {title}
          {hasValue && <span className="ml-1.5 text-[#9b111e]">•</span>}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="pb-4"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
