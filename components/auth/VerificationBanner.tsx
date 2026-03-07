"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/lib/api/auth";
import { usePathname, useRouter } from "next/navigation";
import { checkProfileCompleteness } from "@/hooks/useCompleteProfile";
import { AlertCircle, Loader2, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function VerificationBanner() {
  const { user, isLoadingUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);

  // Define onboarding paths to hide the banner
  const onboardingPaths = [
    "/complete-profile",
    "/verify-email",
    "/verification-complete",
  ];
  const isOnOnboardingPage = onboardingPaths.some((path) =>
    pathname.startsWith(path),
  );

  const isProfileComplete = user ? checkProfileCompleteness(user) : true;

  // Don't show if loading, no user, already complete, or on onboarding pages
  if (isLoadingUser || !user || isProfileComplete || isOnOnboardingPage) {
    return null;
  }

  const handleResend = async () => {
    if (!user.emailAddress && !user.email) return;
    setIsResending(true);
    try {
      const email = user.emailAddress || user.email || "";
      const role = user.role || "user";
      await authApi.resendCode(email, role);
      toast.success("Verification email sent successfully");
      router.push(
        `/verify-email?email=${encodeURIComponent(email)}&type=${role}`,
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  const isEmailUnverified = !user.isEmailVerified;

  return (
    <div className='sticky top-0 lg:top-0 z-50 bg-amber-50 border-b border-amber-200 px-4 py-3 shadow-sm'>
      <div className='max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3'>
        <div className='flex items-center gap-3 text-amber-800'>
          <AlertCircle size={20} className='shrink-0' />
          <p className='text-sm font-medium text-center sm:text-left'>
            {isEmailUnverified
              ? "Your email is not verified. Please verify your email to access all features."
              : "Your identity is not verified. Secure your account to start taking tasks."}
          </p>
        </div>
        {isEmailUnverified ? (
          <button
            onClick={handleResend}
            disabled={isResending}
            className='flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-70 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0'
          >
            {isResending ? (
              <Loader2 size={14} className='animate-spin' />
            ) : (
              <Send size={14} />
            )}
            Resend verification email
          </button>
        ) : (
          <button
            onClick={() => router.push("/complete-profile")}
            className='flex items-center gap-2 bg-[#6B46C1] hover:bg-[#553C9A] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0'
          >
            Complete Profile
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
