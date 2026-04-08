import { useState, useEffect } from "react";
import {
  X,
  Wallet,
  CreditCard,
  Coins,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTaskerWallet } from "@/hooks/useWallet";
import {
  useBanks,
  useSetBankAccount,
  useWithdrawal,
  useTaskerBankAccount,
} from "@/hooks/useWithdrawal";
import { toast } from "sonner";

interface WithdrawFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToStellar: (amount: string) => void;
  balance?: string;
}

export function WithdrawFundsModal({
  isOpen,
  onClose,
  onSwitchToStellar,
  balance = "0.00",
}: WithdrawFundsModalProps) {
  const { data: walletData, isLoading: isLoadingWallet } = useTaskerWallet();
  const { data: banks, isLoading: isLoadingBanks } = useBanks();
  const { data: savedBank, isLoading: isLoadingSavedBank } =
    useTaskerBankAccount();
  const { mutate: setBank, isPending: isSettingBank } = useSetBankAccount();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawal();

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"bank" | "stellar">("bank");
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (savedBank) {
      setAccountNumber(savedBank.accountNumber || "");
      setSelectedBank(savedBank.bankCode || "");
    }
  }, [savedBank]);

  if (!isOpen) return null;

  const handleWithdraw = () => {
    if (method === "stellar") {
      onSwitchToStellar(amount);
      return;
    }

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount < 5000) {
      toast.error("Minimum withdrawal is ₦5,000");
      return;
    }

    if (numAmount > (walletData?.withdrawableAmount || 0)) {
      toast.error("Insufficient withdrawable balance");
      return;
    }

    withdraw(numAmount, {
      onSuccess: () => {
        toast.success("Withdrawal request submitted successfully!");
        onClose();
      },
      onError: (err: unknown) => {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to submit withdrawal request");
      },
    });
  };

  const handleSaveBank = () => {
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
          toast.success("Bank account updated successfully");
        },
      },
    );
  };

  const canWithdraw = walletData?.canWithdraw && walletData?.hasBankAccount;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-[2.5rem] p-6 md:p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-gray-900'>Withdraw Funds</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        {/* Withdrawal Info Alert */}
        {!walletData?.canWithdraw && walletData?.nextWithdrawableAt && (
          <div className='bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-3 mb-6'>
            <AlertCircle size={20} className='text-orange-500 shrink-0' />
            <p className='text-[11px] text-orange-700 font-bold leading-relaxed'>
              Cooldown active. You can withdraw again after{" "}
              {new Date(walletData.nextWithdrawableAt).toLocaleString()}
            </p>
          </div>
        )}

        <div className='bg-linear-to-br from-[#6B46C1] to-[#553C9A] rounded-lg p-6 text-white mb-6 shadow-lg relative overflow-hidden'>
          <div className='relative z-10 flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2 opacity-90'>
              <Wallet size={16} />
              <span className='text-xs font-medium uppercase tracking-wider'>
                Withdrawable Balance
              </span>
            </div>
          </div>
          <div className='relative z-10 text-3xl font-black flex items-baseline gap-1'>
            <span className='text-xl font-normal opacity-80'>₦</span>
            {walletData?.withdrawableAmount?.toLocaleString() || balance}
          </div>
          <div className='absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl' />
        </div>

        <div className='space-y-6'>
          {/* Bank Account Setup */}
          <div className='space-y-3 p-4 bg-gray-50 border border-gray-100 rounded-lg'>
            <h3 className='text-sm font-bold text-gray-900 uppercase tracking-tight flex items-center justify-between'>
              Bank Details
              {walletData?.hasBankAccount && (
                <CheckCircle2 size={16} className='text-green-500' />
              )}
            </h3>

            {savedBank && (
              <div className='bg-white p-3 rounded-2xl border border-purple-100 space-y-1 mb-2'>
                <div className='flex justify-between items-center'>
                  <span className='text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                    Account Name
                  </span>
                  <span className='text-xs font-black text-gray-900'>
                    {savedBank.accountName}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                    Account Number
                  </span>
                  <span className='text-xs font-black text-gray-900 tracking-widest'>
                    {savedBank.accountNumber}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
                    Bank
                  </span>
                  <span className='text-xs font-black text-gray-900 italic'>
                    {savedBank.bankName}
                  </span>
                </div>
              </div>
            )}

            <div className='space-y-2'>
              <p className='text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1'>
                {savedBank ? "Update Bank Details" : "Enter Bank Details"}
              </p>
              <select
                className='w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-purple-200'
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                disabled={isLoadingBanks}
              >
                <option value=''>Select Bank</option>
                {banks?.map((bank: any) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>

              <div className='flex gap-2'>
                <input
                  type='text'
                  maxLength={10}
                  placeholder='Account Number'
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(e.target.value.replace(/\D/g, ""))
                  }
                  className='flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-purple-200'
                />
                <Button
                  size='sm'
                  onClick={handleSaveBank}
                  disabled={isSettingBank}
                  className='bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-xl px-4'
                >
                  {isSettingBank ? (
                    <Loader2 size={16} className='animate-spin' />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
            <div className='flex gap-2 p-2 px-3 bg-purple-50/50 rounded-xl mt-2'>
              <Info size={12} className='text-purple-500 shrink-0 mt-0.5' />
              <p className='text-[9px] text-purple-700 font-semibold leading-tight'>
                Ensure the account name matches your profile name to avoid
                delays.
              </p>
            </div>
          </div>

          <div className='space-y-2'>
            <p className='text-gray-400 text-[10px] font-bold tracking-widest px-1 uppercase'>
              Amount to withdraw (Min ₦5,000)
            </p>
            <div className='relative'>
              <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold'>
                ₦
              </span>
              <input
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='0.00'
                className='w-full pl-10 pr-6 py-4 bg-purple-50/50 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 border-none font-bold text-xl'
              />
            </div>
          </div>

          <div className='space-y-3 pb-2'>
            <p className='text-gray-400 text-[10px] font-bold tracking-widest px-1 uppercase'>
              Payment method
            </p>

            <button
              onClick={() => setMethod("bank")}
              className={cn(
                "w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group",
                method === "bank"
                  ? "border-[#6B46C1] bg-purple-50/50"
                  : "border-gray-100 hover:border-purple-200",
              )}
            >
              <div className='flex items-center gap-4'>
                <div
                  className={cn(
                    "p-3 rounded-xl transition-colors",
                    method === "bank"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-50 text-gray-400 group-hover:bg-purple-50",
                  )}
                >
                  <CreditCard size={22} />
                </div>
                <div className='text-left'>
                  <p className='font-bold text-gray-900'>
                    Direct Bank Transfer
                  </p>
                  <p className='text-[10px] text-gray-400 font-medium tracking-tight'>
                    24-48 hours processing
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  method === "bank"
                    ? "border-[#6B46C1] bg-[#6B46C1]"
                    : "border-gray-200",
                )}
              >
                {method === "bank" && (
                  <div className='w-2 h-2 bg-white rounded-full' />
                )}
              </div>
            </button>

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
                    <p className='text-[10px] text-gray-400 font-medium'>
                      Instant Crypto Payout
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

        {/* Withdrawal Info Alert */}
        <div className='mt-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-start gap-3'>
          <ShieldCheck className='h-5 w-5 text-[#6B46C1] shrink-0 mt-0.5' />
          <div className='space-y-1'>
            <p className='text-[11px] text-gray-900 font-extrabold leading-tight'>
              Anti-Fraud Protection
            </p>
            <p className='text-[10px] text-gray-600 leading-normal font-medium'>
              Withdrawals are audited for security. Please allow up to 48 hours
              for processing to your bank account.
            </p>
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-4 mt-6'>
          <Button
            onClick={onClose}
            variant='outline'
            className='flex-1 py-4 md:py-6 rounded-2xl border-none bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold'
          >
            Cancel
          </Button>
          <Button
            onClick={handleWithdraw}
            disabled={!canWithdraw || isWithdrawing || !amount}
            className='flex-1 py-4 md:py-6 rounded-2xl bg-[#6B46C1] hover:bg-[#553C9A] text-white font-bold shadow-lg transition-all uppercase tracking-wider'
          >
            {isWithdrawing ? <Loader2 className='animate-spin' /> : "Withdraw"}
          </Button>
        </div>
      </div>
    </div>
  );
}
