"use client";

import { X, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useStellarDepositInfo } from "@/hooks/useWallet";

interface StellarPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onCancel: () => void;
}

export function StellarPaymentModal({
  isOpen,
  onClose,
  onContinue,
  onCancel,
}: StellarPaymentModalProps) {
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedMemo, setCopiedMemo] = useState(false);
  const { data: depositInfo, isLoading } = useStellarDepositInfo();

  if (!isOpen) return null;

  const handleCopyAddr = () => {
    if (!depositInfo?.walletAddress) return;
    navigator.clipboard.writeText(depositInfo.walletAddress);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const handleCopyMemo = () => {
    if (!depositInfo?.memoId) return;
    navigator.clipboard.writeText(depositInfo.memoId);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-[2.5rem] p-6 md:p-8 w-full max-w-xl shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar'>
        <button
          onClick={onClose}
          className='absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full'
        >
          <X className='h-6 w-6' />
        </button>

        <div className='text-center space-y-2 mb-8 mt-2'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Send Via Stellar (XLM)
          </h2>
          <p className='text-purple-400/80 text-sm font-medium px-4'>
            Use the QR Code or the Address below to complete the payment
          </p>
        </div>

        {isLoading ? (
          <div className='flex flex-col items-center justify-center py-20 italic text-gray-400 gap-4'>
            <Loader2 className='animate-spin text-[#6B46C1]' size={40} />
            <p className='text-sm font-medium'>Fetching deposit details...</p>
          </div>
        ) : (
          <>
            {/* QR Code */}
            <div className='bg-white border border-purple-50 rounded-2xl p-6 mb-8 flex items-center justify-center aspect-square max-w-[200px] mx-auto shadow-sm'>
              <div 
                className="w-full h-full bg-no-repeat bg-center opacity-80" 
                style={{ backgroundImage: `url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${depositInfo?.walletAddress || "Stellar"}')` }}
              />
            </div>

            <div className='space-y-4 mb-8'>
              <div className='bg-purple-50/50 p-4 rounded-2xl flex items-center justify-between group'>
                <div className='space-y-1'>
                  <p className='text-gray-900 font-bold text-sm'>Asset</p>
                  <p className='text-gray-400 text-xs font-medium'>Stellar (XLM)</p>
                </div>
              </div>

              <div className='bg-purple-50/50 p-4 rounded-2xl flex items-center justify-between group'>
                <div className='space-y-1'>
                  <p className='text-gray-900 font-bold text-sm'>Network</p>
                  <p className='text-gray-400 text-xs font-medium'>XLM</p>
                </div>
              </div>

              <div className='bg-purple-50/50 p-4 rounded-2xl flex items-center justify-between group'>
                <div className='space-y-1 flex-1 min-w-0 mr-4'>
                  <p className='text-gray-900 font-bold text-sm'>Master Wallet Address</p>
                  <p className='text-gray-400 text-[10px] md:text-xs font-medium break-all'>
                    {depositInfo?.walletAddress || "Fetching..."}
                  </p>
                </div>
                <button
                  onClick={handleCopyAddr}
                  className='text-purple-600 hover:text-purple-700 transition-colors shrink-0'
                >
                  {copiedAddr ? <Check className='h-5 w-5' /> : <Copy className='h-5 w-5' />}
                </button>
              </div>

              <div className='bg-[#FFF9E6] border border-[#FFE7A3] p-4 rounded-2xl flex items-center justify-between group'>
                <div className='space-y-1 flex-1 min-w-0 mr-4'>
                  <p className='text-[#856404] font-bold text-sm'>Your Unique Memo ID</p>
                  <p className='text-[#856404]/80 text-lg font-black tracking-widest'>
                    {depositInfo?.memoId || "..."}
                  </p>
                  <p className='text-[9px] text-[#856404]/70 font-bold leading-tight uppercase'>
                    MUST INCLUDE MEMO TO RECEIVE FUNDS AUTOMATICALLY
                  </p>
                </div>
                <button
                  onClick={handleCopyMemo}
                  className='text-[#856404] hover:text-[#533f03] transition-colors shrink-0'
                >
                  {copiedMemo ? <Check className='h-5 w-5' /> : <Copy className='h-5 w-5' />}
                </button>
              </div>
            </div>

            <div className='flex gap-4'>
              <Button
                onClick={onCancel}
                variant='outline'
                className='flex-1 py-6 rounded-2xl border-none bg-purple-50 text-purple-600 hover:bg-purple-100 font-bold text-base transition-all'
              >
                Cancel
              </Button>
              <Button
                onClick={onContinue}
                className='flex-1 py-6 rounded-2xl bg-[#6B46C1] hover:bg-[#553C9A] text-white font-bold text-base shadow-lg shadow-purple-200 transition-all'
              >
                I have sent the funds
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
