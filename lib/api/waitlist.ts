import { apiData } from "@/lib/api";
import { AdminWaitlistResponse } from "@/types/admin";

export const waitlistApi = {
  /**
   * Join the waitlist with an email address
   */
  join: async (email: string): Promise<{ message: string }> => {
    return apiData<{ message: string }>("/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Get the waitlist entries (Admin only)
   */
  getWaitlist: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AdminWaitlistResponse["data"]> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }

    const response = await apiData<any>(`/api/waitlist?${query.toString()}`, {
      method: "GET",
    });
    return response.data ?? response;
  },
};
