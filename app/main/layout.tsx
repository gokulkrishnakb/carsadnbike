import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import Link from "next/link";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-white w-full" style={{ width: '100%', minWidth: '100%' }}>
      <Header />
      <main className="flex-1 w-full pb-24 sm:pb-0" style={{ width: '100%' }}>
        {children}
      </main>

      {/* Desktop footer */}
      <footer className="hidden sm:block bg-[#1a1d2e] border-t border-gray-800 mt-auto">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-[#9b111e] to-[#7b0d18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
                <p className="text-white/80 text-sm">Get the latest deals and automotive news delivered to your inbox.</p>
              </div>
              <div className="flex w-full md:w-auto gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 md:w-72 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20 transition-all"
                />
                <button className="px-6 py-3 bg-white text-[#9b111e] font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {/* Brand - Takes 2 columns */}
            <div className="col-span-2">
              <Link href="/main" className="inline-block mb-5">
                <span className="text-2xl font-extrabold tracking-tight">
                  <span className="text-white">Cars</span>
                  <span className="text-[#9b111e]">&</span>
                  <span className="text-white">Bikes</span>
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
                India's most trusted marketplace for buying and selling vehicles. Find your perfect ride from thousands of verified listings.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-[#9b111e] hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-[#9b111e] hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-[#9b111e] hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-[#9b111e] hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { href: "/main/listings", label: "Browse Vehicles" },
                  { href: "/main/listings/new", label: "Sell Your Vehicle" },
                  { href: "/main/dashboard", label: "Dashboard" },
                  { href: "/main/chat", label: "Messages" },
                  { href: "/main/wishlist", label: "Wishlist" },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 text-sm hover:text-[#9b111e] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vehicle Types */}
            <div>
              <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Explore</h4>
              <ul className="space-y-3">
                {[
                  { href: "/main/listings?condition=new", label: "New Cars" },
                  { href: "/main/listings?condition=used", label: "Used Cars" },
                  { href: "/main/listings?type=bike", label: "Bikes" },
                  { href: "/main/listings?fuel=electric", label: "Electric Vehicles" },
                  { href: "/main/listings?body=suv", label: "SUVs" },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 text-sm hover:text-[#9b111e] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Brands */}
            <div>
              <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Popular Brands</h4>
              <ul className="space-y-3">
                {[
                  { href: "/main/listings?make=Toyota", label: "Toyota" },
                  { href: "/main/listings?make=Honda", label: "Honda" },
                  { href: "/main/listings?make=Maruti Suzuki", label: "Maruti Suzuki" },
                  { href: "/main/listings?make=Hyundai", label: "Hyundai" },
                  { href: "/main/listings?make=Tata", label: "Tata Motors" },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 text-sm hover:text-[#9b111e] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-3">
                {[
                  { href: "#", label: "Help Center" },
                  { href: "#", label: "Contact Us" },
                  { href: "#", label: "FAQs" },
                  { href: "#", label: "Safety Tips" },
                  { href: "#", label: "Report Fraud" },
                ].map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-gray-400 text-sm hover:text-[#9b111e] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* App Download & Contact */}
          <div className="mt-12 pt-10 border-t border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Contact Info */}
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#9b111e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Call Us</p>
                    <p className="text-sm font-semibold text-white">1800-123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#9b111e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-semibold text-white">support@carsandbikes.com</p>
                  </div>
                </div>
              </div>

              {/* App Download */}
              <div className="flex items-center gap-3">
                <a href="#" className="flex items-center gap-2 px-4 py-2.5 bg-[#272a41] text-white rounded-lg hover:bg-[#1a1d2e] transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] opacity-80">Download on the</p>
                    <p className="text-sm font-semibold -mt-0.5">App Store</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2.5 bg-[#272a41] text-white rounded-lg hover:bg-[#1a1d2e] transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] opacity-80">Get it on</p>
                    <p className="text-sm font-semibold -mt-0.5">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 bg-[#12141f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">© 2025 Cars&Bikes. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="#" className="hover:text-[#9b111e] transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-[#9b111e] transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-[#9b111e] transition-colors">Cookie Policy</Link>
              <Link href="#" className="hover:text-[#9b111e] transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
