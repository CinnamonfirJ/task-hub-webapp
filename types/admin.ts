import { User } from "./auth";

// ============================================================================
// Authentication & Profile Types
// ============================================================================

export interface AdminProfile {
  _id: string;
  name: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  emailAddress?: string;
  role: "super_admin" | "operations" | "trust_safety" | "finance";
  isActive: boolean;
  phoneNumber?: string;
  location?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  status: string;
  message: string;
  data: {
    admin: AdminProfile;
    token: string;
  };
}

export interface SystemHealthStats {
  systemHealth: {
    status: string;
    uptime: string;
    lastChecked: string;
  };
  database: {
    status: string;
    responseTime: string;
    connections: number;
  };
  services: {
    email: string;
    payments: string;
    notifications: string;
    storage: string;
  };
  performance: {
    avgResponseTime: string;
    errorRate: string;
    requestsPerMinute: number;
  };
}

// ============================================================================
// Dashboard Statistics Types
// ============================================================================

export interface AdminDashboardStats {
  cards: {
    totalUsers: number;
    totalTaskers: number;
    totalTasks: number;
    activeTasks: number;
    completedTasks: number;
    cancelledTasks: number;
    pendingKyc: number;
    totalRevenue: number;
  };
  quickStats: {
    userToTaskerRatio: string;
    completionRate: string;
    avgTaskValue: number;
  };
  growth: number;
  recentTasks: any[];
  recentActivity: any[];
}

export interface AdminDashboardStatsResponse {
  status: string;
  data: AdminDashboardStats;
}

// ============================================================================
// User Management Types
// ============================================================================

export interface UserStats {
  totalUsers: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  suspended: number;
  deleted: number;
  kyc_verified: number;
  totalTasksPosted: number;
  completedTasks: number;
  growth: {
    this_week: number;
    this_month: number;
    this_year: number;
  };
  demographics: {
    by_country: Record<string, number>;
    by_state: Record<string, number>;
  };
}

export interface UserStatsResponse {
  status: string;
  data: UserStats;
}

export interface AdminUserListItem {
  _id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  country?: string;
  residentState?: string;
  wallet: number;
  isEmailVerified: boolean;
  isKYCVerified: boolean;
  isActive: boolean;
  isLocked: boolean;
  lockReason: string | null;
  lockUntil: string | null;
  lastLogin?: string;
  createdAt: string;
  stats: {
    totalTasks: number;
    completedTasks: number;
    cancelledTasks: number;
    totalSpent: number;
  };
}

