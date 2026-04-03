"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationsStore } from "@/store/notifications.store";
import { ReconnectingWebSocket } from "@/lib/websocket";
import { authClient } from "@/lib/auth-client";
import { notificationsService } from "@/services/notifications.service";
import type { Notification } from "@/types";

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/api/v1";

export function useNotifications() {
  const { user } = useAuthStore();
  const { setUnread, addNotification, markRead, markAllRead, unreadCount, items, setItems } =
    useNotificationsStore();

  // Bootstrap unread count
  useEffect(() => {
    if (!user) return;
    notificationsService.getUnreadCount().then(setUnread);
  }, [user, setUnread]);

  // WebSocket for live notifications
  useEffect(() => {
    if (!user) return;

    let ws: ReconnectingWebSocket | null = null;

    (async () => {
      const tokenRes = await authClient.token();
      const token = tokenRes.data?.token ?? "";
      ws = new ReconnectingWebSocket(`${WS_BASE}/notifications/ws?token=${token}`);

      ws.on((event) => {
        if (event.type === "notification") {
          const notif = event.data as Notification;
          addNotification(notif);
        }
      });

      ws.connect();
    })();

    return () => ws?.disconnect();
  }, [user, addNotification]);

  const handleMarkRead = async (id: string) => {
    await notificationsService.markRead(id);
    markRead(id);
  };

  const handleMarkAllRead = async () => {
    await notificationsService.markAllRead();
    markAllRead();
  };

  return { unreadCount, items, markRead: handleMarkRead, markAllRead: handleMarkAllRead, setItems };
}
