"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Star, Sparkles, Zap, Crown, CheckCircle, CreditCard, Smartphone,
  Building2, Wallet, Trophy, Target, Megaphone, Shield, Gift, Clock, Eye,
  ChevronLeft, Calendar, Check, ArrowRight, RefreshCw, TrendingUp
} from "lucide-react";
import { listingsService } from "@/services/listings.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatMileage, imageUrl } from "@/lib/utils";
import { toast } from "sonner";

export default function FeaturedPlanPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");
  const [selectedPayment, setSelectedPayment] = useState<string>("card");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");

  // Dummy data - replace with actual API calls
  const hasActivePlan = true; // Check if user has active featured plan
  const activePlanExpiry = "2024-12-31";
  const daysRemaining = 12;
  const currentFeaturedVehicle = null; // Currently featured vehicle ID

  const { data: myListings, isLoading } = useQuery({
    queryKey: ["my-listings", user?.id],
    queryFn: () => listingsService.list({ seller_id: user?.id, size: 50 }),
    enabled: !!user?.id,
  });

  // Dummy listings for demo
  const dummyListings = [
    {
      id: "dummy-1",
      title: "2023 BMW 3 Series M Sport",
      make: "BMW",
      model: "3 Series",
      year: 2023,
      price: 4500000,
      mileage: 12000,
      status: "active",
      images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"],
      is_featured: false,
    },
    {
      id: "dummy-2",
      title: "2024 Royal Enfield Classic 350",
      make: "Royal Enfield",
      model: "Classic 350",
      year: 2024,
      price: 195000,
      mileage: 2500,
      status: "active",
      images: ["https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=800&q=80"],
      is_featured: false,
    },
    {
      id: "dummy-3",
      title: "2022 Honda Civic RS Turbo",
      make: "Honda",
      model: "Civic",
      year: 2022,
      price: 2800000,
      mileage: 18500,
      status: "sold",
      images: ["https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&w=800&q=80"],
      is_featured: false,
    },
  ];

  const allListings = [...(myListings?.items ?? []), ...dummyListings];
  const activeListings = allListings.filter(l => l.status === "active");

  const plans = [
    {
      id: "basic",
      name: "Starter",
      duration: "7 Days",
      price: 299,
      originalPrice: 499,
      icon: Zap,
      gradient: "from-blue-500 to-cyan-500",
      features: ["Top of category listing", "2x more visibility", "Basic analytics", "7 days duration"]
    },
    {
      id: "premium",
      name: "Professional",
      duration: "14 Days",
      price: 499,
      originalPrice: 899,
      icon: Star,
      gradient: "from-amber-500 to-orange-500",
      popular: true,
      badge: "MOST POPULAR",
      features: ["Homepage featured slot", "5x more visibility", "Advanced analytics", "Priority support", "14 days duration", "Social media promotion"]
    },
    {
      id: "pro",
      name: "Enterprise",
      duration: "30 Days",
      price: 799,
      originalPrice: 1499,
      icon: Crown,
      gradient: "from-purple-500 to-pink-500",
      badge: "BEST VALUE",
      features: ["Premium homepage placement", "10x more visibility", "Premium analytics dashboard", "Dedicated account manager", "30 days duration", "Full social media campaign"]
    }
  ];

  const paymentMethods = [
    { id: "card", name: "Card", icon: CreditCard, desc: "Instant" },
    { id: "upi", name: "UPI", icon: Smartphone, desc: "Quick pay" },
    { id: "netbanking", name: "Net Banking", icon: Building2, desc: "Bank transfer" },
    { id: "wallet", name: "Wallet", icon: Wallet, desc: "E-wallets" },
  ];

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  const handlePayment = () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }
    toast.success("Processing payment...");
    // TODO: Integrate payment gateway
    // After payment success, user should select which vehicle to feature
  };

  const handleFeatureVehicle = () => {
    if (!selectedVehicle) {
      toast.error("Please select a vehicle to feature");
      return;
    }
    toast.success("Vehicle featured successfully!");
    // TODO: API call to feature the vehicle
  };

  const handleSwitchVehicle = () => {
    if (!selectedVehicle) {
      toast.error("Please select a vehicle");
      return;
    }
    toast.success("Switched featured vehicle!");
    // TODO: API call to switch featured vehicle
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50" />;
  }

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

            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h1 className="text-lg font-bold text-slate-900">Featured Plan</h1>
            </div>

            <div className="w-24" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Active Plan Status */}
        {hasActivePlan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 rounded-lg p-6 text-white shadow-xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl">Active Featured Plan</h2>
                    <p className="text-sm text-white/80">Your listing is getting maximum visibility</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80">Expires in</p>
                  <p className="text-2xl font-black">{daysRemaining} days</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm text-white/80 mb-1">Plan Type</p>
                  <p className="font-bold">Professional</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm text-white/80 mb-1">Expires On</p>
                  <p className="font-bold">{new Date(activePlanExpiry).toLocaleDateString()}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-sm text-white/80 mb-1">Status</p>
                  <p className="font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Active
                  </p>
                </div>
              </div>

              {currentFeaturedVehicle && (
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm text-white/80 mb-2">Currently Featured Vehicle</p>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-white/20">
                      <Image src="/placeholder-car.jpg" alt="" width={80} height={56} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold">2023 BMW 3 Series M Sport</p>
                      <p className="text-sm text-white/80">₹45,00,000</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* No Active Plan */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg p-6 text-white shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />

              <div className="relative">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-black text-2xl mb-1">Feature Your Listing</h2>
                    <p className="text-sm text-slate-300">Get 10x more views & sell faster with premium placement</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[
                    { icon: Target, label: "5x More Views" },
                    { icon: TrendingUp, label: "Sell Faster" },
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
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Vehicle Selection or Plan Selection */}
          <div>
            {hasActivePlan ? (
              /* Select Vehicle to Feature */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-slate-200/50 p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {currentFeaturedVehicle ? "Switch Featured Vehicle" : "Select Vehicle to Feature"}
                    </h3>
                    <p className="text-sm text-slate-500">Choose which listing to promote</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 max-h-[500px] overflow-y-auto">
                  {activeListings.map((listing) => (
                    <button
                      key={listing.id}
                      onClick={() => setSelectedVehicle(listing.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedVehicle === listing.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          {listing.images?.[0] && (
                            <Image
                              src={imageUrl(listing.images[0])}
                              alt={listing.title}
                              width={96}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{listing.title}</p>
                          <p className="text-sm text-slate-500">{formatPrice(listing.price)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{listing.year}</Badge>
                            <Badge variant="outline" className="text-xs">{formatMileage(listing.mileage)}</Badge>
                          </div>
                        </div>
                        {selectedVehicle === listing.id && (
                          <CheckCircle className="w-6 h-6 text-blue-600 shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}

                  {activeListings.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-slate-500 mb-4">No active listings available</p>
                      <Link href="/main/listings/new">
                        <Button>Create Listing</Button>
                      </Link>
                    </div>
                  )}
                </div>

                <button
                  onClick={currentFeaturedVehicle ? handleSwitchVehicle : handleFeatureVehicle}
                  disabled={!selectedVehicle}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Star className="w-5 h-5" />
                  {currentFeaturedVehicle ? "Switch Featured Vehicle" : "Feature This Vehicle"}
                </button>
              </motion.div>
            ) : (
              /* Plan Selection */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h3 className="font-bold text-lg text-slate-900 mb-4">Choose Your Plan</h3>
                {plans.map((plan, i) => (
                  <motion.button
                    key={plan.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
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
                          selectedPlan === plan.id ? "bg-white/20" : "bg-blue-100"
                        }`}>
                          <plan.icon className={`w-5 h-5 ${
                            selectedPlan === plan.id ? "text-white" : "text-blue-600"
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
                      {plan.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 shrink-0 ${
                            selectedPlan === plan.id ? "text-white" : "text-blue-500"
                          }`} />
                          <span className={`text-xs ${selectedPlan === plan.id ? "text-white" : "text-slate-600"}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                      {plan.features.length > 4 && (
                        <p className={`text-xs ml-6 ${selectedPlan === plan.id ? "text-white/80" : "text-slate-400"}`}>
                          +{plan.features.length - 4} more
                        </p>
                      )}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right: Payment or Info */}
          <div>
            {!hasActivePlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AnimatePresence mode="wait">
                  {!showPayment ? (
                    <motion.button
                      key="continue"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowPayment(true)}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-6"
                    >
                      <Sparkles className="w-5 h-5" />
                      Continue to Payment
                    </motion.button>
                  ) : (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-lg border border-slate-200/50 p-6 shadow-lg space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-lg text-slate-900">Payment Method</h4>
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

                {/* Benefits Info */}
                <div className="bg-white rounded-lg border border-slate-200/50 p-6 shadow-lg">
                  <h4 className="font-bold text-slate-900 mb-4">Why Feature Your Listing?</h4>
                  <div className="space-y-3">
                    {[
                      { icon: Eye, title: "10x More Views", desc: "Get maximum exposure on homepage" },
                      { icon: TrendingUp, title: "Sell 3x Faster", desc: "Featured listings sell significantly faster" },
                      { icon: Target, title: "Top Placement", desc: "Always appear first in search results" },
                      { icon: RefreshCw, title: "Switch Anytime", desc: "Change featured vehicle if it sells" },
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <benefit.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{benefit.title}</p>
                          <p className="text-xs text-slate-500">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {hasActivePlan && (
              /* Plan Benefits & Stats */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg border border-slate-200/50 p-6 shadow-lg">
                  <h4 className="font-bold text-slate-900 mb-4">Plan Benefits</h4>
                  <div className="space-y-3">
                    {[
                      "Homepage featured placement",
                      "5x more visibility",
                      "Advanced analytics",
                      "Priority support",
                      "Social media promotion",
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-slate-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-slate-900">Smart Tip</h4>
                  </div>
                  <p className="text-sm text-slate-600">
                    If your featured vehicle sells, you can instantly switch to another listing and use your remaining plan days!
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
