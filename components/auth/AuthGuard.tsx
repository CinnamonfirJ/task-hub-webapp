"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { checkProfileCompleteness } from "@/hooks/useCompleteProfile";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser, isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoadingUser) {
      if (!isAuthenticated) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (user && !checkProfileCompleteness(user)) {
        // Redirection logic to ensure user finishes verification
        const onboardingPaths = [
          "/complete-profile",
          "/verify-email",
          "/verification-complete",
        ];
        const isAlreadyOnOnboarding = onboardingPaths.some((path) =>
          pathname.startsWith(path),
        );

        if (!isAlreadyOnOnboarding) {
          router.replace("/complete-profile");
        }
      }
    }
  }, [isMounted, isLoadingUser, isAuthenticated, user, router, pathname]);

  if (!isMounted) {
    return null;
  }

  if (isLoadingUser) {
    return (
      <div className='flex h-screen w-full flex-col items-center justify-center space-y-4 bg-[#F8F9FC]'>
        <Loader2 className='h-10 w-10 animate-spin text-[#6B46C1]' />
        <p className='text-sm font-medium text-gray-500'>
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
