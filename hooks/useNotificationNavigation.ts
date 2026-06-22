"use client";

import { useRouter } from "next/navigation";
import { useMarkNotificationAsRead } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";

export interface NotificationMetadata {
  taskId?: string;
  chatId?: string;
  transactionId?: string;
  userId?: string;
  [key: string]: any;
}

export interface Notification {
  _id: string;
  id?: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  isRead?: boolean;
  createdAt: string;
  metadata?: NotificationMetadata;
}

export function useNotificationNavigation() {
  const router = useRouter();
  const { mutateAsync: markAsRead } = useMarkNotificationAsRead();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNotificationClick = async (notification: Notification) => {
    const notificationId = notification._id || notification.id;
    if (!notificationId) return;

    setIsNavigating(true);

    try {
      // 1. Mark as read if not already read
      const isRead = notification.read ?? notification.isRead;
      if (!isRead) {
        await markAsRead(notificationId).catch((err) => {
          console.error("Failed to mark notification as read:", err);
          // We still continue to navigate even if marking as read fails
        });
      }

      // 2. Determine destination
      const type = (notification.type || "").toLowerCase();
      const metadata = notification.metadata || {};
      
      let destination = `/notifications/${notificationId}`;

      // Smart routing based on type
      if (type.includes("wallet") || type.includes("payout") || type.includes("withdrawal") || type.includes("escrow")) {
        destination = "/payment-history";
      } else if (type.includes("bid")) {
        destination = metadata.taskId ? `/tasks/${metadata.taskId}` : "/history";
      } else if (type.includes("message") || type.includes("chat")) {
        destination = metadata.chatId ? `/messages/${metadata.chatId}` : "/messages";
      } else if (type.includes("task")) {
        destination = metadata.taskId ? `/tasks/${metadata.taskId}` : "/history";
      } else if (type.includes("kyc") || type.includes("account") || type.includes("profile") || type.includes("verification")) {
        destination = "/profile";
      }

      // 3. Navigate
      router.push(destination);
    } catch (error) {
      console.error("Notification navigation error:", error);
      toast.error("Something went wrong while redirecting");
      // Fallback to details page if everything fails
      router.push(`/notifications/${notificationId}`);
    } finally {
      setIsNavigating(false);
    }
  };

  return {
    handleNotificationClick,
    isNavigating,
  };
}
