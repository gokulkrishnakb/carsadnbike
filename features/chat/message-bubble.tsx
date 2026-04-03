"use client";

import { motion } from "framer-motion";
import { Check, CheckCheck, Clock, AlertTriangle } from "lucide-react";
import { formatTime } from "@/lib/utils";
import type { ChatMessage, MessageStatus } from "@/types";

function StatusIcon({ status }: { status: MessageStatus }) {
  if (status === "sending") return <Clock className="h-3 w-3 text-blue-300" />;
  if (status === "sent") return <Check className="h-3 w-3 text-blue-300" />;
  if (status === "delivered") return <CheckCheck className="h-3 w-3 text-blue-300" />;
  return <CheckCheck className="h-3 w-3 text-white/70" />;
}

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`flex flex-col ${isMine ? "items-end" : "items-start"} gap-1`}
    >
      {/* Safety warning */}
      {message.is_flagged && message.safety_warnings && message.safety_warnings.length > 0 && (
        <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-2xl bg-red-50 border border-red-200 max-w-xs mb-1">
          <AlertTriangle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
          <div>
            {message.safety_warnings.map((w, i) => (
              <p key={i} className="text-xs text-red-600 font-medium">{w}</p>
            ))}
          </div>
        </div>
      )}

      <div
        className={`max-w-[75%] sm:max-w-sm lg:max-w-md px-4 py-2.5 ${
          isMine
            ? "bg-blue-600 text-white rounded-2xl rounded-br-md shadow-[0_2px_8px_rgba(37,99,235,0.3)]"
            : "bg-white text-slate-900 border border-slate-200 rounded-2xl rounded-bl-md shadow-sm"
        }`}
      >
        <p className="text-[14px] leading-relaxed break-words">{message.content}</p>
      </div>

      <div className={`flex items-center gap-1.5 px-1.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
        <span className="text-[10px] text-slate-400 font-medium">{formatTime(message.created_at)}</span>
        {isMine && <StatusIcon status={message.status} />}
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="flex items-start"
    >
      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </motion.div>
  );
}

export function DateDivider({ date }: { date: string }) {
  const label = (() => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  })();

  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-[11px] text-slate-400 font-semibold tracking-wide px-2">{label}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}
