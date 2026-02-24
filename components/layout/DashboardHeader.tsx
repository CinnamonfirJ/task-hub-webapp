"use client";

import { useAuth } from "@/hooks/useAuth";
import { Search, Bell, Mail, ChevronDown, Menu, X } from "lucide-react";
import { navItems } from "@/components/admin/AdminSidebar";
import { useSidebar } from "@/components/admin/SidebarContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminProfile } from "@/hooks/useAdmin";

export function DashboardHeader() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const { user, logout } = useAuth();
  const { data: admin, isLoading: adminLoading } = useAdminProfile();
  const { toggleSidebar } = useSidebar();

  // Determine which user data to use based on route
  const activeUser = isAdminRoute ? admin : user;

  const userName =
    activeUser?.fullName ||
    (adminLoading && isAdminRoute ? "Loading..." : "Welcome");
  const userRole =
    activeUser?.role === "tasker"
      ? "Tasker"
      : isAdminRoute
        ? activeUser?.role?.replace("_", " ") || "Administrator"
        : "User Account";

  const userInitial = activeUser?.fullName
    ? activeUser.fullName[0].toUpperCase()
    : isAdminRoute
      ? "A"
      : "U";

  return (
    <header className='sticky top-0 z-40 w-full bg-white border-b border-gray-100/60 px-4 sm:px-6 py-4 flex items-center justify-between'>
      {/* Mobile Header Design (Mock Match) */}
      <div className='flex flex-col lg:hidden'>
        <span className='text-[#6B46C1] font-bold text-lg leading-tight'>
          {isAdminRoute ? "Task hub Admin" : "Task hub"}
        </span>
        <span className='text-gray-400 text-[10px] md:text-xs'>
          {isAdminRoute ? "System control panel" : "Dashboard"}
        </span>
      </div>

      {/* Search Bar - hidden on mobile */}
      <div className='flex-1 max-w-xl hidden lg:block'>
        <div className='relative'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            size={18}
          />
          <Input
            type='search'
            placeholder='Search Name or email..'
            className='w-full md:w-[400px] pl-10 h-11 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-[#6B46C1] text-sm'
          />
        </div>
      </div>

      <div className='flex items-center gap-2 sm:gap-4 ml-auto'>
        {/* Notifications (Desktop Only) */}
        <button className='relative p-2 text-gray-500 hover:text-gray-900 transition-colors hidden lg:block'>
          <Bell size={22} />
          <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white'></span>
        </button>

        <div className='w-px h-8 bg-gray-200 hidden sm:block lg:hidden'></div>

        {/* Mobile Hamburger (Right Side) */}
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden h-10 w-10 text-gray-600 bg-gray-50/50 hover:bg-gray-100 rounded-lg'
          onClick={toggleSidebar}
        >
          <Menu size={22} />
        </Button>

        <div className='w-px h-8 bg-gray-200 hidden lg:block'></div>

        {/* User Profile (Desktop Only) */}
        <div className='hidden lg:block'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='flex items-center gap-3 hover:opacity-80 transition-opacity outline-none'>
                <div className='text-right hidden sm:block'>
                  <p className='text-sm font-bold text-gray-900 tracking-tight leading-none'>
                    {userName}
                  </p>
                  <p className='text-xs font-medium text-gray-500 mt-1 uppercase'>
                    {userRole}
                  </p>
                </div>
                <div className='h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden shrink-0 border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center'>
                  {activeUser?.profilePicture ? (
                    <img
                      src={activeUser.profilePicture}
                      alt='Profile'
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <span className='text-[#6B46C1] font-bold text-sm'>
                      {userInitial}
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={14}
                  className='text-gray-400 hidden sm:block'
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem className='cursor-pointer'>
                Profile Settings
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
      </div>
    </header>
  );
}
