"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { FEATURES } from "@/lib/features";
import { notFound, usePathname, useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/admin/SidebarContext";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoadingUser, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isMounted && !isLoadingUser && !isLoginPage) {
      if (!isAuthenticated) {
        router.replace("/admin/login");
      } else if (user?.role !== "admin" && user?.role !== "super_admin") {
        // Handled by return if we want immediate 404, or we can use notFound() here
      }
    }
  }, [isMounted, isLoadingUser, isAuthenticated, user, isLoginPage, router]);

  if (!FEATURES.admin) {
    notFound();
  }

  // Purely client-side mount check
  if (!isMounted) return null;

  // Don't wrap login page with security logic or sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoadingUser) {
    return (
      <div className='flex h-screen w-full flex-col items-center justify-center space-y-4 bg-[#F8F9FC]'>
        <Loader2 className='h-10 w-10 animate-spin text-[#6B46C1]' />
        <p className='text-sm font-medium text-gray-500'>
          Checking admin authorization...
        </p>
      </div>
    );
  }

  // If authenticated but not an admin, show 404
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    user?.role !== "super_admin"
  ) {
    notFound();
  }

  // If not authenticated, the useEffect will handle the redirect, but we return null to avoid flashing
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className='min-h-screen bg-[#F9FAFB]'>
        <AdminSidebar />
        <div className='lg:pl-64'>
          <DashboardHeader />
          <main className='p-6'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
