"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/wallet";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook for taskers to request a withdrawal.
 */
export function useWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => walletApi.requestWithdrawal(amount),
    onSuccess: () => {
      // Refresh balance and transactions
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["taskerWallet"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
    },
  });
}

/**
 * Hook for taskers to request a Stellar withdrawal.
 */
export function useStellarWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      amount: number;
      payoutMethod: string;
      transactionPin: string;
      stellarAddress: string;
    }) => walletApi.requestStellarWithdrawal(payload),
    onSuccess: () => {
      // Refresh balance and transactions
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["taskerWallet"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
    },
  });
}

/**
 * Hook to get the list of supported banks.
 */
export function useBanks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["banks"],
    queryFn: () => walletApi.getBanks(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: user?.role === "tasker",
  });
}

/**
 * Hook to get tasker's saved bank account.
 */
export function useTaskerBankAccount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["bankAccount"],
    queryFn: () => walletApi.getBankAccount(),
    enabled: user?.role === "tasker",
  });
}

/**
 * Hook to set/update tasker's bank account.
 */
export function useSetBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ accountNumber, bankCode }: { accountNumber: string; bankCode: string }) =>
      walletApi.setBankAccount(accountNumber, bankCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankAccount"] });
      queryClient.invalidateQueries({ queryKey: ["taskerWallet"] });
    },
  });
}

/**
 * Hook to get withdrawal history.
 */
export function useWithdrawalHistory(params: { page?: number; limit?: number } = {}) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["withdrawals", params],
    queryFn: () => walletApi.getWithdrawalHistory(params),
    enabled: user?.role === "tasker",
  });
}
