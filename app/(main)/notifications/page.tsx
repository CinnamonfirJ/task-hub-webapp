"use client";

import { useState } from "react";
import { Bell, Search, Filter, MoreVertical, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  useNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead, 
  useDeleteNotification 
} from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Mock notification data for initial redesign
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "KYC Verification Successful",
    message: "Your identity has been verified. You can now bid on premium tasks and enjoy all platform features.",
    type: "Update",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "New Task Match",
    message: "A new task 'Professional House Cleaning' matches your skills and is within 5km of your location.",
    type: "Alert",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1h ago
  },
  {
    id: "3",
    title: "Payment Received",
    message: "Your payment of ₦25,000 for 'Logo Design Project' has been credited to your wallet.",
    type: "Announcement",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1d ago
  },
  {
    id: "4",
    title: "System Maintenance",
    message: "TaskHub will be undergoing scheduled maintenance on Sunday, April 20th, from 2:00 AM to 4:00 AM.",
    type: "Warning",
    isRead: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2d ago
  }
];

export default function UserNotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: notificationsData, isLoading } = useNotifications({
    isRead: activeTab === "all" ? undefined : activeTab === "read",
    limit: 100
  });

  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const notifications = notificationsData?.data?.notifications || notificationsData?.notifications || [];

  const filteredNotifications = notifications.filter((n: any) => {
    const matchesSearch = 
      (n.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.message || "").toLowerCase().includes(searchQuery.toLowerCase());

    const isRead = n.read ?? n.isRead ?? false;
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "unread" && !isRead) || 
      (activeTab === "read" && isRead);

    return matchesSearch && matchesTab;
  });

  const handleMarkAllAsRead = () => {
    markAllAsRead(undefined, {
      onSuccess: () => toast.success("All notifications marked as read")
    });
  };

  const handleDelete = (id: string) => {
    deleteNotification(id, {
      onSuccess: () => toast.success("Notification deleted")
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Alert": return "text-blue-500 bg-blue-50";
      case "Warning": return "text-amber-500 bg-amber-50";
      case "Announcement": return "text-emerald-500 bg-emerald-50";
      default: return "text-purple-500 bg-purple-50";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">Stay updated with your latest activities and system alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll || notifications.length === 0}
            className="h-9 px-3 text-xs font-bold gap-2 text-gray-600 rounded-xl"
          >
            {isMarkingAll ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            Mark all as read
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit">
          <TabsList className="bg-gray-100/50 p-1 h-11 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
            <TabsTrigger value="unread" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Unread</TabsTrigger>
            <TabsTrigger value="read" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Read</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            placeholder="Search notifications..." 
            className="pl-10 h-11 bg-white border-gray-100 rounded-xl focus:ring-[#6B46C1]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 rounded-2xl">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-100 bg-gray-50/30">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Bell size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No notifications found</h3>
              <p className="text-sm text-gray-500 max-w-[240px] mt-2">
                {searchQuery ? "Try adjusting your search or filters to find what you're looking for." : "We'll notify you when something important happens."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification: any) => (
            <Card 
              key={notification._id || notification.id} 
              onClick={() => {
                const isRead = notification.read ?? notification.isRead;
                if (!isRead) markAsRead(notification._id || notification.id);
                setExpandedId(expandedId === (notification._id || notification.id) ? null : (notification._id || notification.id));
              }}
              className={cn(
                "group relative border-transparent hover:border-purple-100 transition-all cursor-pointer rounded-2xl overflow-hidden",
                !(notification.read ?? notification.isRead) ? "bg-white shadow-md shadow-purple-50/50 ring-1 ring-purple-50" : "bg-gray-50/50 grayscale-[0.5] opacity-80"
              )}
            >
              <CardContent className="p-0">
                <div className="p-5 sm:p-6 flex gap-4 sm:gap-6">
                  {/* Indicator & Icon */}
                  <div className="relative shrink-0">
                    <div className={cn(
                      "w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-all group-hover:scale-110",
                      getTypeColor(notification.type)
                    )}>
                      <Bell size={20} />
                    </div>
                    {! (notification.read ?? notification.isRead) && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#6B46C1] rounded-full border-2 border-white ring-2 ring-purple-100 animate-pulse" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={cn(
                          "font-bold text-gray-900 line-clamp-1 transition-colors group-hover:text-[#6B46C1]",
                          !(notification.read ?? notification.isRead) ? "text-base" : "text-sm"
                        )}>
                          {notification.title}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 mt-0.5 tracking-wider uppercase">
                          {notification.type || "System"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={14} />
                        <span className="text-xs font-medium">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification._id);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <p className={cn(
                      "text-sm text-gray-600 mt-3 leading-relaxed transition-all",
                      expandedId !== (notification._id || notification.id) && "line-clamp-2"
                    )}>
                      {notification.message}
                    </p>
                    {expandedId !== (notification._id || notification.id) && notification.message.length > 120 && (
                      <button className="text-[10px] font-bold text-purple-600 mt-2 uppercase tracking-wider">
                        Read full message
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
