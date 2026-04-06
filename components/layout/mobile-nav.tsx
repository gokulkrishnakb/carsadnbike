"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, LayoutGrid, Plus, Heart, User } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

const NAV = [
  { href: "/main",           icon: Search,     label: "Search",  exact: true },
  { href: "/main/listings",  icon: LayoutGrid, label: "Browse" },
  { href: "/main/listings/new", icon: Plus,    label: "Sell",    highlight: true },
  { href: "/main/wishlist",  icon: Heart,      label: "Saved" },
  { href: "/main/profile",   icon: User,       label: "Profile" },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 sm:hidden z-50"
      aria-label="Mobile navigation"
    >
      <ul className="flex h-16">
        {NAV.map(({ href, icon: Icon, label, exact, highlight }) => {
          // Redirect unauthenticated users for protected routes
          const isProtected = href === "/main/wishlist" || href === "/main/listings/new" || href === "/main/profile";
          const dest = isProtected && !user ? `/auth/login` : href;
          const active = exact ? pathname === href : pathname.startsWith(href);

          return (
            <li key={href} className="flex-1">
              <Link
                href={dest}
                className={`flex flex-col items-center justify-center h-full gap-1 text-[10px] font-semibold tracking-wide transition-colors ${
                  highlight
                    ? "text-white bg-blue-600 hover:bg-blue-700"
                    : active
                    ? "text-blue-600"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                aria-current={active ? "page" : undefined}
                aria-label={label}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
