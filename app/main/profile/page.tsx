"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Mail, Lock, Shield, LogOut, Plus, CheckCircle2, XCircle,
  User, Phone, MapPin, Calendar, Edit3, Camera, Car, Eye,
  Bell, Smartphone, Key, ChevronRight, Settings, Heart
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { authClient } from "@/lib/auth-client";
import { listingsService } from "@/services/listings.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";

const pwSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[!@#$%^&*]/),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

type PwInput = z.infer<typeof pwSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [activeSection, setActiveSection] = useState<"profile" | "security" | "notifications">("profile");

  const { data: myListings, isLoading: listingsLoading } = useQuery({
    queryKey: ["my-listings"],
    queryFn: () => listingsService.list({ user_id: user?.id }),
    enabled: !!user,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PwInput>({
    resolver: zodResolver(pwSchema),
  });

  const onChangePassword = async (data: PwInput) => {
    const { error } = await authClient.changePassword({
      currentPassword: data.current_password,
      newPassword: data.new_password,
      revokeOtherSessions: false,
    });
    if (error) {
      toast.error("Failed to update password. Check your current password.");
      return;
    }
    toast.success("Password updated successfully");
    reset();
  };

  const handleSignOut = async () => {
    await clearAuth();
    router.push("/auth/login");
  };

  if (!user) return null;

  const stats = {
    listings: myListings?.items?.length || 0,
    views: myListings?.items?.reduce((acc, l) => acc + (l.views || 0), 0) || 0,
    saved: 12,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-bold text-gray-900">Account Settings</h1>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">
              <div className="h-24 bg-gradient-to-br from-[#9b111e] to-[#7b0d18] relative">
                <div className="absolute inset-0 opacity-30">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                  </svg>
                </div>
              </div>
              <div className="px-5 pb-5 -mt-10 relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-white flex items-center justify-center shadow-lg mb-4">
                  <span className="text-2xl font-black text-white">{getInitials(user.full_name)}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">{user.full_name}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-3">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </p>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  user.is_verified
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {user.is_verified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {user.is_verified ? "Verified Account" : "Unverified"}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.listings}</p>
                  <p className="text-xs text-gray-500">Listings</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.views}</p>
                  <p className="text-xs text-gray-500">Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.saved}</p>
                  <p className="text-xs text-gray-500">Saved</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "security", label: "Security", icon: Shield },
                { id: "notifications", label: "Notifications", icon: Bell },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeSection === item.id
                      ? "bg-gray-50 text-gray-900 border-l-2 border-[#9b111e]"
                      : "text-gray-600 hover:bg-gray-50 border-l-2 border-transparent"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                  <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeSection === item.id ? "rotate-90" : ""}`} />
                </button>
              ))}
            </nav>

            {/* Quick Links */}
            <div className="mt-4 space-y-2">
              <Link
                href="/main/dashboard"
                className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
              >
                <Car className="w-5 h-5" />
                <span className="text-sm font-medium">My Listings</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Link>
              <Link
                href="/main/wishlist"
                className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">Wishlist</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Personal Information */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Personal Information</h3>
                      <p className="text-sm text-gray-500">Update your personal details</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#9b111e] hover:bg-red-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Full Name</label>
                        <p className="text-gray-900 font-medium">{user.full_name}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
                        <p className="text-gray-900 font-medium">{user.email}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Phone Number</label>
                        <p className="text-gray-400">Not provided</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Location</label>
                        <p className="text-gray-400">Not provided</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Account Activity</h3>
                    <p className="text-sm text-gray-500">Your account statistics</p>
                  </div>
                  <div className="p-6">
                    <div className="grid sm:grid-cols-4 gap-4">
                      {[
                        { label: "Total Listings", value: stats.listings, icon: Car, color: "blue" },
                        { label: "Total Views", value: stats.views, icon: Eye, color: "emerald" },
                        { label: "Saved Items", value: stats.saved, icon: Heart, color: "pink" },
                        { label: "Member Since", value: "2024", icon: Calendar, color: "purple" },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-gray-50 rounded-xl p-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                            stat.color === "blue" ? "bg-blue-100" :
                            stat.color === "emerald" ? "bg-emerald-100" :
                            stat.color === "pink" ? "bg-pink-100" : "bg-purple-100"
                          }`}>
                            <stat.icon className={`w-5 h-5 ${
                              stat.color === "blue" ? "text-blue-600" :
                              stat.color === "emerald" ? "text-emerald-600" :
                              stat.color === "pink" ? "text-pink-600" : "text-purple-600"
                            }`} />
                          </div>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Change Password */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Change Password</h3>
                        <p className="text-sm text-gray-500">Update your account password</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                        <input
                          type="password"
                          placeholder="Enter current password"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] transition-colors"
                          {...register("current_password")}
                        />
                        {errors.current_password && (
                          <p className="mt-1 text-xs text-red-500">{errors.current_password.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] transition-colors"
                          {...register("new_password")}
                        />
                        <p className="mt-1 text-xs text-gray-400">Min 8 characters, 1 uppercase, 1 number, 1 special character</p>
                        {errors.new_password && (
                          <p className="mt-1 text-xs text-red-500">{errors.new_password.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9b111e]/20 focus:border-[#9b111e] transition-colors"
                          {...register("confirm_password")}
                        />
                        {errors.confirm_password && (
                          <p className="mt-1 text-xs text-red-500">{errors.confirm_password.message}</p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-[#9b111e] text-white font-semibold rounded-lg hover:bg-[#7b0d18] transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? "Updating..." : "Update Password"}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Security Overview */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Security Overview</h3>
                        <p className="text-sm text-gray-500">Manage your account security settings</p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {[
                      { label: "Email Verification", desc: "Your email address is verified", enabled: user.is_verified, icon: Mail },
                      { label: "Two-Factor Authentication", desc: "Add an extra layer of security", enabled: false, icon: Smartphone },
                      { label: "Login Alerts", desc: "Get notified of new sign-ins", enabled: true, icon: Bell },
                      { label: "Active Sessions", desc: "Manage your active sessions", enabled: true, icon: Key },
                    ].map((item) => (
                      <div key={item.label} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.enabled
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {item.enabled ? "Enabled" : "Disabled"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                    <h3 className="font-semibold text-red-700">Danger Zone</h3>
                    <p className="text-sm text-red-600">Irreversible actions</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Delete Account</p>
                        <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "notifications" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Email Notifications */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Manage your email preferences</p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {[
                      { label: "New Messages", desc: "Get notified when you receive a new message", enabled: true },
                      { label: "Listing Updates", desc: "Updates about your listings (views, inquiries)", enabled: true },
                      { label: "Price Alerts", desc: "Notifications when prices change on saved items", enabled: false },
                      { label: "Newsletter", desc: "Weekly updates and automotive news", enabled: true },
                      { label: "Promotional Emails", desc: "Special offers and deals", enabled: false },
                    ].map((item) => (
                      <div key={item.label} className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9b111e]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9b111e]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Bell className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Push Notifications</h3>
                        <p className="text-sm text-gray-500">Manage browser notifications</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Enable Push Notifications</p>
                        <p className="text-sm text-gray-500">Receive real-time updates in your browser</p>
                      </div>
                      <button className="px-4 py-2 bg-[#9b111e] text-white text-sm font-semibold rounded-lg hover:bg-[#7b0d18] transition-colors">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
