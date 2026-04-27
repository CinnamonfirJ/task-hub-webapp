"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/wallet";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook to get the current user's wallet balance.
 * Pulls directly from the auth user object.
 */
export function useWalletBalance() {
  const { user } = useAuth();
  return {
    balance: user?.wallet ?? 0,
    currency: "NGN",
    isLoading: !user,
  };
}

/**
 * Hook to initialize wallet funding.
 * Redirects the user to Paystack on success.
 */
export function useInitializeFunding() {
  return useMutation({
    mutationFn: walletApi.initializeFunding,
    onSuccess: (data) => {
      // Store reference so verify page can pick it up
      if (typeof window !== "undefined") {
        localStorage.setItem("pendingPaymentRef", data.reference);
      }
      // Redirect to Paystack checkout
      if (data.authorizationUrl) {
          window.location.href = data.authorizationUrl;
      }
    },
  });
}

export function useTaskerWallet() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["taskerWallet"],
    queryFn: () => walletApi.getTaskerBalance(),
    enabled: user?.role === "tasker",
  });
}

export function useStellarDepositInfo() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["stellarDepositInfo"],
    queryFn: () => walletApi.getDepositInfo(),
    enabled: user?.role === "tasker",
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (user not found) it's a role/auth issue
      if (error?.status === 404) return false;
      return failureCount < 2;
    },
  });
}
