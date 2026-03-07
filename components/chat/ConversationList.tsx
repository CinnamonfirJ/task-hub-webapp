import { Conversation } from "@/types/chat";
import { User } from "@/types/auth";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (conv: Conversation) => void;
  currentUser: User | null;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  currentUser,
}: ConversationListProps) {
  return (
    <div className='flex flex-col space-y-1 overflow-y-auto h-full'>
      {conversations.length === 0 ? (
        <div className='p-8 text-center'>
          <p className='text-gray-500 text-sm'>No conversations found</p>
        </div>
      ) : (
        conversations.map((conv) => {
          const currentUserId = String(
            currentUser?._id || currentUser?.id || "",
          );
          const convUserId = String(
            typeof conv.user === "object"
              ? conv.user?._id || conv.user?.id
              : conv.user || "",
          );

          // The partner is whichever user is NOT the current user
          const partner =
            currentUserId === convUserId ? conv.tasker : conv.user;
          const partnerObj = typeof partner === "object" ? partner : null;

          const getPartnerName = (p: any) => {
            if (!p) return "User";
            if (typeof p === "string") return "User";

            const name =
              p.fullName ||
              p.name ||
              (p.firstName
                ? `${p.firstName} ${p.lastName || ""}`.trim()
                : null);
            if (name) return name;

            if (p.emailAddress || p.email) {
              return (p.emailAddress || p.email).split("@")[0] || "User";
            }
            return "User";
          };

          const partnerName = getPartnerName(partner);
          const partnerInitial = partnerName[0]?.toUpperCase() || "U";
          const task = typeof conv.task === "object" ? conv.task : null;

          const lastMsg = conv.lastMessage;
          const date = lastMsg?.createdAt
            ? new Date(lastMsg.createdAt)
            : new Date(conv.updatedAt);
          const displayDate = isToday(date)
            ? format(date, "HH:mm")
            : format(date, "MMM d");

          return (
            <button
              key={conv._id}
              onClick={() => onSelect(conv)}
              className={cn(
                "flex items-center gap-3 md:gap-4 p-3 md:p-4 text-left transition-all rounded-xl hover:bg-purple-50 group border border-transparent",
                activeId === conv._id &&
                  "bg-purple-50 border-purple-100 shadow-sm",
              )}
            >
              <div className='relative'>
                {partnerObj?.profilePicture ? (
                  <img
                    src={partnerObj.profilePicture}
                    alt={partnerName}
                    className='h-10 w-10 md:h-12 md:w-12 rounded-full object-cover shrink-0'
                  />
                ) : (
                  <div className='h-10 w-10 md:h-12 md:w-12 rounded-full bg-purple-100 flex items-center justify-center text-[#6B46C1] font-bold shrink-0 text-sm md:text-base'>
                    {partnerInitial}
                  </div>
                )}
                {conv.unreadCount && conv.unreadCount > 0 ? (
                  <div className='absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] md:text-[10px] text-white font-bold animate-pulse'>
                    {conv.unreadCount}
                  </div>
                ) : null}
              </div>

              <div className='flex-1 min-w-0'>
                <div className='flex justify-between items-baseline mb-0.5'>
                  <h4 className='font-bold text-gray-900 truncate text-xs md:text-sm'>
                    {partnerName}
                  </h4>
                  <span className='text-[8px] md:text-[10px] font-semibold text-gray-400 uppercase'>
                    {displayDate}
                  </span>
                </div>
                {task && (
                  <p className='text-[10px] md:text-[11px] font-bold text-purple-600 truncate mb-0.5 md:mb-1'>
                    {task.title}
                  </p>
                )}
                <p className='text-[11px] md:text-xs text-gray-500 truncate'>
                  {lastMsg?.text || "No messages yet"}
                </p>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}
