import { User } from "./auth";

export interface AdminDashboardStats {
  users: {
    total: number;
    active: number;
  };
  tasks: {
    total: number;
    open: number;
    completed: number;
    cancelled: number;
  };
  reports: {
    pending: number;
    resolved: number;
    dismissed: number;
  };
  escrow: {
    totalHeld: number;
  };
  kyc: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface KYCRecord {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    emailAddress: string;
  };
  nin: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface Report {
  _id: string;
  type: string;
  status: "pending" | "resolved" | "dismissed";
  description: string;
  reportedBy: {
    _id: string;
    fullName: string;
  };
  createdAt: string;
}

export interface KYCStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
