"use client";

import {
  useAdminWithdrawals,
  useApproveWithdrawal,
  useRejectWithdrawal,
  useCompleteWithdrawal,
} from "@/hooks/useAdminWithdrawals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Banknote,
  User,
  LayoutDashboard,
  Search,
  Filter,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AdminWithdrawal {
  _id: string;
  tasker?: {
    _id: string;
    fullName: string;
    email: string;
  };
  amount: number;
  payoutMethod: "bank" | "stellar";
  bankDetails?: {
    bankName: string;
    accountNumber: string;
  };
  stellarAddress?: string;
  createdAt: string;
  status: "pending" | "approved" | "completed" | "rejected";
}

export default function AdminWithdrawalsPage() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const { data: withdrawalData, isLoading } = useAdminWithdrawals({
    status: statusFilter,
  });
  const withdrawals = withdrawalData?.withdrawals ?? [];
  const pagination = withdrawalData?.pagination;
  const { mutate: approve, isPending: isApproving } = useApproveWithdrawal();
  const { mutate: reject, isPending: isRejecting } = useRejectWithdrawal();
  const { mutate: complete, isPending: isCompleting } = useCompleteWithdrawal();

  const handleApprove = (id: string) => {
    approve(id, {
      onSuccess: () => toast.success("Withdrawal approved"),
      onError: () => toast.error("Failed to approve withdrawal"),
    });
  };

  const handleReject = (id: string) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;
    reject(
      { id, reason },
      {
        onSuccess: () => toast.success("Withdrawal rejected"),
        onError: () => toast.error("Failed to reject withdrawal"),
      },
    );
  };

  const handleComplete = (id: string) => {
    complete(id, {
      onSuccess: () => toast.success("Withdrawal marked as complete"),
      onError: () => toast.error("Failed to complete withdrawal"),
    });
  };

  return (
    <div className='p-8 space-y-8'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Withdrawal Management
          </h1>
          <p className='text-gray-500'>
            Monitor and process tasker withdrawal requests.
          </p>
        </div>
      </div>

      <div className='flex gap-4'>
        {["pending", "approved", "completed", "rejected"].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            onClick={() => setStatusFilter(status)}
            className='capitalize'
          >
            {status}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex justify-center p-8'>
              <Loader2 className='animate-spin text-purple-600' size={32} />
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm text-left'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 font-bold'>
                  <tr>
                    <th className='px-6 py-4'>Tasker</th>
                    <th className='px-6 py-4'>Amount</th>
                    <th className='px-6 py-4'>Method</th>
                    <th className='px-6 py-4'>Bank Details</th>
                    <th className='px-6 py-4'>Date</th>
                    <th className='px-6 py-4'>Status</th>
                    <th className='px-6 py-4 text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {withdrawals.map((item: AdminWithdrawal) => (
                    <tr
                      key={item._id}
                      className='bg-white hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <div className='w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold'>
                            {item.tasker?.fullName?.[0] || "T"}
                          </div>
                          <div>
                            <p className='font-bold text-gray-900'>
                              {item.tasker?.fullName}
                            </p>
                            <p className='text-[10px] text-gray-500'>
                              {item.tasker?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 font-black text-gray-900'>
                        ₦{item.amount.toLocaleString()}
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-tight",
                            item.payoutMethod === "stellar"
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200",
                          )}
                        >
                          {item.payoutMethod || "bank"}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        {item.payoutMethod === "stellar" ? (
                          <>
                            <p className='font-medium text-gray-700'>Stellar Wallet</p>
                            <p className='text-[10px] text-gray-500 font-mono tracking-tighter break-all max-w-[150px]'>
                              {item.stellarAddress || "N/A"}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className='font-medium text-gray-700'>
                              {item.bankDetails?.bankName}
                            </p>
                            <p className='text-xs text-gray-500 font-mono tracking-tighter'>
                              {item.bankDetails?.accountNumber}
                            </p>
                          </>
                        )}
                      </td>
                      <td className='px-6 py-4 text-gray-500'>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            item.status === "pending"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : item.status === "approved"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : item.status === "completed"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200",
                          )}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <div className='flex justify-end gap-2'>
                          {item.status === "pending" && (
                            <>
                              <Button
                                size='sm'
                                className='bg-blue-600 hover:bg-blue-700'
                                onClick={() => handleApprove(item._id)}
                                disabled={isApproving}
                              >
                                Approve
                              </Button>
                              <Button
                                size='sm'
                                variant='destructive'
                                onClick={() => handleReject(item._id)}
                                disabled={isRejecting}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {item.status === "approved" && (
                            <Button
                              size='sm'
                              className='bg-green-600 hover:bg-green-700'
                              onClick={() => handleComplete(item._id)}
                              disabled={isCompleting}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!withdrawals.length && (
                    <tr>
                      <td
                        colSpan={6}
                        className='px-6 py-12 text-center text-gray-400 font-medium'
                      >
                        No withdrawal requests found for this status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
