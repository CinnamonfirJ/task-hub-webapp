"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  History,
  MessageSquare,
  User,
  Plus,
  Rss,
  LogOut,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useChat";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { data: convData } = useConversations();
  const isTasker = user?.role === "tasker";

  const totalUnread =
    convData?.conversations?.reduce(
      (acc, conv) => acc + (conv.unreadCount || 0),
      0,
    ) || 0;

  const navItems = [
    { icon: Home, label: "Home", href: "/home" },
    {
      icon: isTasker ? Rss : History,
      label: isTasker ? "Feed" : "History",
      href: isTasker ? "/feed" : "/history",
    },
    { icon: Wallet, label: "Payment History", href: "/payment-history" },
    { icon: MessageSquare, label: "Message", href: "/messages" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <aside className='fixed left-0 top-0 hidden h-screen w-64 flex-col border-r bg-white lg:flex'>
      <div className='p-6'>
        <Logo />
      </div>

      <nav className='flex-1 space-y-2 px-4 py-4'>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/home" && pathname === "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#F5EEFF] text-[#6B46C1]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className='flex items-center gap-3'>
                <item.icon
                  size={20}
                  className={isActive ? "text-[#6B46C1]" : "text-gray-400"}
                />
                {item.label}
              </div>
              {item.label === "Message" && totalUnread > 0 && (
                <span className='flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white'>
                  {totalUnread > 9 ? "9+" : totalUnread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {isTasker ? (
        <div className='p-4 border-t'>
          <Button
            onClick={() => logout()}
            variant='outline'
            className='w-full py-6 text-sm font-bold flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100'
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      ) : (
        <div className='p-4 border-t'>
          <Link href='/post-task'>
            <Button className='w-full bg-[#6B46C1] hover:bg-[#553C9A] py-6 text-sm font-bold flex items-center justify-center gap-2'>
              <Plus size={18} />
              Post a task
            </Button>
          </Link>
        </div>
      )}
    </aside>
  );
}
