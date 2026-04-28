"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell, MessageSquare, Plus, ChevronDown,
  LogOut, User, LayoutGrid, Heart, Settings, Menu, LayoutDashboard, Search,
  X, Sparkles
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationsStore } from "@/store/notifications.store";
import { useChatStore } from "@/store/chat.store";
import { getInitials } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/main", label: "Home", exact: true },
  { href: "/main/listings?condition=new", label: "New Cars" },
  { href: "/main/listings?condition=used", label: "Used Cars" },
  { href: "/main/listings?type=bike", label: "Bikes" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const unreadNotifs = useNotificationsStore((s) => s.unreadCount);
  const conversations = useChatStore((s) => s.conversations);
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unread_count, 0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Dummy notification count for demo
  const totalNotifs = 5;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href.split("?")[0]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/main/listings?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 w-full"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Top announcement bar */}
        <div className="bg-gradient-to-r from-[#9b111e] to-[#7b0d18] text-white py-1.5 px-4 text-center text-xs font-medium hidden sm:block">
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Free listing for first-time sellers!</span>
            <Link href="/main/listings/new" className="underline font-bold hover:text-white/80">
              Post Now →
            </Link>
          </motion.div>
        </div>

        {/* Main navbar */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="h-16 flex items-center justify-between gap-4">

              {/* Left: Logo */}
              <div className="flex items-center gap-8">
                <Link href="/main" className="flex items-center shrink-0 group -ml-2" aria-label="CarsAndBikes home">
                  <motion.img
                    src="/logo1.png"
                    alt="CarsAndBikes"
                    className="h-14 w-auto"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
                  {NAV_LINKS.map(({ href, label, exact }) => (
                    <Link
                      key={href}
                      href={href}
                      className="relative px-4 py-2 text-sm font-medium transition-colors"
                    >
                      <span className={isActive(href, exact) ? "text-[#9b111e]" : "text-[#56586a] hover:text-[#272a41]"}>
                        {label}
                      </span>
                      {isActive(href, exact) && (
                        <motion.div
                          className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#9b111e] rounded-full"
                          layoutId="navbar-indicator"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Center: Search bar (desktop) */}
              <div className="hidden md:flex flex-1 max-w-md mx-4">
                <form onSubmit={handleSearch} className="w-full">
                  <motion.div
                    className="w-full relative"
                    initial={false}
                    animate={{ width: searchOpen ? "100%" : "100%" }}
                  >
                    <div className="flex items-center bg-gray-100 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-full px-4 py-2.5 transition-all focus-within:bg-white focus-within:border-[#9b111e] focus-within:ring-2 focus-within:ring-[#9b111e]/10">
                      <Search className="w-4 h-4 text-gray-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search cars, bikes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 ml-2 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                      />
                      {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery("")} className="p-1 hover:bg-gray-200 rounded-full">
                          <X className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                </form>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Mobile search button */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="md:hidden p-2.5 text-[#56586a] hover:text-[#9b111e] hover:bg-gray-50 rounded-full transition-all"
                >
                  <Search className="h-5 w-5" />
                </button>

                {user ? (
                  <>
                    {/* Desktop: Sell CTA */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/main/listings/new"
                        className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#9b111e] to-[#7b0d18] text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-shadow"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="hidden lg:inline">Sell Now</span>
                      </Link>
                    </motion.div>

                    {/* Messages */}
                    <Link
                      href="/main/chat"
                      className="relative p-2.5 text-[#56586a] hover:text-[#9b111e] hover:bg-gray-50 rounded-full transition-all"
                    >
                      <MessageSquare className="h-5 w-5" />
                      {unreadMessages > 0 && (
                        <motion.span
                          className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-[#9b111e] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          {unreadMessages > 9 ? "9+" : unreadMessages}
                        </motion.span>
                      )}
                    </Link>

                    {/* Notifications with dropdown */}
                    <div className="relative" ref={notifRef}>
                      <button
                        onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                        className="relative p-2.5 text-[#56586a] hover:text-[#9b111e] hover:bg-gray-50 rounded-full transition-all"
                      >
                        <Bell className="h-5 w-5" />
                        {totalNotifs > 0 && (
                          <motion.span
                            className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-[#9b111e] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            {totalNotifs > 9 ? "9+" : totalNotifs}
                          </motion.span>
                        )}
                      </button>

                      {/* Notifications Dropdown */}
                      <AnimatePresence>
                        {notifDropdownOpen && (
                          <>
                            {/* Backdrop */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setNotifDropdownOpen(false)}
                              className="fixed inset-0 bg-black/20 z-40"
                            />
                            {/* Sidebar Panel - Full height, minimum width */}
                            <motion.div
                              initial={{ opacity: 0, x: 100 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 100 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              style={{ height: '100vh' }}
                              className="fixed right-0 top-0 w-80 bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col"
                            >
                              {/* Header */}
                              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#9b111e] to-[#7b0d18]">
                                <h3 className="font-bold text-white text-lg">Notifications</h3>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-white/80 font-medium cursor-pointer hover:text-white">Mark all read</span>
                                  <button
                                    onClick={() => setNotifDropdownOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                                  >
                                    <X className="w-5 h-5 text-white" />
                                  </button>
                                </div>
                              </div>
                              {/* Notifications List */}
                              <div className="flex-1 overflow-y-auto min-h-0">
                                {[
                                  { title: "New message from Rahul", desc: "About your BMW 3 Series listing", time: "2 min ago", unread: true, icon: "💬" },
                                  { title: "Price drop alert!", desc: "Honda Civic you saved dropped 10%", time: "1 hr ago", unread: true, icon: "📉" },
                                  { title: "Your listing is live", desc: "Toyota Camry XLE is now visible to buyers", time: "3 hrs ago", unread: true, icon: "✅" },
                                  { title: "New review received", desc: "A buyer left a 5-star review on your profile", time: "5 hrs ago", unread: false, icon: "⭐" },
                                  { title: "Promotion ending soon", desc: "Your featured listing expires tomorrow", time: "8 hrs ago", unread: false, icon: "⏰" },
                                  { title: "New inquiry received", desc: "Someone is interested in your Honda City", time: "1 day ago", unread: false, icon: "❓" },
                                  { title: "Listing view milestone", desc: "Your BMW listing reached 100 views!", time: "1 day ago", unread: false, icon: "👁️" },
                                  { title: "Weekly performance summary", desc: "Check your stats: 250 views, 12 inquiries", time: "2 days ago", unread: false, icon: "📊" },
                                  { title: "New message from Priya", desc: "Is the car still available?", time: "2 days ago", unread: false, icon: "💬" },
                                  { title: "Price suggestion", desc: "Based on market trends, consider updating price", time: "3 days ago", unread: false, icon: "💡" },
                                  { title: "Document verification", desc: "Your RC document has been verified", time: "3 days ago", unread: false, icon: "📄" },
                                  { title: "New follower", desc: "AutoDealer Pro started following you", time: "4 days ago", unread: false, icon: "👤" },
                                  { title: "Listing renewed", desc: "Your Maruti Swift listing was auto-renewed", time: "5 days ago", unread: false, icon: "🔄" },
                                  { title: "Safety tip", desc: "Always meet buyers in public places", time: "1 week ago", unread: false, icon: "🛡️" },
                                  { title: "Welcome to CarsAndBikes!", desc: "Complete your profile to get more leads", time: "2 weeks ago", unread: false, icon: "🎉" },
                                ].map((notif, i) => (
                                  <motion.div
                                    key={i}
                                    className={`px-5 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${notif.unread ? "bg-red-50/60" : ""}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                  >
                                    <div className="flex gap-3">
                                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg shrink-0">
                                        {notif.icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <p className={`text-sm ${notif.unread ? "font-semibold text-[#272a41]" : "font-medium text-gray-600"}`}>
                                            {notif.title}
                                          </p>
                                          {notif.unread && (
                                            <span className="w-2 h-2 rounded-full bg-[#9b111e] shrink-0" />
                                          )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.desc}</p>
                                        <p className="text-[11px] text-gray-400 mt-1.5">{notif.time}</p>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                              {/* Footer */}
                              <div className="border-t border-gray-100 p-4">
                                <Link
                                  href="/main/notifications"
                                  className="block w-full py-3 text-center text-sm font-semibold text-white bg-[#9b111e] hover:bg-[#7b0d18] rounded-lg transition-colors"
                                  onClick={() => setNotifDropdownOpen(false)}
                                >
                                  View All Notifications
                                </Link>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Avatar dropdown */}
                    <div className="relative ml-1" ref={menuRef}>
                      <motion.button
                        onClick={() => setUserMenuOpen((o) => !o)}
                        className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-full transition-all"
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="w-9 h-9 bg-gradient-to-br from-[#9b111e] to-[#7b0d18] rounded-full flex items-center justify-center text-white text-sm font-bold ring-2 ring-white shadow-md">
                          {getInitials(user.full_name)}
                        </div>
                        <ChevronDown className={`h-4 w-4 text-[#56586a] transition-transform duration-200 hidden sm:block ${userMenuOpen ? "rotate-180" : ""}`} />
                      </motion.button>

                      <AnimatePresence>
                        {userMenuOpen && (
                          <motion.div
                            role="menu"
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50"
                          >
                            {/* User info */}
                            <div className="px-5 py-4 bg-gradient-to-br from-[#9b111e] to-[#7b0d18]">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-lg font-bold shadow-inner">
                                  {getInitials(user.full_name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-white truncate">{user.full_name}</p>
                                  <p className="text-xs text-white/70 truncate">{user.email}</p>
                                </div>
                              </div>
                            </div>

                            {/* Quick stats */}
                            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-around text-center">
                              <div>
                                <p className="text-lg font-bold text-[#272a41]">12</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Listings</p>
                              </div>
                              <div className="w-px h-8 bg-gray-200" />
                              <div>
                                <p className="text-lg font-bold text-[#272a41]">48</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Views</p>
                              </div>
                              <div className="w-px h-8 bg-gray-200" />
                              <div>
                                <p className="text-lg font-bold text-[#272a41]">8</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Leads</p>
                              </div>
                            </div>

                            <div role="group" className="py-2">
                              {[
                                { href: "/main/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                                { href: "/main/profile", icon: User, label: "My Profile" },
                                { href: "/main/wishlist", icon: Heart, label: "Wishlist" },
                                { href: "/main/listings", icon: LayoutGrid, label: "My Listings" },
                                ...(user.role === "admin"
                                  ? [{ href: "/admin", icon: Settings, label: "Admin Portal" }]
                                  : []),
                              ].map(({ href, icon: Icon, label }, i) => (
                                <motion.div
                                  key={href}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                >
                                  <Link
                                    href={href}
                                    role="menuitem"
                                    className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-[#272a41] hover:bg-gray-50 hover:text-[#9b111e] transition-all"
                                    onClick={() => setUserMenuOpen(false)}
                                  >
                                    <Icon className="h-4 w-4 text-gray-400" />
                                    {label}
                                  </Link>
                                </motion.div>
                              ))}
                            </div>

                            <div className="border-t border-gray-100 p-2">
                              <button
                                role="menuitem"
                                onClick={() => { clearAuth(); setUserMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-[#9b111e] hover:bg-red-50 rounded-xl transition-all"
                              >
                                <LogOut className="h-4 w-4" />
                                Sign out
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Mobile menu button */}
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="lg:hidden p-2.5 text-[#56586a] hover:text-[#9b111e] hover:bg-gray-50 rounded-full transition-all ml-1"
                    >
                      {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Link
                      href="/auth/login"
                      className="hidden sm:block px-4 py-2 text-sm font-semibold text-[#272a41] hover:text-[#9b111e] transition-colors"
                    >
                      Sign in
                    </Link>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/auth/register"
                        className="bg-gradient-to-r from-[#9b111e] to-[#7b0d18] text-white text-sm font-bold px-5 sm:px-6 py-2.5 rounded-full shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-shadow"
                      >
                        Get started
                      </Link>
                    </motion.div>

                    {/* Mobile menu button */}
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="lg:hidden p-2.5 text-[#56586a] hover:text-[#9b111e] hover:bg-gray-50 rounded-full transition-all"
                    >
                      {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile search overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-100 px-4 py-3"
            >
              <form onSubmit={handleSearch}>
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2.5">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cars, bikes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 ml-2 bg-transparent text-sm focus:outline-none"
                    autoFocus
                  />
                  <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
            >
              <nav className="px-4 py-4 space-y-1">
                {NAV_LINKS.map(({ href, label, exact }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive(href, exact)
                          ? "bg-red-50 text-[#9b111e]"
                          : "text-[#272a41] hover:bg-gray-50"
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}

                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="pt-4 border-t border-gray-100 mt-4"
                  >
                    <Link
                      href="/main/listings/new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#9b111e] to-[#7b0d18] text-white text-sm font-bold px-6 py-3 rounded-xl"
                    >
                      <Plus className="h-4 w-4" />
                      Sell Your Vehicle
                    </Link>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
