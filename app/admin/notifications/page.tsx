"use client";

import { useState } from "react";
import {
  Bell,
  Plus,
  Loader2,
  Users as UsersIcon,
  UserCheck,
  Send,
  BarChart2,
  MoreVertical,
  Eye,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStats, useNotifications } from "@/hooks/useAdmin";
import { SendNotificationModal } from "@/components/admin/notifications/SendNotificationModal";
import { NotificationDetailsModal } from "@/components/admin/notifications/NotificationDetailsModal";

export default function NotificationsPage() {
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { data: stats, isLoading: loadingStats } = useNotificationStats();
  const { data: notifications, isLoading: loadingNotifications } = useNotifications();

  const handleViewDetails = (notification: any) => {
    setSelectedNotification(notification);
    setIsDetailsModalOpen(true);
  };

  const statsCards = [
    {
      title: "All Users",
      value: stats?.totalUsers ?? 0,
      icon: UsersIcon,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "All Taskers",
      value: stats?.totalTaskers ?? 0,
      icon: UserCheck,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Total sent",
      value: stats?.totalSent ?? 0,
      icon: Send,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Open Rate",
      value: stats?.openRate ?? "0%",
      icon: BarChart2,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Notifications</h1>
          <p className='text-sm text-gray-500'>
            Manage and send platform-wide notifications
          </p>
        </div>
        <Button
          onClick={() => setIsSendModalOpen(true)}
          className='bg-[#6B46C1] hover:bg-[#553C9A] text-white h-10 px-4 gap-2'
        >
          <Plus size={16} /> Send Notifications
        </Button>
      </div>

      {/* Stats Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {statsCards.map((stat, index) => (
          <Card key={index} className='border-none shadow-sm bg-white'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    {stat.title}
                  </p>
                  {loadingStats ? (
                    <Loader2 className='h-5 w-5 animate-spin text-gray-400 mt-1' />
                  ) : (
                    <h3 className='text-xl font-bold text-gray-900'>
                      {stat.value}
                    </h3>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Section */}
      <Card className='border border-gray-100 shadow-sm overflow-hidden'>
        <CardContent className='p-0'>
          <div className='p-6 border-b border-gray-100'>
            <h3 className='font-bold text-gray-900 text-xs uppercase tracking-wider'>
              Sent Notifications
            </h3>
          </div>

          <div className='overflow-x-auto min-h-[400px] relative'>
            {loadingNotifications && (
              <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
              </div>
            )}
            <table className='w-full text-left text-sm'>
              <thead>
                <tr className='border-y bg-gray-50/30 text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                  <th className='px-6 py-4'>TITLE</th>
                  <th className='px-6 py-4'>TYPE</th>
                  <th className='px-6 py-4'>AUDIENCE</th>
                  <th className='px-6 py-4'>RECIPIENTS</th>
                  <th className='px-6 py-4'>SENT</th>
                  <th className='px-6 py-4 text-right'>ACTION</th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {notifications?.map((notification) => (
                  <tr
                    key={notification._id}
                    className='group hover:bg-gray-50 transition-colors'
                  >
                    <td className='px-6 py-5 shrink-0'>
                      <div className='flex flex-col'>
                        <span className='font-medium text-gray-900 text-xs'>
                          {notification.title}
                        </span>
                        <span className='text-[10px] text-gray-400 truncate max-w-[200px]'>
                          {notification.message}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-5'>
                      <span className='text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md border border-purple-100'>
                        {notification.type}
                      </span>
                    </td>
                    <td className='px-6 py-5'>
                      <span className='text-gray-600 text-xs'>
                        {notification.audience}
                      </span>
                    </td>
                    <td className='px-6 py-5'>
                      <div className='flex flex-col'>
                        <span className='text-gray-900 font-bold text-xs'>
                          {notification.recipientsCount}
                        </span>
                        <span className='text-[10px] text-gray-400'>
                          {notification.openedCount} opened
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-5 text-xs text-gray-500'>
                      <div className='flex flex-col'>
                        <span>
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                        <span className='text-[10px]'>
                          {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-5 text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400'
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-40'>
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(notification)}
                            className='gap-2 cursor-pointer text-xs'
                          >
                            <Eye size={14} /> View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {!loadingNotifications && notifications?.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className='py-12 text-center text-gray-400 font-medium'
                    >
                      No notifications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <SendNotificationModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
      />

      {/* 
      <NotificationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        notification={selectedNotification}
      /> 
      */}
    </div>
  );
}
