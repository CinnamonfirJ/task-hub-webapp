"use client";
import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/wallet";
import { TransactionFilters } from "@/types/transaction";

/**
 * Hook to fetch transaction history for the current user.
 */
export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => walletApi.getTransactions(filters),
  });
}
