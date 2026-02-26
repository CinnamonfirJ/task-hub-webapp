"use client";

import { useState } from "react";
import { X, Wallet, CreditCard, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [amount, setAmount] = useState("0.00");
  const [method, setMethod] = useState<"paystack" | "stellar">("paystack");
  const isDev = process.env.NEXT_PUBLIC_ENV === "development";

  if (!isOpen) return null;

  const handleFund = () => {
    if (method === "stellar") {
      onSwitchToStellar(amount);
    } else {
      console.log("Funding wallet with Paystack:", amount);
      // Implement Paystack logic here or via callback
      onClose();
    }
  };

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-[2.5rem] p-8 w-full max-w-xl shadow-2xl relative animate-in fade-in zoom-in duration-300'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-2xl font-bold text-gray-900'>Fund wallet</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        {/* Wallet Balance Card */}
        <div className='bg-linear-to-br from-[#6B46C1] to-[#553C9A] rounded-3xl p-6 text-white mb-8 shadow-lg shadow-purple-100 relative overflow-hidden'>
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
          <div className='space-y-2'>
            <p className='text-gray-400 text-sm font-bold tracking-tight px-1'>
              ENTER AMOUNT TO ADD TO YOUR WALLET
            </p>
            <input
              type='number'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='0.00'
              className='w-full px-6 py-4 bg-purple-50/50 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 border-none font-semibold text-lg'
            />
          </div>

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
            {isDev && (
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
            )}
          </div>
        </div>

        <div className='flex gap-4 mt-8'>
          <Button
            onClick={onClose}
            variant='outline'
            className='flex-1 py-6 rounded-2xl border-none bg-purple-50 text-purple-600 hover:bg-purple-100 font-bold text-base transition-all'
          >
            Cancel
          </Button>
          <Button
            onClick={handleFund}
            className='flex-1 py-6 rounded-2xl bg-[#6B46C1] hover:bg-[#553C9A] text-white font-bold text-base shadow-lg shadow-purple-200 transition-all'
          >
            {method === "stellar" ? "Continue" : "Fund"}
          </Button>
        </div>
      </div>
    </div>
  );
}
