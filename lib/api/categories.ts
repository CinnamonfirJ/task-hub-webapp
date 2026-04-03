import { apiData } from "@/lib/api";
import { Category } from "@/types/task";
import { MainCategory, Subcategory, University } from "@/types/category";

export interface CategoryStats {
  category: {
    _id: string;
    name: string;
    displayName: string;
  };
  stats: {
    totalTasks: number;
    totalTaskers: number;
    recentTasks: Array<{
      _id: string;
      title: string;
      createdAt: string;
      status: string;
    }>;
  };
}

export interface CategoriesResponse {
  status: string;
  count: number;
  categories: Category[];
}

export const categoriesApi = {
  // Get all active categories (Public)
  getCategories: async (): Promise<Category[]> => {
    try {
      // Helper to extract categories from various response formats
      const extractCategories = (res: any): Category[] | null => {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.categories)) return res.categories;
        if (res && res.data && Array.isArray(res.data.categories)) return res.data.categories;
        return null;
      };

      // Try the primary endpoint first
      const response = await apiData<any>("/api/categories", {
        method: "GET",
      }).catch(() => null);

      let categories = extractCategories(response);

      // If primary is empty or fails, try the alternative task categories endpoint
      if (!categories || categories.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log("Primary categories endpoint empty, trying /api/tasks/categories...");
        }
        const altResponse = await apiData<any>("/api/tasks/categories", { method: "GET" }).catch(() => null);
        const altCategories = extractCategories(altResponse);
        if (altCategories && altCategories.length > 0) {
          return altCategories;
        }
      }

      // If still empty, try /api/auth/categories
      if (!categories || categories.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log("Secondary categories endpoint empty, trying /api/auth/categories...");
        }
        const authRes = await apiData<any>("/api/auth/categories", { method: "GET" }).catch(() => null);
        const authCategories = extractCategories(authRes);
        if (authCategories && authCategories.length > 0) {
          return authCategories;
        }
      }

      return categories || [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  },

  // New Spec: Get Main Categories (Public)
  getMainCategories: async (): Promise<MainCategory[]> => {
    try {
      const response = await apiData<any>("/api/main-categories", {
        method: "GET",
      });
      let mains = response.data?.mainCategories || response.mainCategories || [];
      
      // Fallback: If no explicit main categories exist, derive them from top-level generic categories
      if (mains.length === 0) {
        const allCats = await categoriesApi.getCategories();
        mains = allCats.filter((c: any) => !c.parentCategory && !c.mainCategory);
      }
      
      return mains;
    } catch (error) {
      console.error("Failed to fetch main categories:", error);
      return [];
    }
  },

  // New Spec: Get Universities (Public)
  getUniversities: async (): Promise<University[]> => {
    try {
      const response = await apiData<any>("/api/universities", {
        method: "GET",
      });
      return response.data?.universities || response.universities || [];
    } catch (error) {
      console.error("Failed to fetch universities:", error);
      return [];
    }
  },

  // Get category details (Public)
  getCategory: async (id: string): Promise<Category> => {
    const response = await apiData<{ status: string; category: Category }>(`/api/categories/${id}`, {
      method: "GET",
    });
    return response.category;
  },

  // Create category (Admin)
  createCategory: async (data: { name: string; displayName: string; description: string }): Promise<Category> => {
    const response = await apiData<{ status: string; category: Category }>("/api/categories/admin", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.category;
  },

  // Get all categories (Admin)
  getAllCategoriesAdmin: async (showInactive = false): Promise<Category[]> => {
    const response = await apiData<CategoriesResponse>(`/api/categories/admin/all?showInactive=${showInactive}`, {
      method: "GET",
    });
    return response.categories || [];
  },

  // Update category (Admin)
  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await apiData<{ status: string; category: Category }>(`/api/categories/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.category;
  },

  // Deactivate category (Admin)
  deactivateCategory: async (id: string): Promise<{ status: string; message: string; usage?: { tasks: number; taskers: number } }> => {
    return apiData<any>(`/api/categories/admin/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  // Get category stats (Admin)
  getCategoryStats: async (id: string): Promise<CategoryStats> => {
    const response = await apiData<{ status: string; category: any; stats: any }>(`/api/categories/admin/${id}/stats`, {
      method: "GET",
    });
    return response as unknown as CategoryStats;
  }
};
