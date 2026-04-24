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
          {/* Header Info */}
          <div className='flex items-start justify-between'>
            <div className='space-y-1'>
              <h2 className='text-lg font-bold text-gray-900 leading-tight'>
                {notification.title}
              </h2>
              <div className='flex items-center gap-2'>
                <span className='px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold border border-purple-100 uppercase tracking-tight'>
                  {notification.type}
                </span>
                <span className='text-[11px] text-gray-400'>
                  Sent on {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className='bg-gray-50 border border-gray-100 rounded-xl p-4'>
            <div className='flex gap-2 mb-2'>
              <MessageSquare size={14} className='text-gray-400' />
              <span className='text-[11px] uppercase font-bold text-gray-400 tracking-wider'>
                Message Content
              </span>
            </div>
            <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium'>
              {notification.message}
            </p>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='p-3 bg-white border border-gray-100 rounded-xl'>
              <div className='flex items-center gap-2 mb-1 text-gray-400'>
                <Target size={14} />
                <span className='text-[10px] uppercase font-bold tracking-wider'>
                  Audience
                </span>
              </div>
              <p className='font-bold text-sm text-gray-900'>
                {notification.audience}
              </p>
            </div>
            <div className='p-3 bg-white border border-gray-100 rounded-xl'>
              <div className='flex items-center gap-2 mb-1 text-gray-400'>
                <User size={14} />
                <span className='text-[10px] uppercase font-bold tracking-wider'>
                  Sent By
                </span>
              </div>
              <p className='font-bold text-sm text-gray-900'>
                {notification.sentBy.firstName} {notification.sentBy.lastName}
              </p>
            </div>
            <div className='p-3 bg-white border border-gray-100 rounded-xl'>
              <div className='flex items-center gap-2 mb-1 text-gray-400'>
                <Users size={14} />
                <span className='text-[10px] uppercase font-bold tracking-wider'>
                  Recipients
                </span>
              </div>
              <p className='font-bold text-sm text-gray-900'>
                {notification.recipientsCount} Users
              </p>
            </div>
            <div className='p-3 bg-white border border-gray-100 rounded-xl'>
              <div className='flex items-center gap-2 mb-1 text-gray-400'>
                <BarChart size={14} />
                <span className='text-[10px] uppercase font-bold tracking-wider'>
                  Opened Rate
                </span>
              </div>
              <p className='font-bold text-sm text-gray-900'>
                {notification.openedCount} (
                {(
                  (notification.openedCount / notification.recipientsCount ||
                    0) * 100
                ).toFixed(1)}
                %)
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className='pt-2 border-t border-gray-100 mt-2'>
          <Button variant='outline' onClick={onClose} className='h-10 px-8'>
            Close Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
