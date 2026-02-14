import { Sidebar } from "@/components/layout/Sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8F9FC]">
        <Sidebar />
        <main className="lg:ml-64 min-h-screen">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
