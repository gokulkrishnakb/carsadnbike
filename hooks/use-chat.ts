"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";
import { ReconnectingWebSocket } from "@/lib/websocket";
import { authClient } from "@/lib/auth-client";
import { chatService } from "@/services/chat.service";
import type { ChatMessage } from "@/types";

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/api/v1";

export function useChat(conversationId?: string) {
  const { user } = useAuthStore();
  const {
    messages,
    typingUsers,
    addMessage,
    setMessages,
    updateMessageStatus,
    setTyping,
    clearUnread,
  } = useChatStore();

  const wsRef = useRef<ReconnectingWebSocket | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load messages when conversation opens
  useEffect(() => {
    if (!conversationId) return;
    chatService.getMessages(conversationId).then(({ items }) => {
      setMessages(conversationId, items);
      clearUnread(conversationId);
    });
  }, [conversationId, setMessages, clearUnread]);

  // WebSocket for chat
  useEffect(() => {
    if (!conversationId || !user) return;

    let ws: ReconnectingWebSocket | null = null;

    (async () => {
      const tokenRes = await authClient.token();
      const token = tokenRes.data?.token ?? "";
      ws = new ReconnectingWebSocket(
        `${WS_BASE}/chat/ws/${conversationId}?token=${token}`
      );
      wsRef.current = ws;

      ws.on((event) => {
        if (event.type === "message") {
          const msg = event.data as ChatMessage;
          addMessage(conversationId, msg);
          if (msg.sender_id !== user.id) {
            ws!.send({ type: "read", message_id: msg.id });
          }
        } else if (event.type === "typing") {
          const { user_id, is_typing } = event.data as { user_id: string; is_typing: boolean };
          if (user_id !== user.id) {
            setTyping(conversationId, is_typing);
          }
        } else if (event.type === "status") {
          const { message_id, status } = event.data as { message_id: string; status: ChatMessage["status"] };
          updateMessageStatus(conversationId, message_id, status);
        }
      });

      ws.connect();
    })();

    return () => {
      ws?.disconnect();
      wsRef.current = null;
    };
  }, [conversationId, user, addMessage, setTyping, updateMessageStatus]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !user) return;
      const tempMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        status: "sending",
        created_at: new Date().toISOString(),
      };
      addMessage(conversationId, tempMsg);
      try {
        const saved = await chatService.sendMessage(conversationId, content);
        updateMessageStatus(conversationId, tempMsg.id, "sent");
        useChatStore.setState((s) => ({
          messages: {
            ...s.messages,
            [conversationId]: s.messages[conversationId].map((m) =>
              m.id === tempMsg.id ? saved : m
            ),
          },
        }));
      } catch {
        updateMessageStatus(conversationId, tempMsg.id, "sent");
      }
    },
    [conversationId, user, addMessage, updateMessageStatus]
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      wsRef.current?.send({ type: "typing", is_typing: isTyping });
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (isTyping) {
        typingTimerRef.current = setTimeout(() => {
          wsRef.current?.send({ type: "typing", is_typing: false });
        }, 3000);
      }
    },
    []
  );

  return {
    messages: conversationId ? (messages[conversationId] ?? []) : [],
    isTyping: conversationId ? (typingUsers[conversationId] ?? false) : false,
    sendMessage,
    sendTyping,
    currentUserId: user?.id,
  };
}
