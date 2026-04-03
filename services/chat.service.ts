import { api } from "@/lib/api";
import type { Conversation, ChatMessage } from "@/types";

export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    const res = await api.get<Conversation[]>("/chat/conversations");
    return res.data;
  },

  async getOrCreateConversation(listingId: string): Promise<Conversation> {
    const res = await api.post<Conversation>("/chat/conversations", { listing_id: listingId });
    return res.data;
  },

  async getMessages(conversationId: string, page = 1): Promise<{ items: ChatMessage[]; total: number }> {
    const res = await api.get(`/chat/conversations/${conversationId}/messages`, {
      params: { page, size: 50 },
    });
    return res.data;
  },

  async sendMessage(conversationId: string, content: string): Promise<ChatMessage> {
    const res = await api.post<ChatMessage>(`/chat/conversations/${conversationId}/messages`, { content });
    return res.data;
  },

  async markRead(conversationId: string): Promise<void> {
    await api.put(`/chat/conversations/${conversationId}/read`);
  },
};
