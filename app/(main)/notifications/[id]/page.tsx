"use client";

import { useParams, useRouter } from "next/navigation";
import { 
  Bell, 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  Wallet, 
  MessageSquare, 
  Briefcase, 
  User,
  ExternalLink,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications, useMarkNotificationAsRead } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function NotificationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: notificationsData, isLoading } = useNotifications({ limit: 100 });
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const notifications = notificationsData?.data?.notifications || notificationsData?.notifications || [];
  const notification = notifications.find((n: any) => (n._id || n.id) === id);

  useEffect(() => {
    if (notification && !(notification.read ?? notification.isRead)) {
      markAsRead(notification._id || notification.id);
    }
  }, [notification, markAsRead]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading notification details...</p>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bell className="text-gray-300" size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Notification Not Found</h1>
        <p className="text-gray-500 mt-2 mb-8">The notification you're looking for might have been deleted or doesn't exist.</p>
        <Button 
          onClick={() => router.push("/notifications")}
          className="bg-[#6B46C1] hover:bg-[#553C9A] rounded-xl px-8"
        >
          View All Notifications
        </Button>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("wallet") || t.includes("payout") || t.includes("transaction")) return <Wallet className="text-blue-600" />;
    if (t.includes("bid")) return <Briefcase className="text-amber-600" />;
    if (t.includes("chat") || t.includes("message")) return <MessageSquare className="text-emerald-600" />;
    if (t.includes("task")) return <CheckCircle2 className="text-purple-600" />;
    if (t.includes("kyc") || t.includes("profile") || t.includes("verification")) return <ShieldCheck className="text-indigo-600" />;
    return <Bell className="text-gray-600" />;
  };

  const getTypeStyles = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("wallet") || t.includes("payout") || t.includes("transaction")) return "bg-blue-50 border-blue-100 text-blue-700";
    if (t.includes("bid")) return "bg-amber-50 border-amber-100 text-amber-700";
    if (t.includes("chat") || t.includes("message")) return "bg-emerald-50 border-emerald-100 text-emerald-700";
    if (t.includes("task")) return "bg-purple-50 border-purple-100 text-purple-700";
    if (t.includes("kyc") || t.includes("profile") || t.includes("verification")) return "bg-indigo-50 border-indigo-100 text-indigo-700";
    return "bg-gray-50 border-gray-100 text-gray-700";
  };

  // Redirection helpers
  const getActionButtons = () => {
    const t = notification.type.toLowerCase();
    const metadata = notification.metadata || {};

    const buttons = [];

    if (t.includes("wallet") || t.includes("payout") || t.includes("transaction")) {
      buttons.push(
        <Button key="wallet" onClick={() => router.push("/payment-history")} className="bg-[#6B46C1] hover:bg-[#553C9A] gap-2 rounded-xl h-12 px-6">
          <Wallet size={18} /> View Wallet
        </Button>,
        <Button key="history" variant="outline" onClick={() => router.push("/payment-history")} className="border-gray-200 hover:bg-gray-50 gap-2 rounded-xl h-12 px-6">
          View Transactions
        </Button>
      );
    } else if (t.includes("bid")) {
      buttons.push(
        <Button key="task" onClick={() => router.push(metadata.taskId ? `/tasks/${metadata.taskId}` : "/history")} className="bg-[#6B46C1] hover:bg-[#553C9A] gap-2 rounded-xl h-12 px-6">
          <Briefcase size={18} /> View Task
        </Button>,
        <Button key="bids" variant="outline" onClick={() => router.push("/history")} className="border-gray-200 hover:bg-gray-50 gap-2 rounded-xl h-12 px-6">
          View Bid History
        </Button>
      );
    } else if (t.includes("chat") || t.includes("message")) {
      buttons.push(
        <Button key="chat" onClick={() => router.push(metadata.chatId ? `/messages/${metadata.chatId}` : "/messages")} className="bg-[#6B46C1] hover:bg-[#553C9A] gap-2 rounded-xl h-12 px-6">
          <MessageSquare size={18} /> Open Chat
        </Button>
      );
    } else if (t.includes("task")) {
      buttons.push(
        <Button key="task" onClick={() => router.push(metadata.taskId ? `/tasks/${metadata.taskId}` : "/history")} className="bg-[#6B46C1] hover:bg-[#553C9A] gap-2 rounded-xl h-12 px-6">
          <CheckCircle2 size={18} /> View Task
        </Button>,
        <Button key="history" variant="outline" onClick={() => router.push("/history")} className="border-gray-200 hover:bg-gray-50 gap-2 rounded-xl h-12 px-6">
          Track Progress
        </Button>
      );
    } else if (t.includes("kyc") || t.includes("profile") || t.includes("verification")) {
      buttons.push(
        <Button key="profile" onClick={() => router.push("/profile")} className="bg-[#6B46C1] hover:bg-[#553C9A] gap-2 rounded-xl h-12 px-6">
          <User size={18} /> Go to Profile
        </Button>
      );
    } else {
      // Default fallback
      buttons.push(
        <Button key="back" variant="outline" onClick={() => router.push("/notifications")} className="border-gray-200 hover:bg-gray-50 gap-2 rounded-xl h-12 px-6">
          <ChevronLeft size={18} /> Go Back
        </Button>,
        <Button key="view-all" onClick={() => router.push("/notifications")} className="bg-[#6B46C1] hover:bg-[#553C9A] gap-2 rounded-xl h-12 px-6">
          View Notifications
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Link */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-[#6B46C1] transition-colors mb-8 group"
      >
        <div className="p-1.5 rounded-lg group-hover:bg-purple-50">
          <ChevronLeft size={20} />
        </div>
        <span className="text-sm font-bold uppercase tracking-wider">Back to notifications</span>
      </button>

      {/* Main Content */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden rounded-[2rem] bg-white">
        <CardContent className="p-0">
          {/* Header/Banner Area */}
          <div className="relative p-8 sm:p-12 bg-gradient-to-br from-purple-50/50 to-white border-b border-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex gap-6 items-start">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${getTypeStyles(notification.type)}`}>
                  {getTypeIcon(notification.type)}
                </div>
                <div>
                  <Badge variant="outline" className={`mb-3 px-3 py-1 font-bold uppercase tracking-widest text-[10px] rounded-full border-none shadow-sm ${getTypeStyles(notification.type)}`}>
                    {notification.type || "System Notification"}
                  </Badge>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                    {notification.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Status & Time */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <div className="flex items-center gap-2 text-gray-400 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-50">
                <Clock size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm border border-gray-50 ${notification.read ? "bg-white text-emerald-600" : "bg-purple-50 text-[#6B46C1]"}`}>
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {notification.read ? "Marked as Read" : "New Notification"}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 sm:p-12">
            <div className="prose prose-purple max-w-none">
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                {notification.message}
              </p>
            </div>

            {/* Metadata Section if available */}
            {notification.metadata && Object.keys(notification.metadata).length > 0 && (
              <div className="mt-10 p-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Related Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(notification.metadata).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-sm font-bold text-gray-700 truncate">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
              {getActionButtons()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <p className="text-center text-gray-400 text-xs mt-12 font-medium">
        You're receiving this because of your account activity. <br className="hidden sm:block" />
        Manage your notification settings in <button onClick={() => router.push('/profile')} className="text-[#6B46C1] hover:underline font-bold">Account Settings</button>.
      </p>
    </div>
  );
}
