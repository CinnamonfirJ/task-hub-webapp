"use client";

import { useAuth } from "@/hooks/useAuth";
import { Search, Bell, ChevronDown } from "lucide-react";
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

export function DashboardHeader() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const { user, logout } = useAuth();

  // Only call the admin profile API on admin routes — never for regular users/taskers
  const { data: admin } = useAdminProfile();
  const activeUser = isAdminRoute ? admin : user;

  const userName = activeUser?.fullName || 
                   (activeUser?.firstName ? `${activeUser.firstName} ${activeUser.lastName || ""}`.trim() : (activeUser as any)?.name) || 
                   "Welcome";
 
  const userInitial = (activeUser?.fullName || activeUser?.firstName || (activeUser as any)?.name || "U")[0].toUpperCase();

  return (
    <header className='sticky top-0 z-40 w-full bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-3'>
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
        {/* Bell */}
        <button className='relative p-1.5 text-gray-500 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100'>
          <Bell size={20} />
        </button>

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
    </header>
  );
}
