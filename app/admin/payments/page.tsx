"use client";

import { useState } from "react";
import {
  MoreVertical,
  TrendingUp,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { ExpandableTableContainer } from "@/components/admin/ExpandableTableContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import { ExportModal } from "@/components/admin/ExportModal";
import Link from "next/link";
import {
  usePaymentStats,
  useTransactions,
} from "@/hooks/useAdmin";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function PaymentsManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const limit = 20;

  const typeParam =
    activeFilter === "All"
      ? undefined
      : activeFilter === "Credit"
        ? "wallet_funding"
        : activeFilter === "Debit"
          ? "escrow_debit"
          : activeFilter === "Payout"
            ? "tasker_payout"
            : activeFilter === "Tasks"
              ? "escrow_debit,tasker_payout,platform_fee"
              : undefined;

  const { data: paymentStats } = usePaymentStats();
  const { data: txData, isLoading, error } = useTransactions({
    page,
    limit,
    type: typeParam,
    search: searchTerm,
  });

  const transactions = Array.isArray(txData)
    ? txData
    : (txData as any)?.transactions ?? [];
  const pagination = (txData as any)?.pagination;
  const overview = paymentStats?.overview;

  const totalRecords = (pagination as any)?.totalTransactions || (txData as any)?.totalRecords || (txData as any)?.count || 0;
  const totalPages = (pagination as any)?.totalPages || (txData as any)?.totalPages || Math.ceil(totalRecords / limit);

  const paymentMetrics = [
    {
      label: "Total Transactions",
      value: String(paymentStats?.transactions?.total ?? "—"),
      trend: undefined,
      color: undefined,
    },
    {
      label: "Total Revenue",
      value: overview ? formatCurrency(overview.total_revenue) : "—",
      trend: undefined,
      color: "text-emerald-500",
    },
    {
      label: "Escrow Held",
      value: overview ? formatCurrency(overview.escrow_held) : "—",
      trend: undefined,
      color: "text-blue-500",
    },
    {
      label: "Platform Fees",
      value: overview ? formatCurrency(overview.platform_fees_collected) : "—",
      trend: undefined,
      color: "text-purple-500",
    },
  ];

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const typeLabel = (type: string) => {
    const labels: Record<string, { label: string; color: string }> = {
      wallet_funding: { label: "Credit", color: "bg-green-50 text-green-500" },
      escrow_debit: { label: "Debit", color: "bg-red-50 text-red-400" },
      escrow_credit: { label: "Credit", color: "bg-green-50 text-green-500" },
      escrow_release: { label: "Release", color: "bg-blue-50 text-blue-500" },
      escrow_refund: { label: "Refund", color: "bg-orange-50 text-orange-500" },
      tasker_payout: { label: "Payout", color: "bg-blue-50 text-blue-500" },
      platform_fee: { label: "Fee", color: "bg-purple-50 text-purple-500" },
      wallet_withdrawal: {
        label: "Withdrawal",
        color: "bg-red-50 text-red-500",
      },
    };
    return (
      labels[type] || {
        label: type.replace("_", " "),
        color: "bg-gray-50 text-gray-500",
      }
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Payments & Transactions
          </h1>
          <p className='text-sm text-gray-500'>
            Monitor all financial transactions
          </p>
        </div>
        <div className='flex gap-3'>
          <Button
            onClick={() => setIsExportModalOpen(true)}
            variant='outline'
            className='text-sm h-10 px-4 gap-2 border-gray-200'
          >
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        type="payments" 
      />

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {paymentMetrics.map((metric, idx) => (
          <Card key={idx} className='border border-gray-100 shadow-sm'>
            <CardContent className='p-5'>
              <div
                className={`text-xl font-bold ${metric.color || "text-gray-900"}`}
              >
                {metric.value}
              </div>
              <div className='text-[10px] mt-1 font-semibold uppercase tracking-wider text-gray-400'>
                {metric.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className='border border-gray-100 shadow-sm overflow-hidden'>
        <CardContent className='p-0'>
          <div className='p-6 border-b border-gray-100'>
            <AdminSearchFilter
              searchPlaceholder='Search transactions...'
              searchTerm={searchTerm}
              onSearch={handleSearch}
              filterOptions={["All", "Credit", "Debit", "Payout", "Tasks"]}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className='p-6 pb-0'>
            <h3 className='text-lg font-bold'>Transactions</h3>
          </div>

          <div className='overflow-x-auto min-h-[400px] relative'>
            {(isLoading || error) && (
              <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
                {isLoading ? (
                  <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
                ) : (
                  <div className='text-center p-6 bg-white rounded-xl shadow-lg border border-red-50 max-w-sm mx-auto'>
                    <div className='w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <div className='w-6 h-6 text-red-500 font-bold'>!</div>
                    </div>
                    <p className='text-gray-900 font-bold mb-1'>{(error as any)?.message || "Request failed"}</p>
                    <p className='text-gray-500 text-xs mb-4'>Please check your connection or try again later.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.location.reload()}
                      className="border-red-100 text-red-600 hover:bg-red-50"
                    >
                      Try again
                    </Button>
                  </div>
                )}
              </div>
            )}
            <table className='w-full text-left text-sm'>
              <thead>
                <tr className='border-y bg-gray-50/30 text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                  <th className='px-6 py-4 w-12'>#</th>
                  <th className='px-6 py-4'>USER</th>
                  <th className='px-6 py-4'>DESCRIPTION</th>
                  <th className='px-6 py-4'>TYPE</th>
                  <th className='px-6 py-4'>TASK</th>
                  <th className='px-6 py-4'>AMOUNT</th>
                  <th className='px-6 py-4'>DATE</th>
                  <th className='px-6 py-4 text-right'>ACTION</th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {transactions.map((tx: any, index: number) => {
                  const tl = typeLabel(tx.type);
                  const displayUser =
                    tx.user?.fullName ||
                    (tx.tasker
                      ? `${tx.tasker.firstName} ${tx.tasker.lastName}`
                      : "—");
                  return (
                    <tr
                      key={tx._id}
                      className='group hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-5 text-xs font-medium text-gray-400'>
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className='px-6 py-5 text-gray-900 font-medium text-xs'>
                        {displayUser}
                      </td>
                      <td className='px-6 py-5 text-gray-500 text-xs max-w-[200px] truncate'>
                        {tx.description}
                      </td>
                      <td className='px-6 py-5'>
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold ${tl.color}`}
                        >
                          {tl.label}
                        </span>
                      </td>
                      <td className='px-6 py-5 text-gray-900 font-bold text-[10px] max-w-[150px] truncate'>
                        {tx.task?.title || "—"}
                      </td>
                      <td className='px-6 py-5 font-bold text-gray-900'>
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className='px-6 py-5 text-gray-500 text-xs'>
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-5 text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 text-gray-400'
                            >
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='w-40'>
                            <Link href={`/admin/payments/${tx._id}`}>
                              <DropdownMenuItem className='gap-2 cursor-pointer text-xs'>
                                <ExternalLink size={14} /> View Details
                              </DropdownMenuItem>
                            </Link>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
                {!isLoading && transactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className='py-12 text-center text-gray-400 font-medium'
                    >
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <AdminPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalRecords={totalRecords}
            label='transactions'
          />
        </CardContent>
      </Card>
    </div>
  );
}
