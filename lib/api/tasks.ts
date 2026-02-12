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
    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach(cat => params.append("categories", cat));
    }
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

  createTask: async (data: any): Promise<Task> => {
    const response = await apiData<{ status: string; data: { task: Task } }>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data.task;
  },

  getTaskerFeed: async (params: { maxDistance?: number; status?: string } = {}): Promise<Task[]> => {
    const searchParams = new URLSearchParams();
    if (params.maxDistance) searchParams.append("maxDistance", params.maxDistance.toString());
    if (params.status) searchParams.append("status", params.status);

    const response = await apiData<{ status: string; count: number; tasks: Task[] }>(
      `/api/tasks/tasker/feed?${searchParams.toString()}`,
      { method: "GET" }
    );
    return response.tasks || [];
  },
};
