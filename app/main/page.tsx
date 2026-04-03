import Link from "next/link";
import { ArrowRight, Shield, Zap, MessageSquare, Car, Bike, Truck, Package, TrendingUp, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/features/search/search-bar";

const stats = [
  { label: "Vehicles listed", value: "24K+", icon: Car },
  { label: "Active buyers", value: "180K", icon: TrendingUp },
  { label: "Deals closed", value: "9.2K", icon: CheckCircle },
  { label: "Verified dealers", value: "340", icon: Star },
];

const categories = [
  { icon: Car, label: "Cars", href: "/main/listings?type=car", color: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300" },
  { icon: Bike, label: "Bikes", href: "/main/listings?type=bike", color: "bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-100 hover:border-violet-300" },
  { icon: Truck, label: "Trucks", href: "/main/listings?type=truck", color: "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 hover:border-orange-300" },
  { icon: Package, label: "Vans", href: "/main/listings?type=van", color: "bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:border-green-300" },
];

const features = [
  {
    icon: Zap,
    title: "List in 60 seconds",
    body: "Photos, specs, and price — publish your vehicle and reach thousands of buyers instantly.",
    color: "bg-yellow-50 border-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    icon: MessageSquare,
    title: "Real-time negotiation",
    body: "Chat directly with buyers and sellers. Encrypted messages, instant delivery, zero middleman.",
    color: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Shield,
    title: "AI fraud protection",
    body: "Every listing is validated by our AI engine. Trust scores and identity checks on all accounts.",
    color: "bg-green-50 border-green-100",
    iconColor: "text-green-600",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-24 pb-20">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative -mx-6 px-6 pt-16 sm:pt-24 pb-14 sm:pb-20 overflow-hidden hero-bg">
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-violet-500/5 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-widest uppercase mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Premium Vehicle Marketplace
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-[-0.04em] leading-[0.92] mb-6">
            Find your<br />
            <span className="text-gradient">perfect vehicle.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
            Thousands of verified listings from trusted sellers. Real-time chat, instant offers, zero hassle.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8 px-0 sm:px-4">
            <SearchBar
              placeholder="Search by make, model, or keyword…"
              className="shadow-lg shadow-blue-500/10"
            />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link href="/main/listings">
              <Button size="lg" className="gap-2 px-7 rounded-full">
                Browse vehicles <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/main/listings/new">
              <Button size="lg" variant="secondary" className="px-7 rounded-full">
                Sell your vehicle
              </Button>
            </Link>
          </div>

          {/* Category shortcuts */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            {categories.map(({ icon: Icon, label, href, color }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all shadow-sm ${color}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-3">
                <s.icon className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section>
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-blue-600 tracking-widest uppercase mb-3">Why CarsAndBikes</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            Built for serious buyers<br />& sellers
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-[15px] leading-relaxed">
            Everything you need to find, evaluate, and close on your next vehicle — all in one place.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl border p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${f.color}`}
            >
              <div className="w-11 h-11 rounded-xl bg-white border border-white/80 flex items-center justify-center mb-5 shadow-sm">
                <f.icon className={`h-5 w-5 ${f.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left: content */}
          <div className="p-10 sm:p-14">
            <p className="text-xs font-semibold text-blue-600 tracking-widest uppercase mb-4">How it works</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">
              Simple, fast,<br />and secure.
            </h2>
            <div className="space-y-7">
              {[
                { step: "01", title: "Create your account", body: "Sign up free in seconds. No credit card required." },
                { step: "02", title: "Browse or list vehicles", body: "Find your dream car or list your vehicle in under a minute." },
                { step: "03", title: "Chat and close the deal", body: "Negotiate securely in real-time and complete your transaction." },
              ].map((s) => (
                <div key={s.step} className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-[0_2px_8px_rgba(37,99,235,0.35)]">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right: decorative */}
          <div className="gradient-brand relative overflow-hidden hidden md:flex items-center justify-center p-14">
            <div className="absolute inset-0 dot-grid opacity-30" />
            <div className="relative text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Car className="h-10 w-10 text-white" />
              </div>
              <p className="text-white font-black text-2xl tracking-tight mb-3">Ready to start?</p>
              <p className="text-blue-200 text-sm leading-relaxed mb-6">Join 180,000+ buyers and sellers on the #1 vehicle marketplace.</p>
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 rounded-full px-8 font-bold shadow-lg">
                  Get started free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl gradient-brand text-white p-12 sm:p-16 text-center shadow-xl">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative">
          <h2 className="text-4xl sm:text-5xl font-black tracking-[-0.03em] mb-4">
            Ready for your next vehicle?
          </h2>
          <p className="text-blue-200 mb-10 text-lg max-w-xl mx-auto leading-relaxed">
            Join 180,000+ buyers and sellers. Free to sign up, no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button
                size="xl"
                className="bg-white text-blue-700 hover:bg-blue-50 shadow-[0_4px_20px_rgba(0,0,0,0.20)] rounded-full px-10 font-bold"
              >
                Create free account
              </Button>
            </Link>
            <Link href="/main/listings">
              <Button
                size="xl"
                className="bg-white/10 text-white border border-white/25 hover:bg-white/20 rounded-full px-10"
              >
                Browse listings
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
