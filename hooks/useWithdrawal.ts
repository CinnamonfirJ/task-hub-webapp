"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/wallet";

/**
 * Hook for taskers to request a withdrawal.
 */
export function useWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: walletApi.requestWithdrawal,
    onSuccess: () => {
      // Refresh balance and transactions
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

/**
 * Hook to verify bank account details before withdrawal.
 */
export function useVerifyBank(accountNumber: string, bankCode: string) {
  return useQuery({
    queryKey: ["wallet", "verify-bank", accountNumber, bankCode],
    queryFn: () => walletApi.verifyBankAccount(accountNumber, bankCode),
    enabled: accountNumber.length === 10 && !!bankCode,
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 mins
  });
}
