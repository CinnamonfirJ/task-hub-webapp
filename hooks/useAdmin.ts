import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: () => adminApi.getDashboardStats(),
  });
}

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: Parameters<typeof adminApi.login>[0]) =>
      adminApi.login(credentials),
    onSuccess: (data) => {
      const token = (data as any)?.token || data?.data?.token;
      const adminData = (data as any)?.admin || data?.data?.admin;

      if (token) {
        if (process.env.NODE_ENV === "development") {
          console.log("[useAdminLogin] Success, setting session state...");
        }

        // Critical: Set userType BEFORE state sync so getProfile knows the role
        localStorage.setItem("userType", "admin");
        localStorage.setItem("token", token);

        // Set the user in the main auth query to prevent 404/redirect loops
        if (adminData) {
          const adminProfile = { ...adminData };

          // Normalize fields for consistency across the app
          if (!adminProfile._id && adminProfile.id)
            adminProfile._id = adminProfile.id;
          if (!adminProfile.fullName && adminProfile.name)
            adminProfile.fullName = adminProfile.name;
          if (!adminProfile.emailAddress && adminProfile.email)
            adminProfile.emailAddress = adminProfile.email;

          // Ensure role is preserved or defaulted
          if (!adminProfile.role) adminProfile.role = "admin";

          queryClient.setQueryData(["currentUser"], adminProfile);
          if (process.env.NODE_ENV === "development") {
            console.log(
              "[useAdminLogin] Set currentUser query data (normalized):",
              adminProfile,
            );
          }
        }

        // Clear all queries and invalidate admin status
        queryClient.invalidateQueries({ queryKey: ["admin"] });
      } else {
        console.error(
          "[useAdminLogin] Login succeeded but no token found in response:",
          data,
        );
      }
    },
  });
}

export function useAdminProfile() {
  // Only fire this query if the user is identified as an admin.
  // Prevents /api/admin/me being called for regular users/taskers (which causes 401 → logout).
  const isAdmin =
    typeof window !== "undefined" &&
    localStorage.getItem("userType") === "admin";

  return useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => adminApi.getMe(),
    enabled: isAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}


export function useSystemStats() {
  return useQuery({
    queryKey: ["admin", "system-stats"],
    queryFn: () => adminApi.getSystemStats(),
    refetchInterval: 60 * 1000, // Refresh every minute
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ["admin", "users", "stats"],
    queryFn: () => adminApi.getUserStats(),
  });
}

export function useAdminUsers(
  params?: Parameters<typeof adminApi.getUsers>[0],
) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => adminApi.getUsers(params),
  });
}

export function useUserDetails(id: string) {
  return useQuery({
    queryKey: ["admin", "users", id],
    queryFn: () => adminApi.getUserDetails(id),
    enabled: !!id,
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.activateUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", id] });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminApi.deactivateUser(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", id] });
    },
  });
}

export function useLockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      reason,
      duration,
    }: {
      id: string;
      reason: string;
      duration?: number;
    }) => adminApi.lockUser(id, { reason, duration }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", id] });
    },
  });
}

export function useUnlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.unlockUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", id] });
    },
  });
}

export function useSoftDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminApi.softDeleteUser(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", id] });
    },
  });
}

export function useRestoreUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.restoreUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", id] });
    },
  });
}

export function useKYCRequests(
  params?: Parameters<typeof adminApi.getKYCRequests>[0],
) {
  return useQuery({
    queryKey: ["admin", "kyc", params],
    queryFn: () => adminApi.getKYCRequests(params),
  });
}

export function useApproveKYC() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      adminApi.approveKYC(id, notes),
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

export function useAdminReports(
  params?: Parameters<typeof adminApi.getReports>[0],
) {
  return useQuery({
    queryKey: ["admin", "reports", params],
    queryFn: () => adminApi.getReports(params),
  });
}

// --- Tasker Management Hooks ---

export function useAdminTaskers(
  params?: Parameters<typeof adminApi.getTaskers>[0],
) {
  return useQuery({
    queryKey: ["admin", "taskers", params],
    queryFn: () => adminApi.getTaskers(params),
  });
}

export function useTaskerDetails(id: string) {
  return useQuery({
    queryKey: ["admin", "taskers", id],
    queryFn: () => adminApi.getTaskerDetails(id),
    enabled: !!id,
  });
}

export function useVerifyTasker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      verificationNotes,
    }: {
      id: string;
      verificationNotes?: string;
    }) => adminApi.verifyTasker(id, verificationNotes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "taskers"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "taskers", id] });
    },
  });
}

export function useLockTasker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      reason,
      duration,
    }: {
      id: string;
      reason: string;
      duration?: number;
    }) => adminApi.lockTasker(id, { reason, duration }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "taskers"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "taskers", id] });
    },
  });
}

