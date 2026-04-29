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

  // Tasker-specific transaction history (correct endpoint per API docs)
  getTaskerTransactions: async (filters: TransactionFilters = {}): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const res = await apiData<any>(
      `/api/wallet/tasker/transactions?${params.toString()}`,
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
    const banks =
      res?.data?.banks ||
      res?.data?.data ||
      (Array.isArray(res?.data) ? res.data : null) ||
      (Array.isArray(res) ? res : null) ||
      [];
    return Array.isArray(banks) ? banks : [];
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

  // ─── Withdrawal (unified endpoint correct per API docs) ────────────────────

  /**
   * Bank Transfer withdrawal
   * POST /api/wallet/withdraw
   */
  requestBankWithdrawal: async (payload: {
    amount: number;
    payoutMethod: "bank_transfer";
    transactionPin: string;
    bankDetails: {
      accountNumber: string;
      bankName: string;
      accountName: string;
    };
  }): Promise<any> => {
    const res = await apiData<any>("/api/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res?.data || res;
  },

  /**
   * Stellar crypto withdrawal
   * POST /api/wallet/withdraw
   */
  requestStellarWithdrawal: async (payload: {
    amount: number;
    payoutMethod: string;
    transactionPin: string;
    stellarAddress: string;
  }): Promise<any> => {
    const res = await apiData<any>("/api/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res?.data || res;
  },

  /**
   * Legacy simple withdrawal kept for backward compat but now hits correct endpoint
   */
  requestWithdrawal: async (amount: number): Promise<any> => {
    const res = await apiData<any>("/api/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
    return res?.data || res;
  },

  // ─── Transaction PIN ──────────────────────────────────────────────────────────

  /**
   * Set up or reset the 4-digit transaction PIN
   * POST /api/wallet/tasker/pin/setup
   */
  setupPin: async (pin: string, password: string): Promise<{ message: string }> => {
    const res = await apiData<any>("/api/wallet/tasker/pin/setup", {
      method: "POST",
      body: JSON.stringify({ pin, password }),
    });
    return res?.data || res;
  },

  // ─── Stellar deposit info ─────────────────────────────────────────────────────

  getDepositInfo: async (): Promise<{
    walletAddress: string;
    memoId: string;
    network: string;
    exchangeRate?: number;
  }> => {
    const res = await apiData<any>("/api/wallet/stellar/deposit-info", {
      method: "GET",
    });
    const data = res?.data || res;
    return {
      walletAddress: data?.masterWalletAddress || data?.walletAddress,
      memoId: data?.userMemoId || data?.memoId,
      network: data?.network || "TESTNET",
      exchangeRate: data?.exchangeRate,
    };
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

  // ─── Escrow (backend-managed) ─────────────────────────────────────────────────

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
