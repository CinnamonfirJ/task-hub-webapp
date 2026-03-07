"use client";

import { useState } from "react";
import {
  Download,
  MessageSquare,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMessageStats, useConversations } from "@/hooks/useAdmin";
import type { ConversationListItem } from "@/types/admin";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pathname = usePathname();

  const statusParam =
    activeFilter === "All"
      ? undefined
      : activeFilter === "Unread"
        ? "open"
        : activeFilter === "Flagged"
          ? "flagged"
          : "resolved";

  // admin.ts getMessageStats does: return response.data ?? response
  // So useMessageStats().data === MessageStats = { totalConversations, totalMessages, totalUnread }
  // There is NO extra .data layer in the component
  const { data: msgStats } = useMessageStats();

  // admin.ts getConversations does: return response.data ?? response
  // Return type is ConversationListResponse (single object, NOT an array)
  // So useConversations().data === { conversations, totalPages, currentPage, ... }
  // Fields are top-level — NOT nested under .data or .pagination
  const { data: convData, isLoading } = useConversations({
    page,
    limit: 30,
    status: statusParam,
    unread: activeFilter === "Unread" ? true : undefined,
  });

  const conversations = convData?.conversations ?? [];

  const pagination =
    convData?.totalPages != null
      ? {
          currentPage: convData.currentPage ?? page,
          totalPages: convData.totalPages,
          hasNext: (convData.currentPage ?? page) < convData.totalPages,
          hasPrev: (convData.currentPage ?? page) > 1,
        }
      : null;

  const messageMetrics = [
    {
      label: "Total Conversations",
      value:
        msgStats?.totalConversations != null
          ? String(msgStats.totalConversations)
          : "—",
    },
    {
      label: "Unread Messages",
      value: msgStats?.totalUnread != null ? String(msgStats.totalUnread) : "—",
    },
    {
      label: "Total Messages",
      value:
        msgStats?.totalMessages != null ? String(msgStats.totalMessages) : "—",
    },
  ];

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const getParticipants = (conv: ConversationListItem) => {
    const userName = conv.user?.fullName ?? "Unknown User";
    const tasker = conv.tasker;
    if (!tasker) return userName;
    return `${userName} ↔ ${tasker.firstName} ${tasker.lastName}`.trim();
  };

  // unread = { user: number, tasker: number } — sum for badge
  const getUnreadCount = (conv: ConversationListItem) =>
    (conv.unread?.user ?? 0) + (conv.unread?.tasker ?? 0);

  // No lastActivity field — derive from lastMessageAt ?? updatedAt
  const getLastActivity = (conv: ConversationListItem) => {
    const ts = conv.lastMessageAt ?? conv.updatedAt;
    return ts ? new Date(ts).toLocaleString() : "—";
  };

  return (
    <div className='space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto'>
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Messages & Conversations
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Monitor user conversations and support tickets
          </p>
        </div>
        <Button
          variant='outline'
          className='text-sm h-10 px-4 gap-2 border-gray-200 self-start md:self-auto'
        >
          <Download size={16} /> Export
        </Button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {messageMetrics.map((metric, idx) => (
          <Card
            key={idx}
            className='border border-gray-100 shadow-sm rounded-2xl'
          >
            <CardContent className='p-6'>
              <div className='text-sm text-gray-500 font-medium mb-2'>
                {metric.label}
              </div>
              <div className='text-2xl md:text-3xl font-bold text-gray-900'>
                {metric.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className='flex items-center gap-2 overflow-x-auto pb-2 md:pb-0'>
        {["All", "Unread", "Flagged", "Resolved"].map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className='flex flex-col md:flex-row gap-6 h-[800px]'>
        {/* Sidebar */}
        <Card className='w-full md:w-[350px] lg:w-[400px] border border-gray-100 shadow-sm rounded-2xl flex flex-col h-full bg-white shrink-0'>
          <div className='flex-1 overflow-y-auto p-4 space-y-3 relative'>
            {isLoading && (
              <div className='absolute inset-0 flex items-center justify-center bg-white/50'>
                <Loader2 className='h-6 w-6 animate-spin text-[#6B46C1]' />
              </div>
            )}

            {conversations.map((conv) => {
              const isActive = pathname === `/admin/messages/${conv._id}`;
              const unreadCount = getUnreadCount(conv);

              return (
                <Link key={conv._id} href={`/admin/messages/${conv._id}`}>
                  <div
                    className={`p-4 rounded-xl border transition-colors ${
                      isActive
                        ? "border-[#6B46C1] bg-purple-50/30"
                        : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <div className='font-bold text-sm text-gray-900 leading-tight'>
                        {conv.task?.title ?? getParticipants(conv)}
                      </div>
                      {unreadCount > 0 && (
                        <div className='w-5 h-5 rounded-full bg-[#6B46C1] text-white flex items-center justify-center text-[10px] font-bold shrink-0'>
                          {unreadCount}
                        </div>
                      )}
                    </div>

                    {/* Show participants as subtitle when task title is the heading */}
                    {conv.task?.title && (
                      <p className='text-[10px] text-gray-400 mt-0.5'>
                        {getParticipants(conv)}
                      </p>
                    )}

                    <div className='flex items-center gap-2 mt-1'>
                      {conv.status === "flagged" && (
                        <AlertCircle
                          size={12}
                          className='text-red-400 shrink-0'
                        />
                      )}
                      <span
                        className={`text-[10px] font-bold capitalize ${
                          conv.status === "flagged"
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        {conv.status}
                      </span>
                      {conv.task?.status && (
                        <span className='text-[10px] text-gray-300'>
                          · Task: {conv.task.status}
                        </span>
                      )}
                    </div>

                    {/* lastMessage is a plain string */}
                    {conv.lastMessage && (
                      <p className='text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed'>
                        {conv.lastMessage}
                      </p>
                    )}

                    <div className='text-[10px] text-gray-400 font-medium mt-2'>
                      {getLastActivity(conv)}
                    </div>
                  </div>
                </Link>
              );
            })}

            {!isLoading && conversations.length === 0 && (
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <MessageSquare size={32} className='text-gray-300 mb-3' />
                <p className='text-sm text-gray-400 font-medium'>
                  No conversations found
                </p>
              </div>
            )}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className='p-3 border-t border-gray-100 flex items-center justify-between'>
              <span className='text-[10px] text-gray-400'>
                {pagination.currentPage}/{pagination.totalPages}
              </span>
              <div className='flex gap-1'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrev}
                  className='h-7 w-7 p-0'
                >
                  <ChevronLeft size={14} />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNext}
                  className='h-7 w-7 p-0'
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Right Content */}
        <div className='flex-1 min-w-0 h-full'>
          <Card className='h-full border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white'>
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
}
