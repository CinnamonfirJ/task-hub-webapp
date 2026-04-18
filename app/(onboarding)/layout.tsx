import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
import { SidebarProvider } from "@/components/admin/SidebarContext";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="min-h-screen bg-[#F8F9FC]">
          <Sidebar />
          <MobileNavbar />
          <main className="lg:ml-64 min-h-screen">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
