"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminNotification } from "@/types/admin";
import {
  Calendar,
  User,
  Users,
  Target,
  BarChart,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: AdminNotification | null;
}

export function NotificationDetailsModal({
  isOpen,
  onClose,
  notification,
}: NotificationDetailsModalProps) {
  if (!notification) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px] gap-6 max-h-[90vh] overflow-y-auto no-scrollbar'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold flex items-center gap-2'>
            Notification Details
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Message Content */}
          <div className='space-y-2'>
            <span className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>
              Message
            </span>
            <div className='bg-gray-50 border border-gray-100 rounded-xl p-4'>
              <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium'>
                {notification.message}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-2 gap-y-6 gap-x-4'>
            <div className='space-y-1'>
              <span className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>
                Audience
              </span>
              <div className='p-3 bg-gray-50 border border-gray-100 rounded-xl'>
                <p className='font-bold text-sm text-gray-900'>
                  {notification.audience}
                </p>
              </div>
            </div>
            <div className='space-y-1'>
              <span className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>
                Recipients
              </span>
              <div className='p-3 bg-gray-50 border border-gray-100 rounded-xl'>
                <p className='font-bold text-sm text-gray-900'>
                  {notification.recipientsCount}
                </p>
              </div>
            </div>
            <div className='space-y-1'>
              <span className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>
                Sent On
              </span>
              <div className='p-3 bg-gray-50 border border-gray-100 rounded-xl'>
                <p className='font-bold text-sm text-gray-900'>
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className='space-y-1'>
              <span className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>
                Delivery Status
              </span>
              <div className='p-3 bg-gray-50 border border-gray-100 rounded-xl'>
                <p className='font-bold text-sm text-green-600 flex items-center gap-1.5'>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                  Successfully Sent
                </p>
              </div>
            </div>
            <div className='space-y-1'>
              <span className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>
                Open Rate
              </span>
              <div className='p-3 bg-gray-50 border border-gray-100 rounded-xl'>
                <p className='font-bold text-sm text-gray-900'>
                  {Math.round((notification.openedCount / notification.recipientsCount) * 100) || 0}%
                </p>
              </div>
            </div>
            <div className='space-y-1 col-span-2'>
              <span className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>
                Delivery Channels
              </span>
              <div className='flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl'>
                 <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                      (notification as any).sentThrough === "both" || (notification as any).sentThrough === "email" 
                        ? "bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-100/50" 
                        : "bg-gray-100/50 text-gray-300 border-gray-200 grayscale opacity-50"
                    )}>
                      Email
                    </span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                      (notification as any).sentThrough === "both" || (notification as any).sentThrough === "in-app" 
                        ? "bg-purple-50 text-purple-600 border-purple-100 shadow-sm shadow-purple-100/50" 
                        : "bg-gray-100/50 text-gray-300 border-gray-200 grayscale opacity-50"
                    )}>
                      In-App
                    </span>
                 </div>
                 <p className="text-[10px] font-bold text-gray-400 italic">
                   { (notification as any).sentThrough === 'both' ? 'Delivered via both channels' : 
                     (notification as any).sentThrough === 'email' ? 'Delivered via Email only' : 
                     (notification as any).sentThrough === 'in-app' ? 'Delivered via In-App only' : 'Delivery channel data pending'}
                 </p>
              </div>
            </div>
          </div>
        </div>

        <div className='pt-2'>
          <Button className='w-full bg-[#6B46C1] hover:bg-[#553C9A] text-white h-12 rounded-xl font-bold'>
            Resend this notification
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
