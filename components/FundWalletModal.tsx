'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FundWalletModal({ isOpen, onClose }: FundWalletModalProps) {
  const [amount, setAmount] = useState('0.00');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Fund wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-6">Enter amount to add to your wallet</p>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-4 py-3 bg-purple-50 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6"
        />

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-900 hover:bg-gray-50 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log('Funding wallet with:', amount);
              onClose();
            }}
            className="flex-1 py-3 rounded-lg bg-[#6B46C1] hover:bg-[#553C9A] text-white font-medium"
          >
            Fund
          </Button>
        </div>
      </div>
    </div>
  );
}
