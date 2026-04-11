"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import {
  useInfiniteMessages,
  useSendMessage,
  useMarkAsRead,
  useConversation,
} from "@/hooks/useChat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Suspense, useEffect } from "react";
import Loading from "../loading";
import { Button } from "@/components/ui/button";
import { containsRestrictedContent } from "@/lib/utils/contentFilter";
import { toast } from "sonner";

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  if (process.env.NODE_ENV === "development") {
    console.log("[ChatPage] Target Conversation ID:", id);
  }

  const {
    data: conversation,
    isLoading: isLoadingConv,
    isError,
    error,
  } = useConversation(id);
  const {
    data: msgData,
    isLoading: isLoadingMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMessages(id);

  // Flatten messages from all pages and reverse them if they are returned in reverse order,
  // but usually we want them chronological for the window.
  // The API returns most recent first (before=timestamp), so we reverse the concatenated list.
  const allMessages =
    msgData?.pages.flatMap((page) => page.messages).reverse() || [];

  const { mutate: sendMessage } = useSendMessage();
  const { mutate: markRead } = useMarkAsRead();

  // Mark as read when entering OR when new messages arrive
  useEffect(() => {
    if (id && allMessages.length > 0) {
      const lastMsg = allMessages[allMessages.length - 1];
      // Only mark if the last message is NOT mine and we are in the chat
      if (lastMsg.senderType !== user?.role) {
        markRead(id);
      }
    }
  }, [id, allMessages.length, markRead, user?.role]);

  const handleSendMessage = (data: string | FormData) => {
    let textToFilter = "";
    if (typeof data === "string") {
      textToFilter = data;
    } else {
      textToFilter = (data.get("text") as string) || "";
    }

    if (textToFilter) {
      const filterResult = containsRestrictedContent(textToFilter);
      if (filterResult.restricted) {
        toast.error(
          filterResult.reason || "Message contains restricted content.",
        );
        return;
      }
    }

    sendMessage({
      conversationId: id,
      data: typeof data === "string" ? { text: data } : data,
    });
  };

  if (isLoadingConv) return <Loading />;

  if (isError || !conversation) {
    const errorObj = error as any;
    const isForbidden =
      errorObj?.status === 403 ||
      errorObj?.message?.toLowerCase().includes("forbidden");
    const isNotFound =
      errorObj?.status === 404 ||
      errorObj?.message?.toLowerCase().includes("not found");

    if (process.env.NODE_ENV === "development") {
      console.error("[ChatPage] Error details:", {
        id,
        errorObj,
        isForbidden,
        isNotFound,
      });
    }

    return (
      <div className='h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50/30'>
        <div className='max-w-md w-full bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm text-center space-y-6'>
          <div className='w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500'>
            {isForbidden ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='32'
                height='32'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect width='18' height='11' x='3' y='11' rx='2' ry='2' />
                <path d='M7 11V7a5 5 0 0 1 10 0v4' />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='32'
                height='32'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='12' cy='12' r='10' />
                <line x1='12' y1='8' x2='12' y2='12' />
                <line x1='12' y1='16' x2='12.01' y2='16' />
              </svg>
            )}
          </div>

          <div className='space-y-2'>
            <h2 className='text-2xl font-bold text-gray-900'>
              {isForbidden
                ? "Access Denied"
                : isNotFound
                  ? "Conversation Not Found"
                  : "Oops! Something went wrong"}
            </h2>
            <p className='text-gray-500 text-sm leading-relaxed'>
              {isForbidden
                ? "You don't have permission to view this conversation. It might belong to another account or the link is invalid."
                : isNotFound
                  ? "The conversation you're looking for doesn't exist or has been removed."
                  : errorObj?.message ||
                    "There was an error loading the chat. Please try again later."}
            </p>
          </div>

          <div className='pt-2 flex flex-col gap-3'>
            <Button
              onClick={() => router.push("/messages")}
              className='bg-[#6B46C1] hover:bg-[#553C9A] rounded-xl font-bold py-6'
            >
              Back to All Messages
            </Button>
            <Button
              variant='outline'
              onClick={() => window.location.reload()}
              className='rounded-xl border-gray-200'
            >
              Try Refreshing
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <p className='text-[10px] text-gray-400 font-mono pt-4'>ID: {id}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='h-[calc(100vh-64px)] p-0 md:p-8 bg-gray-50/30'>
      <div className='max-w-4xl mx-auto h-full'>
        <ChatWindow
          conversation={conversation}
          messages={allMessages}
          currentUser={user || null}
          onSend={handleSendMessage}
          onBack={() => router.push("/messages")}
          isLoadingMessages={isLoadingMessages}
          onLoadMore={() => fetchNextPage()}
          hasMore={hasNextPage}
          isLoadingMore={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
