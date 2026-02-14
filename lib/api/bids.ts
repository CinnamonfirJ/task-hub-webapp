import { apiData } from "@/lib/api";
import { Bid, CreateBidInput, UpdateBidInput, BidsResponse } from "@/types/bid";

export const bidsApi = {
  // Create a bid (Tasker only)
  createBid: async (data: CreateBidInput): Promise<Bid> => {
    const res = await apiData<any>("/api/bids", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res?.bid || res?.data?.bid;
  },

  // Update existing bid (Tasker owner only)
  updateBid: async (id: string, data: UpdateBidInput): Promise<Bid> => {
    const res = await apiData<any>(`/api/bids/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res?.bid || res?.data?.bid;
  },

  // Delete bid (Tasker owner only)
  deleteBid: async (
    id: string,
  ): Promise<{ status: string; message: string }> => {
    return apiData<any>(`/api/bids/${id}`, {
      method: "DELETE",
    });
  },

  // Get all bids created by tasker
  getMyBids: async (status?: string): Promise<Bid[]> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);

    // Try multiple endpoints to handle potential backend inconsistencies or 401s
    const endpoints = [
      `/api/bids/tasker?${params.toString()}`, // Primary
      `/api/bids?${params.toString()}`, // Fallback 1: Generic plural
      `/api/tasker/bids?${params.toString()}`, // Fallback 2: Resource nested
      `/api/my-bids?${params.toString()}`, // Fallback 3: Direct alias
    ];

    for (const endpoint of endpoints) {
      try {
        const res = await apiData<any>(endpoint, { method: "GET" });
        const bids =
          res?.bids ||
          (Array.isArray(res?.data) ? res.data : res?.data?.bids) ||
          (Array.isArray(res) ? res : null);

        if (Array.isArray(bids)) {
          if (process.env.NODE_ENV === "development") {
            console.log(`[bidsApi] Successfully fetched bids from ${endpoint}`);
          }
          return bids;
        }
      } catch (err: any) {
        // Log but continue to next endpoint
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[bidsApi] Failed to fetch from ${endpoint}:`,
            err.message,
          );
        }
      }
    }

    // If all fail, return empty array to prevent UI crash, but log error
    console.error("[bidsApi] All bid fetch endpoints failed.");
    return [];
  },

  // Get all bids for a task (User owner only)
  getTaskBids: async (
    taskId: string,
  ): Promise<{ bids: Bid[]; taskBiddingEnabled: boolean }> => {
    const res = await apiData<any>(`/api/bids/task/${taskId}`, {
      method: "GET",
    });

    // Handle both wrapped in 'data' and root level
    const data = res?.data || res;

    return {
      bids: data?.bids || [],
      taskBiddingEnabled: data?.taskBiddingEnabled ?? false,
    };
  },

  // Get bid details
  getBid: async (id: string): Promise<Bid> => {
    const res = await apiData<any>(`/api/bids/${id}`, {
      method: "GET",
    });
    return res?.bid || res?.data?.bid;
  },

  // Accept bid (User owner only)
  acceptBid: async (id: string): Promise<{ bid: Bid; task: any }> => {
    const res = await apiData<any>(`/api/bids/${id}/accept`, {
      method: "POST",
    });
    return {
      bid: res?.bid || res?.data?.bid,
      task: res?.task || res?.data?.task,
    };
  },

  // Reject bid (User owner only)
  rejectBid: async (id: string, reason?: string): Promise<Bid> => {
    const res = await apiData<any>(`/api/bids/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
    return res?.bid || res?.data?.bid;
  },
};
