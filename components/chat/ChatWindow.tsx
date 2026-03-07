import { useRef, useEffect } from "react";
import { Conversation, Message } from "@/types/chat";
import { User } from "@/types/auth";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { ArrowLeft, MoreVertical, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  currentUser: User | null;
  onSend: (text: string) => void;
  onBack?: () => void;
  isLoadingMessages?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function ChatWindow({
  conversation,
  messages,
  currentUser,
  onSend,
  onBack,
  isLoadingMessages,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Partner detection logic
  const currentUserId = String(currentUser?._id || currentUser?.id || "");
  const convUserId = String(
    typeof conversation.user === "object"
      ? conversation.user?._id || conversation.user?.id
      : conversation.user || "",
  );

  const partner =
    currentUserId === convUserId ? conversation.tasker : conversation.user;
  const partnerObj = typeof partner === "object" ? partner : null;

  const getPartnerName = (p: any) => {
    if (!p) return "User";
    if (typeof p === "string") return "User";

    const name =
      p.fullName ||
      p.name ||
      (p.firstName ? `${p.firstName} ${p.lastName || ""}`.trim() : null);
    if (name) return name;

    if (p.emailAddress || p.email) {
      return (p.emailAddress || p.email).split("@")[0] || "User";
    }
    return "User";
  };

  const partnerName = getPartnerName(partner);
  const partnerInitial = partnerName[0]?.toUpperCase() || "U";
  const task = typeof conversation.task === "object" ? conversation.task : null;

  return (
    <div className='flex flex-col h-full bg-white md:rounded-2xl border-x-0 md:border-x border-y-0 md:border-y border-gray-100 shadow-sm'>
      {/* Header */}
      <div className='flex items-center justify-between p-3 md:p-4 border-b border-gray-100'>
        <div className='flex items-center gap-3'>
          {onBack && (
            <Button
              variant='ghost'
              size='icon'
              onClick={onBack}
              className='md:hidden h-10 w-10 rounded-full hover:bg-gray-100'
            >
              <ArrowLeft size={20} />
            </Button>
          )}

          <div className='relative'>
            {partnerObj?.profilePicture ? (
              <img
                src={partnerObj.profilePicture}
                alt={partnerName}
                className='h-10 w-10 rounded-full object-cover'
              />
            ) : (
              <div className='h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-[#6B46C1] font-bold'>
                {partnerInitial}
              </div>
            )}
            <div className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white' />
          </div>

          <div className='min-w-0'>
            <h3 className='font-bold text-gray-900 text-sm truncate uppercase tracking-tight'>
              {partnerObj?.role === "tasker"
                ? `TASKER: ${partnerName}`
                : `CLIENT: ${partnerName}`}
            </h3>
            {task && (
              <div className='flex items-center gap-1.5'>
                <p className='text-[10px] font-bold text-[#6B46C1] truncate uppercase'>
                  {task.title}
                </p>
                <div className='h-1 w-1 bg-gray-300 rounded-full' />
                <span className='px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-[8px] font-black uppercase flex items-center gap-0.5'>
                  <ShieldCheck size={8} /> Secure Chat
                </span>
              </div>
            )}
          </div>
        </div>

        <Button
          variant='ghost'
          size='icon'
          className='h-10 w-10 rounded-full text-gray-400'
        >
          <MoreVertical size={20} />
        </Button>
      </div>

      {/* Messages */}
      <div
        className='flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50 space-y-1'
        onScroll={(e) => {
          const target = e.currentTarget;
          if (target.scrollTop === 0 && hasMore && !isLoadingMore) {
            onLoadMore?.();
          }
        }}
      >
        {isLoadingMessages ? (
          <div className='h-full flex items-center justify-center'>
            <div className='animate-pulse text-purple-400 text-xs font-bold uppercase tracking-widest'>
              Loading history...
            </div>
          </div>
        ) : (
          <>
            {hasMore && (
              <div className='flex justify-center p-4'>
                {isLoadingMore ? (
                  <div className='animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full' />
                ) : (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={onLoadMore}
                    className='text-[10px] uppercase tracking-widest font-bold text-purple-400'
                  >
                    Load older messages
                  </Button>
                )}
              </div>
            )}
            {messages.length === 0 ? (
              <div className='h-full flex flex-col items-center justify-center p-8 text-center space-y-4'>
                <div className='p-4 bg-purple-50 rounded-full'>
                  <ShieldCheck className='h-8 w-8 text-[#6B46C1]' />
                </div>
                <div>
                  <h4 className='font-bold text-gray-900 text-sm'>
                    Encryption Active
                  </h4>
                  <p className='text-xs text-gray-500 max-w-[200px] mt-1'>
                    This conversation is private and secured by TaskHub.
                  </p>
                </div>
              </div>
            ) : (
              [...messages]
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime(),
                )
                .map((msg) => (
                  <MessageBubble
                    key={msg._id}
                    message={msg}
                    currentUser={currentUser}
                  />
                ))
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <MessageInput onSend={onSend} />
    </div>
  );
}
