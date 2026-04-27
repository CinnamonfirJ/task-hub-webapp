import { useState } from "react";
import { Message } from "@/types/chat";
import { User } from "@/types/auth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FileText, Download, Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: Message;
  currentUser: User | null;
}

export function MessageBubble({ message, currentUser }: MessageBubbleProps) {
  const isMine = 
    message.senderType === currentUser?.role || 
    (message.senderType === "admin" && currentUser?.role?.includes("admin")) ||
    (message.senderType === "admin" && ["super_admin", "operations", "trust_safety", "finance"].includes(currentUser?.role || ""));

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div
      className={cn(
        "flex flex-col max-w-[85%] sm:max-w-[75%] space-y-1 mb-4",
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
          <div
            className={cn(
              "mt-2 grid gap-2",
              message.attachments.length > 1 ? "grid-cols-2" : "grid-cols-1",
            )}
          >
            {message.attachments.map((att, idx) => (
              <div key={idx} className='rounded-xl overflow-hidden'>
                {att.type === "image" || att.url.match(/\.(jpg|jpeg|png|gif|webp)$|images/i) ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className='group relative w-[150px] h-[150px] overflow-hidden rounded-lg border border-black/5'>
                        <img
                          src={att.url}
                          alt={att.name}
                          className='w-full h-full object-cover transition-transform group-hover:scale-110'
                        />
                        <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                          <Maximize2 className='w-6 h-6 text-white' />
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className='max-w-[95vw] sm:max-w-[90vw] max-h-[95vh] p-0 bg-transparent border-none shadow-none flex flex-col items-center justify-center overflow-hidden'>
                      <VisuallyHidden>
                        <DialogTitle>{att.name || "Image Preview"}</DialogTitle>
                      </VisuallyHidden>
                      <div className="relative group w-full h-full flex items-center justify-center p-4">
                        <img
                          src={att.url}
                          alt={att.name}
                          className='max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl'
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                           <Button
                              size="sm"
                              className="bg-white/90 hover:bg-white text-gray-900 rounded-full font-bold shadow-lg flex items-center gap-2 px-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                const link = document.createElement("a");
                                link.href = att.url;
                                link.download = att.name || "image";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                           >
                              <Download size={16} /> Download
                           </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md group w-full max-w-[260px]",
                      isMine
                        ? "bg-white/10 border-white/20 hover:bg-white/20 text-white"
                        : "bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-900",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 shrink-0 rounded-lg flex items-center justify-center cursor-pointer",
                        isMine ? "bg-white/20" : "bg-white shadow-sm",
                      )}
                      onClick={() => window.open(att.url, '_blank')}
                    >
                      <FileText
                        className={cn(
                          "w-5 h-5",
                          isMine ? "text-white" : "text-[#6B46C1]",
                        )}
                      />
                    </div>
                    <div 
                      className='flex-1 min-w-0 overflow-hidden text-left cursor-pointer'
                      onClick={() => window.open(att.url, '_blank')}
                    >
                      <p className='text-xs font-bold truncate pr-2'>
                        {att.name}
                      </p>
                      <p
                        className={cn(
                          "text-[10px] font-medium opacity-60",
                          isMine ? "text-white/80" : "text-gray-500",
                        )}
                      >
                        {formatFileSize(att.size) || "File"}
                      </p>
                    </div>
                    <button
                      className={cn(
                        "p-2 rounded-lg hover:bg-black/5 transition-colors shrink-0",
                        isMine ? "text-white/70 hover:text-white" : "text-gray-400 hover:text-[#6B46C1]",
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        const link = document.createElement("a");
                        link.href = att.url;
                        link.download = att.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
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
