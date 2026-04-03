"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Mail, Lock, Shield, LogOut, Plus, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authClient } from "@/lib/auth-client";
import { listingsService } from "@/services/listings.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListingCard } from "@/features/listings/listing-card";
import { getInitials } from "@/lib/utils";

const pwSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[!@#$%^&*]/),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

type PwInput = z.infer<typeof pwSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [tab, setTab] = useState<"listings" | "security">("listings");

  const { data: myListings, isLoading: listingsLoading } = useQuery({
    queryKey: ["my-listings"],
    queryFn: () => listingsService.list({ user_id: user?.id }),
    enabled: !!user,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PwInput>({
    resolver: zodResolver(pwSchema),
  });

  const onChangePassword = async (data: PwInput) => {
    const { error } = await authClient.changePassword({
      currentPassword: data.current_password,
      newPassword: data.new_password,
      revokeOtherSessions: false,
    });
    if (error) {
      toast.error("Failed to update password. Check your current password.");
      return;
    }
    toast.success("Password updated successfully");
    reset();
  };

  const handleSignOut = async () => {
    await clearAuth();
    router.push("/auth/login");
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-20 gradient-brand relative">
          <div className="absolute inset-0 dot-grid opacity-20" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-8 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 border-4 border-white flex items-center justify-center shadow-lg">
              <span className="text-xl font-black text-white">{getInitials(user.full_name)}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mb-1">{user.full_name}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <Mail className="h-3.5 w-3.5" /> {user.email}
            </span>
            <span className="w-px h-3 bg-slate-200" />
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              user.is_verified ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-yellow-50 text-yellow-700 border border-yellow-200"
            }`}>
              {user.is_verified ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {user.is_verified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
        {(["listings", "security"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              tab === t
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {t === "listings" ? "My Listings" : "Security"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "listings" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {listingsLoading ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-64 rounded-2xl" />
              ))}
            </div>
          ) : !myListings?.items.length ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm text-center py-20">
              <div className="text-5xl mb-5">🚗</div>
              <p className="text-lg font-bold text-slate-900 mb-2">No listings yet</p>
              <p className="text-sm text-slate-500 mb-6">List your first vehicle to get started</p>
              <Button onClick={() => router.push("/main/listings/new")} className="gap-2">
                <Plus className="h-4 w-4" /> List a Vehicle
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {myListings.items.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} showActions />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {tab === "security" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Lock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Change Password</h3>
                <p className="text-xs text-slate-500">Update your account password</p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4" noValidate>
              <Input
                label="Current password"
                type="password"
                placeholder="••••••••"
                error={errors.current_password?.message}
                {...register("current_password")}
              />
              <Input
                label="New password"
                type="password"
                placeholder="••••••••"
                hint="Min 8 chars, 1 uppercase, 1 digit, 1 special"
                error={errors.new_password?.message}
                {...register("new_password")}
              />
              <Input
                label="Confirm new password"
                type="password"
                placeholder="••••••••"
                error={errors.confirm_password?.message}
                {...register("confirm_password")}
              />
              <Button type="submit" loading={isSubmitting}>Update Password</Button>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Shield className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Account Security</h3>
                <p className="text-xs text-slate-500">Your security overview</p>
              </div>
            </div>
            <div className="space-y-2">
              <SecurityRow label="Email verified" value={user.is_verified} />
              <SecurityRow label="Two-factor authentication" value={false} />
              <SecurityRow label="Login alerts" value={true} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function SecurityRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
      <span className="text-sm text-slate-700 font-medium">{label}</span>
      <span className={`flex items-center gap-1.5 text-xs font-semibold ${value ? "text-emerald-700" : "text-slate-400"}`}>
        {value ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
        {value ? "Enabled" : "Not enabled"}
      </span>
    </div>
  );
}
