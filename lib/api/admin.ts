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
  AdminPaymentFilters,
  MessageStats,
  ConversationListResponse,
  ConversationDetailData,
  SystemSettings,
  StaffStats,
  StaffListResponse,
  StaffDetailResponse,
  CreateStaffInput,
  UpdateStaffStatusInput,
  SetupAdminInput,
  ExportResponse,
  DashboardExportRecord,
  TaskExportRecord,
  PaymentExportRecord,
  UserExportRecord,
  TaskerExportRecord,
  AdminCategoryListResponse,
  AdminCategoryDetailResponse,
  CreateCategoryRequest,
  AdminCategory,
  UpdateCategoryRequest,
  AdminWaitlistResponse,
  AdminNotification,
  AdminNotificationStats,
  AdminNotificationListResponse,
  AdminNotificationStatsResponse,
  SendNotificationRequest,
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
    const response = await apiData<any>("/api/admin/me", {
      method: "GET",
    });

    const admin =
      response?.data?.admin || response?.admin || response?.data || response;

    if (!admin || typeof admin !== "object") {
      throw new Error("Failed to retrieve admin profile from response");
    }

    // Normalize fields for consistency across the app
    if (!admin._id && admin.id) admin._id = admin.id;
    if (!admin.fullName && admin.name) admin.fullName = admin.name;
    if (!admin.emailAddress && admin.email) admin.emailAddress = admin.email;

    return admin;
  },

  getSystemStats: async (): Promise<SystemHealthStats> => {
    const response = await apiData<any>("/api/admin/me/system-stats", {
      method: "GET",
    });
    return response.data ?? response;
  },

  // Dashboard Statistics
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    const response = await apiData<any>("/api/admin/dashboard/stats", {
      method: "GET",
    });
    return response.data ?? response;
  },

  // User Management
  getUserStats: async (): Promise<UserStats> => {
    const response = await apiData<any>("/api/admin/users/stats", {
      method: "GET",
    });
    return response.data ?? response;
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
        if (value !== undefined) {
          if (key === "status") {
            if (value === "active") query.append("isActive", "true");
            else if (value === "inactive") query.append("isActive", "false");
            else if (value === "locked") query.append("isLocked", "true");
            else query.append(key, String(value));
          } else {
            query.append(key, String(value));
          }
        }
      });
    }

    const response = await apiData<any>(
      `/api/admin/users?${query.toString()}`,
      { method: "GET" },
    );
    return response.data ?? response;
  },

  getUserDetails: async (
    id: string,
  ): Promise<AdminUserDetailResponse["data"]> => {
    const response = await apiData<any>(`/api/admin/users/${id}`, {
      method: "GET",
    });
    return response.data ?? response;
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
    search?: string;
  }): Promise<KYCListResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          query.append(key, String(value));
        }
      });
    }
    const response = await apiData<any>(`/api/admin/kyc?${query.toString()}`, {
      method: "GET",
    });
    return response.data ?? response;
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
    const response = await apiData<any>("/api/admin/kyc/stats", {
      method: "GET",
    });
    return response.data ?? response;
  },

  // Reports Management
  getReports: async (params?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ReportListResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<any>(
      `/api/admin/reports?${query.toString()}`,
      { method: "GET" },
    );
    return response.data ?? response;
  },

  getReportDetails: async (
    id: string,
  ): Promise<ReportDetailResponse["data"]> => {
    const response = await apiData<any>(`/api/admin/reports/${id}`, {
      method: "GET",
    });
    return response.data ?? response;
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
    resourceType?: string;
    userId?: string;
    adminId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<ActivityLogResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<any>(
      `/api/admin/reports/activity-logs?${query.toString()}`,
      { method: "GET" },
    );
    return response ?? response;
  },

  getSecuritySummary: async (userId: string): Promise<any> => {
    return apiData<any>(`/api/admin/reports/activity-logs/summary/${userId}`, {
      method: "GET",
    });
  },

  // Messages & Support
  getMessageStats: async (): Promise<MessageStats> => {
    const response = await apiData<any>("/api/admin/messages/stats", {
      method: "GET",
    });
    return response.data ?? response;
  },

  getConversations: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    unread?: boolean;
  }): Promise<ConversationListResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<any>(
      `/api/admin/messages?${query.toString()}`,
      { method: "GET" },
    );
    return response.data ?? response;
  },

  getConversationDetails: async (
    id: string,
  ): Promise<ConversationDetailData> => {
    const response = await apiData<any>(`/api/admin/messages/${id}`, {
      method: "GET",
    });
    return response.data ?? response;
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
    const response = await apiData<any>("/api/admin/settings", {
      method: "GET",
    });
    return response.data ?? response;
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
        if (value !== undefined) {
          if (key === "status") {
            if (value === "active") query.append("isActive", "true");
            else if (value === "inactive") query.append("isActive", "false");
            else if (value === "locked") query.append("isLocked", "true");
            else query.append(key, String(value));
          } else {
            query.append(key, String(value));
          }
        }
      });
    }
    const response = await apiData<any>(
      `/api/admin/taskers?${query.toString()}`,
      { method: "GET" },
    );
    return response.data ?? response;
  },

  getTaskerDetails: async (
    id: string,
  ): Promise<AdminTaskerDetailResponse["data"]> => {
    const response = await apiData<any>(`/api/admin/taskers/${id}`, {
      method: "GET",
    });
    return response.data ?? response;
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

  lockTasker: async (
    id: string,
    data: { reason: string; duration?: number },
  ): Promise<any> => {
    return apiData<any>(`/api/admin/taskers/${id}/lock`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  unlockTasker: async (id: string): Promise<any> => {
    return apiData<any>(`/api/admin/taskers/${id}/unlock`, {
      method: "PATCH",
    });
  },

  // Task Management
  getTaskStats: async (): Promise<TaskStats> => {
    const response = await apiData<any>("/api/admin/tasks/stats", {
      method: "GET",
    });
    return response.data ?? response;
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
  }): Promise<AdminTaskListResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<any>(
      `/api/admin/tasks?${query.toString()}`,
      { method: "GET" },
    );
    const data = response.data ?? response;

    // Normalize assignedTasker to assignedTo for compatibility with new types
    if (data && Array.isArray(data.tasks)) {
      data.tasks = data.tasks.map((task: any) => ({
        ...task,
        assignedTo: task.assignedTo || task.assignedTasker,
      }));
    }

    return data;
  },

  getTaskDetails: async (
    id: string,
  ): Promise<AdminTaskDetailResponse["data"]> => {
    const response = await apiData<any>(`/api/admin/tasks/${id}`, {
      method: "GET",
    });
    return response.data ?? response;
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
    const response = await apiData<any>("/api/admin/payments", {
      method: "GET",
    });
    return response.data ?? response;
  },

  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    userId?: string;
    taskerId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<TransactionListResponse["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<any>(
      `/api/admin/payments/history?${query.toString()}`,
      { method: "GET" },
    );
    return response.data ?? response;
  },

  getTransactionDetails: async (
    id: string,
  ): Promise<TransactionDetailResponse["data"]> => {
    const response = await apiData<any>(`/api/admin/payments/${id}`, {
      method: "GET",
    });
    return response.data ?? response;
  },

  // Staff Management
  getStaffStats: async (): Promise<StaffStats> => {
    const response = await apiData<any>("/api/admin/staff/stats", {
      method: "GET",
    });
    return response.data ?? response;
  },

  getStaffList: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<StaffListResponse["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === "status") {
            if (value === "active") query.append("isActive", "true");
            else if (value === "inactive") query.append("isActive", "false");
            else query.append(key, String(value));
          } else {
            query.append(key, String(value));
          }
        }
      });
    }
    const response = await apiData<any>(
      `/api/admin/staff?${query.toString()}`,
      { method: "GET" },
    );
    return response.data ?? response;
  },

  createStaffAccount: async (data: CreateStaffInput): Promise<any> => {
    return apiData<any>("/api/admin/staff/invite", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  setupAdminAccount: async (data: SetupAdminInput): Promise<any> => {
    return apiData<any>("/api/admin/staff/setup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getStaffDetails: async (id: string): Promise<StaffDetailResponse["data"]> => {
    const response = await apiData<any>(`/api/admin/staff/${id}`, {
      method: "GET",
    });
    return response.data ?? response;
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
    format?: string;
  }): Promise<ExportResponse<DashboardExportRecord>["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    if (!query.has("format")) query.append("format", "csv");
    const response = await apiData<any>(
      `/api/admin/reports/export/dashboard?${query.toString()}`,
      { method: "GET", isDownload: true },
    );
    return response.data ?? response;
  },

  exportTasks: async (params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    category?: string;
    format?: string;
  }): Promise<ExportResponse<TaskExportRecord>["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    if (!query.has("format")) query.append("format", "csv");
    const response = await apiData<any>(
      `/api/admin/reports/export/tasks?${query.toString()}`,
      { method: "GET", isDownload: true },
    );
    return response.data ?? response;
  },

  exportPayments: async (format: string = "csv"): Promise<
    ExportResponse<PaymentExportRecord>["data"]
  > => {
    const response = await apiData<any>(`/api/admin/reports/export/payments?format=${format}`, {
      method: "GET",
      isDownload: true,
    });
    return response.data ?? response;
  },

  exportUsers: async (format: string = "csv"): Promise<ExportResponse<UserExportRecord>["data"]> => {
    const response = await apiData<any>(`/api/admin/reports/export/users?format=${format}`, {
      method: "GET",
      isDownload: true,
    });
    return response.data ?? response;
  },

  exportTaskers: async (format: string = "csv"): Promise<
    ExportResponse<TaskerExportRecord>["data"]
  > => {
    const response = await apiData<any>(`/api/admin/reports/export/taskers?format=${format}`, {
      method: "GET",
      isDownload: true,
    });
    return response.data ?? response;
  },

  // ============================================================================
  // Categories (Mock Data Implementation)
  // ============================================================================

  getCategories: async (): Promise<AdminCategoryListResponse["data"]> => {
    const response = await apiData<any>("/api/admin/categories", {
      method: "GET",
    });
    // Response: { status, data: { stats, categories } }
    return response.data ?? response;
  },

  getCategoryDetails: async (
    id: string,
  ): Promise<AdminCategoryDetailResponse["data"]> => {
    const response = await apiData<any>(`/api/admin/categories/${id}`, {
      method: "GET",
    });
    // Response: { status, data: { category, stats, tasks, taskers } }
    return response.data ?? response;
  },

  createCategory: async (
    data: CreateCategoryRequest,
  ): Promise<AdminCategory> => {
    const response = await apiData<any>("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
    // Response: { status, category } at root, NOT under data
    return response.category ?? response;
  },

  updateCategory: async (
    id: string,
    data: UpdateCategoryRequest,
  ): Promise<AdminCategory> => {
    const response = await apiData<any>(`/api/admin/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    // Response: { status, category } at root, NOT under data
    return response.category ?? response;
  },

  deleteCategory: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiData<any>(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });
    return response ?? { success: true };
  },

  // Withdrawal Management
  getWithdrawals: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    payoutMethod?: string;
  }): Promise<any> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<any>(
      `/api/admin/withdrawals?${query.toString()}`,
      { method: "GET" },
    );
    return response.data ?? response;
  },

  getWithdrawalStats: async (): Promise<any> => {
    const response = await apiData<any>("/api/admin/withdrawals/stats", {
      method: "GET",
    });
    return response.data ?? response;
  },

  approveWithdrawal: async (id: string): Promise<any> => {
    return apiData<any>(`/api/admin/withdrawals/${id}/approve`, {
      method: "PATCH",
    });
  },

  rejectWithdrawal: async (id: string, reason: string): Promise<any> => {
    return apiData<any>(`/api/admin/withdrawals/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  },

  completeWithdrawal: async (id: string): Promise<any> => {
    return apiData<any>(`/api/admin/withdrawals/${id}/complete`, {
      method: "PATCH",
    });
  },

  // ============================================================================
  // Main Categories
  // ============================================================================

  getAdminMainCategories: async (): Promise<any> => {
    const response = await apiData<any>("/api/admin/main-categories", {
      method: "GET",
    });
    return response.data ?? response;
  },

  createMainCategory: async (data: any): Promise<any> => {
    const response = await apiData<any>("/api/admin/main-categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.mainCategory ?? response;
  },

  updateMainCategory: async (id: string, data: any): Promise<any> => {
    const response = await apiData<any>(`/api/admin/main-categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return response.mainCategory ?? response;
  },

  deleteMainCategory: async (id: string): Promise<any> => {
    return apiData<any>(`/api/admin/main-categories/${id}`, {
      method: "DELETE",
    });
  },

  // ============================================================================
  // Universities
  // ============================================================================

  getAdminUniversities: async (): Promise<any> => {
    const response = await apiData<any>("/api/admin/universities", {
      method: "GET",
    });
    return response?.data?.universities || response?.universities || (Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []));
  },

  createUniversity: async (data: any): Promise<any> => {
    const response = await apiData<any>("/api/admin/universities", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.university ?? response;
  },

  updateUniversity: async (id: string, data: any): Promise<any> => {
    const response = await apiData<any>(`/api/admin/universities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return response.university ?? response;
  },

  deleteUniversity: async (id: string): Promise<any> => {
    return apiData<any>(`/api/admin/universities/${id}`, {
      method: "DELETE",
    });
  },

  // ============================================================================
  // Notification Management
  // ============================================================================

  getNotificationStats: async (): Promise<AdminNotificationStats> => {
    const response = await apiData<AdminNotificationStatsResponse>(
      "/api/admin/notifications/stats",
      { method: "GET" },
    );
    return response.data;
  },

  getNotifications: async (params?: { page?: number; limit?: number }): Promise<any> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<AdminNotificationListResponse>(
      `/api/admin/notifications?${query.toString()}`,
      { method: "GET" },
    );
    return response.data ?? response;
  },

  sendNotification: async (data: SendNotificationRequest & { sendEmail?: boolean; sendInApp?: boolean }): Promise<any> => {
    return apiData<any>("/api/admin/notifications/send", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resendNotification: async (id: string): Promise<any> => {
    return apiData<any>(`/api/admin/notifications/${id}/resend`, {
      method: "POST",
    });
  },

  getNotificationUsers: async (): Promise<any> => {
    const response = await apiData<any>("/api/admin/notifications/all-users", {
      method: "GET",
    });
    return response.data ?? response;
  },

  sendUserEmail: async (
    id: string,
    data: { subject: string; message: string },
  ): Promise<any> => {
    return apiData<any>(`/api/admin/users/${id}/send-email`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  sendBulkEmail: async (data: {
    targetGroup: "verified" | "unverified" | "all";
    subject: string;
    message: string;
  }): Promise<any> => {
    return apiData<any>("/api/admin/users/bulk-email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  sendTaskerEmail: async (
    id: string,
    data: { subject: string; message: string },
  ): Promise<any> => {
    return apiData<any>(`/api/admin/taskers/${id}/send-email`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  sendBulkTaskerEmail: async (data: {
    targetGroup: "verified" | "unverified" | "all";
    subject: string;
    message: string;
  }): Promise<any> => {
    return apiData<any>("/api/admin/taskers/bulk-email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
