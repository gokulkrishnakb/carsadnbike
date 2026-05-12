"use client";

import { useState } from "react";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MapPin, Calendar, Gauge, Eye, ChevronLeft, ChevronRight,
  Star, Sparkles, Zap, Crown, Edit, TrendingUp, Users, MessageSquare,
  ExternalLink, CheckCircle, CreditCard, Smartphone, Building2, Wallet,
  Trophy, Target, Megaphone, BarChart3, Clock, Shield, Gift
} from "lucide-react";
import { listingsService } from "@/services/listings.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatMileage, formatDate, imageUrl } from "@/lib/utils";
import { toast } from "sonner";

const CONDITION_BADGE = { new: "success", used: "secondary", certified: "warning" } as const;

export default function MyListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const [imgIndex, setImgIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");
  const [selectedPayment, setSelectedPayment] = useState<string>("card");
  const [showPayment, setShowPayment] = useState(false);

  const isDummy = id.startsWith("dummy-");

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => {
      if (isDummy) {
        return {
          id,
          title: "2023 BMW 3 Series M Sport",
          make: "BMW",
          model: "3 Series",
          year: 2023,
          price: 4500000,
          mileage: 12000,
          status: "active",
          condition: "used",
          vehicle_type: "car",
          location: "Mumbai, Maharashtra",
          fuel_type: "petrol",
          transmission: "automatic",
          views: 245,
          images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"],
          description: "Luxury sedan in pristine condition with full service history and premium features.",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: user?.id || "",
          is_featured: false,
        };
      }
      return listingsService.get(id);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-pulse">
          <div className="h-8 w-32 bg-slate-200 rounded" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-[400px] bg-slate-200 rounded-lg" />
              <div className="h-64 bg-slate-200 rounded-lg" />
            </div>
            <div className="space-y-6">
              <div className="h-80 bg-slate-200 rounded-lg" />
              <div className="h-96 bg-slate-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6 text-5xl">🚗</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Listing not found</h2>
          <p className="text-slate-500 mb-8">This listing may have been removed or doesn't exist.</p>
          <Link href="/main/dashboard">
            <Button size="lg" className="rounded-lg">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = listing.images && listing.images.length > 0 ? listing.images : ["/placeholder-car.jpg"];

  const plans = [
    {
      id: "basic",
      name: "Starter",
      duration: "7 Days",
      price: 299,
      originalPrice: 499,
      icon: Zap,
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      features: [
        "Top of category listing",
        "2x more visibility",
        "Basic analytics",
        "7 days duration"
      ]
    },
    {
      id: "premium",
      name: "Professional",
      duration: "14 Days",
      price: 499,
      originalPrice: 899,
      icon: Star,
      color: "amber",
      gradient: "from-amber-500 to-orange-500",
      popular: true,
      badge: "MOST POPULAR",
      features: [
        "Homepage featured slot",
        "5x more visibility",
        "Advanced analytics",
        "Priority support",
        "14 days duration",
        "Social media promotion"
      ]
    },
    {
      id: "pro",
      name: "Enterprise",
      duration: "30 Days",
      price: 799,
      originalPrice: 1499,
      icon: Crown,
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      badge: "BEST VALUE",
      features: [
        "Premium homepage placement",
        "10x more visibility",
        "Premium analytics dashboard",
        "Dedicated account manager",
        "30 days duration",
        "Full social media campaign",
        "SEO optimization",
        "Email marketing inclusion"
      ]
    }
  ];

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCard, desc: "Instant activation" },
    { id: "upi", name: "UPI", icon: Smartphone, desc: "Pay via any UPI app" },
    { id: "netbanking", name: "Net Banking", icon: Building2, desc: "Direct bank transfer" },
    { id: "wallet", name: "Wallet", icon: Wallet, desc: "Paytm, PhonePe, etc." },
  ];

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  const handlePayment = () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }
    toast.success("Redirecting to secure payment gateway...");
    // TODO: Integrate actual payment gateway
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/main/dashboard")}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              Dashboard
            </button>

            <div className="flex items-center gap-3">
              <Link href={`/main/listings/${id}/edit`}>
                <Button size="sm" variant="outline" className="rounded-lg gap-2 hidden sm:flex">
                  <Edit className="w-4 h-4" /> Edit Details
                </Button>
              </Link>
              <Link href={`/main/listings/${id}`} target="_blank">
                <Button size="sm" variant="ghost" className="rounded-lg gap-2 hidden sm:flex">
                  <ExternalLink className="w-4 h-4" /> Preview
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Listing Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg border border-slate-200/50"
            >
              <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-50">
                <motion.img
                  key={imgIndex}
                  src={imageUrl(images[imgIndex])}
                  alt={listing.title}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-car.jpg"; }}
                />

                {listing.is_featured && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg">
                      <Star className="w-4 h-4 fill-white" />
                      FEATURED
                    </div>
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg bg-white/95 hover:bg-white shadow-xl flex items-center justify-center transition-all hover:scale-105"
                    >
                      <ChevronLeft className="h-6 w-6 text-slate-700" />
                    </button>
                    <button
                      onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg bg-white/95 hover:bg-white shadow-xl flex items-center justify-center transition-all hover:scale-105"
                    >
                      <ChevronRight className="h-6 w-6 text-slate-700" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={CONDITION_BADGE[listing.condition]} className="rounded-lg">
                      {listing.condition.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30 rounded-lg">
                      {listing.vehicle_type.toUpperCase()}
                    </Badge>
                  </div>
                  <h1 className="text-2xl font-black text-white mb-1">{listing.title}</h1>
                  <p className="text-3xl font-black text-white">{formatPrice(listing.price)}</p>
                </div>
              </div>

              {images.length > 1 && (
                <div className="p-4 bg-slate-50">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          i === imgIndex
                            ? "border-blue-500 shadow-lg ring-2 ring-blue-500/20"
                            : "border-transparent opacity-50 hover:opacity-100"
                        }`}
                      >
                        <Image src={imageUrl(img)} alt="" width={96} height={64} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Performance Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg border border-slate-200/50 p-6 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Performance Metrics</h3>
                  <p className="text-xs text-slate-500">Last 7 days</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Views", value: listing.views || 0, icon: Eye, color: "blue", change: "+24%" },
                  { label: "Inquiries", value: 12, icon: MessageSquare, color: "green", change: "+8%" },
                  { label: "Saves", value: 8, icon: Star, color: "amber", change: "+12%" },
                  { label: "Shares", value: 5, icon: Users, color: "purple", change: "+5%" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-white p-4 border border-slate-100"
                  >
                    <stat.icon className={`w-5 h-5 text-${stat.color}-500 mb-2`} />
                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                    <div className={`absolute top-2 right-2 px-1.5 py-0.5 bg-${stat.color}-100 text-${stat.color}-700 text-[10px] font-bold rounded`}>
                      {stat.change}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Listing Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg border border-slate-200/50 p-6 shadow-lg"
            >
              <h3 className="font-bold text-lg text-slate-900 mb-6">Vehicle Details</h3>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { label: "Year", value: listing.year, icon: Calendar },
                  { label: "Mileage", value: formatMileage(listing.mileage), icon: Gauge },
                  { label: "Fuel Type", value: listing.fuel_type?.toUpperCase() || "N/A", icon: Zap },
                  { label: "Transmission", value: listing.transmission?.toUpperCase() || "N/A", icon: Settings },
                  { label: "Location", value: listing.location, icon: MapPin },
                  { label: "Listed", value: formatDate(listing.created_at), icon: Clock },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                      <item.icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                      <p className="font-bold text-slate-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Promotion Section */}
          <div className="space-y-6">
            {/* Already Featured */}
            {listing.is_featured ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 rounded-lg p-6 text-white shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Premium Featured!</h3>
                    <p className="text-sm text-white/80">Maximum visibility active</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>10x more exposure</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Homepage placement</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Priority in search</span>
                  </div>
                </div>

                <div className="bg-white/20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Expires in</span>
                    <span className="font-bold">12 days</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Feature Promotion */
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg p-6 text-white shadow-xl overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />

                  <div className="relative">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-xl mb-1">Boost Your Listing</h3>
                        <p className="text-sm text-slate-300">Get 10x more views & sell faster</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                      {[
                        { icon: Target, label: "5x Views" },
                        { icon: TrendingUp, label: "Faster Sales" },
                        { icon: Megaphone, label: "Top Placement" },
                      ].map((item, i) => (
                        <div key={i} className="bg-white/10 rounded-lg p-3 text-center">
                          <item.icon className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                          <p className="text-[10px] font-medium">{item.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-3 flex items-center gap-2">
                      <Gift className="w-5 h-5 text-amber-400 shrink-0" />
                      <p className="text-xs font-medium">
                        Limited offer: <span className="text-amber-400 font-bold">40% OFF</span> all plans today!
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Plan Selection */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  {plans.map((plan, i) => (
                    <motion.button
                      key={plan.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative w-full text-left rounded-lg p-5 transition-all ${
                        selectedPlan === plan.id
                          ? `bg-gradient-to-br ${plan.gradient} text-white shadow-xl scale-[1.02]`
                          : "bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg"
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black rounded-lg shadow-lg">
                          {plan.badge}
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedPlan === plan.id ? "bg-white/20" : `bg-${plan.color}-100`
                          }`}>
                            <plan.icon className={`w-5 h-5 ${
                              selectedPlan === plan.id ? "text-white" : `text-${plan.color}-600`
                            }`} />
                          </div>
                          <div>
                            <h4 className={`font-bold text-lg ${selectedPlan === plan.id ? "text-white" : "text-slate-900"}`}>
                              {plan.name}
                            </h4>
                            <p className={`text-xs ${selectedPlan === plan.id ? "text-white/80" : "text-slate-500"}`}>
                              {plan.duration}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-black ${selectedPlan === plan.id ? "text-white" : "text-slate-900"}`}>
                            ₹{plan.price}
                          </p>
                          <p className={`text-xs line-through ${selectedPlan === plan.id ? "text-white/60" : "text-slate-400"}`}>
                            ₹{plan.originalPrice}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 shrink-0 ${
                              selectedPlan === plan.id ? "text-white" : `text-${plan.color}-500`
                            }`} />
                            <span className={`text-xs ${selectedPlan === plan.id ? "text-white" : "text-slate-600"}`}>
                              {feature}
                            </span>
                          </div>
                        ))}
                        {plan.features.length > 3 && (
                          <p className={`text-xs ml-6 ${selectedPlan === plan.id ? "text-white/80" : "text-slate-400"}`}>
                            +{plan.features.length - 3} more features
                          </p>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Payment Section */}
                <AnimatePresence>
                  {!showPayment ? (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      onClick={() => setShowPayment(true)}
                      disabled={isDummy}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="w-5 h-5" />
                      Continue to Payment
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg border border-slate-200/50 p-6 shadow-lg space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-lg text-slate-900">Select Payment Method</h4>
                        <button
                          onClick={() => setShowPayment(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setSelectedPayment(method.id)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              selectedPayment === method.id
                                ? "border-blue-500 bg-blue-50 shadow-lg"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <method.icon className={`w-6 h-6 mx-auto mb-2 ${
                              selectedPayment === method.id ? "text-blue-600" : "text-slate-400"
                            }`} />
                            <p className={`text-xs font-bold ${
                              selectedPayment === method.id ? "text-blue-900" : "text-slate-700"
                            }`}>
                              {method.name}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{method.desc}</p>
                          </button>
                        ))}
                      </div>

                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-600">Selected Plan</span>
                          <span className="font-bold text-slate-900">{selectedPlanData?.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-lg font-black">
                          <span className="text-slate-900">Total Amount</span>
                          <span className="text-blue-600">₹{selectedPlanData?.price}</span>
                        </div>
                      </div>

                      <button
                        onClick={handlePayment}
                        disabled={!selectedPayment}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Shield className="w-5 h-5" />
                        Secure Checkout - ₹{selectedPlanData?.price}
                      </button>

                      <p className="text-xs text-center text-slate-500">
                        🔒 Secured by 256-bit SSL encryption
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Settings({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
