"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Users, Car, Megaphone, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/listings", label: "Listings", icon: Car },
  { href: "/admin/ads", label: "Advertisements", icon: Megaphone },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && (!user || user.role !== "admin")) {
      router.replace("/main");
    }
  }, [user, isPending, router]);

  if (isPending || !user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="h-16 border-b border-slate-200 flex items-center px-5 gap-3">
          <div className="w-7 h-7 bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-black">A</span>
          </div>
          <span className="font-bold text-slate-900 text-sm">Admin Portal</span>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <Link
            href="/main"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to app
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
