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

  const data = (detailData as any)?.data || detailData;
  const { 
    info, 
    user: userInfo, 
    recentTransactions, 
    status: apiStatus, 
    amount: apiAmount,
    timeline
  } = data;

  // Map fields from new or old structure
  const displayTitle = info?.description || data?.description || "Transaction Details";
  const displayId = info?.transactionId || data?._id || data?.id || id;
  const displayStatus = (apiStatus || data?.status || "pending").toLowerCase();
  const displayAmount = apiAmount || data?.amount || 0;
  
  const history = recentTransactions || data?.transactionHistory || data?.relatedTransactions || [];

  const type = info?.type || data?.type;
  const isCredit = type === "credit" || data?.amountSign === "+";
  
  const statusIcon =
    displayStatus === "completed" || displayStatus === "released" || displayStatus === "success" ? (
      <CheckCircle2 size={18} className='text-green-600' />
    ) : displayStatus === "failed" || displayStatus === "cancelled" ? (
      <XCircle size={18} className='text-red-600' />
    ) : (
      <Clock size={18} className='text-yellow-600' />
    );

  const statusBg =
    displayStatus === "completed" || displayStatus === "released" || displayStatus === "success"
      ? "bg-green-100 text-green-600"
      : displayStatus === "failed" || displayStatus === "cancelled"
        ? "bg-red-100 text-red-600"
        : "bg-yellow-100 text-yellow-600";

  const typeLabel = (typeStr: string) => {
    const t = (typeStr || "").toLowerCase();
    const labels: Record<string, { label: string; color: string }> = {
      credit: { label: "Credit", color: "bg-green-50 text-green-500" },
      debit: { label: "Debit", color: "bg-red-50 text-red-400" },
      wallet_funding: { label: "Credit", color: "bg-green-50 text-green-500" },
      escrow_debit: { label: "Debit", color: "bg-red-50 text-red-400" },
      escrow_credit: { label: "Credit", color: "bg-green-50 text-green-500" },
      tasker_payout: { label: "Payout", color: "bg-blue-50 text-blue-500" },
      platform_fee: { label: "Fee", color: "bg-purple-50 text-purple-500" },
    };
    return (
      labels[t] || {
        label: t.replace("_", " "),
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
              className='h-10 w-10 border-gray-200 rounded-xl'
            >
              <ArrowLeft size={18} className='text-gray-500' />
            </Button>
          </Link>
          <div>
            <h1 className='text-xl md:text-2xl font-black text-gray-900'>
              Escrow Details
            </h1>
            <p className='text-sm text-gray-500 font-medium'>
              {displayTitle}
            </p>
          </div>
        </div>
        <div
          className={`${statusBg} px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider`}
        >
          {statusIcon} {displayStatus}
        </div>
      </div>

      <Card className='border border-gray-100 shadow-sm rounded-2xl overflow-hidden'>
        <CardContent className='p-8 bg-white'>
          <div className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>
            Total Escrow Amount
          </div>
          <div
            className={`text-4xl font-black mt-2 ${isCredit ? "text-green-600" : "text-gray-900"}`}
          >
            {formatCurrency(displayAmount)}
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader>
            <CardTitle className='text-base font-black'>
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <div className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>
                Transaction ID
              </div>
              <div className='text-sm font-bold mt-1 font-mono'>{displayId}</div>
            </div>
            <div>
              <div className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>
                Description
              </div>
              <div className='text-sm font-bold mt-1'>{displayTitle}</div>
            </div>
            {info?.paymentMethod && (
              <div>
                <div className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>
                  Payment Method
                </div>
                <div className='text-sm font-bold mt-1 capitalize'>{info.paymentMethod}</div>
              </div>
            )}
            {info?.type && (
              <div>
                <div className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>
                  Transaction Type
                </div>
                <div className='text-sm font-bold mt-1 capitalize'>{info.type}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader>
            <CardTitle className='text-base font-black'>
              Customer & Wallet Impact
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {userInfo?.email && (
              <div>
                <div className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>Customer Email</div>
                <div className='text-sm font-bold mt-1'>{userInfo.email}</div>
              </div>
            )}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>
                  Previous Balance
                </div>
                <div className='text-sm font-bold mt-1 text-gray-500'>
                  {formatCurrency(userInfo?.previousBalance || 0)}
                </div>
              </div>
              <div>
                <div className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>
                  Balance After
                </div>
                <div className='text-sm font-bold mt-1 text-[#6B46C1]'>
                  {formatCurrency(userInfo?.balanceAfter || 0)}
                </div>
              </div>
            </div>
            <div>
              <div className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>
                Transaction Date
              </div>
              <div className='text-sm font-bold mt-1'>
                {new Date(userInfo?.transactionDate || data?.date || Date.now()).toLocaleString()}
              </div>
            </div>
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
              {timeline.map((event: any, idx: number) => (
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

    {history && history.length > 0 && (
        <Card className='border border-gray-100 shadow-sm rounded-2xl'>
          <CardHeader>
            <CardTitle className='text-base font-black'>
              Transaction History
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
                  {history.map((rt: any) => {
                    const rtl = typeLabel(rt.type);
                    return (
                      <tr key={rt._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className='py-5 font-bold text-gray-900 text-xs'>
                          {rt.description}
                        </td>
                        <td className='py-5'>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${rtl.color}`}
                          >
                            {rtl.label}
                          </span>
                        </td>
                        <td className='py-5 font-black text-gray-900 text-xs'>
                          {formatCurrency(rt.amount)}
                        </td>
                        <td className='py-5 text-gray-400 font-bold text-[10px] uppercase'>
                          {new Date(rt.date || rt.createdAt).toLocaleDateString()}
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
