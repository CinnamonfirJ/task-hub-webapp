import { apiData } from "@/lib/api";
import { User } from "@/types/auth";
import {
  AdminDashboardStats,
  KYCRecord,
  KYCListResponse,
  Report,
  ReportListResponse,
  ReportDetailResponse,
  KYCStats,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminProfile,
  SystemHealthStats,
  UserStats,
  AdminUserListResponse,
  AdminUserDetailResponse,
  AdminTaskerListResponse,
  AdminTaskerDetailResponse,
  AdminTaskListResponse,
  AdminTaskDetailResponse,
  TaskStats,
  PaymentStats,
  TransactionListResponse,
  TransactionDetailResponse,
  ActivityLogResponse,
  MessageStats,
  ConversationListResponse,
  ConversationDetailResponse,
  SystemSettings,
  StaffStats,
  StaffListResponse,
  StaffDetailResponse,
  CreateStaffInput,
  UpdateStaffStatusInput,
  ExportResponse,
  DashboardExportRecord,
  TaskExportRecord,
  PaymentExportRecord,
  UserExportRecord,
  TaskerExportRecord,
} from "@/types/admin";

export const adminApi = {
  // Authentication & Profile
  login: async (
    credentials: AdminLoginRequest,
  ): Promise<AdminLoginResponse> => {
    return apiData<AdminLoginResponse>("/api/admin/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  getMe: async (): Promise<AdminProfile> => {
    const response = await apiData<{
      status: string;
      data: { admin: AdminProfile };
    }>("/api/admin/me", {
      method: "GET",
    });
    return response.data.admin;
  },

  getSystemStats: async (): Promise<SystemHealthStats> => {
    const response = await apiData<{ status: string; data: SystemHealthStats }>(
      "/api/admin/me/system-stats",
      {
        method: "GET",
      },
    );
    return response.data;
  },

  // Dashboard Statistics
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    const response = await apiData<{
      status: string;
      data: AdminDashboardStats;
    }>("/api/admin/dashboard/stats", {
      method: "GET",
    });
    return response.data;
  },

  // User Management
  getUserStats: async (): Promise<UserStats> => {
    const response = await apiData<{ status: string; data: UserStats }>(
      "/api/admin/users/stats",
      { method: "GET" },
    );
    return response.data;
  },

  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    verified?: boolean;
    kycVerified?: boolean;
    sortBy?: string;
    order?: string;
  }): Promise<AdminUserListResponse["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }

    const response = await apiData<AdminUserListResponse>(
      `/api/admin/users?${query.toString()}`,
      { method: "GET" },
    );
    return response.data;
  },

  getUserDetails: async (
    id: string,
  ): Promise<AdminUserDetailResponse["data"]> => {
    const response = await apiData<AdminUserDetailResponse>(
      `/api/admin/users/${id}`,
      { method: "GET" },
    );
    return response.data;
  },

  activateUser: async (id: string): Promise<any> => {
    return apiData<any>(`/api/admin/users/${id}/activate`, {
      method: "PATCH",
    });
  },

  deactivateUser: async (id: string, reason?: string): Promise<any> => {
    return apiData<any>(`/api/admin/users/${id}/deactivate`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  },

  lockUser: async (
    id: string,
    data: { reason: string; duration?: number },
  ): Promise<any> => {
    return apiData<any>(`/api/admin/users/${id}/lock`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  unlockUser: async (id: string): Promise<any> => {
    return apiData<any>(`/api/admin/users/${id}/unlock`, {
      method: "PATCH",
    });
  },

  softDeleteUser: async (id: string, reason?: string): Promise<any> => {
    return apiData<any>(`/api/admin/users/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ reason }),
    });
  },

  restoreUser: async (id: string): Promise<any> => {
    return apiData<any>(`/api/admin/users/${id}/restore`, {
      method: "PATCH",
    });
  },

  // KYC Management
  getKYCRequests: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: string;
  }): Promise<KYCListResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    return apiData<KYCListResponse>(`/api/admin/kyc?${query.toString()}`, {
      method: "GET",
    });
  },

  approveKYC: async (
    id: string,
    notes?: string,
  ): Promise<{ status: string; message: string }> => {
    return apiData<any>(`/api/admin/kyc/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ notes }),
    });
  },

  rejectKYC: async (
    id: string,
    reason: string,
  ): Promise<{ status: string; message: string }> => {
    return apiData<any>(`/api/admin/kyc/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  },

  getKYCStats: async (): Promise<KYCStats> => {
    const response = await apiData<{ status: string; data: KYCStats }>(
      "/api/admin/kyc/stats",
      {
        method: "GET",
      },
    );
    return response.data;
  },

  // Reports Management
  getReports: async (params?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ReportListResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    return apiData<ReportListResponse>(
      `/api/admin/reports?${query.toString()}`,
      { method: "GET" },
    );
  },

  getReportDetails: async (
    id: string,
  ): Promise<ReportDetailResponse["data"]> => {
    const response = await apiData<ReportDetailResponse>(
      `/api/admin/reports/${id}`,
      { method: "GET" },
    );
    return response.data;
  },

  resolveReport: async (
    id: string,
    data: {
      resolution: string;
      action_taken: string;
      refund_amount?: number;
      warning_issued?: boolean;
      notes?: string;
    },
  ): Promise<any> => {
    return apiData<any>(`/api/admin/reports/${id}/resolve`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  getActivityLogs: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    adminId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ActivityLogResponse["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<ActivityLogResponse>(
      `/api/admin/reports/activity-logs?${query.toString()}`,
      { method: "GET" },
    );
    return response.data;
  },

  // Messages & Support
  getMessageStats: async (): Promise<MessageStats> => {
    const response = await apiData<{ status: string; data: MessageStats }>(
      "/api/admin/messages/stats",
      { method: "GET" },
    );
    return response.data;
  },

  getConversations: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    unread?: boolean;
  }): Promise<ConversationListResponse["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<ConversationListResponse>(
      `/api/admin/messages?${query.toString()}`,
      { method: "GET" },
    );
    return response.data;
  },

  getConversationDetails: async (
    id: string,
  ): Promise<ConversationDetailResponse["data"]> => {
    const response = await apiData<ConversationDetailResponse>(
      `/api/admin/messages/${id}`,
      { method: "GET" },
    );
    return response.data;
  },

  sendAdminMessage: async (
    conversationId: string,
    data: { text: string; priority?: string; category?: string },
  ): Promise<any> => {
    return apiData<any>(`/api/admin/messages/${conversationId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // System Settings
  getSystemSettings: async (): Promise<SystemSettings> => {
    const response = await apiData<{ status: string; data: SystemSettings }>(
      "/api/admin/settings",
      { method: "GET" },
    );
    return response.data;
  },

  updateSystemSettings: async (settings: Record<string, any>): Promise<any> => {
    return apiData<any>("/api/admin/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
    });
  },

  // Tasker Management
  getTaskers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    verified?: boolean;
    categories?: string;
    sortBy?: string;
    order?: string;
  }): Promise<AdminTaskerListResponse["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<AdminTaskerListResponse>(
      `/api/admin/taskers?${query.toString()}`,
      { method: "GET" },
    );
    return response.data;
  },

  getTaskerDetails: async (
    id: string,
  ): Promise<AdminTaskerDetailResponse["data"]> => {
    const response = await apiData<AdminTaskerDetailResponse>(
      `/api/admin/taskers/${id}`,
      { method: "GET" },
    );
    return response.data;
  },

  verifyTasker: async (
    id: string,
    verificationNotes?: string,
  ): Promise<any> => {
    return apiData<any>(`/api/admin/taskers/${id}/verify`, {
      method: "PATCH",
      body: JSON.stringify({ verificationNotes }),
    });
  },

  suspendTasker: async (
    id: string,
    data: { reason: string; duration?: number },
  ): Promise<any> => {
    return apiData<any>(`/api/admin/taskers/${id}/suspend`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  activateTasker: async (id: string): Promise<any> => {
    return apiData<any>(`/api/admin/taskers/${id}/activate`, {
      method: "PATCH",
    });
  },

  // Task Management
  getTaskStats: async (): Promise<TaskStats> => {
    const response = await apiData<{ status: string; data: TaskStats }>(
      "/api/admin/tasks/stats",
      { method: "GET" },
    );
    return response.data;
  },

  getTasks: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    userId?: string;
    taskerId?: string;
    search?: string;
    sortBy?: string;
    order?: string;
  }): Promise<AdminTaskListResponse["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<AdminTaskListResponse>(
      `/api/admin/tasks?${query.toString()}`,
      { method: "GET" },
    );
    return response.data;
  },

  getTaskDetails: async (
    id: string,
  ): Promise<AdminTaskDetailResponse["data"]> => {
    const response = await apiData<AdminTaskDetailResponse>(
      `/api/admin/tasks/${id}`,
      { method: "GET" },
    );
    return response.data;
  },

  forceCancelTask: async (
    id: string,
    data: { reason: string; refundUser?: boolean },
  ): Promise<any> => {
    return apiData<any>(`/api/admin/tasks/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  forceCompleteTask: async (
    id: string,
    data: {
      reason: string;
      releaseToTasker?: boolean;
      adjustedAmount?: number;
    },
  ): Promise<any> => {
    return apiData<any>(`/api/admin/tasks/${id}/complete`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Financials & Payments
  getPaymentStats: async (): Promise<PaymentStats> => {
    const response = await apiData<{ status: string; data: PaymentStats }>(
      "/api/admin/payments",
      { method: "GET" },
    );
    return response.data;
  },

  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    userId?: string;
    taskerId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<TransactionListResponse["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<TransactionListResponse>(
      `/api/admin/payments/history?${query.toString()}`,
      { method: "GET" },
    );
    return response.data;
  },

  getTransactionDetails: async (
    id: string,
  ): Promise<TransactionDetailResponse["data"]> => {
    const response = await apiData<TransactionDetailResponse>(
      `/api/admin/payments/${id}`,
      { method: "GET" },
    );
    return response.data;
  },

  // Staff Management
  getStaffStats: async (): Promise<StaffStats> => {
    const response = await apiData<{ status: string; data: StaffStats }>(
      "/api/admin/staff/stats",
      { method: "GET" },
    );
    return response.data;
  },

  getStaffList: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
  }): Promise<StaffListResponse["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<StaffListResponse>(
      `/api/admin/staff?${query.toString()}`,
      { method: "GET" },
    );
    return response.data;
  },

  createStaffAccount: async (data: CreateStaffInput): Promise<any> => {
    return apiData<any>("/api/admin/staff", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getStaffDetails: async (id: string): Promise<StaffDetailResponse["data"]> => {
    const response = await apiData<StaffDetailResponse>(
      `/api/admin/staff/${id}`,
      { method: "GET" },
    );
    return response.data;
  },

  updateStaffStatus: async (
    id: string,
    data: UpdateStaffStatusInput,
  ): Promise<any> => {
    return apiData<any>(`/api/admin/staff/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Data Exports
  exportDashboard: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ExportResponse<DashboardExportRecord>["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<ExportResponse<DashboardExportRecord>>(
      `/api/admin/reports/export/dashboard?${query.toString()}`,
      { method: "GET" },
    );
    return response.data;
  },

  exportTasks: async (params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    category?: string;
  }): Promise<ExportResponse<TaskExportRecord>["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<ExportResponse<TaskExportRecord>>(
      `/api/admin/reports/export/tasks?${query.toString()}`,
      { method: "GET" },
    );
    return response.data;
  },

  exportPayments: async (): Promise<
    ExportResponse<PaymentExportRecord>["data"]
  > => {
    const response = await apiData<ExportResponse<PaymentExportRecord>>(
      "/api/admin/reports/export/payments",
      { method: "GET" },
    );
    return response.data;
  },

  exportUsers: async (): Promise<ExportResponse<UserExportRecord>["data"]> => {
    const response = await apiData<ExportResponse<UserExportRecord>>(
      "/api/admin/reports/export/users",
      { method: "GET" },
    );
    return response.data;
  },

  exportTaskers: async (): Promise<
    ExportResponse<TaskerExportRecord>["data"]
  > => {
    const response = await apiData<ExportResponse<TaskerExportRecord>>(
      "/api/admin/reports/export/taskers",
      { method: "GET" },
    );
    return response.data;
  },
};
