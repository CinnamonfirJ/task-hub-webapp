import { apiData } from "@/lib/api";
import { User } from "@/types/auth";
import { AdminDashboardStats, KYCRecord, Report, KYCStats } from "@/types/admin";

export const adminApi = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    const response = await apiData<{ status: string; data: AdminDashboardStats }>("/api/admin/dashboard", {
      method: "GET",
    });
    return response.data;
  },

  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await apiData<{ status: string; count: number; users: User[] }>("/api/admin/users", {
      method: "GET",
    });
    return response.users || [];
  },

  // KYC Management
  getKYCRequests: async (status?: string): Promise<KYCRecord[]> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    
    const response = await apiData<{ status: string; count: number; records: KYCRecord[] }>(
      `/api/admin/kyc?${params.toString()}`,
      { method: "GET" }
    );
    return response.records || [];
  },

  approveKYC: async (id: string): Promise<{ status: string; message: string }> => {
    return apiData<any>(`/api/admin/kyc/${id}/approve`, {
      method: "PATCH",
    });
  },

  rejectKYC: async (id: string, reason: string): Promise<{ status: string; message: string }> => {
    return apiData<any>(`/api/admin/kyc/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  },

  getKYCStats: async (): Promise<KYCStats> => {
    const response = await apiData<{ status: string; data: KYCStats }>("/api/admin/kyc/stats", {
      method: "GET",
    });
    return response.data;
  },

  // Reports Management
  getReports: async (status?: string): Promise<Report[]> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);

    const response = await apiData<{ status: string; count: number; reports: Report[] }>(
      `/api/admin/reports?${params.toString()}`,
      { method: "GET" }
    );
    return response.reports || [];
  },
};
