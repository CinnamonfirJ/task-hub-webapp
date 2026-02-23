"use client";

import { MoreVertical, Search, TrendingUp, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSearchFilter } from "@/components/admin/AdminSearchFilter";
import Link from "next/link";
import { useState } from "react";

const paymentMetrics = [
  { label: "Total Transactions", value: "14", trend: "+ 24%" },
  { label: "Total Credits", value: "₦292,000", trend: "+ 24%" },
  { label: "Total Debits", value: "₦132,000", trend: "+ 24%" },
  { label: "Net Flow", value: "₦160,000", trend: "+ 24%" },
];

const transactions = [
  {
    id: "tx1",
    user: "chidinma.o@taskhubdemo.com",
    description: "Payment for Design Company...",
    type: "Debit",
    amount: "₦35,000",
    date: "02/02/2025",
  },
  {
    id: "tx2",
    user: "chidinma.o@taskhubdemo.com",
    description: "Payment for Design Company...",
    type: "Debit",
    amount: "₦45,000",
    date: "02/02/2025",
  },
  {
    id: "tx3",
    user: "chidinma.o@taskhubdemo.com",
    description: "Fund Wallet",
    type: "Credit",
    amount: "₦35,000",
    date: "02/02/2025",
  },
  {
    id: "tx4",
    user: "chidinma.o@taskhubdemo.com",
    description: "Payment for Design Company...",
    type: "Debit",
    amount: "₦35,000",
    date: "02/02/2025",
  },
];

export default function PaymentsManagementPage() {
  const [activeFilter, setActiveFilter] = useState("All");
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
        <div className='flex gap-26 md:gap-3'>
          <Button
            variant='outline'
            className='text-sm h-10 px-4 gap-2 border-gray-200'
          >
            Default
          </Button>
          <Button
            variant='outline'
            className='text-sm h-10 px-4 gap-2 border-gray-200'
          >
            <Download size={16} /> Export
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {paymentMetrics.map((metric, idx) => (
          <Card key={idx} className='border border-gray-100 shadow-sm'>
            <CardContent className='p-5'>
              <div className='text-xs text-gray-400 font-medium'>
                {metric.label}
              </div>
              <div className='text-xl font-bold mt-2'>{metric.value}</div>
              <div className='flex items-center gap-1 text-[10px] text-green-500 font-bold mt-1'>
                <TrendingUp size={12} /> {metric.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className='border border-gray-100 shadow-sm overflow-hidden'>
        <CardContent className='p-0'>
          <div className='p-6 border-b border-gray-100'>
            <AdminSearchFilter
              searchPlaceholder='Search name or email...'
              filterOptions={["All", "Debit", "Credit"]}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          <div className='p-6'>
            <h3 className='text-lg font-bold'>Transactions</h3>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead>
                <tr className='border-y bg-gray-50/30 text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                  <th className='px-6 py-4'>USER</th>
                  <th className='px-6 py-4'>DESCRIPTION</th>
                  <th className='px-6 py-4'>TYPE</th>
                  <th className='px-6 py-4'>AMOUNT</th>
                  <th className='px-6 py-4'>DATE</th>
                  <th className='px-6 py-4 text-right'>ACTION</th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className='group hover:bg-gray-50 transition-colors'
                  >
                    <td className='px-6 py-5 text-gray-900 font-medium'>
                      {tx.user}
                    </td>
                    <td className='px-6 py-5 text-gray-500'>
                      {tx.description}
                    </td>
                    <td className='px-6 py-5'>
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                          tx.type === "Credit"
                            ? "bg-green-50 text-green-500"
                            : "bg-red-50 text-red-400"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className='px-6 py-5 font-bold text-gray-900'>
                      {tx.amount}
                    </td>
                    <td className='px-6 py-5 text-gray-500'>{tx.date}</td>
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
                          <Link href={`/admin/payments/${tx.id}`}>
                            <DropdownMenuItem className='gap-2 cursor-pointer text-xs'>
                              View Details
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
        </CardContent>
      </Card>
    </div>
  );
}
