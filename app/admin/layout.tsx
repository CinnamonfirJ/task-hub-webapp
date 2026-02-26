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
      }
    }
  }, [isMounted, isLoadingUser, isAuthenticated, user, isLoginPage, router]);

  // Don't wrap login page with security logic or sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Purely client-side mount check
  if (!isMounted) return null;

  // 2. Authentication check
  // If we have a token but no user yet, wait for isLoadingUser
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  if (!isAuthenticated) {
    if (hasToken) {
      // We have a token but no user object, wait for the query to finish
      return (
        <div className='flex h-screen w-full flex-col items-center justify-center space-y-4 bg-[#F8F9FC]'>
          <Loader2 className='h-10 w-10 animate-spin text-[#6B46C1]' />
          <p className='text-sm font-medium text-gray-500'>
            Verifying session...
          </p>
        </div>
      );
    }
    // No token, useEffect handles the actual router push
    return null;
  }

  // 3. Authorization check (Only allow staff roles)
  const isStaff = user?.role !== "user" && user?.role !== "tasker";

  if (!isStaff) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[AdminLayout] Non-staff user blocked:", user?.role);
    }
    notFound();
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
