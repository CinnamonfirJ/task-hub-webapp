"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isLoadingUser, isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoadingUser && isAuthenticated) {
      if (!pathname.startsWith("/verify-email")) {
        router.replace("/home");
      }
    }
  }, [isMounted, isLoadingUser, isAuthenticated, router, pathname]);

  if (!isMounted) {
    return null;
  }

  if (isLoadingUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B46C1]" />
      </div>
    );
  }

  if (isAuthenticated && !pathname.startsWith("/verify-email")) {
    return null;
  }

  return <>{children}</>;
}
