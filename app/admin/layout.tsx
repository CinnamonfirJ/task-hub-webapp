import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { FEATURES } from "@/lib/features";
import { notFound } from "next/navigation";
import { SidebarProvider } from "@/components/admin/SidebarContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!FEATURES.admin) {
    notFound();
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <div className='min-h-screen bg-[#F9FAFB]'>
          <AdminSidebar />
          <div className='lg:pl-64'>
            <DashboardHeader />
            <main className='p-6'>{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
