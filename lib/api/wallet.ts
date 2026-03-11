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

  requestWithdrawal: async (payload: WithdrawalPayload): Promise<any> => {
    const res = await apiData<any>("/api/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res?.data || res;
  },

  verifyBankAccount: async (accountNumber: string, bankCode: string): Promise<{
    accountName: string;
    accountNumber: string;
  }> => {
    const res = await apiData<any>(
      `/api/wallet/verify-account?accountNumber=${accountNumber}&bankCode=${bankCode}`,
      { method: "GET" }
    );
    return res?.data || res;
  },
};
