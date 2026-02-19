import { apiData } from "@/lib/api";
import {
  Conversation,
  ConversationsResponse,
  Message,
  MessagesResponse,
  CreateConversationInput,
  SendMessageInput,
} from "@/types/chat";

export const chatApi = {
  // Create or get a conversation
  createConversation: async (
    data: CreateConversationInput,
  ): Promise<Conversation> => {
    const res = await apiData<any>("/api/chat/conversations", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res?.conversation || res?.data?.conversation || res?.data || res;
  },

  // List my conversations
  getMyConversations: async (
    page = 1,
    limit = 20,
  ): Promise<ConversationsResponse> => {
    const res = await apiData<any>(
      `/api/chat/conversations?page=${page}&limit=${limit}`,
      {
        method: "GET",
      },
    );
    if (process.env.NODE_ENV === "development") {
      console.log("[chatApi] getMyConversations response:", res);
    }
    return {
      status: res?.status || res?.data?.status || "success",
      conversations:
        res?.conversations ||
        res?.data?.conversations ||
        res?.data ||
        (Array.isArray(res) ? res : []),
      totalPages: res?.totalPages || res?.data?.totalPages || 1,
      currentPage: res?.currentPage || res?.data?.currentPage || 1,
      count:
        res?.count || res?.data?.count || (Array.isArray(res) ? res.length : 0),
    };
  },

  // Get a single conversation
  getConversation: async (id: string): Promise<Conversation> => {
    const res = await apiData<any>(`/api/chat/conversations/${id}`, {
      method: "GET",
    });
    if (process.env.NODE_ENV === "development") {
      console.log(`[chatApi] getConversation(${id}) response:`, res);
    }
    return res?.conversation || res?.data?.conversation || res?.data || res;
  },

  // Get messages for a conversation
  getMessages: async (
    conversationId: string,
    limit = 20,
    before?: string,
  ): Promise<MessagesResponse> => {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    if (before) params.append("before", before);

    const res = await apiData<any>(
      `/api/chat/conversations/${conversationId}/messages?${params.toString()}`,
      {
        method: "GET",
      },
    );

    return {
      status: res?.status || res?.data?.status || "success",
      messages:
        res?.messages ||
        res?.data?.messages ||
        res?.data ||
        (Array.isArray(res) ? res : []),
      hasMore: res?.hasMore ?? res?.data?.hasMore ?? false,
    };
  },

  // Send a message
  sendMessage: async (
    conversationId: string,
    data: SendMessageInput,
  ): Promise<Message> => {
    const res = await apiData<any>(
      `/api/chat/conversations/${conversationId}/messages`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    return res?.message || res?.data?.message || res?.data || res;
  },

  // Mark messages as read
  markAsRead: async (conversationId: string): Promise<void> => {
    await apiData<any>(`/api/chat/conversations/${conversationId}/read`, {
      method: "POST",
    });
  },
};
