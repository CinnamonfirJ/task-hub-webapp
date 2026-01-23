"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, MessageSquare, User, Plus, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

// Inline Logo for now or import if refined
const SidebarLogo = () => (
  <div className="flex items-center gap-2 mb-2">
      <Activity className="h-6 w-6 text-primary" /> 
      <span className="text-xl font-bold tracking-tighter">Task Hub</span>
  </div>
);

const navItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: History, label: "History", href: "/history" },
  { icon: MessageSquare, label: "Message", href: "/messages" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r bg-white lg:flex">
      <div className="p-6">
        <SidebarLogo />
      </div>

      <nav className="flex-1 space-y-2 px-4 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/home" && pathname === "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#F5EEFF] text-[#6B46C1]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-[#6B46C1]" : "text-gray-400"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Link href="/post-task">
            <Button className="w-full bg-[#6B46C1] hover:bg-[#553C9A] py-6 text-sm font-bold flex items-center justify-center gap-2">
            <Plus size={18} />
            Post a task
            </Button>
        </Link>
      </div>
    </aside>
  );
}
