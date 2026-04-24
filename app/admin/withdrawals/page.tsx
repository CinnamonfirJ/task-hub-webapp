"use client";

import {
  useAdminWithdrawals,
  useApproveWithdrawal,
  useRejectWithdrawal,
  useCompleteWithdrawal,
  useWithdrawalStats,
} from "@/hooks/useAdminWithdrawals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Banknote,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Copy,
  ExternalLink,
  X,
} from "lucide-react";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

interface AdminWithdrawal {
  _id: string;
  tasker?: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    emailAddress?: string;
  };
  amount: number;
  payoutMethod: "bank_transfer" | "stellar_crypto" | "bank" | "stellar";
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName?: string;
  };
  stellarDetails?: {
    publicKey?: string;
  }
  createdAt: string;
  status: "pending" | "approved" | "completed" | "rejected";
}

const STATUS_TABS = ["pending", "approved", "completed", "rejected"] as const;
const METHOD_TABS = [
  { label: "All Methods", value: "" },
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "Stellar", value: "stellar_crypto" },
] as const;

export default function AdminWithdrawalsPage() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [methodFilter, setMethodFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data: withdrawalData, isLoading } = useAdminWithdrawals({
    status: statusFilter || undefined,
    payoutMethod: methodFilter || undefined,
    page,
    limit,
  });
  const { data: stats, isLoading: isStatsLoading } = useWithdrawalStats();

  const withdrawals: AdminWithdrawal[] = withdrawalData?.withdrawals ?? [];
  const pagination = withdrawalData?.pagination;
  const totalRecords = pagination?.totalWithdrawals || 0;
  const totalPages = Math.ceil(totalRecords / limit);

  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { mutate: approve, isPending: isApproving } = useApproveWithdrawal();
  const { mutate: reject, isPending: isRejecting } = useRejectWithdrawal();
  const { mutate: complete, isPending: isCompleting } = useCompleteWithdrawal();

  const handleApprove = (id: string) => {
    approve(id, {
      onSuccess: () => toast.success("Withdrawal approved"),
      onError: () => toast.error("Failed to approve withdrawal"),
    });
  };

  const handleRejectConfirm = (id: string) => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }
    reject(
      { id, reason: rejectReason },
      {
        onSuccess: () => {
          toast.success("Withdrawal rejected and refund issued");
          setRejectModalId(null);
          setRejectReason("");
        },
        onError: () => toast.error("Failed to reject withdrawal"),
      }
    );
  };

  const handleComplete = (id: string) => {
    complete(id, {
      onSuccess: () => toast.success("Withdrawal marked as complete"),
      onError: () => toast.error("Failed to complete withdrawal"),
    });
  };

  const getMethodLabel = (method: string) => {
    if (method === "bank_transfer" || method === "bank") return "Bank";
    if (method === "stellar_crypto" || method === "stellar") return "Stellar";
    return method || "Bank";
  };

  const isStellar = (method: string) =>
    method === "stellar_crypto" || method === "stellar";

    const handleFilterChange = (status: string) => {
      setStatusFilter(status);
      setPage(1);
    };

    const handleMethodChange = (method: string) => {
      setMethodFilter(method);
      setPage(1);
    };

    return (
      <div className='p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto'>
      {/* Header */}
      <div>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
          Withdrawal Management
        </h1>
        <p className='text-gray-500 text-sm mt-1'>
          Monitor and process tasker withdrawal requests.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <StatsCard
          label='Pending'
          value={stats?.pending ?? "—"}
          icon={<Clock size={18} className='text-yellow-500' />}
          bg='bg-yellow-50'
          loading={isStatsLoading}
        />
        <StatsCard
          label='Processing'
          value={stats?.processing ?? stats?.approved ?? "—"}
          icon={<TrendingUp size={18} className='text-blue-500' />}
          bg='bg-blue-50'
          loading={isStatsLoading}
        />
        <StatsCard
          label='Completed'
          value={stats?.completed ?? "—"}
          icon={<CheckCircle size={18} className='text-green-500' />}
          bg='bg-green-50'
          loading={isStatsLoading}
        />
        <StatsCard
          label='Total Paid Out'
          value={stats?.totalPaid != null ? formatCurrency(stats.totalPaid) : "—"}
          icon={<DollarSign size={18} className='text-purple-500' />}
          bg='bg-purple-50'
          loading={isStatsLoading}
        />
      </div>

      {/* Filters */}
      <div className='space-y-3'>
        {/* Status filter */}
        <div className='flex flex-wrap gap-2'>
          {STATUS_TABS.map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={cn(
                "px-4 py-2 text-sm font-bold capitalize rounded-xl transition-all",
                statusFilter === status
                  ? "bg-[#6B46C1] text-white shadow-md shadow-purple-200"
                  : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
              )}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Method filter */}
        <div className='flex flex-wrap gap-2'>
          {METHOD_TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleMethodChange(value)}
              className={cn(
                "px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all",
                methodFilter === value
                  ? "bg-gray-800 text-white shadow-md"
                  : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className='border border-gray-100 shadow-sm rounded-2xl'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-bold text-gray-900'>
            Withdrawal Requests
            {pagination?.totalWithdrawals != null && (
              <span className='ml-2 text-gray-400 font-normal'>
                ({pagination.totalWithdrawals})
              </span>
            )}
          </CardTitle>
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
                    <th className='px-6 py-4'>Details</th>
                    <th className='px-6 py-4'>Date</th>
                    <th className='px-6 py-4'>Status</th>
                    <th className='px-6 py-4 text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {withdrawals.map((item) => (
                    <tr
                      key={item._id}
                      className='bg-white hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <div className='w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm'>
                            {item.tasker?.firstName?.[0] || "T"}
                          </div>
                          <div>
                            <p className='font-bold text-gray-900'>
                              {item.tasker?.firstName + " " + item.tasker?.lastName || "—"}
                            </p>
                            <p className='text-[10px] text-gray-500'>
                              {item.tasker?.emailAddress || item.tasker?.email || ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 font-black text-gray-900'>
                        ₦{item.amount?.toLocaleString()}
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-tight",
                            isStellar(item.payoutMethod)
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          )}
                        >
                          {getMethodLabel(item.payoutMethod)}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        {isStellar(item.payoutMethod) ? (
                          <>
                            <p className='font-medium text-gray-700'>Stellar Wallet</p>
                            <div 
                              className='flex items-center gap-1.5 cursor-pointer group/copy'
                              onClick={() => {
                                if (item?.stellarDetails?.publicKey) {
                                  navigator.clipboard.writeText(item.stellarDetails.publicKey);
                                  toast.success("Address copied to clipboard");
                                }
                              }}
                            >
                              <p className='text-[10px] text-gray-500 font-mono' title={item?.stellarDetails?.publicKey}>
                                {item?.stellarDetails?.publicKey 
                                  ? `${item.stellarDetails.publicKey.slice(0, 6)}...${item.stellarDetails.publicKey.slice(-4)}`
                                  : "N/A"}
                              </p>
                              {item?.stellarDetails?.publicKey && (
                                <Copy size={12} className='text-gray-300 group-hover/copy:text-purple-500 transition-colors' />
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <p className='font-medium text-gray-700'>
                              {item.bankDetails?.bankName || "—"}
                            </p>
                            <div 
                              className='flex items-center gap-1.5 cursor-pointer group/copy'
                              onClick={() => {
                                if (item.bankDetails?.accountNumber) {
                                  navigator.clipboard.writeText(item.bankDetails.accountNumber);
                                  toast.success("Account number copied");
                                }
                              }}
                            >
                              <p className='text-xs text-gray-500 font-mono'>
                                {item.bankDetails?.accountNumber || "—"}
                              </p>
                              {item.bankDetails?.accountNumber && (
                                <Copy size={12} className='text-gray-300 group-hover/copy:text-blue-500 transition-colors' />
                              )}
                            </div>
                            {item.bankDetails?.accountName && (
                              <p className='text-[10px] text-gray-400 mt-0.5'>
                                {item.bankDetails.accountName}
                              </p>
                            )}
                          </>
                        )}
                      </td>
                      <td className='px-6 py-4 text-gray-500 text-xs'>
                        {new Date(item.createdAt).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
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
                              : "bg-red-50 text-red-700 border-red-200"
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
                                className='bg-blue-600 hover:bg-blue-700 text-white rounded-xl'
                                onClick={() => handleApprove(item._id)}
                                disabled={isApproving}
                              >
                                {isApproving ? (
                                  <Loader2 size={14} className='animate-spin' />
                                ) : (
                                  "Approve"
                                )}
                              </Button>
                              <Button
                                size='sm'
                                variant='destructive'
                                className='rounded-xl'
                                onClick={() => setRejectModalId(item._id)}
                                disabled={isRejecting}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {item.status === "approved" && (
                              <Button
                                size='sm'
                                className='bg-green-600 hover:bg-green-700 text-white rounded-xl'
                                onClick={() => handleComplete(item._id)}
                                disabled={isCompleting}
                              >
                                {isCompleting ? (
                                  <Loader2 size={14} className='animate-spin' />
                                ) : (
                                  "Mark Complete"
                                )}
                              </Button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {withdrawals.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className='px-6 py-12 text-center text-gray-400 font-medium'
                      >
                        No withdrawal requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <AdminPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalRecords={totalRecords}
            label='withdrawals'
          />
        </CardContent>
      </Card>

      {/* Reject Modal */}
      {rejectModalId && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
          <div className='bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto no-scrollbar'>
            <div className='p-6 border-b border-gray-100 flex items-center justify-between'>
              <div>
                <h2 className='text-lg font-bold text-gray-900'>Reject Withdrawal</h2>
                <p className='text-sm text-gray-500 mt-0.5'>
                  The tasker will be automatically refunded.
                </p>
              </div>
              <button
                onClick={() => { setRejectModalId(null); setRejectReason(""); }}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400'
              >
                <X size={18} />
              </button>
            </div>
            <div className='p-6 space-y-4'>
              <div className='flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-100'>
                <AlertCircle size={16} className='text-red-500 shrink-0 mt-0.5' />
                <p className='text-xs text-red-600 font-medium'>
                  Rejecting this withdrawal will automatically refund the NGN amount back to the tasker's wallet.
                </p>
              </div>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-700 uppercase'>
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder='e.g. Incorrect bank details provided'
                  rows={3}
                  className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-200'
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => { setRejectModalId(null); setRejectReason(""); }}
                className='rounded-xl font-semibold'
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleRejectConfirm(rejectModalId)}
                disabled={isRejecting || !rejectReason.trim()}
                className='bg-red-600 hover:bg-red-700 text-white rounded-xl gap-2 font-semibold'
              >
                {isRejecting ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <XCircle size={16} />
                )}
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatsCard({
  label,
  value,
  icon,
  bg,
  loading,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
  loading?: boolean;
}) {
  return (
    <div className='bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col gap-3'>
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", bg)}>
        {icon}
      </div>
      <div>
        <p className='text-2xl font-bold text-gray-900'>
          {loading ? (
            <Loader2 size={20} className='animate-spin text-gray-300' />
          ) : (
            value
          )}
        </p>
        <p className='text-xs text-gray-500 font-medium mt-0.5'>{label}</p>
      </div>
    </div>
  );
}
