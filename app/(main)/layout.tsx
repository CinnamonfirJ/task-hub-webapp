import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
import { AuthGuard } from "@/components/auth/AuthGuard";

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
        <main className='lg:ml-64 min-h-screen pt-16 lg:pt-0'>{children}</main>
      </div>
    </AuthGuard>
  );
}
