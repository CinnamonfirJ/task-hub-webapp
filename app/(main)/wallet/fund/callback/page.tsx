"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFundingVerify, useRefreshBalanceOnSuccess } from "@/hooks/useFundingVerify";
import { CheckCircle, XCircle, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function WalletCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refreshBalance = useRefreshBalanceOnSuccess();

  // Get reference from URL params OR from localStorage as fallback
  const referenceFromUrl = searchParams.get("reference") ?? searchParams.get("trxref");
  const referenceFromStorage =
    typeof window !== "undefined"
      ? localStorage.getItem("pendingPaymentRef")
      : null;
  const reference = referenceFromUrl || referenceFromStorage;

  const { data, isLoading, isError } = useFundingVerify(reference);

  // Once we get a successful payment, refresh the user's balance
  useEffect(() => {
    if (data?.transactionStatus === "success") {
      refreshBalance();
      // Clean up localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("pendingPaymentRef");
      }
    }
  }, [data?.transactionStatus]);

  if (!reference) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="bg-red-50 p-5 rounded-full">
          <XCircle size={48} className="text-red-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No payment reference found</h2>
          <p className="text-gray-500 text-sm">
            We couldn't find your payment reference. Please try again.
          </p>
        </div>
        <Link href="/profile">
          <Button className="bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-2xl px-8 py-5 font-bold">
            Back to Profile
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
        <div className="bg-purple-50 p-5 rounded-full">
          <Loader2 size={48} className="text-[#6B46C1] animate-spin" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your payment…</h2>
          <p className="text-gray-400 text-sm">This should only take a moment.</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="bg-red-50 p-5 rounded-full">
          <XCircle size={48} className="text-red-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification failed</h2>
          <p className="text-gray-500 text-sm">
            We couldn't verify your payment. If money was deducted, please contact support.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/profile">
            <Button variant="outline" className="rounded-2xl px-6 py-5 font-bold border-purple-200 text-[#6B46C1]">
              Back to Profile
            </Button>
          </Link>
          <Button
            onClick={() => router.refresh()}
            className="bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-2xl px-6 py-5 font-bold"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const { transactionStatus, amount } = data;

  if (transactionStatus === "pending") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
        <div className="bg-yellow-50 p-5 rounded-full">
          <Loader2 size={48} className="text-yellow-400 animate-spin" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment is being processed…</h2>
          <p className="text-gray-400 text-sm">
            We're waiting for confirmation from Paystack. This page will update automatically.
          </p>
        </div>
      </div>
    );
  }

  if (transactionStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="bg-green-50 p-5 rounded-full">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Funded! 🎉</h2>
          <p className="text-gray-500 text-sm">
            <span className="font-bold text-gray-800">₦{amount?.toLocaleString()}</span> has been added to your wallet.
          </p>
        </div>
        <Link href="/profile">
          <Button className="bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-2xl px-8 py-5 font-bold flex items-center gap-2">
            <Wallet size={18} />
            View Wallet
          </Button>
        </Link>
      </div>
    );
  }

  // Failed
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="bg-red-50 p-5 rounded-full">
        <XCircle size={48} className="text-red-400" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
        <p className="text-gray-500 text-sm">
          Your payment was not successful. No money has been deducted.
        </p>
      </div>
      <Link href="/profile">
        <Button className="bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-2xl px-8 py-5 font-bold">
          Try Again
        </Button>
      </Link>
    </div>
  );
}

import { LegalFooter } from "@/components/layout/LegalFooter";

export default function WalletCallbackPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="grow">
        <div className="max-w-lg mx-auto pt-16 pb-20">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={40} className="text-[#6B46C1] animate-spin" />
              </div>
            }
          >
            <WalletCallbackContent />
          </Suspense>
        </div>
      </div>
      <div className="px-4">
        <LegalFooter />
      </div>
    </div>
  );
}
