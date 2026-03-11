import { apiData } from "@/lib/api";
import { 
  AdminTransaction, 
  AdminPaymentFilters, 
  PaymentStats 
} from "@/types/transaction";

export const adminPaymentsApi = {
  getStats: async (): Promise<PaymentStats> => {
    const res = await apiData<any>("/api/admin/payments", {
      method: "GET",
    });
    return res?.data || res;
  },

  getAllPayments: async (filters: AdminPaymentFilters = {}): Promise<{
    transactions: AdminTransaction[];
    count: number;
    totalPages: number;
    currentPage: number;
  }> => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.type) params.append("type", filters.type);
    if (filters.paymentPurpose) params.append("paymentPurpose", filters.paymentPurpose);
    if (filters.userId) params.append("userId", filters.userId);
    if (filters.search) params.append("search", filters.search);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const res = await apiData<any>(
      `/api/admin/payments/history?${params.toString()}`,
      { method: "GET" }
    );
    
    return {
      transactions: res?.data?.transactions || res?.transactions || [],
      count: res?.count || 0,
      totalPages: res?.totalPages || 1,
      currentPage: res?.currentPage || 1,
    };
  },

  getPaymentById: async (id: string): Promise<AdminTransaction> => {
    const res = await apiData<any>(`/api/admin/payments/${id}`, {
      method: "GET",
    });
    return res?.data?.transaction || res?.data || res;
  },
};
