"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Search } from "lucide-react";
import { chatService } from "@/services/chat.service";
import { useChatStore } from "@/store/chat.store";
import { ChatList } from "@/features/chat/chat-list";
import { ChatWindow } from "@/features/chat/chat-window";
import type { Conversation } from "@/types";

function ChatPageInner() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");
  const { conversations, setConversations, setActiveConversation } = useChatStore();
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);

  const { isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const data = await chatService.getConversations();
      setConversations(data);
      return data;
    },
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (initialId && conversations.length > 0) {
      const found = conversations.find((c) => c.id === initialId);
      if (found) {
        setSelectedConv(found);
        setActiveConversation(found.id);
      }
    }
  }, [initialId, conversations, setActiveConversation]);

  const handleSelect = (conv: Conversation) => {
    setSelectedConv(conv);
    setActiveConversation(conv.id);
  };

  const handleBack = () => {
    setSelectedConv(null);
    setActiveConversation(null);
  };

  const unreadTotal = conversations.reduce((acc, c) => acc + c.unread_count, 0);

  return (
    <div className="flex h-[calc(100dvh-7.5rem)] rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-lg">
      {/* Sidebar */}
      <div className={`flex-shrink-0 w-full sm:w-72 md:w-80 border-r border-slate-200 flex flex-col bg-white ${
        selectedConv ? "hidden sm:flex" : "flex"
      }`}>
        {/* Sidebar header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-[15px]">Messages</span>
          {unreadTotal > 0 && (
            <span className="ml-auto px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold leading-none px-2.5 py-1">
              {unreadTotal}
            </span>
          )}
        </div>

        {/* Search conversations */}
        <div className="px-3 py-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="text-[13px] text-slate-400">Search messages…</span>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-2 animate-pulse">
                  <div className="skeleton w-11 h-11 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2.5 py-1">
                    <div className="skeleton h-3 w-3/4 rounded-lg" />
                    <div className="skeleton h-3 w-1/2 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ChatList
              conversations={conversations}
              activeId={selectedConv?.id}
              onSelect={handleSelect}
            />
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 min-w-0 ${!selectedConv ? "hidden sm:flex" : "flex"} flex-col`}>
        {selectedConv ? (
          <ChatWindow conversation={selectedConv} onBack={handleBack} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-10">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center mb-6 shadow-sm">
              <MessageCircle className="h-11 w-11 text-blue-400" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Your messages</h3>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Select a conversation to start chatting, or contact a seller from any listing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatPageInner />
    </Suspense>
  );
}
