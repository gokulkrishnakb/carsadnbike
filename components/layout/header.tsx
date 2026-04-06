"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell, MessageSquare, Plus, Search, ChevronDown,
  LogOut, User, LayoutGrid, Heart, Settings
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationsStore } from "@/store/notifications.store";
import { useChatStore } from "@/store/chat.store";
import { getInitials } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/main/listings", label: "Browse" },
  { href: "/main/listings/new", label: "Sell a vehicle" },
];

export function Header() {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const unreadNotifs = useNotificationsStore((s) => s.unreadCount);
  const conversations = useChatStore((s) => s.conversations);
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unread_count, 0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/main" className="flex items-center gap-2 shrink-0" aria-label="CarsAndBikes home">
          <div className="w-7 h-7 bg-blue-600 flex items-center justify-center">
            <span className="text-white font-black text-xs">CB</span>
          </div>
          <span className="font-bold text-slate-900 text-sm hidden sm:block tracking-tight">
            CarsAndBikes
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {user ? (
            <>
              {/* Desktop: Sell CTA */}
              <Link
                href="/main/listings/new"
                className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors mr-1 min-h-[36px]"
                aria-label="List a vehicle for sale"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden md:inline">List Vehicle</span>
              </Link>

              {/* Messages */}
              <Link
                href="/main/chat"
                className="relative p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={`Messages${unreadMessages > 0 ? `, ${unreadMessages} unread` : ""}`}
              >
                <MessageSquare className="h-5 w-5" aria-hidden="true" />
                {unreadMessages > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center leading-none" aria-hidden="true">
                    {unreadMessages > 9 ? "9+" : unreadMessages}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <Link
                href="/main/notifications"
                className="relative p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={`Notifications${unreadNotifs > 0 ? `, ${unreadNotifs} unread` : ""}`}
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center leading-none badge-pulse" aria-hidden="true">
                    {unreadNotifs > 9 ? "9+" : unreadNotifs}
                  </span>
                )}
              </Link>

              {/* Avatar dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-1.5 h-9 px-2 hover:bg-slate-100 transition-colors min-w-[44px] justify-center"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  aria-label={`Account menu for ${user.full_name}`}
                >
                  <div className="w-7 h-7 bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {getInitials(user.full_name)}
                  </div>
                  <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 hidden sm:block ${userMenuOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      role="menu"
                      aria-label="Account options"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden z-50"
                    >
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.full_name}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                      </div>

                      <div role="group" className="py-1">
                        {[
                          { href: "/main/profile", icon: User, label: "My Profile" },
                          { href: "/main/wishlist", icon: Heart, label: "Wishlist" },
                          { href: "/main/listings", icon: LayoutGrid, label: "Browse Listings" },
                          ...(user.role === "admin"
                            ? [{ href: "/admin", icon: Settings, label: "Admin Portal" }]
                            : []),
                        ].map(({ href, icon: Icon, label }) => (
                          <Link
                            key={href}
                            href={href}
                            role="menuitem"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors min-h-[44px] rounded-xl"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Icon className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
                            {label}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 py-1">
                        <button
                          role="menuitem"
                          onClick={() => { clearAuth(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors min-h-[44px]"
                        >
                          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="hidden sm:block px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors min-h-[40px] flex items-center"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
