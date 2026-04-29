"use client";

import { useState } from "react";
import {
  X,
  Wallet,
  CreditCard,
  Coins,
  Loader2,
  ShieldCheck,
  Info,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInitializeFunding, useStellarDepositInfo } from "@/hooks/useWallet";
import { toast } from "sonner";
import Link from "next/link";

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToStellar: (amount: string) => void;
  balance?: string;
}

export function FundWalletModal({
  isOpen,
  onClose,
  onSwitchToStellar,
  balance = "0.00",
}: FundWalletModalProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"paystack" | "stellar">("paystack");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { mutate: initializeFunding, isPending } = useInitializeFunding();
  const { 
    data: stellarInfo, 
    isLoading: isStellarLoading, 
    isError: stellarError 
  } = useStellarDepositInfo(method === "stellar");

  if (!isOpen) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success(`${field} copied to clipboard`);
  };

  const handleFund = () => {
    if (method === "stellar") {
      onSwitchToStellar(amount);
      return;
    }

    const nairaAmount = parseFloat(amount);
    if (!nairaAmount || nairaAmount < 100) {
      toast.error("Minimum funding amount is ₦100");
      return;
    }

    initializeFunding(nairaAmount, {
      onError: (err: any) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Could not initialize payment. Please try again.";
        toast.error(message);
      },
    });
  };

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-[2.5rem] p-8 w-full max-w-xl shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-2xl font-bold text-gray-900'>Fund wallet</h2>
          <button
            onClick={onClose}
            disabled={isPending}
            className='text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full disabled:opacity-50'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        {/* Wallet Balance Card */}
        <div className='bg-linear-to-br from-[#6B46C1] to-[#553C9A] rounded-lg p-6 text-white mb-8 shadow-lg shadow-purple-100 relative overflow-hidden'>
          <div className='relative z-10 flex items-center gap-3 mb-4 opacity-90'>
            <Wallet size={18} />
            <span className='text-sm font-medium'>Wallet balance</span>
          </div>
          <div className='relative z-10 text-4xl font-black'>
            <span className='text-2xl mr-1 font-normal opacity-80'>₦</span>
            {balance}
          </div>
          {/* Decorative circles */}
          <div className='absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl' />
          <div className='absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-3xl' />
        </div>

        <div className='space-y-6'>
          {method !== "stellar" ? (
            <div className="space-y-2">
              <p className="text-gray-400 text-sm font-bold tracking-tight px-1">
                ENTER AMOUNT TO ADD TO YOUR WALLET
              </p>
              <input
                type="number"
                value={amount}
                min={100}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full px-6 py-4 bg-purple-50/50 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 border-none font-semibold text-lg"
              />
              <p className="text-xs text-gray-400 px-1">Minimum: ₦100</p>
            </div>
          ) : (
            <div className='space-y-4 p-5 bg-purple-50/50 rounded-2xl border border-purple-100 animate-in fade-in slide-in-from-top-4 duration-300'>
              <div className='flex items-center justify-between mb-2'>
                <p className='text-purple-900 font-bold text-sm'>Stellar Deposit Details</p>
                <div className='px-2 py-1 bg-purple-100 rounded-md'>
                  <p className='text-[10px] font-bold text-purple-600 uppercase'>{stellarInfo?.network || "TESTNET"}</p>
                </div>
              </div>

              <div className='space-y-3'>
                {/* Wallet Address */}
                <div className='space-y-1'>
                  <p className='text-[10px] text-gray-500 font-bold uppercase px-1'>Wallet Address</p>
                  <div className='flex gap-2'>
                    <div className='flex-1 bg-white p-3 rounded-xl border border-purple-100 break-all text-xs font-mono text-gray-600 min-h-[40px] flex items-center'>
                      {isStellarLoading ? (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Loader2 size={12} className="animate-spin" />
                          <span>Fetching...</span>
                        </div>
                      ) : stellarInfo?.walletAddress}
                    </div>
                    <button
                      onClick={() => stellarInfo && copyToClipboard(stellarInfo.walletAddress, "Wallet Address")}
                      className='p-3 bg-white rounded-xl border border-purple-100 text-purple-600 hover:bg-purple-50 transition-colors shrink-0'
                    >
                      {copiedField === "Wallet Address" ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                {/* Memo ID */}
                <div className='space-y-1'>
                  <p className='text-[10px] text-gray-500 font-bold uppercase px-1'>Memo ID (Required)</p>
                  <div className='flex gap-2'>
                    <div className='flex-1 bg-white p-3 rounded-xl border border-purple-100 text-sm font-mono font-bold text-purple-700 min-h-[40px] flex items-center'>
                      {isStellarLoading ? (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Loader2 size={12} className="animate-spin" />
                          <span>Fetching...</span>
                        </div>
                      ) : stellarInfo?.memoId}
                    </div>
                    <button
                      onClick={() => stellarInfo && copyToClipboard(stellarInfo.memoId, "Memo ID")}
                      className='p-3 bg-white rounded-xl border border-purple-100 text-purple-600 hover:bg-purple-50 transition-colors shrink-0'
                    >
                      {copiedField === "Memo ID" ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                {stellarInfo?.exchangeRate && (
                  <div className='flex items-center gap-2 px-1'>
                    <Info size={14} className='text-purple-400' />
                    <p className='text-[11px] text-gray-500 font-medium'>
                      Current rate: <span className='font-bold text-purple-600'>1 XLM = ₦{stellarInfo.exchangeRate}</span>
                    </p>
                  </div>
                )}
              </div>

              {stellarError && (
                <div className='p-3 bg-red-50 border border-red-100 rounded-xl'>
                  <p className='text-xs text-red-600 font-medium'>
                    Failed to load deposit info. Please try again later.
                  </p>
                </div>
              )}
              
              <p className='text-[10px] text-purple-400 font-medium italic px-1'>
                * Send XLM to this address with the exact Memo ID. Your wallet will be credited automatically.
              </p>
            </div>
          )}

          <div className='space-y-3'>
            <p className='text-gray-400 text-sm font-bold tracking-tight px-1 uppercase'>
              Select Payment method
            </p>

            {/* Paystack Option */}
            <button
              onClick={() => setMethod("paystack")}
              className={cn(
                "w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group",
                method === "paystack"
                  ? "border-[#6B46C1] bg-purple-50/50"
                  : "border-gray-100 hover:border-purple-200",
              )}
            >
              <div className='flex items-center gap-4'>
                <div
                  className={cn(
                    "p-3 rounded-xl transition-colors",
                    method === "paystack"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-50 text-gray-400 group-hover:bg-purple-50",
                  )}
                >
                  <CreditCard size={22} />
                </div>
                <div className='text-left'>
                  <p className='font-bold text-gray-900'>Paystack</p>
                  <p className='text-xs text-gray-400 font-medium'>
                    Card, Bank Transfer, USSD
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  method === "paystack"
                    ? "border-[#6B46C1] bg-[#6B46C1]"
                    : "border-gray-200",
                )}
              >
                {method === "paystack" && (
                  <div className='w-2 h-2 bg-white rounded-full' />
                )}
              </div>
            </button>

            {/* Stellar Option */}
            <button
              onClick={() => setMethod("stellar")}
              className={cn(
                "w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group",
                method === "stellar"
                  ? "border-[#6B46C1] bg-purple-50/50"
                  : "border-gray-100 hover:border-purple-200",
              )}
            >
              <div className='flex items-center gap-4'>
                <div
                  className={cn(
                    "p-3 rounded-xl transition-colors",
                    method === "stellar"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-50 text-gray-400 group-hover:bg-purple-50",
                  )}
                >
                  <Coins size={22} />
                </div>
                <div className='text-left'>
                  <p className='font-bold text-gray-900'>Stellar</p>
                  <p className='text-xs text-gray-400 font-medium'>
                    Cryptocurrency Payment
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  method === "stellar"
                    ? "border-[#6B46C1] bg-[#6B46C1]"
                    : "border-gray-200",
                )}
              >
                {method === "stellar" && (
                  <div className='w-2 h-2 bg-white rounded-full' />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Security and Info Alert */}
        <div className='mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3'>
          <ShieldCheck className='h-5 w-5 text-blue-500 shrink-0 mt-0.5' />
          <div className='space-y-1'>
            <p className='text-[11px] text-blue-800 font-bold leading-tight'>
              Secure Payment Integration
            </p>
            <p className='text-[10px] text-blue-600 leading-normal font-medium'>
              Your payments are processed securely via Paystack. Funds added to
              your wallet are held for task payments and can be withdrawn
              according to our policy.
            </p>
          </div>
        </div>

        <div className='flex gap-4 mt-8'>
          <Button
            onClick={onClose}
            disabled={isPending}
            variant='outline'
            className='flex-1 py-6 rounded-2xl border-none bg-purple-50 text-purple-600 hover:bg-purple-100 font-bold text-base transition-all disabled:opacity-50'
          >
            Cancel
          </Button>
          <Button
            onClick={handleFund}
            disabled={isPending}
            className='flex-1 py-6 rounded-2xl bg-[#6B46C1] hover:bg-[#553C9A] text-white font-bold text-base shadow-lg shadow-purple-200 transition-all disabled:opacity-70'
          >
            {isPending ? (
              <span className='flex items-center gap-2'>
                <Loader2 size={18} className='animate-spin' />
                Redirecting...
              </span>
            ) : method === "stellar" ? (
              "Continue"
            ) : (
              "Fund"
            )}
          </Button>
        </div>

        <div className='mt-6 flex justify-center gap-4 text-[10px] text-gray-400 font-medium'>
          <Link href="/terms" className="hover:text-purple-600 underline underline-offset-2">Terms & Conditions</Link>
          <Link href="/privacy" className="hover:text-purple-600 underline underline-offset-2">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
