import { User } from "./auth";
import { Task } from "./task";

export type SenderType = "user" | "tasker" | "admin";
export type MessageStatus = "sent" | "delivered" | "read";

export interface Attachment {
  url: string;
  type: "image" | "file" | "video";
  name: string;
  size: number;
}

export interface Message {
  _id: string;
  conversation: string;
  senderType: SenderType;
  senderUser: string | Partial<User>;
  text?: string;
  attachments?: Attachment[];
  status: MessageStatus;
  readBy: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Conversation {
  _id: string;
  task: string | Partial<Task>;
  user: string | Partial<User>;
  tasker: string | Partial<User>;
  lastMessage?: Message;
  unreadCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationsResponse {
  status: string;
  conversations: Conversation[];
  totalPages: number;
  currentPage: number;
  count: number;
}

export interface MessagesResponse {
  status: string;
  messages: Message[];
  hasMore: boolean;
}

export interface CreateConversationInput {
  taskId: string;
  bidId?: string;
  taskerId?: string;
}

export interface SendMessageInput {
  text?: string;
  attachments?: Attachment[];
}
