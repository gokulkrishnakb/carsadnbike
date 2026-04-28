"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import { notificationsService } from "@/services/notifications.service";
import { useNotificationsStore } from "@/store/notifications.store";
import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";

const NOTIF_ICONS: Record<string, string> = {
  new_message: "💬",
  new_bid: "🏷️",
  bid_accepted: "✅",
  bid_rejected: "❌",
  listing_updated: "✏️",
  listing_sold: "🎉",
  listing_created: "🆕",
};

export default function NotificationsPage() {
  const { setItems } = useNotificationsStore();
  const { items, markRead, markAllRead, unreadCount } = useNotifications();

  const { isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const data = await notificationsService.list();
      setItems(data.items);
      return data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-slate-500 mt-0.5">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllRead} className="gap-2">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 animate-pulse">
              <div className="skeleton w-11 h-11 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2.5 py-1">
                <div className="skeleton h-3.5 w-3/4 rounded-lg" />
                <div className="skeleton h-3 w-1/2 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-5">
            <Bell className="h-9 w-9 text-slate-300" />
          </div>
          <p className="text-lg font-bold text-slate-900">You&apos;re all caught up</p>
          <p className="text-sm text-slate-500 mt-1.5">No notifications yet. Check back later.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => !notif.is_read && markRead(notif.id)}
              className={`bg-white border rounded-2xl p-4 flex items-start gap-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                !notif.is_read
                  ? "border-blue-200 bg-blue-50/30 hover:border-blue-300"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl ${
                !notif.is_read ? "bg-blue-100" : "bg-slate-100"
              }`}>
                {NOTIF_ICONS[notif.type] ?? "🔔"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm leading-snug ${!notif.is_read ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                    {notif.title}
                  </p>
                  <span className="text-[11px] text-slate-400 shrink-0 mt-0.5">{timeAgo(notif.created_at)}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.body}</p>
              </div>
              {!notif.is_read && (
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
              )}
            </motion.div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
