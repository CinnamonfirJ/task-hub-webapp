"use client";

import { useState, useRef, useEffect } from "react";
import {
  AlertTriangle,
  Loader2,
  Send,
  XCircle,
  User,
  Shield,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConversationDetails, useSendAdminMessage } from "@/hooks/useAdmin";

export default function MessageDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: detailData, isLoading, isError } = useConversationDetails(id);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { mutate: sendMessage, isPending: isSending } = useSendAdminMessage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [detailData?.messages]);

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Loader2 className='h-10 w-10 animate-spin text-[#6B46C1]' />
      </div>
    );
  }

  if (isError || !detailData) {
    return (
      <div className='flex h-full flex-col items-center justify-center gap-3'>
        <XCircle className='h-10 w-10 text-red-500' />
        <p className='text-sm font-bold text-gray-900'>
          Conversation not found
        </p>
      </div>
    );
  }

  const { conversation, messages, metadata } = detailData;

  const handleSend = () => {
    if (!messageText.trim()) return;
    sendMessage(
      { conversationId: id, text: messageText },
      { onSuccess: () => setMessageText("") },
    );
  };

  const senderIcon = (type: string) => {
    if (type === "admin")
      return <Shield size={14} className='text-purple-500' />;
    if (type === "system") return <Bot size={14} className='text-blue-400' />;
    return <User size={14} className='text-gray-400' />;
  };

  const participantLabel = () => {
    const userName = conversation.user.fullName;
    const taskerName = conversation.tasker
      ? `${conversation.tasker.firstName} ${conversation.tasker.lastName}`
      : null;
    return taskerName ? `${userName} ↔ ${taskerName}` : userName;
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div className='p-6 border-b border-gray-100 shrink-0'>
        <h2 className='text-lg font-bold text-gray-900'>
          {conversation.subject || "Conversation"}
        </h2>
        <p className='text-sm text-gray-500 mt-1'>{participantLabel()}</p>
        <div className='flex items-center gap-3 mt-2'>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              conversation.status === "flagged"
                ? "bg-red-50 text-red-500"
                : conversation.status === "open"
                  ? "bg-green-50 text-green-500"
                  : "bg-gray-50 text-gray-500"
            }`}
          >
            {conversation.status}
          </span>
          {conversation.category && (
            <span className='text-[10px] font-medium text-gray-400 capitalize'>
              {conversation.category.replace("_", " ")}
            </span>
          )}
          <span className='text-[10px] text-gray-400'>
            {metadata.totalMessages} messages
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30'>
        {messages.map((message) => {
          const isAdmin = message.from.type === "admin";
          const isSystem = message.from.type === "system";
          const isRight = isAdmin || isSystem;

          return (
            <div
              key={message._id}
              className={`flex flex-col ${isRight ? "items-end" : "items-start"}`}
            >
              <div className='flex items-center gap-1.5 mb-1.5 px-1'>
                {senderIcon(message.from.type)}
                <span className='text-[10px] text-gray-500 font-medium'>
                  {message.from.name}
                </span>
              </div>
              <div
                className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-4 ${
                  isAdmin
                    ? "bg-[#6B46C1] text-white rounded-tr-sm"
                    : isSystem
                      ? "bg-blue-100 text-blue-900 rounded-tr-sm"
                      : "bg-gray-100 text-gray-900 rounded-tl-sm"
                }`}
              >
                <p className='text-sm leading-relaxed'>{message.text}</p>
                <div
                  className={`text-[10px] mt-2 font-medium ${
                    isAdmin
                      ? "text-purple-200"
                      : isSystem
                        ? "text-blue-400"
                        : "text-gray-500"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Admin Reply */}
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
          Messages sent here will appear as admin responses in the conversation.
        </p>
      </div>
    </div>
  );
}
