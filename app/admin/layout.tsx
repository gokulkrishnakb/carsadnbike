"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
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
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/clients", label: "Clients", icon: UserX, badge: "3" },
  { href: "/admin/listings", label: "Listings", icon: Car },
  { href: "/admin/ads", label: "Advertisements", icon: Megaphone },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isPending, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Allow access to login page without authentication
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return; // Skip auth check for login page
    if (!isPending && (!user || user.role !== "admin")) {
      router.replace("/admin/login");
    }
  }, [user, isPending, router, isLoginPage]);

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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="h-16 border-b border-slate-200 flex items-center px-5 gap-3">
          <div className="w-7 h-7 bg-[#9b111e] rounded flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-sm">Admin Portal</span>
        </div>

        {/* User Info */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#9b111e]/10 rounded-full flex items-center justify-center">
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
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
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

        <div className="p-3 border-t border-slate-100 space-y-0.5">
          <Link
            href="/main"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to app
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