export function useUnlockTasker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.unlockTasker(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "taskers"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "taskers", id] });
    },
  });
}

// --- Task Management Hooks ---

export function useTaskStats() {
  return useQuery({
    queryKey: ["admin", "tasks", "stats"],
    queryFn: () => adminApi.getTaskStats(),
  });
}

export function useAdminTasks(
  params?: Parameters<typeof adminApi.getTasks>[0],
) {
  return useQuery({
    queryKey: ["admin", "tasks", params],
    queryFn: () => adminApi.getTasks(params),
  });
}

export function useAdminTaskDetails(id: string) {
  return useQuery({
    queryKey: ["admin", "tasks", id],
    queryFn: () => adminApi.getTaskDetails(id),
    enabled: !!id,
  });
}

export function useForceCancelTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      reason,
      refundUser,
    }: {
      id: string;
      reason: string;
      refundUser?: boolean;
    }) => adminApi.forceCancelTask(id, { reason, refundUser }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "tasks", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useForceCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      reason,
      releaseToTasker,
      adjustedAmount,
    }: {
      id: string;
      reason: string;
      releaseToTasker?: boolean;
      adjustedAmount?: number;
    }) =>
      adminApi.forceCompleteTask(id, {
        reason,
        releaseToTasker,
        adjustedAmount,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "tasks", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

// --- Financials & Payments Hooks ---

export function usePaymentStats() {
  return useQuery({
    queryKey: ["admin", "payments", "stats"],
    queryFn: () => adminApi.getPaymentStats(),
  });
}

export function useTransactions(
  params?: Parameters<typeof adminApi.getTransactions>[0],
) {
  return useQuery({
    queryKey: ["admin", "payments", "history", params],
    queryFn: () => adminApi.getTransactions(params),
  });
}

export function useTransactionDetails(id: string) {
  return useQuery({
    queryKey: ["admin", "payments", id],
    queryFn: () => adminApi.getTransactionDetails(id),
    enabled: !!id,
  });
}

// --- Reports & Moderation Hooks ---

export function useReports(params?: Parameters<typeof adminApi.getReports>[0]) {
  return useQuery({
    queryKey: ["admin", "reports", params],
    queryFn: () => adminApi.getReports(params),
  });
}

export function useReportDetails(id: string) {
  return useQuery({
    queryKey: ["admin", "reports", id],
    queryFn: () => adminApi.getReportDetails(id),
    enabled: !!id,
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      resolution: string;
      action_taken: string;
      refund_amount?: number;
      warning_issued?: boolean;
      notes?: string;
    }) => adminApi.resolveReport(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reports", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useActivityLogs(
  params?: Parameters<typeof adminApi.getActivityLogs>[0],
) {
  return useQuery({
    queryKey: ["admin", "activity-logs", params],
    queryFn: () => adminApi.getActivityLogs(params),
  });
}

export function useSecuritySummary(userId: string) {
  return useQuery({
    queryKey: ["admin", "security-summary", userId],
    queryFn: () => adminApi.getSecuritySummary(userId),
    enabled: !!userId,
  });
}

// --- Messages & Support Hooks ---

export function useMessageStats() {
  return useQuery({
    queryKey: ["admin", "messages", "stats"],
    queryFn: () => adminApi.getMessageStats(),
  });
}

export function useConversations(
  params?: Parameters<typeof adminApi.getConversations>[0],
) {
  return useQuery({
    queryKey: ["admin", "messages", params],
    queryFn: () => adminApi.getConversations(params),
  });
}

export function useConversationDetails(id: string) {
  return useQuery({
    queryKey: ["admin", "messages", id],
    queryFn: () => adminApi.getConversationDetails(id),
    enabled: !!id,
  });
}

export function useSendAdminMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      conversationId,
      text,
      priority,
      category,
    }: {
      conversationId: string;
      text: string;
      priority?: string;
      category?: string;
    }) =>
      adminApi.sendAdminMessage(conversationId, { text, priority, category }),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "messages", conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
    },
  });
}

// --- System Settings Hooks ---

export function useSystemSettings() {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => adminApi.getSystemSettings(),
  });
}

export function useUpdateSystemSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Record<string, any>) =>
      adminApi.updateSystemSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
  });
}

// --- Staff Management Hooks ---

export function useStaffStats() {
  return useQuery({
    queryKey: ["admin", "staff", "stats"],
    queryFn: () => adminApi.getStaffStats(),
  });
}

export function useAdminStaffList(
  params?: Parameters<typeof adminApi.getStaffList>[0],
) {
  return useQuery({
    queryKey: ["admin", "staff", "list", params],
    queryFn: () => adminApi.getStaffList(params),
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof adminApi.createStaffAccount>[0]) =>
      adminApi.createStaffAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
    },
  });
}

