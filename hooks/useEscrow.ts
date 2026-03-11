"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/wallet";

/**
 * Hook for holding money in escrow when a task is assigned.
 */
export function useHoldEscrow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: walletApi.holdEscrow,
    onSuccess: () => {
      // Refresh user balance and transaction history
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // Also potentially invalidate task details if they show payment status
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });
}

/**
 * Hook for releasing held escrow to a tasker upon completion.
 */
export function useReleaseEscrow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: walletApi.releaseEscrow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });
}

/**
 * Hook for refunding escrowed money back to the user if task is cancelled.
 */
export function useRefundEscrow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: walletApi.refundEscrow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });
}
