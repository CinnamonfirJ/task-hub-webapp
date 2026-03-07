"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, MessageCircle, MoreHorizontal, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useCreateConversation,
} from "@/hooks/useChat";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Conversation } from "@/types/chat";
import Loading from "./loading";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "read">(
    "all",
  );

  // Fetch conversations
  const { data: convData, isLoading: isLoadingConvs } = useConversations();
  const conversations = convData?.conversations || [];

  const getDisplayName = (u: any) => {
    if (!u) return "User";

    // Check various name fields
    const name =
      u.fullName ||
      u.name ||
      (u.firstName ? `${u.firstName} ${u.lastName || ""}`.trim() : null);
    if (name) return name;

    // Check nested objects (some APIs return user: { ... })
    const nested = u.user || u.tasker || u.data?.user || u.data?.tasker;
    if (nested) {
      const nestedName =
        nested.fullName ||
        nested.name ||
        (nested.firstName
          ? `${nested.firstName} ${nested.lastName || ""}`.trim()
          : null);
      if (nestedName) return nestedName;
    }

    // Fallback to email prefix or generic User
    if (u.emailAddress || u.email) {
      const email = u.emailAddress || u.email;
      return email.split("@")[0] || "User";
    }

    return "User";
  };

  const displayName = getDisplayName(user);

  if (process.env.NODE_ENV === "development") {
    console.log("[MessagesPage] Current User:", user);
  }

  const userInitials =
    displayName !== "User"
      ? displayName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";

  const filteredConversations = conversations
    .filter((conv) => {
      if (activeFilter === "unread") return (conv.unreadCount || 0) > 0;
      if (activeFilter === "read") return (conv.unreadCount || 0) === 0;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.lastMessage?.createdAt || a.updatedAt).getTime();
      const dateB = new Date(b.lastMessage?.createdAt || b.updatedAt).getTime();
      return dateB - dateA;
    });

  const handleSelectConversation = (conv: Conversation) => {
    router.push(`/messages/${conv._id}`);
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className='p-4 md:p-8'>
        <div className='max-w-6xl mx-auto space-y-6 md:space-y-8'>
          {/* User Header */}
          <div className='flex items-center gap-3 md:gap-4'>
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt='Profile'
                className='h-12 w-12 md:h-16 md:w-16 rounded-full object-cover border border-gray-100'
              />
            ) : (
              <div className='h-12 w-12 md:h-16 md:w-16 rounded-full bg-[#6B46C1] flex items-center justify-center text-white text-lg md:text-xl font-bold'>
                {userInitials}
              </div>
            )}
            <div>
              <h2 className='text-sm md:text-lg font-bold text-gray-900 uppercase tracking-tight'>
                {user?.role === "tasker"
                  ? `TASKER: ${displayName}`
                  : `CLIENT: ${displayName}`}
              </h2>
              <p className='text-[8px] md:text-[10px] font-black text-purple-600 uppercase tracking-widest'>
                ACCOUNT VERIFIED
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400' />
            <input
              type='text'
              placeholder='Search messages'
              className='w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base text-gray-900 placeholder-gray-500'
            />
          </div>

          {/* Filter Tabs */}
          <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-none'>
            {(["all", "unread", "read"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-[#6B46C1] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* List Content */}
          <div className='space-y-4'>
            {isLoadingConvs ? (
              <div className='space-y-4'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='h-24 bg-gray-100 animate-pulse rounded-2xl'
                  />
                ))}
              </div>
            ) : filteredConversations.length > 0 ? (
              <ConversationList
                conversations={filteredConversations}
                onSelect={handleSelectConversation}
                currentUser={user || null}
              />
            ) : (
              <div className='flex flex-col items-center justify-center py-16'>
                <div className='bg-purple-100 p-6 rounded-full mb-6'>
                  <MessageCircle className='h-12 w-12 text-[#6B46C1]' />
                </div>
                <h3 className='text-2xl font-semibold text-gray-900 mb-2'>
                  No messages yet
                </h3>
                <p className='text-gray-600 text-center max-w-md mb-6'>
                  Start posting tasks and connecting with taskers to begin
                  conversations.
                </p>
                <Button
                  onClick={() => router.push("/post-task")}
                  className='bg-[#6B46C1] hover:bg-[#553C9A] text-white px-6 py-2 rounded-lg'
                >
                  Post a Task
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
