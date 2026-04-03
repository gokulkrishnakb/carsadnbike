"use client";

import { create } from "zustand";
import type { ChatMessage, Conversation } from "@/types";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, ChatMessage[]>;
  typingUsers: Record<string, boolean>;   // conversationId → isTyping

  setConversations: (c: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  setMessages: (conversationId: string, msgs: ChatMessage[]) => void;
  addMessage: (conversationId: string, msg: ChatMessage) => void;
  updateMessageStatus: (conversationId: string, msgId: string, status: ChatMessage["status"]) => void;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  incrementUnread: (conversationId: string) => void;
  clearUnread: (conversationId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingUsers: {},

  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (id) => set({ activeConversationId: id }),

  setMessages: (cid, msgs) =>
    set((s) => ({ messages: { ...s.messages, [cid]: msgs } })),

  addMessage: (cid, msg) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [cid]: [...(s.messages[cid] ?? []), msg],
      },
    })),

  updateMessageStatus: (cid, msgId, status) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [cid]: (s.messages[cid] ?? []).map((m) =>
          m.id === msgId ? { ...m, status } : m
        ),
      },
    })),

  setTyping: (cid, isTyping) =>
    set((s) => ({ typingUsers: { ...s.typingUsers, [cid]: isTyping } })),

  incrementUnread: (cid) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === cid ? { ...c, unread_count: c.unread_count + 1 } : c
      ),
    })),

  clearUnread: (cid) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === cid ? { ...c, unread_count: 0 } : c
      ),
    })),
}));
