import { apiData } from "@/lib/api";
import { Task, TaskFilters, Category } from "@/types/task";

// Response type for tasks listing
interface TasksResponse {
  status: string;
  count: number;
  totalPages: number;
  currentPage: number;
  tasks: Task[];
}

export const tasksApi = {
  getTasks: async (filters: TaskFilters = {}): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.search) params.append("search", filters.search);
    if (filters.minBudget) params.append("minBudget", filters.minBudget.toString());
    if (filters.maxBudget) params.append("maxBudget", filters.maxBudget.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.status) params.append("status", filters.status);
    
    const response = await apiData<TasksResponse>(`/api/tasks?${params.toString()}`, {
      method: "GET",
    });
    
    return response.tasks || [];
  },

  getTask: async (id: string): Promise<Task> => {
    return apiData<Task>(`/api/tasks/${id}`, {
      method: "GET",
    });
  },

  createTask: async (data: Partial<Task>): Promise<Task> => {
    return apiData<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiData<Category[] | { categories: Category[] }>("/api/categories", {
        method: "GET",
      });
      // Handle both array and object response formats
      if (Array.isArray(response)) {
        return response;
      }
      if (response && Array.isArray(response.categories)) {
        return response.categories;
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  },
};
