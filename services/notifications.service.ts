import { api } from "@/lib/api";
import type { Notification, NotificationListResponse } from "@/types";

export const notificationsService = {
  async list(page = 1): Promise<NotificationListResponse> {
    const res = await api.get<NotificationListResponse>("/notifications/", { params: { page, size: 20 } });
    return res.data;
  },

  async getUnreadCount(): Promise<number> {
    const res = await api.get<{ count: number }>("/notifications/unread-count");
    return res.data.count;
  },

  async markRead(id: string): Promise<Notification> {
    const res = await api.put<Notification>(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllRead(): Promise<void> {
    await api.put("/notifications/read-all");
  },
};
