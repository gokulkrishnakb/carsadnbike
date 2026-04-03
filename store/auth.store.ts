"use client";

import { authClient } from "@/lib/auth-client";
import type { User } from "@/types";

type SessionUser = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function toUser(sessionUser: SessionUser | undefined): User | null {
  if (!sessionUser) return null;
  return {
    id: sessionUser.id,
    email: sessionUser.email,
    full_name: sessionUser.name,
    role: "user",
    is_active: true,
    is_verified: sessionUser.emailVerified,
    created_at: sessionUser.createdAt?.toISOString?.() ?? new Date().toISOString(),
  };
}

export function useAuthStore() {
  const { data: session, isPending } = authClient.useSession();

  return {
    user: toUser(session?.user as SessionUser | undefined),
    isPending,
    clearAuth: () => authClient.signOut(),
    updateUser: (_partial: Partial<User>) => {
      // User data is managed by better-auth sessions; refresh page to reflect profile changes
    },
  };
}
