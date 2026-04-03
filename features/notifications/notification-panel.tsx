"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, CheckCheck } from "lucide-react";
import { notificationsService } from "@/services/notifications.service";
import { useNotificationsStore } from "@/store/notifications.store";
import { useNotifications } from "@/hooks/use-notifications";
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

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const { setItems } = useNotificationsStore();
  const { items, unreadCount, markRead, markAllRead } = useNotifications();

  useEffect(() => {
    if (!open) return;
    notificationsService.list().then((data) => setItems(data.items));
  }, [open, setItems]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />

          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2.5 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Bell className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-bold text-slate-900 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold leading-none">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    All read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[440px] overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                    <Bell className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">You&apos;re all caught up!</p>
                  <p className="text-xs text-slate-400 mt-1">No new notifications</p>
                </div>
              ) : (
                <ul>
                  {items.map((notif) => (
                    <motion.li
                      key={notif.id}
                      layout
                      className={`flex items-start gap-3 px-4 py-3.5 border-b border-slate-100 last:border-0 cursor-pointer transition-colors ${
                        !notif.is_read ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-slate-50"
                      }`}
                      onClick={() => !notif.is_read && markRead(notif.id)}
                    >
                      <span className="text-lg shrink-0 mt-0.5">
                        {NOTIF_ICONS[notif.type] ?? "🔔"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${!notif.is_read ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{notif.body}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{timeAgo(notif.created_at)}</p>
                      </div>
                      {!notif.is_read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                      )}
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
