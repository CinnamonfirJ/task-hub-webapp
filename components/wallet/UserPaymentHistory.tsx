"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/wallet";
import { Loader2 } from "lucide-react";
import { TransactionItem } from "./TransactionItem";
import { TransactionDetailsModal } from "./TransactionDetailsModal";

export function UserPaymentHistory() {
  const [selectedTx, setSelectedTx] = useState<any>(null);
  
  const { data: transactions, isLoading, isError, refetch } = useQuery({
    queryKey: ["userTransactions"],
    queryFn: () => walletApi.getUserTransactions({ limit: 50 }),
  });

  return (
    <div className='flex flex-col space-y-6 md:space-y-8 w-full max-w-5xl mx-auto'>
      <div className='space-y-1 md:space-y-2'>
        <h1 className='font-bold text-gray-900 text-2xl md:text-3xl'>
          Payment History
        </h1>
        <p className='text-gray-500 font-medium text-sm md:text-base'>
          View all transaction History
        </p>
      </div>

      <div className='mt-8'>
        <h2 className='font-bold text-gray-900 text-lg md:text-xl mb-4'>
          Transactions
        </h2>

        {isLoading ? (
          <div className='flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-[2rem]'>
            <Loader2 className='w-10 h-10 animate-spin text-[#6B46C1] opacity-50' />
            <span className='mt-4 text-gray-500 font-medium'>
              Loading transactions...
            </span>
          </div>
        ) : isError ? (
          <div className='flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-[2rem]'>
            <span className='text-red-500 font-medium'>
              Failed to load transactions
            </span>
            <button
              onClick={() => refetch()}
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
