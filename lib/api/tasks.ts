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
      filters.categories.forEach((cat) => params.append("categories", cat));
    }
    if (filters.search) params.append("search", filters.search);
    if (filters.minBudget)
      params.append("minBudget", filters.minBudget.toString());
    if (filters.maxBudget)
      params.append("maxBudget", filters.maxBudget.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.status) params.append("status", filters.status);

    const res = await apiData<any>(
      `/api/tasks?${params.toString()}`,
      {
        method: "GET",
      },
    );

    return (
      res?.tasks ||
      (Array.isArray(res?.data) ? res.data : res?.data?.tasks) ||
      (Array.isArray(res) ? res : [])
    );
  },

  getTask: async (id: string): Promise<Task> => {
    const res = await apiData<any>(`/api/tasks/${id}`, {
      method: "GET",
    });
    return res?.data?.task || res?.task || res;
  },

  createTask: async (data: any): Promise<Task> => {
    const res = await apiData<any>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res?.data?.task || res?.task;
  },

  getTaskerFeed: async (
    params: { maxDistance?: number; status?: string } = {},
  ): Promise<Task[]> => {
    const searchParams = new URLSearchParams();
    if (params.maxDistance)
      searchParams.append("maxDistance", params.maxDistance.toString());
    if (params.status) searchParams.append("status", params.status);

    const res = await apiData<any>(
      `/api/tasks/tasker/feed?${searchParams.toString()}`,
      { method: "GET" },
    );
    return (
      res?.tasks ||
      (Array.isArray(res?.data) ? res.data : res?.data?.tasks) ||
      (Array.isArray(res) ? res : [])
    );
  },

  getUserTasks: async (
    filters: { status?: string; page?: number; limit?: number } = {},
  ): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    // Fallback to a large limit if no status/page provided to try and get 'all' for client-side legacy
    // But ideally we should use server-side filtering.
    if (!filters.limit && !filters.page && !filters.status) {
      params.append("limit", "100");
    }

    const res = await apiData<any>(
      `/api/tasks/user/tasks?${params.toString()}`,
      { method: "GET" },
    );

    return (
      res?.tasks ||
      (Array.isArray(res?.data) ? res.data : res?.data?.tasks) ||
      (Array.isArray(res) ? res : [])
    );
  },

  getUserDashboardTasks: async (
    filters: { status?: string; page?: number; limit?: number } = {},
  ): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const res = await apiData<any>(
      `/api/tasks/user/tasks?${params.toString()}`,
      { method: "GET" },
    );

    return (
      res?.tasks ||
      (Array.isArray(res?.data) ? res.data : res?.data?.tasks) ||
      (Array.isArray(res) ? res : [])
    );
  },

  cancelTask: async (
    id: string,
  ): Promise<{ status: string; message: string }> => {
    return apiData<{ status: string; message: string }>(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  },

  getCompletionCode: async (taskId: string): Promise<string> => {
    const res = await apiData<any>(`/api/tasks/${taskId}/completion-code`, {
      method: "GET",
    });
    return res?.data?.completionCode || res?.completionCode;
  },

  updateTaskStatusTasker: async (
    taskId: string,
    payload: { status: "in-progress" | "completed"; completionCode?: string },
  ): Promise<any> => {
    const res = await apiData<any>(`/api/tasks/${taskId}/status/tasker`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return res?.task || res?.data?.task || res;
  },
};
