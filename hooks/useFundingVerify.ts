"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/wallet";

/**
 * Hook to verify wallet funding after redirect from Paystack.
 * Polls the backend every 3 seconds while status is "pending".
 */
export function useFundingVerify(reference: string | null) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["wallet", "verify", reference],
    queryFn: () => walletApi.verifyFunding(reference!),
    enabled: !!reference,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Continue polling if still pending
      return data?.transactionStatus === "pending" ? 3000 : false;
    },
    // Invalidate user data to refresh balance once success is confirmed
    placeholderData: (previousData) => previousData,
    staleTime: 0,
  });
}

/**
 * Effect-like helper to trigger profile refresh on success.
 * This can be called from the callback component.
 */
export function useRefreshBalanceOnSuccess() {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    };
}
