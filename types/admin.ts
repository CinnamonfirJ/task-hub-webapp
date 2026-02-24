import { User } from "./auth";

export interface AdminDashboardStats {
  users: {
    total: number;
    active: number;
    new_this_month: number;
    verified: number;
    locked: number;
  };
  taskers: {
    total: number;
    active: number;
    verified: number;
    suspended: number;
    pending_verification: number;
  };
  tasks: {
    total: number;
    open: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    this_month: number;
  };
  financials: {
    total_revenue: number;
    escrow_held: number;
    pending_withdrawals: number;
    total_transactions: number;
    this_month_revenue: number;
  };
  kyc: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    pending_review: number;
  };
  reports: {
    total: number;
    pending: number;
    resolved: number;
    dismissed: number;
  };
  support: {
    open_tickets: number;
    unread_messages: number;
    avg_response_time: string;
  };
}

export interface AdminProfile {
  _id: string;
  fullName: string;
  emailAddress: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  profilePicture?: string;
  lastLogin?: string;
  createdAt: string;
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

export interface AdminLoginRequest {
  emailAddress: string;
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

// --- User Management Types ---

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  locked: number;
  deleted: number;
  kyc_verified: number;
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

export interface AdminUserListItem extends User {
  isLocked: boolean;
  lockReason: string | null;
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

export interface AdminUserDetailResponse {
  status: string;
  data: {
    user: User & {
      isLocked: boolean;
      lockReason: string | null;
      lockUntil: string | null;
      createdAt: string;
      updatedAt: string;
    };
    stats: {
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
    recentTasks: Array<{
      _id: string;
      title: string;
      status: string;
      budget: number;
      createdAt: string;
    }>;
    recentTransactions: Array<{
      _id: string;
      type: string;
      amount: number;
      description: string;
      createdAt: string;
    }>;
  };
}

export interface DeactivateUserInput {
  reason?: string;
}

export interface LockUserInput {
  reason: string;
  duration?: number;
}

export interface SoftDeleteUserInput {
  reason?: string;
}

// --- Tasker Management Types ---

export interface TaskerCategory {
  _id: string;
  name?: string;
  displayName: string;
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
  rating: number;
  completedTasks: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  lastActive?: string;
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

export interface AdminTaskerDetailResponse {
  status: string;
  data: {
    tasker: AdminTaskerListItem & {
      country?: string;
      residentState?: string;
      address?: string;
      profilePicture?: string;
      isEmailVerified?: boolean;
      suspensionReason?: string | null;
    };
    stats: {
      bids: {
        total: number;
        accepted: number;
        rejected: number;
        pending: number;
        acceptanceRate: number;
      };
      tasks: {
        total: number;
        completed: number;
        cancelled: number;
        completionRate: number;
      };
      financials: {
        totalEarnings: number;
        averageTaskValue: number;
        pendingPayments: number;
      };
      performance: {
        averageRating: number;
        totalReviews: number;
        responseTime: string;
        completionTime: string;
      };
    };
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
  };
}

export interface SuspendTaskerInput {
  reason: string;
  duration?: number;
}

export interface VerifyTaskerInput {
  verificationNotes?: string;
}

// --- KYC / Verification Types (Enhanced) ---

export interface KYCRecord {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    emailAddress: string;
    phoneNumber?: string;
  };
  nin: string;
  status: "pending" | "approved" | "rejected";
  submittedDocuments?: Array<{
    type: string;
    url: string;
  }>;
  approvedBy?: {
    _id: string;
    fullName: string;
  };
  approvedAt?: string;
  rejectionReason?: string;
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

export interface KYCStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  pending_review?: number;
  approval_rate?: number;
  average_review_time?: string;
  this_week?: {
    submitted: number;
    approved: number;
    rejected: number;
    pending: number;
  };
  this_month?: {
    submitted: number;
    approved: number;
    rejected: number;
    pending: number;
  };
}

// --- Task Management Types ---

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
  categories: AdminTaskCategory[];
  user: {
    _id: string;
    fullName: string;
    emailAddress: string;
  };
  assignedTasker?: {
    _id: string;
    firstName: string;
    lastName: string;
    rating?: number;
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
  data: {
    tasks: AdminTaskListItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalTasks: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface AdminTaskDetailResponse {
  status: string;
  data: {
    task: AdminTaskListItem & {
      images?: string[];
      deadline?: string;
      acceptedAt?: string;
      assignedTasker?: {
        _id: string;
        firstName: string;
        lastName: string;
        emailAddress?: string;
        phoneNumber?: string;
        rating?: number;
        verifyIdentity?: boolean;
      };
      user: {
        _id: string;
        fullName: string;
        emailAddress: string;
        phoneNumber?: string;
      };
    };
    bids: Array<{
      _id: string;
      tasker: {
        firstName: string;
        lastName: string;
      };
      amount: number;
      status: string;
      createdAt: string;
    }>;
    timeline: Array<{
      event: string;
      timestamp: string;
      actor?: string;
    }>;
    payments: Array<{
      type: string;
      amount: number;
      status: string;
      timestamp: string;
    }>;
  };
}

export interface TaskStats {
  total: number;
  by_status: {
    open: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  this_week?: {
    created: number;
    completed: number;
    cancelled: number;
  };
  this_month?: {
    created: number;
    completed: number;
    cancelled: number;
  };
  by_category?: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  financials?: {
    total_value: number;
    average_budget: number;
    escrow_held: number;
  };
  performance?: {
    average_completion_time: string;
    completion_rate: number;
    cancellation_rate: number;
  };
}

export interface ForceCancelTaskInput {
  reason: string;
  refundUser?: boolean;
}

export interface ForceCompleteTaskInput {
  reason: string;
  releaseToTasker?: boolean;
  adjustedAmount?: number;
}

// --- Financials & Payments Types ---

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
  payment_methods?: Record<string, number>;
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

export interface TransactionDetailResponse {
  status: string;
  data: {
    transaction: TransactionListItem & {
      paymentGateway?: string;
      gatewayReference?: string;
      gatewayFee?: number;
      metadata?: Record<string, string>;
      processedAt?: string;
    };
    relatedTransactions: TransactionListItem[];
    timeline: Array<{
      event: string;
      timestamp: string;
    }>;
  };
}

// --- Reports & Moderation Types ---

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
  priority?: "low" | "medium" | "high";
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

export interface ReportDetailResponse {
  status: string;
  data: {
    report: Report;
    timeline: Array<{
      event: string;
      actor?: string;
      timestamp: string;
    }>;
    taskHistory?: Array<{
      event: string;
      timestamp: string;
    }>;
    chatMessages?: Array<{
      from: string;
      message: string;
      timestamp: string;
    }>;
  };
}

export interface ResolveReportInput {
  resolution: string;
  action_taken: string;
  refund_amount?: number;
  warning_issued?: boolean;
  notes?: string;
}

// --- Activity Logs Types ---

export interface ActivityLogItem {
  _id: string;
  type: string;
  action: string;
  admin: {
    _id: string;
    fullName: string;
    role?: string;
  };
  target?: {
    type: string;
    id: string;
    name: string;
  };
  details?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export interface ActivityLogResponse {
  status: string;
  data: {
    activities: ActivityLogItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalActivities: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// --- Messages & Support Types ---

export interface MessageStats {
  overview: {
    total_conversations: number;
    active_conversations: number;
    unread_messages: number;
    flagged_conversations: number;
  };
  this_week?: {
    new_conversations: number;
    messages_sent: number;
    avg_response_time: string;
  };
  support_tickets?: {
    open: number;
    pending_admin_response: number;
    resolved_this_week: number;
  };
  categories?: Record<string, number>;
}

export interface ConversationListItem {
  _id: string;
  type: string;
  status: string;
  category?: string;
  priority?: string;
  user: {
    _id: string;
    fullName: string;
    emailAddress?: string;
  };
  tasker?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  relatedTask?: {
    _id: string;
    title: string;
  };
  subject?: string;
  flagReason?: string;
  lastMessage?: {
    from: string;
    text: string;
    timestamp: string;
  };
  unreadCount: number;
  messageCount: number;
  createdAt: string;
  lastActivity: string;
}

export interface ConversationListResponse {
  status: string;
  data: {
    conversations: ConversationListItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalConversations: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface ConversationMessage {
  _id: string;
  from: {
    id: string;
    name: string;
    type: string;
  };
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ConversationDetailResponse {
  status: string;
  data: {
    conversation: ConversationListItem & {
      subject?: string;
    };
    messages: ConversationMessage[];
    metadata: {
      totalMessages: number;
      unreadCount: number;
      averageResponseTime?: string;
      assignedTo?: string | null;
    };
  };
}

// --- System Settings Types ---

export interface SystemSettings {
  system: {
    maintenanceMode: boolean;
    maintenanceMessage?: string;
    registrationEnabled: boolean;
    taskCreationEnabled: boolean;
    biddingEnabled: boolean;
    paymentsEnabled: boolean;
  };
  features: {
    ninVerification: boolean;
    kycVerification: boolean;
    pushNotifications: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  limits: {
    max_task_budget: number;
    min_task_budget: number;
    max_withdrawal: number;
    min_withdrawal: number;
    max_images_per_task: number;
    max_categories_per_task: number;
  };
  fees: {
    platform_fee_percentage: number;
    withdrawal_fee: number;
    payment_gateway_fee_percentage: number;
  };
  notifications?: {
    new_task_radius_miles: number;
    task_expiry_days: number;
    bid_expiry_hours: number;
  };
  security?: {
    max_login_attempts: number;
    account_lock_duration_hours: number;
    session_timeout_minutes: number;
    password_min_length: number;
  };
}

// --- Staff Management Types ---

export interface StaffStats {
  total: number;
  active: number;
  inactive: number;
  by_role: {
    super_admin: number;
    operations: number;
    trust_safety: number;
    support: number;
  };
  recent_activity: {
    last_24h: number;
    last_7d: number;
  };
}

export interface StaffMember {
  _id: string;
  fullName: string;
  emailAddress: string;
  role: "super_admin" | "operations" | "trust_safety" | "support";
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  createdBy: string | { _id: string; fullName: string };
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

export interface StaffDetailResponse {
  status: string;
  data: {
    staff: StaffMember;
    activity: {
      login_count: number;
      last_30_days: {
        logins: number;
        actions: number;
        average_session: string;
      };
      actions_by_type: Record<string, number>;
    };
    recentActivity: Array<{
      type: string;
      target: string;
      timestamp: string;
    }>;
  };
}

export interface CreateStaffInput {
  fullName: string;
  emailAddress: string;
  password?: string;
  role: "super_admin" | "operations" | "trust_safety" | "support";
  permissions?: string[];
}

export interface UpdateStaffStatusInput {
  isActive: boolean;
  reason?: string;
}

// --- Data Export Types ---

export interface ExportResponse<T = any> {
  status: string;
  data: {
    export_type: string;
    generated_at: string;
    downloadUrl?: string;
    date_range?: {
      start: string;
      end: string;
    };
    records: T[];
    summary: Record<string, any>;
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
