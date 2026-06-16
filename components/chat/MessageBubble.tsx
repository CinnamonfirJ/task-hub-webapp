import { useState } from "react";
import { Message } from "@/types/chat";
import { User } from "@/types/auth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FileText, Download, Maximize2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: Message;
  currentUser: User | null;
  partner?: Partial<User> | null;
}

export function MessageBubble({ message, currentUser, partner }: MessageBubbleProps) {
  const isMine =
    message.senderType === currentUser?.role ||
    (message.senderType === "admin" && currentUser?.role?.includes("admin")) ||
    (message.senderType === "admin" && ["super_admin", "operations", "trust_safety", "finance"].includes(currentUser?.role || ""));

  const sender = isMine ? currentUser : partner;
  const profilePicture = (sender as any)?.profilePicture;
  const initials =
    (sender as any)?.fullName?.[0] ||
    (sender as any)?.firstName?.[0] ||
    (sender as any)?.name?.[0] ||
    "U";

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleDownload = async (e: React.MouseEvent, url: string, filename: string) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      // Primary Method: Fetch and Blob (Native browser download trigger)
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.warn("Advanced download failed, using standard fallback", error);
      
      let downloadUrl = url;
      if (url.includes("res.cloudinary.com")) {
        const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$|images/i);
        
        // For images, fl_attachment is reliable.
        // For documents (PDF, etc.), we avoid flags to prevent 401 Unauthorized errors.
        if (isImage && !url.includes("fl_attachment")) {
          downloadUrl = url.replace("/upload/", "/upload/fl_attachment/");
        }
      }
      
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || "download";
      link.target = "_blank"; // Fallback to new tab if download attribute is ignored
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      className={cn(
        "flex gap-2 mb-4 w-full",
        isMine ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className='flex flex-col space-y-1 max-w-[85%] sm:max-w-[75%]'>
        <div className={cn("flex flex-col", isMine ? "items-end" : "items-start")}>
          {/* Avatar for the sender */}
          <div className={cn("flex items-end gap-2", isMine ? "flex-row-reverse" : "flex-row")}>
            <div className='w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-[#6B46C1] flex items-center justify-center text-white text-[10px] font-bold'>
              {profilePicture ? (
                <img src={profilePicture} alt='Avatar' className='w-full h-full object-cover' />
              ) : (
                initials
              )}
            </div>
            <div
              className={cn(
                "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                isMine
                  ? "bg-[#6B46C1] text-white rounded-br-none "
                  : "bg-white border border-gray-100 text-gray-800 rounded-bl-none ",
              )}
            >
        {message.text && <p className='whitespace-pre-wrap break-words'>{message.text}</p>}

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
                    <DialogContent
                      showCloseButton={false}
                      className='max-w-[95vw] sm:max-w-[90vw] max-h-[95vh] p-0 bg-transparent border-none shadow-none flex flex-col items-center justify-center overflow-hidden outline-none'
                    >
                      <VisuallyHidden>
                        <DialogTitle>{att.name || "Image Preview"}</DialogTitle>
                      </VisuallyHidden>
                      <div className="relative group w-full h-full flex items-center justify-center p-4">
                        <img
                          src={att.url}
                          alt={att.name}
                          className='max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl'
                        />

                        {/* Floating Action Controls */}
                        <div className="absolute top-6 right-6 flex items-center gap-3">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md border border-white/20 transition-all duration-200"
                            onClick={(e) => handleDownload(e, att.url, att.name || "image")}
                          >
                            <Download size={20} />
                          </Button>

                          <DialogClose asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md border border-white/20 transition-all duration-200"
                            >
                              <X size={20} />
                            </Button>
                          </DialogClose>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all group w-full max-w-[260px]",
                      isMine
                        ? "bg-white/10 border-white/20 hover:bg-white/20 text-white"
                        : "bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-900",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 shrink-0 rounded-lg flex items-center justify-center cursor-pointer",
                        isMine ? "bg-white/20" : "bg-white ",
                      )}
                      onClick={(e) => handleDownload(e, att.url, att.name)}
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
                      onClick={(e) => handleDownload(e, att.url, att.name)}
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
                      onClick={(e) => handleDownload(e, att.url, att.name)}
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
          </div>
          <span className='text-[10px] text-gray-400 px-10 font-medium uppercase mt-1'>
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
        </div>
      </div>
    </div>
  );
}
