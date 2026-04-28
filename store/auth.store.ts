"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

// Mock mode - set to true for testing without backend
const MOCK_MODE = true;

type AuthState = {
  user: User | null;
  isPending: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  updateUser: (partial: Partial<User>) => void;
  mockLogin: (email: string, name: string, role?: string) => void;
};

const useAuthStoreBase = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isPending: false,
      setUser: (user) => set({ user }),
      clearAuth: () => set({ user: null }),
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
      mockLogin: (email: string, name: string, role: string = "user") =>
        set({
          user: {
            id: "mock-user-" + Date.now(),
            email,
            full_name: name,
            role: role as "user" | "agent" | "admin",
            is_active: true,
            is_verified: true,
            created_at: new Date().toISOString(),
          },
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);

// Export hook that works with both mock and real auth
export function useAuthStore() {
  const store = useAuthStoreBase();

  if (MOCK_MODE) {
    return {
      user: store.user,
      isPending: false,
      clearAuth: store.clearAuth,
      updateUser: store.updateUser,
      mockLogin: store.mockLogin,
    };
  }

  // Real auth mode would use better-auth here
  return {
    user: store.user,
    isPending: false,
    clearAuth: store.clearAuth,
    updateUser: store.updateUser,
    mockLogin: store.mockLogin,
  };
}

// Export for direct access
export { useAuthStoreBase };
