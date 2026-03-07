"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/lib/api/auth";
import { usePathname, useRouter } from "next/navigation";
import { AlertCircle, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export function VerificationBanner() {
  const { user, isLoadingUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);

  // Only show on home page for unverified users
  if (isLoadingUser || !user || user.isEmailVerified || pathname !== "/home") {
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

      // Route to verify page
      router.push(
        `/verify-email?email=${encodeURIComponent(email)}&type=${role}`,
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className='sticky top-0 lg:top-0 z-50 bg-amber-50 border-b border-amber-200 px-4 py-3 shadow-sm'>
      <div className='max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3'>
        <div className='flex items-center gap-3 text-amber-800'>
          <AlertCircle size={20} className='shrink-0' />
          <p className='text-sm font-medium text-center sm:text-left'>
            Your email is not verified. Please verify your email to access all
            features.
          </p>
        </div>
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
      </div>
    </div>
  );
}
