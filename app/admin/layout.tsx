"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Car,
  Megaphone,
  Settings,
  ArrowLeft,
  LogOut,
  Shield,
  UserX,
  HeartPulse,
  ChevronUp,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/clients", label: "Risk Monitor", icon: UserX, badge: "3" },
  { href: "/admin/listings", label: "Listings", icon: Car },
  { href: "/admin/ads", label: "Advertisements", icon: Megaphone },
  { href: "/admin/health", label: "Health & Support", icon: HeartPulse },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isPending, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [showLogout, setShowLogout] = useState(false);

  // Allow access to login page without authentication
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return; // Skip auth check for login page
    if (!isPending && (!user || user.role !== "admin")) {
      router.replace("/admin/login");
    }
  }, [user, isPending, router, isLoginPage]);

  // Close logout popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showLogout && !target.closest('.user-card-container')) {
        setShowLogout(false);
      }
    };

    if (showLogout) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showLogout]);

  // Render login page without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show nothing while checking auth
  if (isPending || !user || user.role !== "admin") return null;

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar - Fixed */}
      <aside className="fixed top-0 left-0 w-56 h-screen bg-white border-r border-slate-200 flex flex-col z-10">
        <div className="h-16 border-b border-slate-200 flex items-center px-5 gap-3">
          <div className="w-7 h-7 bg-[#9b111e] rounded flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-sm">Admin Portal</span>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon, exact, badge }) => {
            const active = exact ? pathname === href : pathname.startsWith(href) && href !== "/admin";
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded ${
                  active
                    ? "bg-[#9b111e]/10 text-[#9b111e]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info at Bottom */}
        <div className="relative border-t border-slate-200 user-card-container">
          {/* Logout Popup */}
          {showLogout && (
            <div className="absolute bottom-full left-0 right-0 mb-1 mx-3">
              <div className="bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                <Link
                  href="/main"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  onClick={() => setShowLogout(false)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to app
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* User Card - Clickable */}
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="w-full px-5 py-4 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#9b111e]/10 rounded-full flex items-center justify-center shrink-0">
                <span className="text-[#9b111e] font-bold text-sm">
                  {user.full_name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user.full_name}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
              <ChevronUp
                className={`h-4 w-4 text-slate-400 transition-transform ${
                  showLogout ? "" : "rotate-180"
                }`}
              />
            </div>
          </button>
        </div>
      </aside>

      {/* Main - With left margin for fixed sidebar */}
      <main className="ml-56">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
