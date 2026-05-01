"use client";

import { useState } from "react";
import {
  MoreVertical,
  Download,
  Loader2,
  ExternalLink,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Activity,
  Search,
} from "lucide-react";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    activeFilter === "All" || activeFilter === "all"
      ? undefined
      : activeFilter === "Credit" || activeFilter === "credit"
        ? "credit"
        : activeFilter === "Debit" || activeFilter === "debit"
          ? "debit"
          : activeFilter;

  const { data: paymentStats, isLoading: loadingStats } = usePaymentStats();
  const { data: txData, isLoading: loadingTx, error } = useTransactions({
    page,
    limit,
    type: typeParam,
    search: searchTerm,
  });

  const transactions = 
    (txData as any)?.transactions || 
    (txData as any)?.data?.transactions || 
    (Array.isArray((txData as any)?.data) ? (txData as any).data : null) ||
    (Array.isArray(txData) ? txData : []) || 
    [];

  const processedTransactions = transactions.filter((tx: any) => {
    if (activeFilter === "all" || activeFilter === "All") return true;
    const type = (tx.type || "").toLowerCase();
    const filter = activeFilter.toLowerCase();
    
    // Handle exact match or common aliases
    if (type === filter) return true;
    if (filter === "credit" && (type === "wallet_funding" || type === "escrow_credit" || type === "inflow")) return true;
    if (filter === "debit" && (type === "escrow_debit" || type === "tasker_payout" || type === "outflow")) return true;
    
    return false;
  });

  const pagination = (txData as any)?.pagination || (txData as any)?.data?.pagination;

  const totalRecords = 
    (pagination as any)?.totalTransactionVolume || 
    (txData as any)?.totalRecords || 
    (txData as any)?.results || 
    (txData as any)?.count || 
    (txData as any)?.data?.totalRecords || 
    (txData as any)?.data?.results ||
    transactions.length ||
    0;

  const totalPages = 
    (pagination as any)?.totalPages || 
    (txData as any)?.totalPages || 
    (txData as any)?.data?.totalPages || 
    (txData as any)?.data?.pages ||
    Math.ceil(totalRecords / limit);

  const paymentMetrics = [
    {
      label: "Total Transactions",
      value: paymentStats?.totalTransactionVolume?.toLocaleString() ?? "0",
      icon: <DollarSign size={18} />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Escrow Held (Inflow)",
      value: formatCurrency(paymentStats?.totalCredits ?? 0),
      icon: <ArrowUpRight size={18} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Tasker Payouts (Outflow)",
      value: formatCurrency(paymentStats?.totalDebits ?? 0),
      icon: <ArrowDownRight size={18} />,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    // {
    //   label: "Net Flow",
    //   value: formatCurrency(paymentStats?.netFlow ?? 0),
    //   icon: <History size={18} />,
    //   color: "text-purple-600",
    //   bg: "bg-purple-50",
    // },
    {
      label: "Platform Revenue",
      value: formatCurrency(paymentStats?.totalPlatformFees ?? 0),
      icon: <Activity size={18} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
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

  return (
    <div className='p-0 space-y-6'>
      {/* Header */}
      <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
        <div>
          <h1 className='text-2xl font-black text-gray-900'>Financials</h1>
          <p className='text-sm text-gray-500 font-medium'>
            Monitor platform transactions and revenue
          </p>
        </div>
        <div className='flex gap-3'>
          <Button
            onClick={() => setIsExportModalOpen(true)}
            variant='outline'
            className='text-sm h-10 px-4 gap-2 border-gray-100 rounded-xl font-bold bg-white'
          >
            <Download size={16} />
            Export Data
          </Button>
        </div>
      </div>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        type="payments" 
      />

      {/* Metrics Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
        {paymentMetrics.map((metric, index) => (
          <Card
            key={index}
            className='border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow'
          >
            <CardContent className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div
                  className={`p-2.5 rounded-xl ${metric.bg} ${metric.color} transition-transform group-hover:scale-110 duration-300`}
                >
                  {metric.icon}
                </div>
              </div>
              <div>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                  {metric.label}
                </p>
                <h3 className='text-xl font-black text-gray-900 mt-1'>
                  {loadingStats ? (
                    <Loader2 className='h-5 w-5 animate-spin text-gray-400' />
                  ) : (
                    metric.value
                  )}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Table */}
      <Card className='border border-gray-100 shadow-sm overflow-hidden bg-white'>
        <div className='p-6 border-b border-gray-100'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <div className='h-8 w-1 bg-[#6B46C1] rounded-full' />
              <h3 className='font-bold text-gray-900 text-xs uppercase tracking-wider'>
                Transaction History
              </h3>
            </div>

            <div className='flex items-center gap-3'>
              <div className='relative'>
                <Search
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                  size={14}
                />
                <input
                  type='text'
                  placeholder='Search by description...'
                  className='pl-9 pr-4 py-2 bg-gray-50 border-0 rounded-xl text-xs focus:ring-1 focus:ring-[#6B46C1] w-64 font-medium'
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Select
                value={activeFilter}
                onValueChange={handleFilterChange}
              >
                <SelectTrigger className='w-32 h-9 text-xs font-bold border-0 bg-gray-50 rounded-xl'>
                  <SelectValue placeholder='All Types' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Types</SelectItem>
                  <SelectItem value='credit'>Credits</SelectItem>
                  <SelectItem value='debit'>Debits</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className='overflow-x-auto min-h-[400px] relative'>
          {(loadingTx || error) && (
            <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center'>
              {loadingTx ? (
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
                    className="border-red-100 text-red-600 hover:bg-red-50 rounded-xl font-bold"
                  >
                    Try again
                  </Button>
                </div>
              )}
            </div>
          )}
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='border-y bg-gray-50/50 text-[10px] text-gray-400 font-black uppercase tracking-widest'>
                <th className='px-6 py-4'>Transaction ID</th>
                <th className='px-6 py-4'>User</th>
                <th className='px-6 py-4'>Description</th>
                <th className='px-6 py-4'>Amount</th>
                <th className='px-6 py-4 text-center'>Type</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4'>Date</th>
                <th className='px-6 py-4 text-right'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {processedTransactions.map((tx: any) => (
                <tr
                  key={tx._id}
                  className='group hover:bg-[#6B46C1]/2 transition-colors'
                >
                  <td className='px-6 py-4 text-xs font-bold text-gray-500'>
                    #{tx._id?.slice(-8).toUpperCase()}
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 overflow-hidden shrink-0 border border-white shadow-sm'>
                        {tx.user?.profilePicture ? (
                          <img
                            src={tx.user.profilePicture}
                            alt=''
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          tx.user?.fullName?.[0] || "U"
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-bold text-gray-900 text-xs'>
                          {tx.user?.fullName || "System"}
                        </span>
                        <span className='text-[10px] text-gray-400 font-medium'>
                          {tx.user?.emailAddress}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex flex-col'>
                      <span className='text-xs font-bold text-gray-700 line-clamp-1'>
                        {tx.description}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`text-xs font-black ${
                        tx.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <span
                      className={`text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full border ${
                        tx.type === "credit"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full border ${
                        tx.status === "held"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : tx.status === "released" ||
                              tx.status === "completed"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-gray-50 text-gray-600 border-gray-100"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-[10px] font-bold text-gray-500 uppercase'>
                    {new Date(tx.date || tx.createdAt).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric", year: "numeric" },
                    )}
                  </td>
                  <td className='px-6 py-4 text-right'>
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
              ))}
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
      </Card>
    </div>
  );
}
