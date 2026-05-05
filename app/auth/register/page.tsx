"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, CheckCircle2, Car, Phone, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Captcha } from "@/components/ui/captcha";
import { useAuthStore } from "@/store/auth.store";

const benefits = [
  "Browse thousands of verified listings",
  "List your vehicle for free",
  "Chat directly with sellers and buyers",
  "AI-powered fraud detection",
];

export default function RegisterPage() {
  const router = useRouter();
  const { mockLogin } = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaValid, setCaptchaValid] = useState(false);

  // OTP verification state
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get user's location in background on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // Resend timer countdown
  useEffect(() => {
    if (showOtpPage && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showOtpPage, resendTimer]);

  // Phone number validation function
  const validatePhoneNumber = (phone: string): boolean => {
    // Supports formats: +1234567890, 1234567890, 123-456-7890, (123) 456-7890
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName) newErrors.fullName = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (!captchaValid) {
      toast.error("Please complete the CAPTCHA verification");
      return;
    }

    setIsSubmitting(true);

    // Simulate sending OTP to phone
    setTimeout(() => {
      setIsSubmitting(false);
      setShowOtpPage(true);
      setResendTimer(30);
      toast.success(`OTP sent to ${phoneNumber}`);
    }, 1000);
  }, [captchaValid, phoneNumber]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    otpInputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const verifyOtp = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }

    setIsVerifying(true);

    // Mock OTP verification - accept any 6-digit OTP
    setTimeout(() => {
      let role = "user";
      if (email.includes("agent")) role = "agent";
      if (email.includes("admin")) role = "admin";

      mockLogin(email, fullName, role);
      toast.success("Phone verified! Account created successfully!");
      router.push("/main/dashboard");
      setIsVerifying(false);
    }, 1000);
  };

  // Resend OTP
  const resendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    toast.success(`OTP resent to ${phoneNumber}`);
  };

  // OTP Verification Page
  if (showOtpPage) {
    return (
      <div className="min-h-dvh flex">
        {/* Left: Brand panel */}
        <div className="hidden lg:flex lg:w-[45%] flex-col bg-gradient-to-br from-[#1a1d2e] via-[#272a41] to-[#1a1d2e] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          <div className="relative flex flex-col h-full p-12">
            <Link href="/main" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#9b111e] rounded flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-sm">CarsAndBikes</span>
            </Link>

            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-4xl font-bold tracking-tight leading-[1.1] mb-5" style={{ color: 'white' }}>
                Verify your<br />phone number.
              </h2>
              <p className="text-gray-400 text-[15px] leading-relaxed mb-10">
                We sent a 6-digit code to your phone. Enter it below to complete registration.
              </p>
              <div className="space-y-3.5">
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#9b111e] shrink-0" />
                    <span className="text-sm text-gray-300 font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-gray-500 text-xs">© 2025 CarsAndBikes</p>
          </div>
        </div>

        {/* Right: OTP Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-[#f8f9fa]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-[400px]"
          >
            <Link href="/main" className="flex items-center gap-2 mb-8 lg:hidden justify-center">
              <div className="w-8 h-8 bg-[#9b111e] rounded flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[#272a41] text-sm">CarsAndBikes</span>
            </Link>

            <div className="bg-white rounded shadow-2xl p-8">
              {/* Back Button */}
              <button
                onClick={() => setShowOtpPage(false)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#9b111e] mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-[#9b111e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-[#9b111e]" />
                </div>
                <h1 className="text-2xl font-bold text-[#272a41] tracking-tight">Verify Phone</h1>
                <p className="text-[#56586a] text-sm mt-2">
                  Enter the 6-digit code sent to<br />
                  <span className="font-semibold text-[#272a41]">{phoneNumber}</span>
                </p>
              </div>

              {/* OTP Input */}
              <div className="flex justify-center gap-2 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpInputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className={`w-12 h-14 text-center text-xl font-bold border-2 rounded ${
                      otpError ? "border-red-500" : "border-gray-200"
                    } focus:border-[#9b111e] focus:ring-4 focus:ring-red-100 outline-none transition-all`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-center text-xs text-red-500 mb-4">{otpError}</p>
              )}

              {/* Verify Button */}
              <button
                onClick={verifyOtp}
                disabled={isVerifying || otp.join("").length !== 6}
                className="w-full px-6 py-3 bg-[#9b111e] text-white font-bold rounded hover:bg-[#7b0d18] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Verify & Create Account <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Didn't receive the code?{" "}
                  {resendTimer > 0 ? (
                    <span className="text-gray-400">Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      onClick={resendOtp}
                      className="text-[#9b111e] hover:text-[#7b0d18] font-semibold transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex">
      {/* Left: Brand panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col bg-gradient-to-br from-[#1a1d2e] via-[#272a41] to-[#1a1d2e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative flex flex-col h-full p-12">
          <Link href="/main" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#9b111e] rounded flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-sm">CarsAndBikes</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl font-bold tracking-tight leading-[1.1] mb-5" style={{ color: 'white' }}>
              Join the #1<br />vehicle marketplace.
            </h2>
            <p className="text-gray-400 text-[15px] leading-relaxed mb-10">
              Free forever. No credit card needed. Start browsing or listing in seconds.
            </p>
            <div className="space-y-3.5">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#9b111e] shrink-0" />
                  <span className="text-sm text-gray-300 font-medium">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-500 text-xs">© 2025 CarsAndBikes</p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-[#f8f9fa]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[400px]"
        >
          <Link href="/main" className="flex items-center gap-2 mb-8 lg:hidden justify-center">
            <div className="w-8 h-8 bg-[#9b111e] rounded flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#272a41] text-sm">CarsAndBikes</span>
          </Link>

          <div className="bg-white rounded shadow-2xl p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-[#272a41] tracking-tight">Create an account</h1>
              <p className="text-[#56586a] text-sm mt-1">Free forever. No credit card needed.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-semibold text-[#56586a] uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border-2 ${
                      errors.fullName ? "border-red-500" : "border-gray-200"
                    } rounded text-[#272a41] text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#9b111e] focus:ring-4 focus:ring-red-100 transition-all`}
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#56586a] uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border-2 ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } rounded text-[#272a41] text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#9b111e] focus:ring-4 focus:ring-red-100 transition-all`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#56586a] uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder="+1 (123) 456-7890"
                    autoComplete="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border-2 ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-200"
                    } rounded text-[#272a41] text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#9b111e] focus:ring-4 focus:ring-red-100 transition-all`}
                  />
                </div>
                {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>}
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border-2 ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    } rounded text-[#272a41] text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#9b111e] focus:ring-4 focus:ring-red-100 transition-all`}
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#56586a] uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border-2 ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-200"
                    } rounded text-[#272a41] text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#9b111e] focus:ring-4 focus:ring-red-100 transition-all`}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              <Captcha onChange={setCaptchaValid} />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-[#9b111e] text-white font-bold rounded hover:bg-[#7b0d18] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-[#56586a]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#9b111e] hover:text-[#7b0d18] font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
