"use client";

import { use } from "react";
import { ArrowLeft, CheckCircle2, Loader2, XCircle, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTransactionDetails } from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/utils";

export default function TransactionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: detailData, isLoading, isError } = useTransactionDetails(id);

  if (isLoading) {
    return (
      <div className='flex h-[80vh] items-center justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-[#6B46C1]' />
      </div>
    );
  }

  if (isError || !detailData) {
    return (
      <div className='flex h-[80vh] flex-col items-center justify-center gap-4'>
        <XCircle className='h-12 w-12 text-red-500' />
        <h2 className='text-xl font-bold text-gray-900'>
          Transaction not found
        </h2>
        <Link href='/admin/payments'>
          <Button variant='outline'>Back to Payments</Button>
        </Link>
      </div>
    );
  }

  const { transaction: tx, relatedTransactions, timeline } = detailData;

  const isCredit = ["wallet_funding", "escrow_credit"].includes(tx.type);
  const statusIcon =
    tx.status === "completed" ? (
      <CheckCircle2 size={18} className='text-green-600' />
    ) : (
      <Clock size={18} className='text-yellow-600' />
    );
  const statusBg =
    tx.status === "completed"
      ? "bg-green-100 text-green-600"
      : "bg-yellow-100 text-yellow-600";

  const typeLabel = (type: string) => {
    const labels: Record<string, { label: string; color: string }> = {
      wallet_funding: { label: "Credit", color: "bg-green-50 text-green-500" },
      escrow_debit: { label: "Debit", color: "bg-red-50 text-red-400" },
      escrow_credit: { label: "Credit", color: "bg-green-50 text-green-500" },
      tasker_payout: { label: "Payout", color: "bg-blue-50 text-blue-500" },
      platform_fee: { label: "Fee", color: "bg-purple-50 text-purple-500" },
    };
    return (
      labels[type] || {
        label: type.replace("_", " "),
        color: "bg-gray-50 text-gray-500",
      }
    );
  };

  return (
    <div className='space-y-6 p-4 md:p-8 max-w-[1400px] mx-auto'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/payments'>
            <Button
              variant='outline'
              size='icon'
              className='h-10 w-10 border-gray-200'
            >
              <ArrowLeft size={18} className='text-gray-500' />
            </Button>
          </Link>
          <div>
            <h1 className='text-xl md:text-2xl font-bold text-gray-900'>
              Transaction Details
            </h1>
            <p className='text-sm text-gray-500'>
              View complete transaction information
            </p>
          </div>
        </div>
        <div
          className={`${statusBg} px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm capitalize`}
        >
          {statusIcon} {tx.status}
        </div>
      </div>

      <Card className='border border-gray-100 shadow-sm'>
        <CardContent className='p-6'>
          <div className='text-xs text-gray-400 font-medium'>
            Transaction Amount
          </div>
          <div
            className={`text-3xl font-bold mt-2 ${isCredit ? "text-green-500" : "text-red-500"}`}
          >
            {isCredit ? "+ " : "- "}
            {formatCurrency(tx.amount)}
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='border border-gray-100 shadow-sm'>
          <CardHeader>
            <CardTitle className='text-lg font-bold'>
              Transaction Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <div className='text-xs text-gray-400 font-medium'>
                Transaction ID
              </div>
              <div className='text-sm font-bold mt-1 font-mono'>{tx._id}</div>
            </div>
            <div>
              <div className='text-xs text-gray-400 font-medium'>
                Description
              </div>
              <div className='text-sm font-bold mt-1'>{tx.description}</div>
            </div>
            <div>
              <div className='text-xs text-gray-400 font-medium'>
                Transaction Type
              </div>
              <span
                className={`mt-2 px-3 py-1 rounded-md text-[10px] font-bold inline-block ${typeLabel(tx.type).color}`}
              >
                {typeLabel(tx.type).label}
              </span>
            </div>
            <div>
              <div className='text-xs text-gray-400 font-medium'>
                Payment Method
              </div>
              <div className='text-sm font-bold mt-1 capitalize'>
                {tx.paymentMethod || "N/A"}
              </div>
            </div>
            {tx.reference && (
              <div>
                <div className='text-xs text-gray-400 font-medium'>
                  Reference
                </div>
                <div className='text-sm font-bold mt-1 font-mono'>
                  {tx.reference}
                </div>
              </div>
            )}
            {tx.paymentGateway && (
              <div>
                <div className='text-xs text-gray-400 font-medium'>
                  Payment Gateway
                </div>
                <div className='text-sm font-bold mt-1 capitalize'>
                  {tx.paymentGateway}
                </div>
              </div>
            )}
            {tx.task && (
              <div>
                <div className='text-xs text-gray-400 font-medium'>
                  Related Task
                </div>
                <Link
                  href={`/admin/tasks/${tx.task._id}`}
                  className='text-sm font-bold mt-1 text-[#6B46C1] hover:underline flex items-center gap-1'
                >
                  {tx.task.title}
                  <ExternalLink size={12} />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm'>
          <CardHeader>
            <CardTitle className='text-lg font-bold'>
              User & Balance Details
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <div className='text-xs text-gray-400 font-medium'>User</div>
              <div className='text-sm font-bold mt-1'>
                {tx.user?.fullName ||
                  (tx.tasker
                    ? `${tx.tasker.firstName} ${tx.tasker.lastName}`
                    : "N/A")}
              </div>
              {tx.user?.emailAddress && (
                <div className='text-xs text-gray-400 mt-0.5'>
                  {tx.user.emailAddress}
                </div>
              )}
            </div>
            {tx.balanceBefore !== undefined && (
              <div>
                <div className='text-xs text-gray-400 font-medium'>
                  Previous Balance
                </div>
                <div className='text-sm font-bold mt-1'>
                  {formatCurrency(tx.balanceBefore)}
                </div>
              </div>
            )}
            {tx.balanceAfter !== undefined && (
              <div>
                <div className='text-xs text-gray-400 font-medium'>
                  Balance After Transaction
                </div>
                <div className='text-sm font-bold mt-1'>
                  {formatCurrency(tx.balanceAfter)}
                </div>
              </div>
            )}
            {tx.platformFee !== undefined && (
              <div>
                <div className='text-xs text-gray-400 font-medium'>
                  Platform Fee
                </div>
                <div className='text-sm font-bold mt-1 text-purple-600'>
                  {formatCurrency(tx.platformFee)}
                </div>
              </div>
            )}
            <div>
              <div className='text-xs text-gray-400 font-medium'>
                Transaction Date
              </div>
              <div className='text-sm font-bold mt-1'>
                {new Date(tx.createdAt).toLocaleString()}
              </div>
            </div>
            {tx.processedAt && (
              <div>
                <div className='text-xs text-gray-400 font-medium'>
                  Processed At
                </div>
                <div className='text-sm font-bold mt-1'>
                  {new Date(tx.processedAt).toLocaleString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      {timeline && timeline.length > 0 && (
        <Card className='border border-gray-100 shadow-sm'>
          <CardHeader>
            <CardTitle className='text-lg font-bold'>
              Transaction Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {timeline.map((event, idx) => (
                <div
                  key={idx}
                  className='flex items-center gap-4 p-3 rounded-xl bg-gray-50/50'
                >
                  <div className='w-2 h-2 rounded-full bg-[#6B46C1] shrink-0' />
                  <div className='flex-1'>
                    <div className='text-sm font-bold text-gray-900 capitalize'>
                      {event.event.replace("_", " ")}
                    </div>
                    <div className='text-xs text-gray-400'>
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Transactions */}
      {relatedTransactions && relatedTransactions.length > 0 && (
        <Card className='border border-gray-100 shadow-sm'>
          <CardHeader>
            <CardTitle className='text-lg font-bold'>
              Related Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-b text-[10px] text-gray-400 font-bold uppercase tracking-wider pb-4'>
                    <th className='pb-4'>DESCRIPTION</th>
                    <th className='pb-4'>TYPE</th>
                    <th className='pb-4'>AMOUNT</th>
                    <th className='pb-4'>DATE</th>
                  </tr>
                </thead>
                <tbody className='divide-y text-xs'>
                  {relatedTransactions.map((rt) => {
                    const rtl = typeLabel(rt.type);
                    return (
                      <tr key={rt._id}>
                        <td className='py-4 font-medium text-gray-900'>
                          {rt.description}
                        </td>
                        <td className='py-4'>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${rtl.color}`}
                          >
                            {rtl.label}
                          </span>
                        </td>
                        <td className='py-4 font-bold text-gray-900'>
                          {formatCurrency(rt.amount)}
                        </td>
                        <td className='py-4 text-gray-400 font-medium'>
                          {new Date(rt.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
