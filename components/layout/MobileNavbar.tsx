"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  History,
  MessageSquare,
  User,
  Plus,
  Rss,
  LogOut,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useConversations } from "@/hooks/useChat";

export function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
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
    {
      icon: MessageSquare,
      label: "Message",
      href: "/messages",
      badge: totalUnread,
    },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  // Close drawer when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const userInitial = user?.fullName ? user.fullName[0].toUpperCase() : "U";

  return (
    <div className='lg:hidden'>
      {/* Top Navbar */}
      <nav className='fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between z-40'>
        <Link href='/profile' className='flex items-center gap-2'>
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt='Profile'
              className='h-8 w-8 rounded-full object-cover border border-gray-100'
            />
          ) : (
            <div className='h-8 w-8 rounded-full bg-[#6B46C1] flex items-center justify-center text-white text-xs font-bold'>
              {userInitial}
            </div>
          )}
        </Link>

        <Logo size='sm' />

        <button
          onClick={() => setIsOpen(true)}
          className='p-2 text-gray-500 hover:text-[#6B46C1] transition-colors'
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className='fixed inset-0 bg-black/40 backdrop-blur-sm z-50'
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className='fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 flex flex-col'
            >
              <div className='p-6 flex items-center justify-between border-b border-gray-50'>
                <Logo size='sm' />
                <button
                  onClick={() => setIsOpen(false)}
                  className='p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors'
                >
                  <X size={20} />
                </button>
              </div>

              <div className='flex-1 py-6 px-4 space-y-2 overflow-y-auto'>
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href === "/home" && pathname === "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between rounded-xl px-4 py-4 text-sm font-bold transition-all ${
                        isActive
                          ? "bg-purple-50 text-[#6B46C1]"
                          : "text-gray-500 hover:bg-gray-50 active:scale-[0.98]"
                      }`}
                    >
                      <div className='flex items-center gap-4'>
                        <item.icon
                          size={20}
                          className={
                            isActive ? "text-[#6B46C1]" : "text-gray-400"
                          }
                        />
                        {item.label}
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span className='flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm shadow-red-200'>
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>

              {isTasker ? (
                <div className='p-6 border-t border-gray-50'>
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    variant='outline'
                    className='w-full py-7 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 transition-all active:scale-95'
                  >
                    <LogOut size={20} />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className='p-6 border-t border-gray-50'>
                  <Link href='/post-task'>
                    <Button className='w-full bg-[#6B46C1] hover:bg-[#553C9A] py-7 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-purple-100 transition-all active:scale-95'>
                      <Plus size={20} />
                      Post a task
                    </Button>
                  </Link>
                </div>
              )}

              <div className='p-6 bg-gray-50/50 mt-auto'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-full bg-[#6B46C1] flex items-center justify-center text-white text-sm font-bold shadow-md shadow-purple-200'>
                    {userInitial}
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-bold text-gray-900 truncate'>
                      {user?.fullName}
                    </p>
                    <p className='text-[10px] font-bold text-gray-400 uppercase tracking-tight'>
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
