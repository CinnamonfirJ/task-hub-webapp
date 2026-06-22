"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFundingVerify, useRefreshBalanceOnSuccess } from "@/hooks/useFundingVerify";
import { CheckCircle, XCircle, Loader2, Wallet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LegalFooter } from "@/components/layout/LegalFooter";

function VerifyPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refreshBalance = useRefreshBalanceOnSuccess();

  // Flutterwave parameters
  const txRef = searchParams.get("tx_ref");
  const transactionId = searchParams.get("transaction_id");
  const status = searchParams.get("status");

  // Paystack parameters
  const paystackRef = searchParams.get("reference") ?? searchParams.get("trxref");

  // Detection logic: Flutterwave uses tx_ref, Paystack uses reference/trxref
  const isFlutterwave = !!txRef;
  const reference = isFlutterwave ? txRef : paystackRef;
  const finalTransactionId = isFlutterwave ? transactionId : undefined;

  const { data, isLoading, isError } = useFundingVerify(reference, finalTransactionId);

  // Once we get a successful payment, refresh the user's balance
  useEffect(() => {
    if (data?.transactionStatus === "success") {
      refreshBalance();
      // Clean up localStorage if reference was stored there
      if (typeof window !== "undefined") {
        localStorage.removeItem("pendingPaymentRef");
      }
    }
  }, [data?.transactionStatus, refreshBalance]);

  // Handle explicit cancellation from provider
  if (status === "cancelled" || status === "canceled") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
          <AlertCircle size={48} className="text-orange-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
          <p className="text-gray-500 text-sm">
            You cancelled the payment process. No funds were deducted.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/home">
            <Button variant="outline" className="rounded-2xl px-8 py-5 font-bold border-purple-200 text-[#6B46C1] hover:bg-purple-50">
              Back to Home
            </Button>
          </Link>
          <Button
            onClick={() => router.push('/profile')}
            className="bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-2xl px-8 py-5 font-bold"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!reference) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="bg-red-50 p-5 rounded-xl border border-red-100">
          <XCircle size={48} className="text-red-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Missing Payment Reference</h2>
          <p className="text-gray-500 text-sm">
            We couldn't find a valid payment reference to verify.
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
        <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
          <Loader2 size={48} className="text-[#6B46C1] animate-spin" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment…</h2>
          <p className="text-gray-400 text-sm">We are confirming your transaction with the provider.</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="bg-red-50 p-5 rounded-xl border border-red-100">
          <XCircle size={48} className="text-red-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Error</h2>
          <p className="text-gray-500 text-sm">
            Something went wrong while verifying your payment. Please try again or contact support.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/profile">
            <Button variant="outline" className="rounded-2xl px-6 py-5 font-bold border-purple-200 text-[#6B46C1] hover:bg-purple-50">
              Back to Profile
            </Button>
          </Link>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-2xl px-6 py-5 font-bold"
          >
            Retry Verification
          </Button>
        </div>
      </div>
    );
  }

  const { transactionStatus, amount } = data;

  if (transactionStatus === "pending") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100">
          <Loader2 size={48} className="text-yellow-400 animate-spin" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment…</h2>
          <p className="text-gray-400 text-sm">
            The provider is still processing your payment. This page will update automatically.
          </p>
        </div>
      </div>
    );
  }

  if (transactionStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="bg-green-50 p-5 rounded-xl border border-green-100">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h2>
          <p className="text-gray-500 text-sm">
            <span className="font-bold text-gray-800">₦{amount?.toLocaleString()}</span> has been credited to your wallet.
          </p>
        </div>
        <Link href="/profile">
          <Button className="bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-2xl px-8 py-5 font-bold flex items-center gap-2">
            <Wallet size={18} />
            Go to Wallet
          </Button>
        </Link>
      </div>
    );
  }

  // Default Failed state
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="bg-red-50 p-5 rounded-xl border border-red-100">
        <XCircle size={48} className="text-red-400" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
        <p className="text-gray-500 text-sm">
          We couldn't confirm your payment. Please check your transaction status with your bank.
        </p>
      </div>
      <Link href="/profile">
        <Button className="bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-2xl px-8 py-5 font-bold">
          Back to Wallet
        </Button>
      </Link>
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="grow">
        <div className="max-w-lg mx-auto pt-16 pb-20">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={40} className="text-[#6B46C1] animate-spin" />
              </div>
            }
          >
            <VerifyPaymentContent />
          </Suspense>
        </div>
      </div>
      <div className="px-4">
        <LegalFooter />
      </div>
    </div>
  );
}
