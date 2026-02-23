"use client";

import { AlertTriangle } from "lucide-react";

const messages = [
  {
    id: 1,
    senderEmail: "fatima.h@example.com",
    content:
      "Hi! I saw your task posting for interior decoration. I have 5 years of experience in this field.",
    timestamp: "1/15/2026, 7:00:58 AM",
    isCurrentUser: true, // For layout purposes, assume right-side is one user
  },
  {
    id: 2,
    senderEmail: "adebayo.j@example.com",
    content: "Hi, are you available to fix my kitchen sink this week?",
    timestamp: "1/15/2026, 7:00:58 AM",
    isCurrentUser: false,
  },
];

export default function MessageDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className='flex flex-col h-full'>
      <div className='p-6 border-b border-gray-100 shrink-0'>
        <h2 className='text-lg font-bold text-gray-900'>Conversation</h2>
        <p className='text-sm text-gray-500 mt-1'>
          fatima.h@example.com ↔ adebayo.j@example.com
        </p>
      </div>

      <div className='flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.isCurrentUser ? "items-end" : "items-start"
            }`}
          >
            <div className='text-[10px] text-gray-500 mb-1.5 px-1'>
              {message.senderEmail}
            </div>
            <div
              className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-4 ${
                message.isCurrentUser
                  ? "bg-[#6B46C1] text-white rounded-tr-sm"
                  : "bg-gray-100 text-gray-900 rounded-tl-sm"
              }`}
            >
              <p className='text-sm leading-relaxed'>{message.content}</p>
              <div
                className={`text-[10px] mt-2 font-medium ${
                  message.isCurrentUser ? "text-purple-200" : "text-gray-500"
                }`}
              >
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='p-6 border-t border-gray-100 shrink-0 bg-white'>
        <div className='flex items-center gap-2 p-3 bg-yellow-50/50 rounded-xl text-yellow-600 border border-yellow-100'>
          <AlertTriangle size={18} className='shrink-0' />
          <p className='text-sm italic font-medium'>
            This is a read-only view. Admins cannot send messages in this
            interface.
          </p>
        </div>
      </div>
    </div>
  );
}
