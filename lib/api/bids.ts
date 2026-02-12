import { apiData } from "@/lib/api";
import { Bid, CreateBidInput, UpdateBidInput, BidsResponse } from "@/types/bid";

export const bidsApi = {
  // Create a bid (Tasker only)
  createBid: async (data: CreateBidInput): Promise<Bid> => {
    const response = await apiData<{ status: string; message: string; bid: Bid }>("/api/bids", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.bid;
  },

  // Update existing bid (Tasker owner only)
  updateBid: async (id: string, data: UpdateBidInput): Promise<Bid> => {
    const response = await apiData<{ status: string; message: string; bid: Bid }>(`/api/bids/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.bid;
  },

  // Delete bid (Tasker owner only)
  deleteBid: async (id: string): Promise<{ status: string; message: string }> => {
    return apiData<any>(`/api/bids/${id}`, {
      method: "DELETE",
    });
  },

  // Get all bids created by tasker
  getMyBids: async (status?: string): Promise<Bid[]> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    
    const response = await apiData<BidsResponse>(`/api/bids/tasker?${params.toString()}`, {
      method: "GET",
    });
    return response.bids || [];
  },

  // Get all bids for a task (User owner only)
  getTaskBids: async (taskId: string): Promise<{ bids: Bid[]; taskBiddingEnabled: boolean }> => {
    const response = await apiData<BidsResponse>(`/api/bids/task/${taskId}`, {
      method: "GET",
    });
    return {
      bids: response.bids || [],
      taskBiddingEnabled: response.taskBiddingEnabled ?? false,
    };
  },

  // Get bid details
  getBid: async (id: string): Promise<Bid> => {
    const response = await apiData<{ status: string; bid: Bid }>(`/api/bids/${id}`, {
      method: "GET",
    });
    return response.bid;
  },

  // Accept bid (User owner only)
  acceptBid: async (id: string): Promise<{ bid: Bid; task: any }> => {
    const response = await apiData<{ status: string; message: string; bid: Bid; task: any }>(
      `/api/bids/${id}/accept`,
      { method: "POST" }
    );
    return {
      bid: response.bid,
      task: response.task,
    };
  },

  // Reject bid (User owner only)
  rejectBid: async (id: string, reason?: string): Promise<Bid> => {
    const response = await apiData<{ status: string; message: string; bid: Bid }>(
      `/api/bids/${id}/reject`,
      {
        method: "POST",
        body: JSON.stringify({ reason }),
      }
    );
    return response.bid;
  },
};
