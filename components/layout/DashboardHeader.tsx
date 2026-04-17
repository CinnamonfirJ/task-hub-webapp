"use client";

import { useAuth } from "@/hooks/useAuth";
import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminProfile } from "@/hooks/useAdmin";
import { useSidebar } from "@/components/admin/SidebarContext";
import { ExportModal, ExportType } from "@/components/admin/ExportModal";
import { useNotifications, useMarkNotificationAsRead } from "@/hooks/useAuth";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export function DashboardHeader() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();

  // Only call the admin profile API on admin routes — never for regular users/taskers
  const { data: admin } = useAdminProfile();
  const activeUser = isAdminRoute ? admin : user;

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Derive export type from pathname
  const getExportType = (): ExportType => {
    if (pathname.includes("/admin/tasks")) return "tasks";
    if (pathname.includes("/admin/payments")) return "payments";
    if (pathname.includes("/admin/users")) return "users";
    if (pathname.includes("/admin/taskers")) return "taskers";
    return "dashboard";
  };

  const userName =
    activeUser?.fullName ||
    (activeUser?.firstName
      ? `${activeUser.firstName} ${activeUser.lastName || ""}`.trim()
      : (activeUser as any)?.name) ||
    "Welcome";

  const userInitial = (activeUser?.fullName ||
    activeUser?.firstName ||
    (activeUser as any)?.name ||
    "U")[0].toUpperCase();

  return (
    <header className='sticky top-0 z-40 w-full bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-2 sm:gap-3'>
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className='lg:hidden p-2 -ml-2 text-gray-500 hover:text-[#6B46C1] transition-colors rounded-lg hover:bg-gray-100'
      >
        <Menu size={24} />
      </button>

      {/* Search Bar — always visible */}
      <div className='flex-1 max-w-xl'>
        <div className='relative'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            size={16}
          />
          <Input
            type='search'
            placeholder='Search task, workers...'
            className='w-full pl-9 h-10 bg-gray-100 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-[#6B46C1] text-sm text-gray-700 placeholder:text-gray-400'
          />
        </div>
      </div>

      {/* Right side: Bell + User */}
      <div className='flex items-center gap-3 ml-auto shrink-0'>
        {/* Export Button (Admin Only) */}
        {isAdminRoute && (
          <button
            onClick={() => setIsExportModalOpen(true)}
            className='flex items-center gap-2 p-1.5 sm:px-3 text-gray-500 hover:text-[#6B46C1] transition-colors rounded-lg hover:bg-purple-50 group border border-transparent hover:border-purple-100'
          >
            <Download size={18} className='group-hover:bounce' />
            <span className='hidden md:block text-xs font-bold'>Export</span>
          </button>
        )}

        {/* Notifications (User/Tasker Only) */}
        {!isAdminRoute && (
          <NotificationsDropdown />
        )}

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='flex items-center gap-2 hover:opacity-80 transition-opacity outline-none'>
              <div className='h-9 w-9 rounded-full overflow-hidden shrink-0 border border-gray-200 shadow-sm bg-[#6B46C1] flex items-center justify-center'>
                {(activeUser as any)?.profilePicture ? (
                  <img
                    src={(activeUser as any).profilePicture}
                    alt='Profile'
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <span className='text-white font-bold text-sm'>
                    {userInitial}
                  </span>
                )}
              </div>
              <span className='hidden sm:block text-sm font-semibold text-gray-900 max-w-[120px] truncate'>
                {userName}
              </span>
              <ChevronDown
                size={14}
                className='text-gray-400 hidden sm:block'
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuItem className='cursor-pointer' asChild>
              <Link href='/profile'>Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className='cursor-pointer text-red-600 focus:text-red-600'
              onClick={() => logout()}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        type={getExportType()}
      />
    </header>
  );
}
function NotificationsDropdown() {
  const { data: notificationsData, isLoading } = useNotifications({ limit: 5 });
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  
  const notifications = notificationsData?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='relative p-1.5 text-gray-500 hover:text-[#6B46C1] transition-colors rounded-lg hover:bg-purple-50 group border border-transparent hover:border-purple-100 outline-none'>
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className='absolute top-1.5 right-1.5 h-3 w-3 bg-red-500 rounded-full border-2 border-white animate-pulse' />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-85 p-0 overflow-hidden rounded-2xl border-gray-100 shadow-xl'>
        <div className='p-5 border-b border-gray-50 flex items-center justify-between'>
          <h3 className='font-bold text-gray-900'>Notifications</h3>
          {unreadCount > 0 && (
            <span className='text-[10px] bg-purple-100 text-[#6B46C1] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider'>
              {unreadCount} New
            </span>
          )}
        </div>
        
        <div className='max-h-[400px] overflow-y-auto custom-scrollbar min-h-[100px] bg-white'>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification: any) => (
              <div 
                key={notification._id} 
                onClick={() => !notification.isRead && markAsRead(notification._id)}
                className={`p-5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors flex gap-4 ${
                  !notification.isRead ? "bg-purple-50/30" : ""
                }`}
              >
                <div className={`h-2.5 w-2.5 mt-1.5 rounded-full shrink-0 ${
                  !notification.isRead ? "bg-[#6B46C1]" : "bg-gray-200"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug truncate ${
                    !notification.isRead ? "font-bold text-gray-900" : "font-medium text-gray-600"
                  }`}>
                    {notification.title}
                  </p>
                  <p className='text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed'>
                    {notification.message}
                  </p>
                  <p className='text-[10px] text-gray-400 mt-2 font-medium flex items-center gap-1'>
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    <span className="h-1 w-1 rounded-full bg-gray-300 mx-1" />
                    {notification.type || "System"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Bell size={32} className="opacity-10 mb-2" />
              <p className="text-xs font-bold">No notifications yet</p>
            </div>
          )}
        </div>
        
        <Link
          href="/notifications"
          className='block w-full p-4 text-center text-xs font-black text-[#6B46C1] hover:bg-purple-50 transition-colors border-t border-gray-50 uppercase tracking-widest bg-gray-50/50'
        >
          View all notifications
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
