export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 py-6">
        <div className="max-w-lg mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>© 2025 CarsAndBikes</span>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-slate-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
