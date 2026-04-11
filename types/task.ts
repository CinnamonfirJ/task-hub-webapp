import { User } from "./auth";

export interface Category {
  _id: string;
  name: string;
  displayName: string;
  slug?: string;
  icon?: string;
  description: string;
  isActive: boolean;
  mainCategory?: any;
  parentCategory?: any;
  count?: number;
  createdBy?:
    | string
    | {
        _id: string;
        fullName: string;
        emailAddress: string;
      };
  createdAt: string;
  updatedAt?: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  mainCategory?: Category | string;
  subCategory?: Category | string;
  categories: Category[] | string[]; // Populated or IDs
  budget: number;
  location?:
    | {
        latitude: number;
        longitude: number;
        address?: string;
      }
    | string;
  isBiddingEnabled?: boolean;
  status: "open" | "assigned" | "in-progress" | "completed" | "cancelled";
  creator: User | string;
  user?: Partial<User>; // Populated user info (poster details)
  deadline?: string;
  dueDate?: string; // New: matches spec
  university?: any; // New: matches backend
  images?: string[];
  tags?: string[];
  createdAt: string;
  bidsCount?: number;
  distance?: number; // Distance in miles/km (tasker feed only)
  taskerBidInfo?: {
    _id?: string;
    hasBid: boolean;
    amount?: number;
    message?: string;
    bidType?: "custom" | "fixed";
    status?: "pending" | "accepted" | "rejected";
  };
  applicationInfo?: {
    canApply: boolean;
    applicationMode: "bidding" | "fixed";
    applicationLabel: string;
    priceEditable: boolean;
    fixedPrice: number | null;
  };
}

export interface TaskFilters {
  categories?: string[];
  minBudget?: number;
  maxBudget?: number;
  search?: string;
  status?: string;
  limit?: number;
  page?: number;
}
