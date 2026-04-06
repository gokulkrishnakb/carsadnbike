"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Car, CheckCircle, Megaphone, TrendingUp, ShoppingBag } from "lucide-react";
import { adminService } from "@/services/admin.service";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white border border-slate-200 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
        <div className={`w-10 h-10 flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminService.getStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Platform overview</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 p-6 h-28 animate-pulse">
              <div className="h-3 w-24 bg-slate-200 mb-3" />
              <div className="h-8 w-16 bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Platform overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={stats?.total_users ?? 0} icon={Users} color="bg-blue-50 text-blue-600" />
        <StatCard label="Total Listings" value={stats?.total_listings ?? 0} icon={Car} color="bg-slate-100 text-slate-600" />
        <StatCard label="Active Listings" value={stats?.active_listings ?? 0} icon={TrendingUp} color="bg-emerald-50 text-emerald-600" />
        <StatCard label="Sold Vehicles" value={stats?.sold_listings ?? 0} icon={ShoppingBag} color="bg-amber-50 text-amber-600" />
        <StatCard label="Total Ads" value={stats?.total_ads ?? 0} icon={Megaphone} color="bg-purple-50 text-purple-600" />
        <StatCard label="Active Ads" value={stats?.active_ads ?? 0} icon={CheckCircle} color="bg-emerald-50 text-emerald-600" />
      </div>
    </div>
  );
}
