"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SearchFilters, VehicleType, Condition } from "@/types";

const VEHICLE_TYPES: { value: VehicleType; label: string; emoji: string }[] = [
  { value: "car", label: "Car", emoji: "🚗" },
  { value: "bike", label: "Bike", emoji: "🏍" },
  { value: "truck", label: "Truck", emoji: "🚛" },
  { value: "van", label: "Van", emoji: "🚐" },
];

const CONDITIONS: { value: Condition; label: string }[] = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "certified", label: "Certified Pre-Owned" },
];

const PRICE_RANGES = [
  { label: "Under $10K", min: 0, max: 10000 },
  { label: "$10K – $25K", min: 10000, max: 25000 },
  { label: "$25K – $50K", min: 25000, max: 50000 },
  { label: "$50K – $100K", min: 50000, max: 100000 },
  { label: "$100K+", min: 100000, max: undefined },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

interface FilterSidebarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onClose?: () => void;
}

export function FilterSidebar({ filters, onChange, onClose }: FilterSidebarProps) {
  const set = useCallback(
    (patch: Partial<SearchFilters>) => onChange({ ...filters, ...patch, page: 1 }),
    [filters, onChange]
  );

  const reset = () => onChange({ page: 1 });

  const activeCount = [
    filters.vehicle_type, filters.condition, filters.min_price,
    filters.min_year, filters.max_year, filters.make, filters.location,
  ].filter(Boolean).length;

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <span className="font-bold text-slate-900 text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center leading-none">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button onClick={reset} className="text-xs text-blue-600 hover:text-blue-800 font-bold transition-colors">
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 lg:hidden transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-7">
        {/* Vehicle Type */}
        <FilterSection label="Vehicle Type">
          <div className="grid grid-cols-2 gap-2">
            {VEHICLE_TYPES.map(({ value, label, emoji }) => (
              <FilterChip
                key={value}
                active={filters.vehicle_type === value}
                onClick={() => set({ vehicle_type: filters.vehicle_type === value ? undefined : value })}
              >
                <span>{emoji}</span> {label}
              </FilterChip>
            ))}
          </div>
        </FilterSection>

        {/* Condition */}
        <FilterSection label="Condition">
          <div className="space-y-2">
            {CONDITIONS.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded-md border-2 transition-all flex items-center justify-center shrink-0 ${
                    filters.condition === value
                      ? "bg-blue-600 border-blue-600"
                      : "border-slate-300 group-hover:border-blue-400"
                  }`}
                  onClick={() => set({ condition: filters.condition === value ? undefined : value })}
                >
                  {filters.condition === value && (
                    <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
                      <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-medium">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection label="Price Range">
          <div className="space-y-1.5">
            {PRICE_RANGES.map(({ label, min, max }) => {
              const active = filters.min_price === min && filters.max_price === max;
              return (
                <FilterChip
                  key={label}
                  active={active}
                  onClick={() =>
                    set(active ? { min_price: undefined, max_price: undefined } : { min_price: min, max_price: max })
                  }
                  className="w-full text-left justify-start"
                >
                  {label}
                </FilterChip>
              );
            })}
          </div>
        </FilterSection>

        {/* Year */}
        <FilterSection label="Year Range">
          <div className="flex items-center gap-2">
            <select
              value={filters.min_year ?? ""}
              onChange={(e) => set({ min_year: e.target.value ? +e.target.value : undefined })}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors font-medium"
            >
              <option value="">From</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <span className="text-slate-300 text-sm font-bold">—</span>
            <select
              value={filters.max_year ?? ""}
              onChange={(e) => set({ max_year: e.target.value ? +e.target.value : undefined })}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors font-medium"
            >
              <option value="">To</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </FilterSection>

        {/* Make */}
        <FilterSection label="Make / Brand">
          <input
            type="text"
            value={filters.make ?? ""}
            placeholder="e.g. Toyota, BMW…"
            onChange={(e) => set({ make: e.target.value || undefined })}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors font-medium"
          />
        </FilterSection>

        {/* Location */}
        <FilterSection label="Location">
          <input
            type="text"
            value={filters.location ?? ""}
            placeholder="City or state…"
            onChange={(e) => set({ location: e.target.value || undefined })}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors font-medium"
          />
        </FilterSection>

        {onClose && (
          <Button onClick={onClose} className="w-full rounded-xl">
            Show results
          </Button>
        )}
      </div>
    </aside>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
      {children}
    </div>
  );
}

function FilterChip({
  active, onClick, children, className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={`px-3 py-2 rounded-xl text-sm border transition-all font-medium flex items-center gap-1.5 ${
        active
          ? "bg-blue-600 border-blue-600 text-white shadow-[0_1px_4px_rgba(37,99,235,0.3)]"
          : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
      } ${className ?? ""}`}
    >
      {children}
    </motion.button>
  );
}
