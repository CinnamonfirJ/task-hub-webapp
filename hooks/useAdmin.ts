import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminApi.getDashboardStats(),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => adminApi.getUsers(),
  });
}

export function useKYCRequests(status?: string) {
  return useQuery({
    queryKey: ["admin", "kyc", status],
    queryFn: () => adminApi.getKYCRequests(status),
  });
}

export function useApproveKYC() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApi.approveKYC(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useRejectKYC() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      adminApi.rejectKYC(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useKYCStats() {
  return useQuery({
    queryKey: ["admin", "kyc", "stats"],
    queryFn: () => adminApi.getKYCStats(),
  });
}

export function useAdminReports(status?: string) {
  return useQuery({
    queryKey: ["admin", "reports", status],
    queryFn: () => adminApi.getReports(status),
  });
}
