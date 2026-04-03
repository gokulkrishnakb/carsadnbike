"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";

const benefits = [
  "Browse 24,000+ verified listings",
  "List your vehicle for free",
  "Chat directly with sellers and buyers",
  "AI-powered fraud detection",
];

export default function RegisterPage() {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.full_name,
    });
    if (error) {
      toast.error(error.message ?? "Registration failed. Email may already be in use.");
      return;
    }
    toast.success("Account created! Please sign in.");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-dvh flex">
      {/* Left: Brand panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col gradient-brand relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative flex flex-col h-full p-12">
          <Link href="/main" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-black text-base">CB</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">CarsAndBikes</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl font-black text-white tracking-[-0.03em] leading-[1.1] mb-5">
              Join the #1<br />vehicle marketplace.
            </h2>
            <p className="text-blue-200 text-[15px] leading-relaxed mb-10">
              Free forever. No credit card needed. Start browsing or listing in seconds.
            </p>
            <div className="space-y-3.5">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-300 shrink-0" />
                  <span className="text-sm text-blue-100 font-medium">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-blue-300/60 text-xs">© 2025 CarsAndBikes</p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[400px]"
        >
          <Link href="/main" className="flex items-center gap-2.5 mb-8 lg:hidden justify-center">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">CB</span>
            </div>
            <span className="font-bold text-slate-900 text-lg">CarsAndBikes</span>
          </Link>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create an account</h1>
              <p className="text-slate-500 text-sm mt-1.5">Free forever. No credit card needed.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <Input
                label="Full name"
                placeholder="John Doe"
                autoComplete="name"
                icon={<User className="h-4 w-4" />}
                error={errors.full_name?.message}
                {...register("full_name")}
              />
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
                autoComplete="new-password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                hint="Min 8 chars with uppercase, digit & special character"
                {...register("password")}
              />
              <PasswordInput
                label="Confirm password"
                placeholder="••••••••"
                autoComplete="new-password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.confirm_password?.message}
                {...register("confirm_password")}
              />

              <Button type="submit" size="lg" loading={isSubmitting} className="w-full gap-2 rounded-xl mt-1">
                Create account <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
              Sign in →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
