"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Car,
  CheckCircle,
  Megaphone,
  TrendingUp,
  ShoppingBag,
  Plus,
  Settings,
  Eye,
  Clock,
  UserPlus,
  FileText,
  ArrowRight,
} from "lucide-react";
import { adminService } from "@/services/admin.service";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  href?: string;
}) {
  const content = (
    <div className="bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            {label}
          </p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

function QuickAction({
  label,
  description,
  icon: Icon,
  href,
  color,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
    >
      <div className={`w-10 h-10 rounded flex items-center justify-center ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

// Mock recent activity data
const recentActivity = [
  {
    id: "1",
    type: "user",
    icon: UserPlus,
    title: "New user registered",
    description: "john.doe@example.com joined the platform",
    time: "5 minutes ago",
  },
  {
    id: "2",
    type: "listing",
    icon: Car,
    title: "New listing created",
    description: "2024 BMW M3 Competition listed for $85,000",
    time: "15 minutes ago",
  },
  {
    id: "3",
    type: "ad",
    icon: Megaphone,
    title: "Ad campaign started",
    description: "Homepage banner ad is now live",
    time: "1 hour ago",
  },
  {
    id: "4",
    type: "listing",
    icon: CheckCircle,
    title: "Vehicle sold",
    description: "2023 Tesla Model S marked as sold",
    time: "2 hours ago",
  },
  {
    id: "5",
    type: "user",
    icon: UserPlus,
    title: "New dealer registered",
    description: "Premium Motors applied for dealer account",
    time: "3 hours ago",
  },
];

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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Platform overview and quick actions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Users"
          value={stats?.total_users ?? 0}
          icon={Users}
          color="bg-[#9b111e]/10 text-[#9b111e]"
          href="/admin/users"
        />
        <StatCard
          label="Total Listings"
          value={stats?.total_listings ?? 0}
          icon={Car}
          color="bg-slate-100 text-slate-600"
          href="/admin/listings"
        />
        <StatCard
          label="Active Listings"
          value={stats?.active_listings ?? 0}
          icon={TrendingUp}
          color="bg-emerald-50 text-emerald-600"
          href="/admin/listings"
        />
        <StatCard
          label="Sold Vehicles"
          value={stats?.sold_listings ?? 0}
          icon={ShoppingBag}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Total Ads"
          value={stats?.total_ads ?? 0}
          icon={Megaphone}
          color="bg-purple-50 text-purple-600"
          href="/admin/ads"
        />
        <StatCard
          label="Active Ads"
          value={stats?.active_ads ?? 0}
          icon={CheckCircle}
          color="bg-emerald-50 text-emerald-600"
          href="/admin/ads"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          <div className="space-y-2">
            <QuickAction
              label="View All Users"
              description="Manage user accounts and roles"
              icon={Users}
              href="/admin/users"
              color="bg-[#9b111e]/10 text-[#9b111e]"
            />
            <QuickAction
              label="Manage Listings"
              description="Review and moderate vehicle listings"
              icon={Car}
              href="/admin/listings"
              color="bg-blue-50 text-blue-600"
            />
            <QuickAction
              label="Create New Ad"
              description="Set up a new advertisement campaign"
              icon={Plus}
              href="/admin/ads"
              color="bg-purple-50 text-purple-600"
            />
            <QuickAction
              label="Site Settings"
              description="Configure branding and site options"
              icon={Settings}
              href="/admin/settings"
              color="bg-slate-100 text-slate-600"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last 24 hours
            </span>
          </div>
          <div className="bg-white border border-slate-200 divide-y divide-slate-100">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-4">
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                    activity.type === "user"
                      ? "bg-blue-50 text-blue-600"
                      : activity.type === "listing"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-purple-50 text-purple-600"
                  }`}
                >
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                  <p className="text-xs text-slate-500 truncate">{activity.description}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
