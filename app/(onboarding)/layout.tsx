import { AuthGuard } from "@/components/auth/AuthGuard";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        {children}
      </div>
    </AuthGuard>
  );
}
