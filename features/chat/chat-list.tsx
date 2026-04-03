"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";
import type { Conversation } from "@/types";

interface ChatListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (conversation: Conversation) => void;
}

export function ChatList({ conversations, activeId, onSelect }: ChatListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4">
          <MessageCircle className="h-6 w-6 text-slate-300" />
        </div>
        <p className="text-slate-700 text-sm font-semibold mb-1">No conversations yet</p>
        <p className="text-slate-400 text-xs leading-relaxed">Contact a seller from a listing to start chatting</p>
      </div>
    );
  }

  return (
    <ul>
      {conversations.map((conv, i) => {
        const isActive = activeId === conv.id;
        const hasUnread = conv.unread_count > 0;
        const initials = conv.other_user.full_name.charAt(0).toUpperCase();

        return (
          <motion.li
            key={conv.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <button
              onClick={() => onSelect(conv)}
              className={`w-full flex items-start gap-3 px-4 py-3.5 transition-all text-left border-b border-slate-100/80 last:border-0 ${
                isActive
                  ? "bg-blue-50 border-l-2 border-l-blue-600"
                  : "hover:bg-slate-50"
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0 mt-0.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-sm ${
                  isActive ? "bg-blue-600 text-white" : "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600"
                }`}>
                  {initials}
                </div>
                {hasUnread && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center shadow-sm border border-white leading-none">
                    {conv.unread_count > 9 ? "9+" : conv.unread_count}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-1 mb-0.5">
                  <span className={`text-sm truncate ${
                    hasUnread ? "font-bold text-slate-900" : "font-semibold text-slate-700"
                  }`}>
                    {conv.other_user.full_name}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: false })}
                  </span>
                </div>
                <p className="text-[11px] text-blue-600 truncate font-semibold mb-0.5">{conv.listing_title}</p>
                {conv.last_message && (
                  <p className={`text-[12px] truncate ${
                    hasUnread ? "text-slate-700 font-medium" : "text-slate-400"
                  }`}>
                    {conv.last_message.content}
                  </p>
                )}
              </div>
            </button>
          </motion.li>
        );
      })}
    </ul>
  );
}
