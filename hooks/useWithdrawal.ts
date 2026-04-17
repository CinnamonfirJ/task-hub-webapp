"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/wallet";
import { useAuth } from "@/hooks/useAuth";

/**
 * Bank transfer withdrawal with PIN + bankDetails (correct payload per API docs).
 */
export function useBankWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      amount: number;
      payoutMethod: "bank_transfer";
      transactionPin: string;
      bankDetails: {
        accountNumber: string;
        bankName: string;
        accountName: string;
      };
    }) => walletApi.requestBankWithdrawal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["taskerWallet"] });
      queryClient.invalidateQueries({ queryKey: ["taskerBalance"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
    },
  });
}

/**
 * Hook for taskers to request a withdrawal (legacy simple — kept for backward compat).
 */
export function useWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => walletApi.requestWithdrawal(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["taskerWallet"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
    },
  });
}

/**
 * Stellar crypto withdrawal with PIN + stellarAddress.
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
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["taskerWallet"] });
      queryClient.invalidateQueries({ queryKey: ["taskerBalance"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
    },
  });
}

/**
 * Set up or reset the 4-digit transaction PIN.
 */
export function useSetupPin() {
  return useMutation({
    mutationFn: ({ pin, password }: { pin: string; password: string }) =>
      walletApi.setupPin(pin, password),
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
    staleTime: 5 * 60 * 1000,
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
