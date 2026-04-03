"use client";

import Link from "next/link";
import { Bell, MessageSquare, Plus, Search, Menu, X, ChevronDown, LogOut, User, LayoutGrid } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationsStore } from "@/store/notifications.store";
import { useChatStore } from "@/store/chat.store";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

export function Header() {
  const { user, clearAuth } = useAuthStore();
  const unreadNotifs = useNotificationsStore((s) => s.unreadCount);
  const conversations = useChatStore((s) => s.conversations);
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unread_count, 0);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/main" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-[0_1px_3px_rgba(37,99,235,0.4)]">
            <span className="text-white font-black text-[13px] tracking-tight">CB</span>
          </div>
          <span className="font-bold text-slate-900 text-[15px] tracking-tight hidden sm:block">
            CarsAndBikes
          </span>
        </Link>

        {/* Search — desktop */}
        <Link
          href="/main/listings"
          className="hidden md:flex flex-1 max-w-xs items-center gap-2.5 h-10 px-3.5 rounded-full bg-slate-50 border border-slate-200 text-slate-400 text-sm hover:border-blue-300 hover:bg-blue-50/40 hover:text-blue-500 transition-all group shadow-sm"
        >
          <Search className="h-3.5 w-3.5 shrink-0 group-hover:text-blue-500 transition-colors" />
          <span className="group-hover:text-blue-500 transition-colors text-[13px]">Search vehicles…</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Link href="/main/listings/new" className="hidden sm:block mr-1">
                <Button variant="primary" size="sm" className="gap-1.5 rounded-full px-4">
                  <Plus className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">List</span> Vehicle
                </Button>
              </Link>

              {/* Chat */}
              <Link
                href="/main/chat"
                className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Messages"
              >
                <MessageSquare className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                    {unreadMessages > 9 ? "9+" : unreadMessages}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <Link
                href="/main/notifications"
                className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center leading-none badge-pulse">
                    {unreadNotifs > 9 ? "9+" : unreadNotifs}
                  </span>
                )}
              </Link>

              {/* Avatar dropdown */}
              <div className="relative ml-0.5" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-1.5 pl-1 pr-2 h-9 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {getInitials(user.full_name)}
                  </div>
                  <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.14, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.full_name}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          href="/main/profile"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                            <User className="h-3.5 w-3.5 text-slate-500" />
                          </div>
                          My Profile
                        </Link>
                        <Link
                          href="/main/listings"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                            <LayoutGrid className="h-3.5 w-3.5 text-slate-500" />
                          </div>
                          Browse Listings
                        </Link>
                        <div className="h-px bg-slate-100 my-1" />
                        <button
                          onClick={() => { clearAuth(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                            <LogOut className="h-3.5 w-3.5 text-red-500" />
                          </div>
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign in</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" size="sm" className="rounded-full px-5">Get started</Button>
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors ml-1"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white"
          >
            <nav className="p-3 flex flex-col gap-1">
              <Link
                href="/main/listings"
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                <Search className="h-4 w-4 text-slate-400" />
                Browse Vehicles
              </Link>
              {user && (
                <>
                  <Link
                    href="/main/chat"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    <MessageSquare className="h-4 w-4 text-slate-400" />
                    Messages
                    {unreadMessages > 0 && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{unreadMessages}</span>
                    )}
                  </Link>
                  <Link
                    href="/main/listings/new"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium mt-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Plus className="h-4 w-4" />
                    List a Vehicle
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
