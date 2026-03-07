import { AdminWaitlistResponse } from "@/types/admin";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_API;

function getAuthHeaders(): Record<string, string> {
  // Adjust the key to match wherever your app stores the admin token
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("adminToken") ||
        sessionStorage.getItem("token")
      : null;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function backendFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options?.headers ?? {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Error ${response.status}: ${response.statusText}`,
    );
  }

  return data;
}

export const waitlistApi = {
  /**
   * Join the waitlist with an email address
   */
  join: async (email: string): Promise<{ message: string }> => {
    return backendFetch<{ message: string }>("/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  getWaitlist: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AdminWaitlistResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, String(value));
      });
    }

    const response = await backendFetch<AdminWaitlistResponse>(
      `/api/waitlist?${query.toString()}`,
      { method: "GET" },
    );

    return response;
  },
};
