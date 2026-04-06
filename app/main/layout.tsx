import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 pb-24 sm:pb-8 page-enter">
        {children}
      </main>

      {/* Desktop footer */}
      <footer className="hidden sm:block border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-[11px]">CB</span>
            </div>
            <span className="font-semibold text-slate-700 text-sm">CarsAndBikes</span>
          </div>
          <p className="text-xs text-slate-400">© 2025 CarsAndBikes. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Help</a>
          </div>
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
