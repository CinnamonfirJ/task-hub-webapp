"use client";

import { useState, useRef, useEffect, use } from "react";
import { Loader2, Send, XCircle, User, Shield, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConversationDetails, useSendAdminMessage } from "@/hooks/useAdmin";
import type { ConversationMessage } from "@/types/admin";

export default function MessageDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // admin.ts getConversationDetails:
  //   return response.data ?? response
  //   typed as Promise<ConversationDetailResponse["data"]>
  //
  // So useConversationDetails().data === { details, messages }
  //   - "details" holds the conversation object  (NOT "conversation")
  //   - "messages" holds the message array
  //   - there is NO "metadata" field in the real response
  const { data: detailData, isLoading, isError } = useConversationDetails(id);

  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutate: sendMessage, isPending: isSending } = useSendAdminMessage();

  // ↓ "details" not "conversation" — matches real API response
  const conversation = detailData?.details;
  const messages: ConversationMessage[] = detailData?.messages ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Loader2 className='h-10 w-10 animate-spin text-[#6B46C1]' />
      </div>
    );
  }

  if (isError || !conversation) {
    return (
      <div className='flex h-full flex-col items-center justify-center gap-3'>
        <XCircle className='h-10 w-10 text-red-500' />
        <p className='text-sm font-bold text-gray-900'>
          Conversation not found
        </p>
        <p className='text-xs text-gray-400'>
          It may have been deleted or you may not have access.
        </p>
      </div>
    );
  }

  const handleSend = () => {
    if (!messageText.trim()) return;
    sendMessage(
      { conversationId: id, text: messageText },
      { onSuccess: () => setMessageText("") },
    );
  };

  const participantLabel = () => {
    const userName = conversation.user?.fullName ?? "Unknown User";
    const tasker = conversation.tasker;
    if (!tasker) return userName;
    return `${userName} ↔ ${tasker.firstName} ${tasker.lastName}`.trim();
  };

  const headerTitle =
    conversation.task?.title ?? conversation.subject ?? participantLabel();

  const statusColor: Record<string, string> = {
    flagged: "bg-red-50 text-red-500",
    active: "bg-green-50 text-green-600",
    open: "bg-green-50 text-green-600",
    resolved: "bg-gray-50 text-gray-500",
  };

  // Derive sender display name from the real message shape:
  // senderType + senderUser (fullName) or senderTasker (firstName + lastName)
  const getSenderName = (msg: ConversationMessage): string => {
    if (msg.senderType === "user" && msg.senderUser) {
      return msg.senderUser.fullName;
    }
    if (msg.senderType === "tasker" && msg.senderTasker) {
      return `${msg.senderTasker.firstName} ${msg.senderTasker.lastName}`.trim();
    }
    if (msg.senderType === "admin") return "Admin";
    if (msg.senderType === "system") return "System";
    return msg.senderType;
  };

  const getSenderAvatar = (msg: ConversationMessage): string | undefined => {
    if (msg.senderType === "user") return msg.senderUser?.profilePicture;
    if (msg.senderType === "tasker") return msg.senderTasker?.profilePicture;
    return undefined;
  };

  const SenderIcon = ({ type }: { type: string }) => {
    if (type === "admin")
      return <Shield size={14} className='text-purple-500' />;
    if (type === "system") return <Bot size={14} className='text-blue-400' />;
    return <User size={14} className='text-gray-400' />;
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div className='p-6 border-b border-gray-100 shrink-0'>
        <h2 className='text-lg font-bold text-gray-900 truncate'>
          {headerTitle}
        </h2>
        <p className='text-sm text-gray-500 mt-0.5'>{participantLabel()}</p>

        <div className='flex flex-wrap items-center gap-3 mt-2'>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              statusColor[conversation.status] ?? "bg-gray-50 text-gray-500"
            }`}
          >
            {conversation.status}
          </span>

          {conversation.task?.status && (
            <span className='text-[10px] font-medium text-gray-400'>
              Task: {conversation.task.status}
            </span>
          )}

          <span className='text-[10px] text-gray-400'>
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </span>

          {/* Per-role unread counts */}
          {(conversation.unread?.user ?? 0) > 0 && (
            <span className='text-[10px] text-orange-400 font-medium'>
              {conversation.unread.user} unread (user)
            </span>
          )}
          {(conversation.unread?.tasker ?? 0) > 0 && (
            <span className='text-[10px] text-orange-400 font-medium'>
              {conversation.unread.tasker} unread (tasker)
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30'>
        {messages.length === 0 && (
          <div className='flex items-center justify-center py-12'>
            <p className='text-sm text-gray-400'>No messages yet.</p>
          </div>
        )}

        {messages.map((message) => {
          const senderType = message.senderType ?? "user";
          const isAdmin = senderType === "admin";
          const isSystem = senderType === "system";
          const isTasker = senderType === "tasker";
          // Admin messages aligned right; user/tasker aligned left
          const isRight = isAdmin || isSystem;
          const avatar = getSenderAvatar(message);
          const senderName = getSenderName(message);

          return (
            <div
              key={message._id}
              className={`flex flex-col ${isRight ? "items-end" : "items-start"}`}
            >
              {/* Sender label */}
              <div className='flex items-center gap-1.5 mb-1 px-1'>
                {avatar ? (
                  <img
                    src={avatar}
                    alt={senderName}
                    className='w-4 h-4 rounded-full object-cover'
                  />
                ) : (
                  <SenderIcon type={senderType} />
                )}
                <span className='text-[10px] text-gray-500 font-medium'>
                  {senderName}
                </span>
                {isTasker && (
                  <span className='text-[9px] text-purple-400 font-semibold uppercase'>
                    Tasker
                  </span>
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[80%] md:max-w-[65%] rounded-2xl px-4 py-3 ${
                  isAdmin
                    ? "bg-[#6B46C1] text-white rounded-tr-sm"
                    : isSystem
                      ? "bg-blue-100 text-blue-900 rounded-tr-sm"
                      : isTasker
                        ? "bg-purple-50 text-gray-900 rounded-tl-sm"
                        : "bg-white border border-gray-100 text-gray-900 rounded-tl-sm"
                }`}
              >
                <p className='text-sm leading-relaxed'>{message.text}</p>
                {/* createdAt is the timestamp field — there is no "timestamp" field */}
                <div
                  className={`text-[10px] mt-1.5 font-medium ${
                    isAdmin
                      ? "text-purple-200"
                      : isSystem
                        ? "text-blue-400"
                        : "text-gray-400"
                  }`}
                >
                  {message.createdAt
                    ? new Date(message.createdAt).toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply box */}
      <div className='p-4 border-t border-gray-100 shrink-0 bg-white'>
        <div className='flex items-center gap-3'>
          <Input
            placeholder='Type an admin response...'
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className='flex-1 h-11 rounded-xl'
          />
          <Button
            onClick={handleSend}
            disabled={isSending || !messageText.trim()}
            className='bg-[#6B46C1] hover:bg-[#553098] text-white h-11 px-5 rounded-xl gap-2 font-semibold'
          >
            {isSending ? (
              <Loader2 size={16} className='animate-spin' />
            ) : (
              <Send size={16} />
            )}
            Send
          </Button>
        </div>
        <p className='text-[10px] text-gray-400 mt-2 italic'>
          Messages sent here appear as admin responses in the conversation.
        </p>
      </div>
    </div>
  );
}
