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
                Delivered At
              </span>
              <div className='p-3 bg-gray-50 border border-gray-100 rounded-xl'>
                <p className='font-bold text-sm text-gray-900'>
                  {new Date(notification.createdAt).toLocaleDateString()} 10:00 AM
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
            <div className='space-y-1'>
              <span className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>
                Delivered At
              </span>
              <div className='p-3 bg-gray-50 border border-gray-100 rounded-xl'>
                <p className='font-bold text-sm text-gray-900'>
                  Delivered
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
