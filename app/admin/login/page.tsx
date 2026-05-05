"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { toast } from "sonner";
import { Captcha } from "@/components/ui/captcha";
import { useAuthStore } from "@/store/auth.store";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, mockLogin, clearAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);

  // If already logged in as admin, redirect to admin dashboard
  useEffect(() => {
    if (user && user.role === "admin") {
      router.replace("/admin");
    }
  }, [user, router]);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!captchaValid) {
      toast.error("Please complete the CAPTCHA verification");
      return;
    }

    setIsSubmitting(true);

    // Mock login - simulates admin authentication
    setTimeout(() => {
      // For admin login, check if email contains "admin"
      const isAdmin = email.toLowerCase().includes("admin");

      if (!isAdmin) {
        toast.error("Access denied. Admin credentials required.");
        setIsSubmitting(false);
        return;
      }

      const name = email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      mockLogin(email, name, "admin");
      toast.success("Welcome to Admin Portal!");
      router.push("/admin");
      setIsSubmitting(false);
    }, 500);
  }, [email, captchaValid, mockLogin, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d2e] via-[#272a41] to-[#1a1d2e] flex flex-col">
      {/* Top bar */}
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href="/main" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#9b111e] rounded flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">Admin Portal</span>
        </Link>
        <Link
          href="/auth/login"
          className="text-sm text-gray-400 hover:text-white font-medium transition-colors"
        >
          User Login
        </Link>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded shadow-2xl p-8">
            <div className="mb-6 text-center">
              <div className="w-16 h-16 bg-[#9b111e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#9b111e]" />
              </div>
              <h1 className="text-2xl font-bold text-[#272a41] tracking-tight mb-1">
                Admin Portal
              </h1>
              <p className="text-[#56586a] text-sm">
                Sign in with administrator credentials
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-semibold text-[#56586a] uppercase tracking-wider mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border-2 border-gray-200 rounded text-[#272a41] text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#9b111e] focus:ring-4 focus:ring-red-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#56586a] uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border-2 border-gray-200 rounded text-[#272a41] text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#9b111e] focus:ring-4 focus:ring-red-100 transition-all"
                  />
                </div>
              </div>

              <Captcha onChange={setCaptchaValid} />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-[#9b111e] text-white font-bold rounded hover:bg-[#7b0d18] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Access Admin Portal <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-center text-xs text-[#56586a]">
                Not an administrator?{" "}
                <Link
                  href="/auth/login"
                  className="text-[#9b111e] hover:text-[#7b0d18] font-semibold transition-colors"
                >
                  Go to user login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
