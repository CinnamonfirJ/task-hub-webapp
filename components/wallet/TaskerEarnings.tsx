"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/wallet";
import { Loader2 } from "lucide-react";
import { TransactionItem } from "./TransactionItem";
import { TransactionDetailsModal } from "./TransactionDetailsModal";

export function TaskerEarnings() {
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const { data: balance, isLoading: isBalanceLoading } = useQuery({
    queryKey: ["taskerBalance"],
    queryFn: walletApi.getTaskerBalance,
    refetchInterval: 30000,
  });

  const {
    data: transactions,
    isLoading: isTxLoading,
    isError: isTxError,
    refetch: refetchTx,
  } = useQuery({
    queryKey: ["taskerWithdrawals"],
    queryFn: () => walletApi.getWithdrawalHistory({ limit: 50 }),
  });

  // Map to the requested UI fields based on our assumptions
  const totalJobs = 0; // Not provided by the balance API directly
  const totalEarned = balance?.walletBalance || 0; // Assuming current balance maps to total earned loosely, or we only have this snapshot
  const awaitingRelease = balance?.pendingWithdrawalAmount || 0;
  const onDisputeHold = 0; // Not provided

  return (
    <div className='flex flex-col space-y-6 md:space-y-8 w-full max-w-5xl mx-auto'>
      <div className='space-y-1 md:space-y-2'>
        <h1 className='font-bold text-gray-900 text-2xl md:text-3xl'>
          Earnings
        </h1>
        <p className='text-gray-500 font-medium text-sm md:text-base'>
          View all transaction History
        </p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <StatCard title='Total Jobs' value={totalJobs.toString()} />
        <StatCard
          title='Total Earned'
          value={`#${totalEarned.toLocaleString()}`}
        />
        <StatCard
          title='Awaiting Release'
          value={`#${awaitingRelease.toLocaleString()}`}
        />
        <StatCard title='On Dispute Hold' value={`#${onDisputeHold}`} />
      </div>

      <div className='mt-8 pt-4'>
        {isTxLoading ? (
          <div className='flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-[2rem]'>
            <Loader2 className='w-10 h-10 animate-spin text-[#6B46C1] opacity-50' />
            <span className='mt-4 text-gray-500 font-medium'>
              Loading transactions...
            </span>
          </div>
        ) : isTxError ? (
          <div className='flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-[2rem]'>
            <span className='text-red-500 font-medium'>
              Failed to load transactions
            </span>
            <button
              onClick={() => refetchTx()}
              className='mt-4 text-[#6B46C1] font-bold hover:underline'
            >
              Try Again
            </button>
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className='bg-white border border-gray-100 p-4 md:p-6 rounded-[2rem] shadow-sm'>
            {transactions.map((tx: any) => (
              <TransactionItem
                key={tx._id || tx.reference}
                transaction={tx}
                onClick={setSelectedTx}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-[2rem]'>
            <span className='text-gray-500 font-medium'>
              No transactions found
            </span>
          </div>
        )}
      </div>

      <TransactionDetailsModal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
      />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className='bg-white border border-gray-100 p-6 rounded-2xl md:rounded-lg hover:shadow-md transition-shadow flex flex-col justify-between'>
      <div className='font-bold text-gray-900 text-2xl md:text-3xl'>
        {value}
      </div>
      <div className='text-gray-500 text-xs md:text-sm font-medium mt-auto pt-4'>
        {title}
      </div>
    </div>
  );
}
