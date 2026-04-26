"use client";

import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2, CreditCard, Info, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBanks, useSetBankAccount, useTaskerBankAccount } from "@/hooks/useWithdrawal";
import { toast } from "sonner";

interface BankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BankAccountModal({ isOpen, onClose }: BankAccountModalProps) {
  const { data: banks, isLoading: isLoadingBanks } = useBanks();
  const { data: savedBank, isLoading: isLoadingSavedBank } = useTaskerBankAccount();
  const { mutate: setBank, isPending: isSettingBank } = useSetBankAccount();

  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    if (savedBank) {
      setAccountNumber(savedBank.accountNumber || "");
      setSelectedBank(savedBank.bankCode || "");
    }
  }, [savedBank]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (accountNumber.length !== 10) {
      toast.error("Account number must be 10 digits");
      return;
    }
    if (!selectedBank) {
      toast.error("Please select a bank");
      return;
    }

    setBank(
      { accountNumber, bankCode: selectedBank },
      {
        onSuccess: () => {
          toast.success("Bank account saved successfully!");
          onClose();
        },
        onError: (err: unknown) => {
          const error = err as { message?: string; data?: { message?: string } };
          const message = error?.data?.message || error?.message || "Failed to save bank account";
          // Provide a more helpful message for common verification errors
          if (message.toLowerCase().includes("could not verify") || message.toLowerCase().includes("verification")) {
            toast.error("Could not verify bank account. Please double-check your account number and bank selection.");
          } else {
            toast.error(message);
          }
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] p-6 lg:p-8 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2.5 rounded-xl">
              <CreditCard className="w-5 h-5 text-[#6B46C1]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {savedBank ? "Update Bank Account" : "Add Bank Account"}
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                For withdrawal settlements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Saved bank preview */}
        {savedBank && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={14} className="text-green-500" />
              <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Current Saved Account</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account Name</span>
              <span className="text-xs font-black text-gray-900">{savedBank.accountName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bank</span>
              <span className="text-xs font-black text-gray-900">{savedBank.bankName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account Number</span>
              <span className="text-xs font-black text-gray-900 tracking-widest">{savedBank.accountNumber}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
              {savedBank ? "Change Bank" : "Select Bank"}
            </p>
            <div className="relative">
              <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-purple-200 appearance-none"
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                disabled={isLoadingBanks}
              >
                <option value="">{isLoadingBanks ? "Loading banks..." : "Select Bank"}</option>
                {banks
                  ?.filter((bank: any, index: number, self: any[]) => self.findIndex((b: any) => b.code === bank.code) === index)
                  .map((bank: any) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Account Number</p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-purple-200 tracking-widest"
            />
            <p className="text-[10px] text-gray-400 px-1">{accountNumber.length}/10 digits</p>
          </div>

          {/* Info note */}
          <div className="flex gap-2 p-3 bg-purple-50/50 rounded-xl">
            <Info size={12} className="text-purple-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-purple-700 font-semibold leading-tight">
              Ensure the account name matches your registered profile name to avoid withdrawal delays.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 py-6 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100 font-medium text-sm transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSettingBank || accountNumber.length !== 10 || !selectedBank}
            className="flex-1 py-6 rounded-xl bg-[#6B46C1] hover:bg-[#553C9A] text-white font-medium text-sm transition-all"
          >
            {isSettingBank ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              savedBank ? "Update Account" : "Save Account"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