export function useSetupAdmin() {
  return useMutation({
    mutationFn: (data: Parameters<typeof adminApi.setupAdminAccount>[0]) =>
      adminApi.setupAdminAccount(data),
  });
}

export function useStaffDetails(id: string) {
  return useQuery({
    queryKey: ["admin", "staff", "details", id],
    queryFn: () => adminApi.getStaffDetails(id),
    enabled: !!id,
  });
}

export function useUpdateStaffStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof adminApi.updateStaffStatus>[1];
    }) => adminApi.updateStaffStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "staff", "details", id],
      });
    },
  });
}

// --- Data Export Hooks ---

export function useExportDashboard() {
  return useMutation({
    mutationFn: (params?: Parameters<typeof adminApi.exportDashboard>[0]) =>
      adminApi.exportDashboard(params),
  });
}

export function useExportTasks() {
  return useMutation({
    mutationFn: (params?: Parameters<typeof adminApi.exportTasks>[0]) =>
      adminApi.exportTasks(params),
  });
}

export function useExportPayments() {
  return useMutation({
    mutationFn: (format?: string) => adminApi.exportPayments(format),
  });
}

export function useExportUsers() {
  return useMutation({
    mutationFn: (format?: string) => adminApi.exportUsers(format),
  });
}

export function useExportTaskers() {
  return useMutation({
    mutationFn: (format?: string) => adminApi.exportTaskers(format),
  });
}

// ============================================================================
// Categories Hooks
// ============================================================================

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => adminApi.getCategories(),
  });
}

export function useAdminCategoryDetails(id: string) {
  return useQuery({
    queryKey: ["admin", "category", id],
    queryFn: () => adminApi.getCategoryDetails(id),
    enabled: !!id,
  });
}

export function useCreateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof adminApi.createCategory>[0]) =>
      adminApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

export function useUpdateAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof adminApi.updateCategory>[1];
    }) => adminApi.updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "category", variables.id],
      });
    },
  });
}

export function useDeleteAdminCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
}

// --- Main Categories Hooks ---

export function useAdminMainCategories() {
  return useQuery({
    queryKey: ["admin", "main-categories"],
    queryFn: () => adminApi.getAdminMainCategories(),
  });
}

export function useCreateMainCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminApi.createMainCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "main-categories"] });
    },
  });
}

export function useUpdateMainCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateMainCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "main-categories"] });
    },
  });
}

export function useDeleteMainCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteMainCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "main-categories"] });
    },
  });
}

// --- Universities Hooks ---

export function useAdminUniversities() {
  return useQuery({
    queryKey: ["admin", "universities"],
    queryFn: () => adminApi.getAdminUniversities(),
  });
}

export function useCreateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminApi.createUniversity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "universities"] });
    },
  });
}

export function useUpdateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updateUniversity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "universities"] });
    },
  });
}

export function useDeleteUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUniversity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "universities"] });
    },
  });
}

// ============================================================================
// Notification Management Hooks
// ============================================================================

export function useNotificationStats() {
  return useQuery({
    queryKey: ["admin", "notifications", "stats"],
    queryFn: () => adminApi.getNotificationStats(),
  });
}

export function useNotifications(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["admin", "notifications", "list", params],
    queryFn: () => adminApi.getNotifications(params),
  });
}

export function useSendNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof adminApi.sendNotification>[0]) =>
      adminApi.sendNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
  });
}

export function useResendNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.resendNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
  });
}

export function useSendUserEmail() {
  return useMutation({
    mutationFn: ({
      id,
      subject,
      message,
    }: {
      id: string;
      subject: string;
      message: string;
    }) => adminApi.sendUserEmail(id, { subject, message }),
  });
}

export function useSendBulkEmail() {
  return useMutation({
    mutationFn: (data: {
      targetGroup: "verified" | "unverified" | "all";
      subject: string;
      message: string;
    }) => adminApi.sendBulkEmail(data),
  });
}

export function useSendTaskerEmail() {
  return useMutation({
    mutationFn: ({
      id,
      subject,
      message,
    }: {
      id: string;
      subject: string;
      message: string;
    }) => adminApi.sendTaskerEmail(id, { subject, message }),
  });
}

export function useSendBulkTaskerEmail() {
  return useMutation({
    mutationFn: (data: {
      targetGroup: "verified" | "unverified" | "all";
      subject: string;
      message: string;
    }) => adminApi.sendBulkTaskerEmail(data),
  });
}

export function useNotificationUsers() {
  return useQuery({
    queryKey: ["admin", "notifications", "all-users"],
    queryFn: () => adminApi.getNotificationUsers(),
  });
}
