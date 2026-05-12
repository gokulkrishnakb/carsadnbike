"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Users,
  Car,
  CheckCircle,
  Megaphone,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  AlertCircle,
  DollarSign,
  Activity,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  UserPlus,
  Eye,
  Clock,
  Star,
  X,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

// Metric Card with trend
function MetricCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  href,
  color,
}: {
  label: string;
  value: number | string;
  change?: string;
  trend?: "up" | "down";
  icon: React.ElementType;
  href?: string;
  color: string;
}) {
  const content = (
    <div className="bg-white rounded-lg border border-slate-200 p-3 hover:shadow-md hover:border-slate-300 transition-all group w-full">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-xl font-bold text-slate-900 whitespace-nowrap">{value}</p>
            {change && (
              <span
                className={`flex items-center gap-0.5 text-[10px] font-semibold whitespace-nowrap ${
                  trend === "up" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {change}
              </span>
            )}
          </div>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-0.5 truncate">{label}</p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block w-full">{content}</Link>;
  }
  return content;
}

// Alert Card
function AlertCard({
  title,
  description,
  severity,
  count,
  href,
}: {
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  count: number;
  href: string;
}) {
  const severityColors = {
    critical: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <Link
      href={href}
      className={`p-4 rounded-lg border ${severityColors[severity]} hover:shadow-md transition-all group`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4" />
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
          <p className="text-xs opacity-80">{description}</p>
        </div>
        <span className="text-xl font-bold ml-3">{count}</span>
      </div>
    </Link>
  );
}

// Activity Item
function ActivityItem({
  icon: Icon,
  title,
  description,
  time,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 truncate">{description}</p>
      </div>
      <span className="text-xs text-slate-400 shrink-0">{time}</span>
    </div>
  );
}

// Quick Stat
function QuickStat({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      {subValue && <p className="text-xs text-emerald-600 font-medium mt-0.5">{subValue}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const qc = useQueryClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminService.getStats,
  });

  const { data: featuredListings, isLoading: featuredLoading } = useQuery({
    queryKey: ["admin-featured-listings"],
    queryFn: adminService.getFeaturedListings,
  });

  const removeFeaturedMutation = useMutation({
    mutationFn: (listingId: string) => adminService.toggleFeatured(listingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-featured-listings"] });
      toast.success("Removed from featured");
    },
    onError: () => toast.error("Failed to remove from featured"),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-64 bg-slate-100 rounded" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-lg p-3 h-16 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-slate-200 rounded-lg shrink-0" />
                <div className="flex-1">
                  <div className="h-5 w-12 bg-slate-200 rounded mb-1" />
                  <div className="h-2.5 w-16 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const recentActivity = [
    {
      icon: UserPlus,
      title: "New user registered",
      description: "john.doe@example.com joined the platform",
      time: "5m ago",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Car,
      title: "New listing created",
      description: "2024 BMW M3 Competition - $85,000",
      time: "12m ago",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: ShoppingBag,
      title: "Vehicle sold",
      description: "2023 Tesla Model S marked as sold",
      time: "1h ago",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Shield,
      title: "Security alert resolved",
      description: "Suspicious account flagged and suspended",
      time: "2h ago",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Megaphone,
      title: "Ad campaign started",
      description: "Homepage banner - 30 day campaign",
      time: "3h ago",
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
          {[
            { value: "7d", label: "7 Days" },
            { value: "30d", label: "30 Days" },
            { value: "90d", label: "90 Days" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as typeof timeRange)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                timeRange === option.value
                  ? "bg-[#9b111e] text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Users"
          value={stats?.total_users?.toLocaleString() ?? "0"}
          change="+12.5%"
          trend="up"
          icon={Users}
          href="/admin/users"
          color="bg-blue-100 text-blue-600"
        />
        <MetricCard
          label="Active Listings"
          value={stats?.active_listings?.toLocaleString() ?? "0"}
          change="+8.2%"
          trend="up"
          icon={Car}
          href="/admin/listings"
          color="bg-emerald-100 text-emerald-600"
        />
        <MetricCard
          label="Revenue"
          value="$24.5K"
          change="+15.3%"
          trend="up"
          icon={DollarSign}
          color="bg-purple-100 text-purple-600"
        />
        <MetricCard
          label="Conversion Rate"
          value="3.2%"
          change="-2.1%"
          trend="down"
          icon={BarChart3}
          color="bg-amber-100 text-amber-600"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Sold Vehicles"
          value={stats?.sold_listings?.toLocaleString() ?? "0"}
          icon={ShoppingBag}
          color="bg-slate-100 text-slate-600"
        />
        <MetricCard
          label="Active Ads"
          value={stats?.active_ads?.toLocaleString() ?? "0"}
          icon={Megaphone}
          href="/admin/ads"
          color="bg-slate-100 text-slate-600"
        />
        <MetricCard
          label="Pending Reviews"
          value="12"
          icon={Eye}
          color="bg-slate-100 text-slate-600"
        />
        <MetricCard
          label="Platform Health"
          value="99.8%"
          icon={Activity}
          href="/admin/health"
          color="bg-slate-100 text-slate-600"
        />
      </div>

      {/* Alerts Section */}
      <div className="w-full">
        <h2 className="text-lg font-bold text-slate-900 mb-3">Alerts & Notifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AlertCard
            title="High Risk Accounts"
            description="Accounts flagged for suspicious activity"
            severity="critical"
            count={3}
            href="/admin/clients"
          />
          <AlertCard
            title="Pending Approvals"
            description="Dealer applications awaiting review"
            severity="warning"
            count={7}
            href="/admin/users"
          />
          <AlertCard
            title="Expiring Ads"
            description="Ad campaigns ending in next 7 days"
            severity="info"
            count={5}
            href="/admin/ads"
          />
        </div>
      </div>

      {/* Featured Listings Section */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Featured Listings
          </h2>
          <Link
            href="/admin/listings"
            className="text-sm font-medium text-[#9b111e] hover:text-[#7b0d18] transition-colors flex items-center gap-1"
          >
            Manage All
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        {featuredLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredListings && featuredListings.length > 0 ? (
              featuredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => removeFeaturedMutation.mutate(listing.id)}
                      className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm border border-slate-200 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove from featured"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {listing.images && listing.images[0] && (
                    <div className="mb-3 -mx-4 -mt-4">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-slate-900 truncate mb-1">
                        {listing.title}
                      </h3>
                      <p className="text-xs text-slate-500 mb-2">
                        {listing.year} · {listing.make} {listing.model}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-base font-bold text-[#9b111e]">
                          ${listing.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-400">{listing.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white border border-dashed border-slate-200 rounded-lg p-12 text-center">
                <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm mb-2">No featured listings yet</p>
                <Link
                  href="/admin/listings"
                  className="text-sm font-medium text-[#9b111e] hover:text-[#7b0d18] transition-colors"
                >
                  Go to listings to feature some cars
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Recent Activity - 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Live updates</span>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivity.map((activity, idx) => (
              <ActivityItem key={idx} {...activity} />
            ))}
          </div>
          <Link
            href="#"
            className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-[#9b111e] hover:text-[#7b0d18] transition-colors"
          >
            View all activity
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Stats - 1 column */}
        <div className="space-y-4">
          {/* Performance Overview */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Performance Overview</h3>
            <div className="space-y-4">
              <QuickStat label="Avg. Response Time" value="2.3h" subValue="-15% faster" />
              <div className="border-t border-slate-100 pt-4">
                <QuickStat label="Customer Satisfaction" value="4.8/5" subValue="+0.3 this month" />
              </div>
              <div className="border-t border-slate-100 pt-4">
                <QuickStat label="Active Sessions" value="1,234" subValue="+234 today" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-[#9b111e] to-[#7b0d18] rounded-lg p-6 text-white">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/admin/listings/new"
                className="block w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-center"
              >
                Create Listing
              </Link>
              <Link
                href="/admin/users"
                className="block w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-center"
              >
                Manage Users
              </Link>
              <Link
                href="/admin/settings"
                className="block w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-center"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 min-w-0">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-medium text-slate-600">Growth Rate</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">+18.5%</p>
            <p className="text-xs text-emerald-600 mt-1">vs. last month</p>
          </div>
          <div className="text-center sm:border-l border-slate-100 sm:pl-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-medium text-slate-600">New Users</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">+342</p>
            <p className="text-xs text-blue-600 mt-1">this week</p>
          </div>
          <div className="text-center md:border-l border-slate-100 md:pl-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Car className="w-4 h-4 text-purple-600" />
              <p className="text-sm font-medium text-slate-600">Listings Added</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">+128</p>
            <p className="text-xs text-purple-600 mt-1">this week</p>
          </div>
          <div className="text-center md:border-l border-slate-100 md:pl-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-medium text-slate-600">Success Rate</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">94.2%</p>
            <p className="text-xs text-emerald-600 mt-1">+2.1% increase</p>
          </div>
        </div>
      </div>
    </div>
  );
}
