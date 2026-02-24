"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CreditCard,
  UserCheck,
  MessageSquare,
  FileText,
  Settings,
  Users2,
  ShieldCheck,
  Bell,
  LogOut,
  X,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { useAdminProfile } from "@/hooks/useAdmin";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";

export const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Users2, label: "Taskers", href: "/admin/taskers" },
  { icon: ShieldCheck, label: "Staff/Admin", href: "/admin/staff" },
  { icon: Briefcase, label: "Tasks", href: "/admin/tasks" },
  { icon: CreditCard, label: "Payments", href: "/admin/payments" },
  { icon: UserCheck, label: "KYC/Verification", href: "/admin/verification" },
  { icon: MessageSquare, label: "Message", href: "/admin/messages" },
  { icon: FileText, label: "Report & Logs", href: "/admin/reports" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: admin, isLoading } = useAdminProfile();
  const { logout } = useAuth();
  const { isOpen, closeSidebar } = useSidebar();

  const userName = admin?.fullName || "Admin User";
  const userRole = admin?.role?.replace("_", " ") || "Administrator";
  const userInitial = admin?.fullName ? admin.fullName[0].toUpperCase() : "A";

  return (
    <>
      {/* Backdrop for Mobile */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 flex-col border-r bg-white transition-transform duration-300 ease-in-out lg:flex lg:w-64 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className='p-6 flex items-center justify-between'>
          <div className='flex flex-col'>
            <span className='text-[#6B46C1] font-bold text-xl'>
              Task hub Admin
            </span>
            <span className='text-gray-400 text-xs'>System control panel</span>
          </div>
          {/* Close button for mobile */}
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden text-gray-400'
            onClick={closeSidebar}
          >
            <X size={20} />
          </Button>
        </div>

        <nav className='flex-1 space-y-1 px-3 py-4 overflow-y-auto'>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) closeSidebar();
                }}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#6B46C1] text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <item.icon
                  size={20}
                  className={isActive ? "text-white" : "text-gray-400"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile-only: Notifications & Profile */}
        <div className='lg:hidden border-t border-gray-100 p-4 space-y-4'>
          <div className='px-2'>
            <h4 className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3'>
              Account & Activity
            </h4>
            <div className='space-y-1'>
              <button className='w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors relative'>
                <Bell size={18} className='text-gray-400' />
                Notifications
                <span className='absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white'></span>
              </button>
            </div>
          </div>

          <div className='p-3 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100/50'>
            <div className='h-10 w-10 rounded-full overflow-hidden shrink-0 border border-gray-200 bg-white flex items-center justify-center'>
              {admin?.emailAddress ? (
                <div className='h-full w-full bg-[#6B46C1] flex items-center justify-center text-white text-sm font-bold'>
                  {userInitial}
                </div>
              ) : (
                <span className='text-[#6B46C1] font-bold'>{userInitial}</span>
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-bold text-gray-900 truncate leading-none'>
                {isLoading ? "Loading..." : userName}
              </p>
              <p className='text-[11px] font-medium text-gray-500 mt-1 uppercase'>
                {isLoading ? "Please wait" : userRole}
              </p>
            </div>
            <button
              className='p-1.5 text-gray-400 hover:text-red-600 transition-colors'
              onClick={() => logout()}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
