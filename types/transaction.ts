// types/transaction.ts

export type TransactionStatus = "success" | "pending" | "failed";
export type TransactionType = "credit" | "debit";
export type PaymentPurpose =
  | "wallet_funding"
  | "escrow_hold"
  | "escrow_release"
  | "escrow_refund"
  | "other";
export type TransactionProvider = "paystack" | "system";

export interface Transaction {
  _id: string;
  user: string; // ObjectId ref
  amount: number; // Naira
  type: TransactionType;
  description: string;
  status: TransactionStatus;
  reference: string;
  provider: TransactionProvider;
  paymentPurpose: PaymentPurpose;
  currency: string; // "NGN"
  providerTransactionId?: string;
  gatewayResponse?: string;
  metadata?: Record<string, any>;
  verifiedAt?: string;
  creditedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// With populated user (admin routes)
export interface AdminTransaction extends Omit<Transaction, "user"> {
  user: {
    _id: string;
    fullName: string;
    emailAddress: string;
    phoneNumber?: string;
  };
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  paymentPurpose?: PaymentPurpose;
}

export interface AdminPaymentFilters extends TransactionFilters {
  userId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface WithdrawalPayload {
  amount: number;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export interface EscrowResult {
  transactionId: string;
  reference: string;
  amount: number;
  paymentPurpose: PaymentPurpose;
  status: TransactionStatus;
}

export interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  pendingTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalEscrowHeld: number;
  totalWithdrawals: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
}
