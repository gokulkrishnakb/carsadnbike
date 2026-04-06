"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

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
    <div className="bg-white flex flex-col">
      {/* Top bar */}
      <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <Link href="/main" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 flex items-center justify-center">
            <span className="text-white font-black text-xs">CB</span>
          </div>
          <span className="font-bold text-slate-900 text-sm">CarsAndBikes</span>
        </Link>
        <Link
          href="/auth/register"
          className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
        >
          Create account
        </Link>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1.5">Sign in</h1>
            <p className="text-slate-500 text-sm">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Email"
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

            <Button type="submit" size="lg" loading={isSubmitting} className="w-full gap-2 mt-2">
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            No account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
