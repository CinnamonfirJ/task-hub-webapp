import { Message } from "@/types/chat";
import { User } from "@/types/auth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  currentUser: User | null;
}

export function MessageBubble({ message, currentUser }: MessageBubbleProps) {
  const isMine = message.senderType === currentUser?.role;

  return (
    <div
      className={cn(
        "flex flex-col max-w-[80%] space-y-1 mb-4",
        isMine ? "ml-auto items-end" : "mr-auto items-start",
      )}
    >
      <div
        className={cn(
          "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
          isMine
            ? "bg-[#6B46C1] text-white rounded-br-none shadow-sm"
            : "bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm",
        )}
      >
        {message.text && <p className='whitespace-pre-wrap'>{message.text}</p>}
        {message.attachments && message.attachments.length > 0 && (
          <div className='mt-2 space-y-2'>
            {message.attachments.map((att, idx) => (
              <div key={idx} className='rounded-lg overflow-hidden'>
                {att.type === "image" ? (
                  <img
                    src={att.url}
                    alt={att.name}
                    className='max-w-full h-auto object-cover'
                  />
                ) : (
                  <a
                    href={att.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 p-2 bg-black/5 hover:bg-black/10 transition-colors'
                  >
                    <span className='truncate text-xs'>{att.name}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <span className='text-[10px] text-gray-400 px-1 font-medium uppercase'>
        {format(new Date(message.createdAt), "HH:mm")}
      </span>
    </div>
  );
}
