"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";

export function useAdminWithdrawals(params?: {
  page?: number;
  limit?: number;
  status?: string;
  payoutMethod?: string;
}) {
  return useQuery({
    queryKey: ["adminWithdrawals", params],
    queryFn: () => adminApi.getWithdrawals(params),
  });
}

export function useWithdrawalStats() {
  return useQuery({
    queryKey: ["adminWithdrawalStats"],
    queryFn: () => adminApi.getWithdrawalStats(),
    staleTime: 30_000,
  });
}

export function useApproveWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.approveWithdrawal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["adminWithdrawalStats"] });
    },
  });
}

export function useRejectWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminApi.rejectWithdrawal(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["adminWithdrawalStats"] });
    },
  });
}

export function useCompleteWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.completeWithdrawal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWithdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["adminWithdrawalStats"] });
    },
  });
}
