"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Car, Shield, Zap } from "lucide-react";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";

const perks = [
  { icon: Car, text: "24,000+ verified listings" },
  { icon: Zap, text: "Real-time chat with sellers" },
  { icon: Shield, text: "AI-powered fraud protection" },
];

export default function LoginPage() {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
    if (error) {
      toast.error("Invalid email or password");
      return;
    }
    toast.success("Welcome back!");
    router.push("/main");
  };

  return (
    <div className="min-h-dvh flex">
      {/* Left: Brand panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col gradient-brand relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative flex flex-col h-full p-12">
          {/* Logo */}
          <Link href="/main" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-black text-base">CB</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">CarsAndBikes</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl font-black text-white tracking-[-0.03em] leading-[1.1] mb-5">
              The smarter way to<br />buy & sell vehicles.
            </h2>
            <p className="text-blue-200 text-[15px] leading-relaxed mb-10">
              Join hundreds of thousands of buyers and sellers on the most trusted vehicle marketplace.
            </p>
            <div className="space-y-4">
              {perks.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-blue-200" />
                  </div>
                  <span className="text-sm text-blue-100 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-blue-300/60 text-xs">© 2025 CarsAndBikes</p>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <Link href="/main" className="flex items-center gap-2.5 mb-8 lg:hidden justify-center">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">CB</span>
            </div>
            <span className="font-bold text-slate-900 text-lg">CarsAndBikes</span>
          </Link>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back</h1>
              <p className="text-slate-500 text-sm mt-1.5">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register("email")}
              />
              <PasswordInput
                label="Password"
                placeholder="••••••••"
                autoComplete="current-password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register("password")}
              />

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" size="lg" loading={isSubmitting} className="w-full gap-2 rounded-xl mt-1">
                Sign in <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
              Create one free →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
