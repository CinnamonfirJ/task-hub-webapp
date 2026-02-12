"use client";

import { 
  ArrowLeft, 
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TransactionDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
          <p className="text-sm text-gray-500">View complete transaction information</p>
        </div>
        <div className="bg-green-100 text-green-600 px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm">
          <CheckCircle2 size={18} /> Completed
        </div>
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="text-xs text-gray-400 font-medium">Transaction Amount</div>
          <div className="text-3xl font-bold text-red-500 mt-2">- ₦15,000</div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Transaction Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs text-gray-400 font-medium">Transaction ID</div>
              <div className="text-sm font-bold mt-1">697b40af88cb57bf906949b2</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Description</div>
              <div className="text-sm font-bold mt-1">Payment for Design Company Logo task</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Transaction Type</div>
              <div className="mt-2 text-red-500 bg-red-50 px-3 py-1 rounded-md text-[10px] font-bold inline-block">Debit</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Payment Method</div>
              <div className="text-sm font-bold mt-1">Wallet</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">User & Balance Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs text-gray-400 font-medium">User Email</div>
              <div className="text-sm font-bold mt-1">chidinma.o@taskhubdemo.com</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Balance After Transaction</div>
              <div className="text-sm font-bold mt-1">₦215,000</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Previous Balance</div>
              <div className="text-sm font-bold mt-1">₦250,000</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Transaction Date</div>
              <div className="text-sm font-bold mt-1">1/29/2026, 11:12:47 AM</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Recent Transactions from This User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-[10px] text-gray-400 font-bold uppercase tracking-wider pb-4">
                  <th className="pb-4">DESCRIPTION</th>
                  <th className="pb-4">TYPE</th>
                  <th className="pb-4">AMOUNT</th>
                  <th className="pb-4">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                <tr>
                  <td className="py-4 font-medium text-gray-900">Payment for Design Company Logo task</td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-400">Debit</span>
                  </td>
                  <td className="py-4 font-bold text-gray-900">N35,000</td>
                  <td className="py-4 text-gray-400 font-medium">02/02/2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
