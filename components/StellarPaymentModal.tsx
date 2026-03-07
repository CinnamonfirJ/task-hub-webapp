"use client";

import { X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface StellarPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onCancel: () => void;
  address?: string;
}

export function StellarPaymentModal({
  isOpen,
  onClose,
  onContinue,
  onCancel,
  address = "GA...ADDRESS", // Placeholder
}: StellarPaymentModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-[2.5rem] p-8 w-full max-w-xl shadow-2xl relative animate-in fade-in zoom-in duration-300'>
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

        {/* QR Code Placeholder */}
        <div className='bg-white border border-purple-50 rounded-2xl p-6 mb-8 flex items-center justify-center aspect-square max-w-[240px] mx-auto shadow-sm'>
          <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=StellarAddress')] bg-no-repeat bg-center opacity-80" />
        </div>

        <div className='space-y-4 mb-8'>
          <div className='bg-purple-50/50 p-4 rounded-2xl flex items-center justify-between group'>
            <div className='space-y-1'>
              <p className='text-gray-900 font-bold text-sm'>Asset</p>
              <p className='text-gray-400 text-xs font-medium'>Stellar (XLM)</p>
            </div>
            <Copy className='h-5 w-5 text-purple-600/40' />
          </div>

          <div className='bg-purple-50/50 p-4 rounded-2xl flex items-center justify-between group'>
            <div className='space-y-1'>
              <p className='text-gray-900 font-bold text-sm'>Network</p>
              <p className='text-gray-400 text-xs font-medium'>XLM</p>
            </div>
          </div>

          <div className='bg-purple-50/50 p-4 rounded-2xl flex items-center justify-between group'>
            <div className='space-y-1 flex-1 min-w-0 mr-4'>
              <p className='text-gray-900 font-bold text-sm'>Wallet Address</p>
              <p className='text-gray-400 text-xs font-medium truncate'>
                {address}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className='text-purple-600 hover:text-purple-700 transition-colors'
            >
              {copied ? (
                <Check className='h-5 w-5' />
              ) : (
                <Copy className='h-5 w-5' />
              )}
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
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
