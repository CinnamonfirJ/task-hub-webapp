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
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statsCards.map((stat, index) => (
          <Card key={index} className='border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow'>
            <CardContent className='p-0'>
              <div className='flex items-center p-6'>
                <div className={`p-4 rounded-2xl ${stat.color} mr-4 transition-transform group-hover:scale-110 duration-300`}>
                  <stat.icon size={26} />
                </div>
                <div>
                  <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                    {stat.title}
                  </p>
                  {loadingStats ? (
                    <Loader2 className='h-5 w-5 animate-spin text-gray-400 mt-1' />
                  ) : (
                    <h3 className='text-2xl font-black text-gray-900 mt-0.5'>
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
                <tr className='border-y bg-gray-50/50 text-[10px] text-gray-400 font-black uppercase tracking-widest'>
                  <th className='px-6 py-4'>Message Details</th>
                  <th className='px-6 py-4 text-center'>Type</th>
                  <th className='px-6 py-4'>Audience</th>
                  <th className='px-6 py-4'>Performance</th>
                  <th className='px-6 py-4'>Date Sent</th>
                  {/* <th className='px-6 py-4 text-right'>Action</th> */}
                </tr>
              </thead>
              <tbody className='divide-y'>
                {notifications?.map((notification) => (
                  <tr
                    key={notification._id}
                    className='group hover:bg-[#6B46C1]/2 transition-colors'
                  >
                    <td className='px-6 py-5 shrink-0'>
                      <div className='flex flex-col gap-1'>
                        <span className='font-bold text-gray-900 text-sm'>
                          {notification.title}
                        </span>
                        <p className='text-xs text-gray-400 line-clamp-1 max-w-[250px] font-medium'>
                          {notification.message}
                        </p>
                      </div>
                    </td>
                    <td className='px-6 py-5 text-center'>
                      <span className={`text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full border ${
                        notification.type === 'Warning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        notification.type === 'Alert' ? 'bg-red-50 text-red-600 border-red-100' :
                        notification.type === 'Announcement' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-purple-50 text-purple-600 border-purple-100'
                      }`}>
                        {notification.type}
                      </span>
                    </td>
                    <td className='px-6 py-5'>
                      <div className='flex items-center gap-2'>
                        <div className='h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400'>
                          <UsersIcon size={12} />
                        </div>
                        <span className='text-gray-600 text-[11px] font-bold'>
                          {notification.audience}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-5'>
                      <div className='flex flex-col gap-1.5'>
                        <div className='flex items-center justify-between text-[10px] font-bold'>
                          <span className='text-gray-900'>{notification.recipientsCount} recipients</span>
                          <span className='text-gray-400'>{Math.round((notification.openedCount / notification.recipientsCount) * 100) || 0}% opened</span>
                        </div>
                        <div className='w-full h-1.5 bg-gray-100 rounded-full overflow-hidden'>
                          <div 
                            className='h-full bg-[#6B46C1] rounded-full' 
                            style={{ width: `${(notification.openedCount / notification.recipientsCount) * 100 || 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-5 text-xs text-gray-500'>
                      <div className='flex flex-col'>
                        <span className='font-bold text-gray-700'>
                          {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className='text-[10px] text-gray-400 font-medium mt-0.5'>
                          {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    {/* <td className='px-6 py-5 text-right'>
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
                    </td> */}
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
