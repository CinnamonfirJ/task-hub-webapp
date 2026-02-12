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
  ShieldCheck
} from "lucide-react";

const navItems = [
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

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r bg-white lg:flex">
      <div className="p-6">
        <div className="flex flex-col">
          <span className="text-[#6B46C1] font-bold text-xl">Task hub Admin</span>
          <span className="text-gray-400 text-xs">System control panel</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#6B46C1] text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
