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
  category: Category | string; // Populated or ID
  budget: number;
  location?: string;
  status: "open" | "assigned" | "in-progress" | "completed" | "cancelled";
  creator: User | string;
  deadline?: string;
  images?: string[];
  tags?: string[];
  createdAt: string;
  bidsCount?: number;
}

export interface TaskFilters {
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  search?: string;
  status?: string;
  limit?: number;
  page?: number;
}
