"use client";
import { useQuery } from "@tanstack/react-query";
import { adminPaymentsApi } from "@/lib/api/admin/payments";
import { AdminPaymentFilters } from "@/types/transaction";

/**
 * Hook to get aggregate payment statistics for the admin dashboard.
 */
export function useAdminPaymentStats() {
  return useQuery({
    queryKey: ["admin", "payments", "stats"],
    queryFn: adminPaymentsApi.getStats,
  });
}

/**
 * Hook to get a paginated list of all transactions for admin oversight.
 */
export function useAdminPayments(filters: AdminPaymentFilters = {}) {
  return useQuery({
    queryKey: ["admin", "payments", "history", filters],
    queryFn: () => adminPaymentsApi.getAllPayments(filters),
  });
}

/**
 * Hook to get detailed information about a single transaction by ID.
 */
export function useAdminPaymentDetail(id: string | null) {
  return useQuery({
    queryKey: ["admin", "payments", "detail", id],
    queryFn: () => adminPaymentsApi.getPaymentById(id!),
    enabled: !!id,
  });
}
