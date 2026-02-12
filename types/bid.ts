import { User } from "./auth";
import { Task } from "./task";

export type BidStatus = "pending" | "accepted" | "rejected";
export type BidType = "custom" | "fixed";

export interface Bid {
  _id: string;
  task: string | Partial<Task>;
  tasker: string | Partial<User>;
  amount: number;
  message: string;
  bidType: BidType;
  bidTypeLabel?: string;
  isFixedPrice?: boolean;
  status: BidStatus;
  rejectionReason?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt?: string;
  taskBiddingEnabled?: boolean;
}

export interface CreateBidInput {
  taskId: string;
  amount?: number;
  message: string;
}

export interface UpdateBidInput {
  amount?: number;
  message: string;
}

export interface BidsResponse {
  status: string;
  count: number;
  bids: Bid[];
  taskBiddingEnabled?: boolean;
}