export interface AdminUserListResponse {
  status: string;
  data: {
    users: AdminUserListItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalUsers: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface AdminUserDetail {
  _id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  country?: string;
  residentState?: string;
  address?: string;
  profilePicture?: string;
  dateOfBirth?: string;
  wallet: number;
  isAdmin: boolean;
  isEmailVerified: boolean;
  isKYCVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  isLocked: boolean;
  lockReason: string | null;
  lockUntil: string | null;
  loginAttempts?: number;
  lastLogin?: string;
  notificationId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserDetailResponse {
  status: string;
  data: {
    user: AdminUserDetail;
    wallet: {
      balance: number;
      escrow: number;
    };
    verification: {
      status: string;
      type: string;
    };
    tasks: Array<{
      _id: string;
      title: string;
      budget: number;
      status: string;
      createdAt: string;
    }>;
    transactions: Array<{
      _id: string;
      type: string;
      amount: number;
      description: string;
      createdAt: string;
    }>;
    activityLog: Array<{
      action: string;
      date: string;
      details: string;
    }>;
    stats?: {
      tasks: {
        total: number;
        open: number;
        in_progress: number;
        completed: number;
        cancelled: number;
      };
      financials: {
        totalSpent: number;
        averageTaskBudget: number;
        escrowHeld: number;
      };
      activity: {
        lastActive: string;
        loginCount: number;
        averageSessionDuration: string;
      };
    };
    recentTasks?: Array<{
      _id: string;
      title: string;
      status: string;
      budget: number;
      createdAt: string;
    }>;
    recentTransactions?: Array<{
      _id: string;
      type: string;
      amount: number;
      description: string;
      createdAt: string;
    }>;
  };
}

export interface ActivateUserResponse {
  status: string;
  message: string;
  data: {
    userId: string;
    isActive: boolean;
    updatedAt: string;
  };
}

export interface DeactivateUserInput {
  reason?: string;
}

export interface DeactivateUserResponse {
  status: string;
  message: string;
  data: {
    userId: string;
    isActive: boolean;
    deactivationReason?: string;
    deactivatedBy: string;
    deactivatedAt: string;
  };
}

export interface LockUserInput {
  reason: string;
  duration?: number;
}

export interface LockUserResponse {
  status: string;
  message: string;
  data: {
    userId: string;
    isLocked: boolean;
    lockReason: string;
    lockUntil: string;
    lockedBy: string;
    lockedAt: string;
  };
}

export interface UnlockUserResponse {
  status: string;
  message: string;
  data: {
    userId: string;
    isLocked: boolean;
    lockReason: null;
    lockUntil: null;
    unlockedBy: string;
    unlockedAt: string;
  };
}

export interface SoftDeleteUserInput {
  reason?: string;
}

export interface SoftDeleteUserResponse {
  status: string;
  message: string;
  data: {
    userId: string;
    isDeleted: boolean;
    deletionReason?: string;
    deletedBy: string;
    deletedAt: string;
    canRestore: boolean;
    restoreBefore: string;
  };
}

export interface RestoreUserResponse {
  status: string;
  message: string;
  data: {
    userId: string;
    isDeleted: boolean;
    isActive: boolean;
    restoredBy: string;
    restoredAt: string;
  };
}

// ============================================================================
// Tasker Management Types
// ============================================================================

export interface TaskerCategory {
  _id: string;
  displayName: string;
  name?: string;
}

export interface AdminTaskerListItem {
  _id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
  categories: TaskerCategory[];
  verifyIdentity: boolean;
  isActive: boolean;
  isSuspended: boolean;
  wallet: number;
  averageRating: number;
  completedTasks: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  lastLogin?: string;
  createdAt: string;
}

export interface AdminTaskerListResponse {
  status: string;
  data: {
    taskers: AdminTaskerListItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalTaskers: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface AdminTaskerDetail {
  _id: string;

  emailAddress: string;
  phoneNumber?: string;
  country?: string;
  residentState?: string;
  address?: string;
  profilePicture?: string;
  categories: TaskerCategory[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  verifyIdentity: boolean;
  wallet: number;
  isEmailVerified: boolean;
  isActive: boolean;
  isSuspended: boolean;
  suspensionReason: string | null;
  rating: number;
  completedTasks: number;
  lastActive?: string;
  createdAt: string;
}

export interface AdminTaskerDetailResponse {
  status: string;
  data: {
    tasker?: AdminTaskerDetail;
    account?: {
      userId?: string;
      fullName: string;
      role: string;
      lastUpdated?: string;
    };
    kyc: {
      type: string;
      number: string;
      status: string;
    };
    stats: {
      rating: number;
      completionRate: string;
      completedTasks: number;
      totalTransaction: number;
      currentBalance: number;
      reviews_count?: number;
      bids?: {
        total: number;
        accepted: number;
        rejected: number;
        pending: number;
        acceptanceRate: number;
      };
      tasks?: {
        total: number;
        completed: number;
        cancelled: number;
        completionRate: number;
      };
      financials?: {
        totalEarnings: number;
        averageTaskValue: number;
        pendingPayments: number;
      };
      performance?: {
        averageRating: number;
        totalReviews: number;
        responseTime: string;
        completionTime: string;
      };
    };
    categories: string[] | TaskerCategory[];
    recentTasks: Array<{
      _id: string;
      title: string;
      status: string;
      agreedPrice: number;
      rating?: number;
      completedAt?: string;
    }>;
    reviews: Array<{
      _id: string;
      rating: number;
      comment: string;
      reviewer: string;
      task: string;
      createdAt: string;
    }>;
    activityLog: Array<{
      action: string;
      details: string;
      date: string;
    }>;
  };
}

export interface VerifyTaskerInput {
  verificationNotes?: string;
}

export interface VerifyTaskerResponse {
  status: string;
  message: string;
  data: {
    taskerId: string;
    verifyIdentity: boolean;
    verifiedBy: string;
    verificationNotes?: string;
    verifiedAt: string;
  };
}

export interface SuspendTaskerInput {
  reason: string;
  duration?: number;
}

export interface SuspendTaskerResponse {
  status: string;
  message: string;
  data: {
    taskerId: string;
    isSuspended: boolean;
    suspensionReason: string;
    suspendedUntil?: string;
    suspendedBy: string;
    suspendedAt: string;
  };
}

export interface ActivateTaskerResponse {
  status: string;
  message: string;
  data: {
    taskerId: string;
    isSuspended: boolean;
    suspensionReason: null;
    suspendedUntil: null;
    activatedBy: string;
    activatedAt: string;
  };
}

// ============================================================================
// KYC Verification Types
// ============================================================================

export interface KYCStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  pending_review: number;
  approval_rate: number;
  average_review_time: string;
  this_week: {
    submitted: number;
    approved: number;
    rejected: number;
    pending: number;
  };
  this_month: {
    submitted: number;
    approved: number;
    rejected: number;
    pending: number;
  };
}

export interface KYCStatsResponse {
  status: string;
  data: KYCStats;
}

export interface KYCDocument {
  type: string;
  url: string;
}

export interface KYCRecord {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    firstName?: string;
    lastName?: string;
    emailAddress: string;
    phoneNumber?: string;
  } | null;
  nin: string; // Legacy masked string
  maskedNin?: string; // New field from API
  status: "pending" | "approved" | "approve" | "rejected";
  submittedDocuments?: KYCDocument[];
  approvedBy?: {
    _id: string;
    fullName: string;
    firstName?: string;
    lastName?: string;
  };
  approvedAt?: string;
  rejectionReason?: string;
  rejectedBy?: {
    _id: string;
    fullName: string;
    firstName?: string;
    lastName?: string;
  };
  rejectedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface KYCListResponse {
  status: string;
  count: number;
  records: KYCRecord[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApproveKYCInput {
  notes?: string;
}

export interface ApproveKYCResponse {
  status: string;
  message: string;
  data: {
    kycId: string;
    userId: string;
    status: "approved";
    approvedBy: string;
    approvalNotes?: string;
    approvedAt: string;
  };
}

export interface RejectKYCInput {
  reason: string;
}

export interface RejectKYCResponse {
  status: string;
  message: string;
  data: {
    kycId: string;
    userId: string;
    status: "rejected";
    rejectionReason: string;
    rejectedBy: string;
    rejectedAt: string;
  };
}

// ============================================================================
// Task Management Types
// ============================================================================

export interface TaskStats {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  this_week: {
    created: number;
    completed: number;
    cancelled: number;
  };
  this_month: {
    created: number;
    completed: number;
    cancelled: number;
  };
  by_category: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  financials: {
    total_value: number;
    average_budget: number;
    escrow_held: number;
  };
  performance: {
    average_completion_time: string;
    completion_rate: number;
    cancellation_rate: number;
  };
}

export interface TaskStatsResponse {
  status: string;
  data: TaskStats;
}

export interface AdminTaskCategory {
  _id: string;
  displayName: string;
}

export interface AdminTaskListItem {
  _id: string;
  title: string;
  description?: string;
  status: string;
  budget: number;
  agreedPrice?: number;
  mainCategory?: {
    _id: string;
    name: string;
  };
  subCategory?: {
    _id: string;
    name: string;
  };
  university?: string | null;
  images?: {
    url: string;
    _id: string;
  }[];
  categories?: AdminTaskCategory[];
  user: {
    _id: string;
    fullName: string;
    emailAddress: string;
  };
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
    emailAddress?: string;
    rating?: number;
    taskerName?: string;
  };
  location?: {
    address?: string;
  };
  bidCount?: number;
  isBiddingEnabled?: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface AdminTaskListResponse {
  status: string;
  results?: number;
  totalRecords?: number;
  totalPages?: number;
  currentPage?: number;
  tasks: AdminTaskListItem[];
}

export interface AdminTaskDetail {
  _id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  agreedPrice?: number;
  negotiable?: string;
  category?: string;
  categories: AdminTaskCategory[];
  postedBy?: {
    _id: string;
    fullName: string;
    emailAddress: string;
    profilePicture?: string;
    taskerEmail?: string;
  };
  user: {
    _id: string;
    fullName: string;
    emailAddress: string;
    phoneNumber?: string;
  };
  assignedTo?: {
    _id: string;
    taskerName?: string;
    emailAddress?: string;
    phoneNumber?: string;
    rating?: number;
    verifyIdentity?: boolean;
  };
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  images?: string[];
  isBiddingEnabled: boolean;
  bidCount?: number;
  deadline?: string;
  createdAt: string;
  lastUpdated?: string;
  acceptedAt?: string;
  completedAt?: string;
}

export interface AdminTaskBid {
  _id: string;
  taskerName: string;
  taskerImage: string;
  amount: number;
  status: string;
  date: string;
}

export interface TaskTimelineEvent {
  event: string;
  timestamp: string;
  actor?: string;
}

export interface TaskPayment {
  type: string;
  amount: number;
  status: string;
  timestamp: string;
}

export interface AdminTaskDetailResponse {
  status: string;
  data: {
    task: AdminTaskDetail;
    bids: AdminTaskBid[];
    timeline: TaskTimelineEvent[];
    payments: TaskPayment[];
  };
}

export interface ForceCancelTaskInput {
  reason: string;
  refundUser?: boolean;
}

export interface ForceCancelTaskResponse {
  status: string;
  message: string;
  data: {
    taskId: string;
    status: "cancelled";
    cancellationReason: string;
    cancelledBy: string;
    refundIssued: boolean;
    refundAmount?: number;
    cancelledAt: string;
  };
}

export interface ForceCompleteTaskInput {
  reason: string;
  releaseToTasker?: boolean;
  adjustedAmount?: number;
}

export interface ForceCompleteTaskResponse {
  status: string;
  message: string;
  data: {
    taskId: string;
    status: "completed";
    completionReason: string;
    completedBy: string;
    paymentReleased: boolean;
    releasedAmount?: number;
    taskerReceived?: number;
    platformFee?: number;
    completedAt: string;
  };
}

// ============================================================================
// Financials & Payments Types
// ============================================================================

export interface PaymentStats {
  overview: {
    total_revenue: number;
    this_month_revenue: number;
    platform_fees_collected: number;
    escrow_held: number;
    pending_withdrawals: number;
  };
  transactions: {
    total: number;
    this_week: number;
    this_month: number;
    by_type: Record<string, number>;
  };
  success_rate: number;
  average_transaction_value: number;
  payment_methods: Record<string, number>;
}

export interface PaymentStatsResponse {
  status: string;
  data: PaymentStats;
}

export interface TransactionListItem {
  _id: string;
  type: string;
  amount: number;
  status: string;
  user?: {
    _id: string;
    fullName: string;
    emailAddress?: string;
  };
  tasker?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  task?: {
    _id: string;
    title: string;
  };
  description: string;
  reference?: string;
  paymentMethod?: string;
  platformFee?: number;
  balanceBefore?: number;
  balanceAfter?: number;
  createdAt: string;
}

export interface TransactionListResponse {
  status: string;
  data: {
    transactions: TransactionListItem[];
    summary?: {
      total_amount: number;
      count: number;
    };
    pagination: {
      currentPage: number;
      totalPages: number;
      totalTransactions: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface TransactionDetail extends TransactionListItem {
  paymentGateway?: string;
  gatewayReference?: string;
  gatewayFee?: number;
  metadata?: Record<string, string>;
  processedAt?: string;
}

export interface TransactionTimelineEvent {
  event: string;
  timestamp: string;
}

export interface TransactionDetailResponse {
  status: string;
  data: {
    transaction: TransactionDetail;
    relatedTransactions: TransactionListItem[];
    timeline: TransactionTimelineEvent[];
  };
}

// ============================================================================
// Moderation & Reports Types
// ============================================================================

export interface ReportEvidence {
  type: string;
  url: string;
  description?: string;
  messageCount?: number;
}

export interface Report {
  _id: string;
  type: string;
  status: "pending" | "resolved" | "dismissed";
  priority: "low" | "medium" | "high";
  reporter: {
    _id: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    userType?: string;
  };
  reportedUser?: {
    _id: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    userType?: string;
  };
  relatedTask?: {
    _id: string;
    title: string;
    status?: string;
    budget?: number;
    agreedPrice?: number;
  };
  reason: string;
  detailedDescription?: string;
  evidence?: ReportEvidence[];
  resolution?: string;
  resolvedBy?: {
    _id: string;
    fullName: string;
  };
  resolvedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReportListResponse {
  status: string;
  count: number;
  reports: Report[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ChatMessage {
  from: string;
  message: string;
  timestamp: string;
}

export interface ReportDetailResponse {
  status: string;
  data: {
    report: Report & {
      detailedDescription: string;
    };
    timeline: Array<{
      event: string;
      actor?: string;
      timestamp: string;
    }>;
    taskHistory?: Array<{
      event: string;
      timestamp: string;
    }>;
    chatMessages?: ChatMessage[];
  };
}

export interface ResolveReportInput {
  resolution: string;
  action_taken: string;
  refund_amount?: number;
  warning_issued?: boolean;
  notes?: string;
}

export interface ResolveReportResponse {
  status: string;
  message: string;
  data: {
    reportId: string;
    status: "resolved";
    resolution: string;
    action_taken: string;
    refund_amount?: number;
    warning_issued?: boolean;
    resolvedBy: string;
    resolvedAt: string;
  };
}

// ============================================================================
// Activity Logs Types
// ============================================================================

export interface ActivityLogItem {
  _id: string;
  /** Actual API field — use `resourceType` (e.g. "System", "User") */
  resourceType: string;
  /** Kept for backwards-compat if ever returned by a different endpoint */
  type?: string;
  action: string;
  admin: {
    _id: string;
    /** API returns email, not fullName */
    email: string;
    fullName?: string;
    role?: string;
  };
  resourceId: string;
  /** Legacy / future shape: a resolved target object */
  target?: {
    type: string;
    id: string;
    name: string;
  };
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  /** API uses createdAt, not timestamp */
  createdAt: string;
  updatedAt?: string;
  /** Kept for backwards-compat */
  timestamp?: string;
}

export interface ActivityLogResponse {
  status: string;
  /** Flat pagination fields returned at root level */
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  logs: ActivityLogItem[];
}

// ============================================================================
// Messages & Support Types
// ============================================================================

// ─── Message Stats ──────────────────────────────────────────────────────────────
// GET /api/admin/messages/stats
// admin.ts: return response.data ?? response
// useMessageStats().data === MessageStats directly (no .data wrapper in component)
export interface MessageStats {
  totalConversations: number;
  totalMessages: number;
  totalUnread: number;
}

// ─── Conversation List ───────────────────────────────────────────────────────────
// GET /api/admin/messages
// admin.ts: return response.data ?? response, typed Promise<ConversationListResponse>
// useConversations().data === ConversationListResponse directly (no .data wrapper in component)

export interface ConversationUnread {
  user: number;
  tasker: number;
}

export interface ConversationTask {
  _id: string;
  title: string;
  budget?: number;
  status: string;
}

export interface ConversationUser {
  _id: string;
  fullName: string;
  emailAddress?: string;
  profilePicture?: string;
}

export interface ConversationTasker {
  _id: string;
  firstName: string;
  lastName: string;
  emailAddress?: string;
  profilePicture?: string;
}

export interface ConversationListItem {
  _id: string;
  task?: ConversationTask;
  bid?: string;
  user: ConversationUser;
  tasker?: ConversationTasker;
  status: string;
  // lastMessage is a plain string, NOT an object
  lastMessage?: string;
  lastMessageAt?: string;
  // unread is per-role, NOT a single number
  unread: ConversationUnread;
  subject?: string;
  category?: string;
  priority?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationListResponse {
  status: string;
  results?: number;
  totalRecords?: number;
  totalPages: number;
  currentPage: number;
  conversations: ConversationListItem[];
}

// ─── Conversation Detail ─────────────────────────────────────────────────────────
// GET /api/admin/messages/:id
// Actual response shape:
// {
//   status: "success",
//   data: {
//     details: { ...conversation fields... },
//     messages: [ ...message items... ]
//   }
// }
// admin.ts: return response.data ?? response, typed Promise<ConversationDetailResponse["data"]>
// So useConversationDetails().data === { details, messages } directly (no .data wrapper in component)

export interface ConversationReadBy {
  who: string;
  at: string;
  _id: string;
}

export interface ConversationMessage {
  _id: string;
  conversation: string;
  // Who sent this message
  senderType: "user" | "tasker" | "admin" | "system" | string;
  // Populated only when senderType === "user"
  senderUser?: {
    _id: string;
    fullName: string;
    profilePicture?: string;
  };
  // Populated only when senderType === "tasker"
  senderTasker?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  text: string;
  attachments: string[];
  status: string;
  readBy: ConversationReadBy[];
  // Use createdAt as the message timestamp — there is no "timestamp" field
  createdAt: string;
  updatedAt: string;
}

// The object returned by useConversationDetails().data
export interface ConversationDetailData {
  // The conversation lives under "details", NOT "conversation"
  details: ConversationListItem;
  messages: ConversationMessage[];
  // NOTE: there is no "metadata" object in the real API response
}

// Full raw response type (for reference / admin.ts typing)
export interface ConversationDetailResponse {
  status: string;
  data: ConversationDetailData;
}

// ─── Send Admin Message ──────────────────────────────────────────────────────────
export interface SendAdminMessageInput {
  text: string;
  priority?: string;
  category?: string;
}

// ============================================================================
// System Settings Types
// ============================================================================

export interface SystemSettings {
  system: {
    maintenanceMode: boolean;
    newUserRegistrations: boolean;
    taskPostingEnabled: boolean;
  };
  security: {
    twoFactorAuthRequired: boolean;
    sessionTimeout: number;
    ipWhitelistEnabled: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    reportAlerts: boolean;
    kycSubmissionAlerts: boolean;
  };
  systemInfo: {
    version: string;
    lastBackup: string;
  };
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettingsResponse {
  status: string;
  data: SystemSettings;
}

export interface UpdateSystemSettingsInput {
  [key: string]: any; // Dot notation updates like "system.maintenanceMode": true
}

export interface UpdateSystemSettingsResponse {
  status: string;
  message: string;
  data: {
    updated: Record<string, any>;
    updatedBy: string;
    updatedAt: string;
  };
}

// ============================================================================
// Staff Management Types
// ============================================================================

export interface StaffStats {
  totalAdmin: number;
  activeToday: number;
  superAdmin: number;
  inactive: number;
  by_role: {
    super_admin: number;
    operations: number;
    trust_safety: number;
    support?: number;
  };
  recent_activity?: {
    last_24h: number;
    last_7d: number;
  };
}

export interface StaffStatsResponse {
  status: string;
  data: StaffStats;
}

export interface StaffMember {
  _id: string;
  name: string;
  email: string;
  role: "super_admin" | "operations" | "trust_safety" | "finance";
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  createdBy: string;
  mustChangePassword?: boolean;
}

export interface StaffListResponse {
  status: string;
  data: {
    staff: StaffMember[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalStaff: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface CreateStaffInput {
  email: string;
  role: "super_admin" | "operations" | "trust_safety" | "finance";
}

export interface SetupAdminInput {
  token: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface CreateStaffResponse {
  status: string;
  message: string;
  data: {
    staff: StaffMember;
  };
}

export interface StaffRecentActivity {
  id: string;
  /** e.g. "ADMIN LOGIN", "LOCK USER ACCOUNT" */
  action: string;
  /** e.g. "Performed action on System" */
  details: string;
  date: string;
}

export interface StaffDetailResponse {
  status: string;
  data: {
    profile: {
      id: string;
      email: string;
      role: "super_admin" | "operations" | "trust_safety" | "finance";
      phone?: string;
      location?: string;
      /** ISO date string — replaces the old createdAt */
      joinedAt: string;
      isActive: boolean;
    };
    permissions: string[];
    accountInfo: {
      adminId: string;
      role: string;
      /** ISO date of the last recorded update / action */
      lastUpdated: string;
    };
    /** replaces old recentActivity array */
    recentActivities: StaffRecentActivity[];
  };
}

export interface UpdateStaffStatusInput {
  isActive: boolean;
  reason?: string;
}

export interface UpdateStaffStatusResponse {
  status: string;
  message: string;
  data: {
    staffId: string;
    isActive: boolean;
    reason?: string;
    updatedBy: string;
    updatedAt: string;
  };
}

// ============================================================================
// Data Export Types
// ============================================================================

export interface ExportResponse<T = any> {
  status: string;
  data: {
    export_type: string;
    generated_at: string;
    date_range?: {
      start: string;
      end: string;
    };
    records: T[];
    summary: Record<string, any>;
    downloadUrl?: string;
  };
}

export interface DashboardExportRecord {
  date: string;
  total_users: number;
  active_users: number;
  new_users: number;
  total_tasks: number;
  open_tasks: number;
  completed_tasks: number;
  total_revenue: number;
  escrow_held: number;
}

export interface TaskExportRecord {
  task_id: string;
  title: string;
  status: string;
  budget: number;
  agreed_price?: number;
  category: string;
  user_name: string;
  user_email: string;
  tasker_name?: string;
  tasker_email?: string;
  location: string;
  bid_count: number;
  created_at: string;
  accepted_at?: string;
  completed_at?: string;
  completion_time_hours?: number;
}

export interface PaymentExportRecord {
  transaction_id: string;
  type: string;
  amount: number;
  status: string;
  user_name: string;
  user_email: string;
  payment_method: string;
  reference: string;
  gateway_fee: number;
  created_at: string;
}

export interface UserExportRecord {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  wallet_balance: number;
  is_verified: boolean;
  is_kyc_verified: boolean;
  is_active: boolean;
  total_tasks: number;
  completed_tasks: number;
  total_spent: number;
  created_at: string;
  last_login: string;
}

export interface TaskerExportRecord {
  tasker_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  categories: string;
  wallet_balance: number;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  total_tasks: number;
  completed_tasks: number;
  total_earned: number;
  created_at: string;
  last_active: string;
}

// ============================================================================
// Common API Response Types
// ============================================================================

export interface SuccessResponse {
  status: "success";
  message: string;
}

export interface ErrorResponse {
  status: "error";
  message: string;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Query Parameter Types
// ============================================================================

export interface UserListQueryParams extends PaginationParams {
  search?: string;
  status?: "active" | "inactive" | "locked";
  verified?: boolean;
  kycVerified?: boolean;
}

export interface TaskerListQueryParams extends PaginationParams {
  search?: string;
  status?: "active" | "suspended" | "inactive";
  verified?: boolean;
  categories?: string;
}

export interface TaskListQueryParams extends PaginationParams {
  status?: string;
  category?: string;
  userId?: string;
  taskerId?: string;
  search?: string;
}

export interface TransactionListQueryParams
  extends PaginationParams, DateRangeParams {
  type?: string;
  status?: string;
  userId?: string;
  taskerId?: string;
  search?: string;
}

export interface AdminPaymentFilters extends TransactionListQueryParams {}

export interface ReportListQueryParams extends PaginationParams {
  status?: "pending" | "resolved" | "dismissed";
  type?: string;
}

export interface ActivityLogQueryParams
  extends PaginationParams, DateRangeParams {
  type?: string;
  adminId?: string;
}

export interface ConversationListQueryParams extends PaginationParams {
  status?: string;
  category?: string;
  unread?: boolean;
}

export interface KYCListQueryParams extends PaginationParams {
  status?: "pending" | "approved" | "rejected";
}

export interface StaffListQueryParams extends PaginationParams {
  role?: "super_admin" | "operations" | "trust_safety" | "finance";
  status?: "active" | "inactive";
}

export interface ExportQueryParams extends DateRangeParams {
  status?: string;
  category?: string;
}

// ============================================================================
// Categories Types
// ============================================================================

// ─── Message Stats ──────────────────────────────────────────────────────────────
// GET /api/admin/messages/stats
// admin.ts: return response.data ?? response
// useMessageStats().data === MessageStats directly (no .data wrapper in component)
export interface MessageStats {
  totalConversations: number;
  totalMessages: number;
  totalUnread: number;
}

// ─── Conversation List ───────────────────────────────────────────────────────────
// GET /api/admin/messages
// admin.ts: return response.data ?? response, typed Promise<ConversationListResponse>
// useConversations().data === ConversationListResponse directly (no .data wrapper in component)

export interface ConversationUnread {
  user: number;
  tasker: number;
}

export interface ConversationTask {
  _id: string;
  title: string;
  budget?: number;
  status: string;
}

export interface ConversationUser {
  _id: string;
  fullName: string;
  emailAddress?: string;
  profilePicture?: string;
}

export interface ConversationTasker {
  _id: string;
  firstName: string;
  lastName: string;
  emailAddress?: string;
  profilePicture?: string;
}

export interface ConversationListItem {
  _id: string;
  task?: ConversationTask;
  bid?: string;
  user: ConversationUser;
  tasker?: ConversationTasker;
  status: string;
  // lastMessage is a plain string, NOT an object
  lastMessage?: string;
  lastMessageAt?: string;
  // unread is per-role, NOT a single number
  unread: ConversationUnread;
  subject?: string;
  category?: string;
  priority?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationListResponse {
  status: string;
  results?: number;
  totalRecords?: number;
  totalPages: number;
  currentPage: number;
  conversations: ConversationListItem[];
}

// ─── Conversation Detail ─────────────────────────────────────────────────────────
// GET /api/admin/messages/:id
// Actual response shape:
// {
//   status: "success",
//   data: {
//     details: { ...conversation fields... },
//     messages: [ ...message items... ]
//   }
// }
// admin.ts: return response.data ?? response, typed Promise<ConversationDetailResponse["data"]>
// So useConversationDetails().data === { details, messages } directly (no .data wrapper in component)

export interface ConversationReadBy {
  who: string;
  at: string;
  _id: string;
}

export interface ConversationMessage {
  _id: string;
  conversation: string;
  // Who sent this message
  senderType: "user" | "tasker" | "admin" | "system" | string;
  // Populated only when senderType === "user"
  senderUser?: {
    _id: string;
    fullName: string;
    profilePicture?: string;
  };
  // Populated only when senderType === "tasker"
  senderTasker?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  text: string;
  attachments: string[];
  status: string;
  readBy: ConversationReadBy[];
  // Use createdAt as the message timestamp — there is no "timestamp" field
  createdAt: string;
  updatedAt: string;
}

// The object returned by useConversationDetails().data
export interface ConversationDetailData {
  // The conversation lives under "details", NOT "conversation"
  details: ConversationListItem;
  messages: ConversationMessage[];
  // NOTE: there is no "metadata" object in the real API response
}

// Full raw response type (for reference / admin.ts typing)
export interface ConversationDetailResponse {
  status: string;
  data: ConversationDetailData;
}

// ─── Send Admin Message ──────────────────────────────────────────────────────────
export interface SendAdminMessageInput {
  text: string;
  priority?: string;
  category?: string;
}

// ─── Categories ──────────────────────────────────────────────────────────────
// These replace the old AdminCategory, AdminCategoryListResponse,
// AdminCategoryDetailResponse, CreateCategoryRequest, UpdateCategoryRequest types

// Single category as returned in the list
export interface AdminCategory {
  _id: string;
  name: string;
  displayName?: string;
  description: string;
  // Real API uses isActive boolean — NOT status: "Active"/"Closed"
  isActive: boolean;
  // Real API field is "minimumPrice" — NOT "minPrice"
  minimumPrice: number;
  // Real API field is "services" in list — NOT "serviceCount"
  services?: number;
  // Add support for subcategory hierarchy
  parentCategory?: string | any;
  subCategoryCount?: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Stats block returned by GET /api/admin/categories
export interface AdminCategoryStats {
  activeCategories: number;
  closedCategories: number;
  totalServices: number;
  totalTasks: number; // Added from redesign
}

// GET /api/admin/categories
// admin.ts: return response.data ?? response
// useAdminCategories().data === { stats, categories } directly
export interface AdminCategoryListResponse {
  status: string;
  data: {
    stats: AdminCategoryStats;
    categories: AdminCategory[];
  };
}

// Stats block returned by GET /api/admin/categories/:id
export interface AdminCategoryDetailStats {
  totalServices: number;
  subCategoryCount: number; // Added from redesign
  activeServices: number; // Added from redesign
  // Real API returns activeTaskers + totalTaskers — NOT "taskers" or "activeServices"
  activeTaskers: number;
  totalTaskers: number;
  revenue: number;
}

// Task shape in category detail (real API returns [] so typed from component usage)
export interface AdminCategoryTask {
  _id: string;
  title: string;
  postedBy: string;
  category: string;
  budget: number;
  status: string;
  date?: string;
  createdAt?: string;
}

// Tasker shape in category detail (real API returns [] so typed from component usage)
export interface AdminCategoryTasker {
  _id: string;
  fullName: string;
  email: string;
  emailAddress?: string;
  profilePicture?: string;
  category?: string;
  status: "Active" | "Suspended" | string;
  verification: "Verified" | "Not verified" | "Pending" | string;
  lastActive?: string;
}

// GET /api/admin/categories/:id
// admin.ts: return response.data ?? response
// useAdminCategoryDetails().data === { category, stats, tasks, taskers } directly
export interface AdminCategoryDetailResponse {
  status: string;
  data: {
    category: AdminCategory;
    stats: AdminCategoryDetailStats;
    tasks: AdminCategoryTask[];
    taskers: AdminCategoryTasker[];
    subcategories?: AdminCategory[]; // Added for hierarchy drill-down
    subCategories?: AdminCategory[]; // Match API casing
  };
}

// POST /api/admin/categories payload
export interface CreateCategoryRequest {
  name: string;
  displayName: string;
  description: string;
  minimumPrice: number;
  parentCategory?: string; // For creating subcategories
}

// PATCH /api/admin/categories/:id payload
export interface UpdateCategoryRequest {
  name?: string;
  displayName?: string;
  description?: string;
  minimumPrice?: number;
  // Use isActive boolean — NOT status: "Active"/"Closed"
  isActive?: boolean;
  parentCategory?: string;
}

// ============================================================================
// Waitlist Types
// ============================================================================

export interface AdminWaitlistListItem {
  _id: string;
  email: string;
  createdAt: string;
}

export interface AdminWaitlistResponse {
  status: string;
  count: number;
  data: AdminWaitlistListItem[];
}
// ─── Main Categories ──────────────────────────────────────────────────────────
export interface AdminMainCategory {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  isActive: boolean;
  subcategories: number;
  createdAt: string;
}

export interface AdminMainCategoryListResponse {
  status: string;
  data: {
    mainCategories: AdminMainCategory[];
  };
}

export interface CreateMainCategoryRequest {
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
}

export interface UpdateMainCategoryRequest {
  name?: string;
  displayName?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

// ─── Universities ──────────────────────────────────────────────────────────────
export interface AdminUniversity {
  _id: string;
  name: string;
  abbreviation: string;
  state: string;
  location: string;
  logo: string;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
}

export interface AdminUniversityListResponse {
  status: string;
  data: {
    universities: AdminUniversity[];
  };
}

export interface CreateUniversityRequest {
  name: string;
  abbreviation?: string;
  state?: string;
  location?: string;
  logo?: string;
}

export interface UpdateUniversityRequest {
  name?: string;
  abbreviation?: string;
  state?: string;
  location?: string;
  logo?: string;
  isActive?: boolean;
}

// ============================================================================
// Notification Management Types
// ============================================================================

export interface AdminNotification {
  _id: string;
  title: string;
  message: string;
  type: "Announcement" | "Alert" | "Warning" | "Update";
  audience: "All Users" | "All Taskers" | "Selected Users" | "Everyone";
  recipientsCount: number;
  openedCount: number;
  sentBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminNotificationStats {
  totalUsers: number;
  totalTaskers: number;
  totalSent: number;
  openRate: string;
}

export interface SendNotificationRequest {
  title: string;
  message: string;
  type?: "Announcement" | "Alert" | "Warning" | "Update";
  audience: "All Users" | "All Taskers" | "Selected Users" | "Everyone";
  selectedUserIds?: string[];
}

export interface AdminNotificationListResponse {
  status: string;
  results: number;
  data: AdminNotification[];
}

export interface AdminNotificationStatsResponse {
  status: string;
  data: AdminNotificationStats;
}
