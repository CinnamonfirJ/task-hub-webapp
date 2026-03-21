import { apiData } from "@/lib/api";
import { 
  Transaction, 
  TransactionFilters, 
  WithdrawalPayload, 
  EscrowResult 
} from "@/types/transaction";

export const walletApi = {
  initializeFunding: async (amount: number): Promise<{
    authorizationUrl: string;
    accessCode: string;
    reference: string;
  }> => {
    const res = await apiData<any>("/api/wallet/fund/initialize", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
    return res?.data || res;
  },

  verifyFunding: async (reference: string): Promise<{
    reference: string;
    amount: number;
    transactionStatus: "success" | "pending" | "failed";
    creditedAt?: string;
  }> => {
    const res = await apiData<any>(
      `/api/wallet/fund/verify?reference=${reference}`,
      { method: "GET" }
    );
    return res?.data || res;
  },

  getTransactions: async (filters: TransactionFilters = {}): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.type) params.append("type", filters.type);
    if (filters.status) params.append("status", filters.status);
    if (filters.paymentPurpose) params.append("paymentPurpose", filters.paymentPurpose);

    const res = await apiData<any>(
      `/api/wallet/transactions?${params.toString()}`,
      { method: "GET" }
    );
    return res?.data?.transactions || res?.transactions || [];
  },

  getUserTransactions: async (filters: TransactionFilters = {}): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.type) params.append("type", filters.type);
    if (filters.status) params.append("status", filters.status);
    if (filters.paymentPurpose) params.append("paymentPurpose", filters.paymentPurpose);

    const res = await apiData<any>(
      `/api/wallet/user/transactions?${params.toString()}`,
      { method: "GET" }
    );
    
    const txs = res?.data?.transactions || res?.transactions || (Array.isArray(res?.data) ? res.data : null);
    return txs || [];
  },

  getTaskerBalance: async (): Promise<{
    walletBalance: number;
    withdrawableAmount: number;
    canWithdraw: boolean;
    nextWithdrawableAt: string | null;
    minimumWithdrawal: number;
    hasBankAccount: boolean;
    hasPendingWithdrawal: boolean;
    pendingWithdrawalAmount: number;
  }> => {
    const res = await apiData<any>("/api/wallet/tasker/balance", { method: "GET" });
    return res?.data || res;
  },

  getBanks: async (): Promise<any[]> => {
    const res = await apiData<any>("/api/wallet/banks", { method: "GET" });
    return res?.data || res || [];
  },

  getBankAccount: async (): Promise<any> => {
    const res = await apiData<any>("/api/wallet/tasker/bank-account", { method: "GET" });
    return res?.data || res;
  },

  setBankAccount: async (accountNumber: string, bankCode: string): Promise<any> => {
    const res = await apiData<any>("/api/wallet/tasker/bank-account", {
      method: "POST",
      body: JSON.stringify({ accountNumber, bankCode }),
    });
    return res?.data || res;
  },

  requestWithdrawal: async (amount: number): Promise<any> => {
    const res = await apiData<any>("/api/wallet/tasker/withdraw", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
    return res?.data || res;
  },

  getWithdrawalHistory: async (params: { page?: number; limit?: number } = {}): Promise<any[]> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    
    const res = await apiData<any>(`/api/wallet/tasker/withdrawals?${searchParams.toString()}`, {
      method: "GET",
    });
    
    const withdrawals = res?.data?.withdrawals || res?.withdrawals || (Array.isArray(res?.data) ? res.data : null);
    return withdrawals || [];
  },

  // Legacy/Internal - Escrow is handled automatically by the backend status transitions
  holdEscrow: async (payload: {
    taskId: string;
    taskerId: string;
    amount: number;
  }): Promise<EscrowResult> => {
    const res = await apiData<any>("/api/wallet/escrow/hold", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res?.data || res;
  },

  releaseEscrow: async (taskId: string): Promise<EscrowResult> => {
    const res = await apiData<any>("/api/wallet/escrow/release", {
      method: "POST",
      body: JSON.stringify({ taskId }),
    });
    return res?.data || res;
  },

  refundEscrow: async (taskId: string): Promise<EscrowResult> => {
    const res = await apiData<any>("/api/wallet/escrow/refund", {
      method: "POST",
      body: JSON.stringify({ taskId }),
    });
    return res?.data || res;
  },
};
