import { User } from "./auth";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  categories: Category[] | string[]; // Populated or IDs
  budget: number;
  location?: {
    latitude: number;
    longitude: number;
  } | string;
  isBiddingEnabled?: boolean;
  status: "open" | "assigned" | "in-progress" | "completed" | "cancelled";
  creator: User | string;
  deadline?: string;
  images?: string[];
  tags?: string[];
  createdAt: string;
  bidsCount?: number;
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
