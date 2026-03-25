import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { VerificationBanner } from "@/components/auth/VerificationBanner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className='min-h-screen bg-[#F8F9FC]'>
        <Sidebar />
        <MobileNavbar />
        <main className='lg:ml-64 min-h-screen'>
          <DashboardHeader />
          <VerificationBanner />
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
