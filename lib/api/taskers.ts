import { apiData } from "@/lib/api";
import { NearbyTasker } from "@/types/category";

export const taskersApi = {
  getNearbyTaskers: async (params?: { latitude?: number; longitude?: number }): Promise<NearbyTasker[]> => {
    try {
      let query = "";
      if (params?.latitude !== undefined && params?.longitude !== undefined) {
        query = `?latitude=${params.latitude}&longitude=${params.longitude}`;
      }
      const response = await apiData<{ success: boolean; data: NearbyTasker[] }>(`/api/taskers/nearby${query}`, {
        method: "GET",
      });
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch nearby taskers:", error);
      return [];
    }
  },
};
