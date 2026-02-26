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
  AdminCategoryListResponse,
  AdminCategoryDetailResponse,
  CreateCategoryRequest,
  AdminCategory,
  UpdateCategoryRequest,
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
  }): Promise<KYCListResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
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
    adminId?: string;
    startDate?: string;
    endDate?: string;
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
  }): Promise<ConversationListResponse["data"]> => {
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
  ): Promise<ConversationDetailResponse["data"]> => {
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
            else if (value === "suspended") query.append("isSuspended", "true");
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
  }): Promise<AdminTaskListResponse["data"]> => {
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
    return response.data ?? response;
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
    return apiData<any>("/api/admin/staff", {
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
  }): Promise<ExportResponse<DashboardExportRecord>["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }
    const response = await apiData<any>(
      `/api/admin/reports/export/dashboard?${query.toString()}`,
      { method: "GET" },
    );
    return response.data ?? response;
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
    const response = await apiData<any>(
      `/api/admin/reports/export/tasks?${query.toString()}`,
      { method: "GET" },
    );
    return response.data ?? response;
  },

  exportPayments: async (): Promise<
    ExportResponse<PaymentExportRecord>["data"]
  > => {
    const response = await apiData<any>("/api/admin/reports/export/payments", {
      method: "GET",
    });
    return response.data ?? response;
  },

  exportUsers: async (): Promise<ExportResponse<UserExportRecord>["data"]> => {
    const response = await apiData<any>("/api/admin/reports/export/users", {
      method: "GET",
    });
    return response.data ?? response;
  },

  exportTaskers: async (): Promise<
    ExportResponse<TaskerExportRecord>["data"]
  > => {
    const response = await apiData<any>("/api/admin/reports/export/taskers", {
      method: "GET",
    });
    return response.data ?? response;
  },

  // ============================================================================
  // Categories (Mock Data Implementation)
  // ============================================================================

  getCategories: async (): Promise<AdminCategoryListResponse["data"]> => {
    // Generate mock categories
    const mockCategories = [
      {
        _id: "cat_1",
        name: "Cleaning Services",
        description: "Professional home and office cleaning",
        minPrice: 15000,
        status: "Active" as const,
        serviceCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "cat_2",
        name: "Plumbing",
        description: "Expert plumbing services and repairs",
        minPrice: 20000,
        status: "Active" as const,
        serviceCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "cat_3",
        name: "Electrical Repairs",
        description: "Licensed electricians for all electrical work",
        minPrice: 25000,
        status: "Active" as const,
        serviceCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "cat_4",
        name: "Graphics design",
        description: "Creative design services for businesses",
        minPrice: 50000,
        status: "Closed" as const,
        serviceCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "cat_5",
        name: "Digital marketing",
        description: "SEO, social media, and online marketing",
        minPrice: 40000,
        status: "Active" as const,
        serviceCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          categories: mockCategories,
          stats: {
            activeCategories: 4,
            closedCategories: 1,
            totalServices: 184,
          },
          pagination: {
            total: mockCategories.length,
            page: 1,
            limit: 10,
            pages: 1,
          },
        });
      }, 500);
    });
  },

  getCategoryDetails: async (
    id: string,
  ): Promise<AdminCategoryDetailResponse["data"]> => {
    const mockCategory = {
      _id: id,
      name: "Cleaning Services",
      description:
        "Professional home and office cleaning services for all your needs",
      minPrice: 15000,
      status: "Active" as const,
      serviceCount: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockTasks = Array(4)
      .fill(null)
      .map((_, i) => ({
        _id: `task_${i}`,
        title: "Fix Leaking Kitchen Sink",
        postedBy: "aisha.musa@taskhubdemo.com",
        category: "Cleaning services",
        budget: 40000,
        status:
          i === 0
            ? "In progress"
            : i === 1
              ? "Open"
              : i === 2
                ? "Completed"
                : "Assigned",
        date: "02/02/2025",
      }));

    const mockTaskers = Array(4)
      .fill(null)
      .map((_, i) => ({
        _id: `tasker_${i}`,
        fullName:
          i === 2
            ? "Ibrahim Yusuf"
            : i === 3
              ? "Ngozi Adekunle"
              : "Adewale Thompson",
        email:
          i === 2
            ? "ibrahim.y@example.com"
            : i === 3
              ? "ngozi.a@example.com"
              : "adewale.t@example.com",
        category: "Cleaning services",
        status: i === 1 ? ("Suspended" as const) : ("Active" as const),
        verification:
          i === 0 || i === 1
            ? ("Verified" as const)
            : i === 2
              ? ("Not verified" as const)
              : ("Pending" as const),
        lastActive: "7:25PM, 11/15/2025",
      }));

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          category: mockCategory,
          stats: {
            totalServices: 4,
            activeServices: 1,
            taskers: 184,
            revenue: 459045.1,
          },
          tasks: mockTasks,
          taskers: mockTaskers,
        });
      }, 500);
    });
  },

  createCategory: async (
    data: CreateCategoryRequest,
  ): Promise<AdminCategory> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          _id: `cat_${Date.now()}`,
          ...data,
          serviceCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 600);
    });
  },

  updateCategory: async (
    id: string,
    data: UpdateCategoryRequest,
  ): Promise<AdminCategory> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          _id: id,
          name: data.name || "Updated Category",
          description: data.description || "Updated Description",
          minPrice: data.minPrice || 0,
          status: data.status || "Active",
          serviceCount: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 600);
    });
  },

  deleteCategory: async (id: string): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 600);
    });
  },
};
