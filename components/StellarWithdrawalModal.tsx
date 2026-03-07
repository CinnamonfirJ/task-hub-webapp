"use client";

import { useState } from "react";
import { X, Coins, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StellarWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (address: string) => void;
  amount: string;
}

export function StellarWithdrawalModal({
  isOpen,
  onClose,
  onWithdraw,
  amount,
}: StellarWithdrawalModalProps) {
  const [address, setAddress] = useState("");

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-300'>
        <button
          onClick={onClose}
          className='absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full'
        >
          <X className='h-6 w-6' />
        </button>

        <div className='text-center space-y-2 mb-8 mt-2'>
          <div className='bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#6B46C1] shadow-inner'>
            <Coins size={32} />
          </div>
          <h2 className='text-2xl font-bold text-gray-900'>
            Withdraw Via Stellar
          </h2>
          <p className='text-purple-400 text-sm font-medium'>
            Enter your Stellar wallet address to receive ₦{amount}
          </p>
        </div>

        <div className='space-y-6 mb-8'>
          <div className='space-y-2'>
            <p className='text-gray-400 text-[10px] font-bold tracking-widest px-1 uppercase'>
              Stellar Wallet Address
            </p>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder='G... (Stellar Public Key)'
              className='w-full px-6 py-4 bg-purple-50/50 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 border-none font-medium text-sm min-h-[100px] resize-none'
            />
          </div>

          <div className='bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50'>
            <p className='text-[10px] text-blue-600 font-bold leading-relaxed text-center uppercase tracking-wider'>
              Double check your address. Transactions on Stellar are
              irreversible.
            </p>
          </div>
        </div>

        <div className='flex gap-4'>
          <Button
            onClick={onClose}
            variant='outline'
            className='flex-1 py-6 rounded-2xl border-none bg-purple-50 text-purple-600 hover:bg-purple-100 font-bold text-base transition-all'
          >
            Cancel
          </Button>
          <Button
            onClick={() => onWithdraw(address)}
            disabled={!address || address.length < 20}
            className='flex-1 py-6 rounded-2xl bg-[#6B46C1] hover:bg-[#553C9A] text-white font-bold text-base shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:shadow-none'
          >
            Confirm{" "}
            <ArrowRight
              size={18}
              className='group-hover:translate-x-1 transition-transform'
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
