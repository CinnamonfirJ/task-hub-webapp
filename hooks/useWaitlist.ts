"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { waitlistApi } from "@/lib/api/waitlist";
import { useRouter } from "next/navigation";
import { AdminWaitlistResponse } from "@/types/admin";

/**
 * Hook for joining the waitlist
 */
export function useJoinWaitlist() {
  const router = useRouter();

  return useMutation({
    mutationFn: (email: string) => waitlistApi.join(email),
    onSuccess: () => {
      router.push("/waitlist-success");
    },
  });
}

/**
 * Hook for managing the waitlist (Admin only)
 */
export function useWaitlist(
  params?: Parameters<typeof waitlistApi.getWaitlist>[0],
) {
  return useQuery({
    queryKey: ["admin", "waitlist", params],
    queryFn: () => waitlistApi.getWaitlist(params),
  });
}
