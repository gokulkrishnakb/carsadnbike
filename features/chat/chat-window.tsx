"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Phone, Video, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useChat } from "@/hooks/use-chat";
import { MessageBubble, TypingIndicator, DateDivider } from "./message-bubble";
import { imageUrl } from "@/lib/utils";
import type { Conversation } from "@/types";

function shouldShowDateDivider(prev: string | undefined, curr: string): boolean {
  if (!prev) return true;
  return new Date(prev).toDateString() !== new Date(curr).toDateString();
}

interface ChatWindowProps {
  conversation: Conversation;
  onBack?: () => void;
}

export function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const { messages, isTyping, sendMessage, sendTyping, currentUserId } = useChat(conversation.id);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  const handleSend = useCallback(async () => {
    const content = draft.trim();
    if (!content) return;
    setDraft("");
    sendTyping(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await sendMessage(content);
  }, [draft, sendMessage, sendTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    sendTyping(e.target.value.length > 0);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const other = conversation.other_user;
  const initials = other.full_name.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-white shrink-0 shadow-sm">
        {onBack && (
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-xl hover:bg-slate-100 -ml-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-sm">
          <span className="font-bold text-sm text-white">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-slate-900 truncate">{other.full_name}</p>
          <p className="text-xs text-blue-600 truncate font-medium">{conversation.listing_title}</p>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <Phone className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <Video className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Vehicle preview banner */}
      <div className="shrink-0 bg-blue-50 border-b border-blue-100 px-4 py-2.5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 overflow-hidden">
          {conversation.listing_image ? (
            <img src={imageUrl(conversation.listing_image)} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-blue-400 text-xs font-bold">🚗</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-blue-500 font-semibold uppercase tracking-wider">Chatting about</p>
          <p className="text-sm font-bold text-blue-900 truncate">{conversation.listing_title}</p>
        </div>
        <Link href={`/main/listings/${conversation.listing_id}`} className="text-xs text-blue-600 hover:text-blue-800 font-semibold shrink-0">
          View →
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
              <MessageCircle className="h-7 w-7 text-slate-300" />
            </div>
            <p className="text-slate-600 text-sm font-semibold mb-1">No messages yet</p>
            <p className="text-slate-400 text-xs">
              Start the conversation about {conversation.listing_title}
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const prev = messages[i - 1];
          const showDivider = shouldShowDateDivider(prev?.created_at, msg.created_at);
          const isMine = msg.sender_id === currentUserId;
          return (
            <div key={msg.id}>
              {showDivider && <DateDivider date={msg.created_at} />}
              <MessageBubble message={msg} isMine={isMine} />
            </div>
          );
        })}

        <AnimatePresence>
          {isTyping && (
            <motion.div key="typing">
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3.5">
        {/* Quick replies */}
        {messages.length === 0 && (
          <div className="shrink-0 pb-2 flex gap-2 flex-wrap">
            {["Is this still available?", "What's your best price?", "Can I test drive?"].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => { setDraft(q); textareaRef.current?.focus(); }}
                className="text-xs bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-600 px-3 py-1.5 rounded-full transition-colors font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2.5">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all leading-relaxed max-h-[120px] overflow-y-auto"
          />
          <motion.button
            onClick={handleSend}
            disabled={!draft.trim()}
            whileTap={{ scale: 0.90 }}
            className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white shadow-[0_2px_8px_rgba(37,99,235,0.35)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.4)]"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
        <p className="text-[10px] text-slate-300 mt-2 text-center font-medium">
          Messages are end-to-end encrypted · Press Enter to send
        </p>
      </div>
    </div>
  );
}
