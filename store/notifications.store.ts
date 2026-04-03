"use client";

import { create } from "zustand";
import type { Notification } from "@/types";

interface NotificationsState {
  unreadCount: number;
  items: Notification[];
  setUnread: (count: number) => void;
  addNotification: (n: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  setItems: (items: Notification[]) => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  unreadCount: 0,
  items: [],

  setUnread: (count) => set({ unreadCount: count }),

  addNotification: (n) =>
    set((s) => ({
      items: [n, ...s.items],
      unreadCount: s.unreadCount + (n.is_read ? 0 : 1),
    })),

  markRead: (id) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, is_read: true } : i)),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),

  markAllRead: () =>
    set((s) => ({
      items: s.items.map((i) => ({ ...i, is_read: true })),
      unreadCount: 0,
    })),

  setItems: (items) =>
    set({
      items,
      unreadCount: items.filter((i) => !i.is_read).length,
    }),
}));
