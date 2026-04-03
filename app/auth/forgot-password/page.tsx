"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/features/auth/schemas";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: "/auth/reset-password",
    });
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSent(true);
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
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-8">
              <KeyRound className="h-8 w-8 text-blue-200" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-[-0.03em] leading-[1.1] mb-5">
              Forgot your<br />password?
            </h2>
            <p className="text-blue-200 text-[15px] leading-relaxed">
              No worries — it happens to everyone. Enter your email and we&apos;ll send you a reset link instantly.
            </p>
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
            {!sent ? (
              <>
                <div className="mb-7">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reset password</h1>
                  <p className="text-slate-500 text-sm mt-1.5">
                    Enter your email and we&apos;ll send you a reset link.
                  </p>
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
                  <Button type="submit" size="lg" loading={isSubmitting} className="w-full gap-2 rounded-xl">
                    Send reset link <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">Check your inbox</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  If that email is registered, a reset link has been sent.
                </p>
                <p className="text-xs text-slate-400 mt-3">
                  In development, check the server console for the reset link.
                </p>
              </motion.div>
            )}
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
