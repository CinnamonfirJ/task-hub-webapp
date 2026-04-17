"use client";

import { useState, useRef } from "react";
import { X, CheckCircle2, ScanLine, AlertCircle, BadgeCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStellarWithdrawal } from "@/hooks/useWithdrawal";
import { useTaskerWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import Image from "next/image";

interface StellarWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'input' | 'review' | 'pin' | 'success';

export function StellarWithdrawalModal({
  isOpen,
  onClose,
}: StellarWithdrawalModalProps) {
  const [step, setStep] = useState<Step>('input');
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  
  const { mutate: withdraw, isPending: isWithdrawing } = useStellarWithdrawal();
  const { data: walletData } = useTaskerWallet();
  
  const withdrawableNGN = walletData?.withdrawableAmount || 0;
  const withdrawableXLM = (withdrawableNGN / 1500).toFixed(2);
  
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  if (!isOpen) return null;

  const isAddressValid = address.length >= 20;

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto focus next
    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const resetAndClose = () => {
    setStep('input');
    setAddress("");
    setAmount("");
    setPin(["", "", "", ""]);
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-[2rem] p-6 lg:p-8 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-300'>
        <button
          onClick={resetAndClose}
          className='absolute right-6 top-6 text-gray-500 hover:text-gray-900 transition-colors z-10'
        >
          <X className='h-6 w-6' />
        </button>

        {step !== 'success' && (
          <div className='text-center space-y-3 mb-8 mt-4'>
            <h2 className='text-xl lg:text-2xl font-bold text-gray-900'>
              Withdraw Via Stellar (XLM)
            </h2>
            <p className='text-gray-400 text-sm md:text-base font-medium px-4'>
              Use the QR Code or your Stellar (XLM) Address below to complete the payment
            </p>
          </div>
        )}

        <div className='space-y-6'>
          {step === 'input' && (
            <>
              {/* Asset Info field */}
              <div className='space-y-2'>
                <p className='text-gray-900 text-sm font-medium px-1'>
                  Asset
                </p>
                <div className='w-full px-4 py-3.5 bg-[#F6F4FB] rounded-xl border border-[#EDEBFC]'>
                  <span className='text-gray-400 font-medium text-base'>Stellar (XLM)</span>
                </div>
              </div>

              {/* Network Info field */}
              <div className='space-y-2'>
                <p className='text-gray-900 text-sm font-medium px-1'>
                  Network
                </p>
                <div className='w-full px-4 py-3.5 bg-[#F6F4FB] rounded-xl border border-[#EDEBFC]'>
                  <span className='text-gray-400 font-medium text-base'>XLM</span>
                </div>
              </div>

              <div className='flex items-start gap-2 -mt-2'>
                <AlertCircle className='w-4 h-4 text-red-500 shrink-0 mt-0.5' fill="currentColor" stroke="white" strokeWidth={2} />
                <p className='text-red-500 text-sm font-medium'>
                  Sending to the wrong network will result in the permanent loss of Funds
                </p>
              </div>

              {/* Wallet Address field */}
              <div className='space-y-2 relative'>
                <p className='text-gray-900 text-sm font-medium px-1'>
                  Wallet Address
                </p>
                <div className='relative'>
                  <input
                    type='text'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder='Enter Wallet Address'
                    className='w-full pl-4 pr-12 py-3.5 bg-[#F6F4FB] rounded-xl border border-[#EDEBFC] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1]/20 font-medium text-base truncate'
                  />
                  <button className='absolute right-4 top-1/2 -translate-y-1/2 text-[#6B46C1] hover:text-[#553C9A] transition-colors'>
                    <ScanLine size={20} />
                  </button>
                </div>
                {isAddressValid && (
                  <div className='flex items-center gap-1.5 mt-2 px-1'>
                    <CheckCircle2 size={16} className='text-green-500' fill="currentColor" stroke="white" strokeWidth={2} />
                    <span className='text-gray-900 text-sm font-medium'>Matched Network</span>
                  </div>
                )}
              </div>

              {/* Amount field */}
              <div className='space-y-2 pt-2'>
                <p className='text-gray-500 text-sm font-medium px-1'>
                  Enter amount of XLM to withdraw
                </p>
                <input
                  type='number'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder='0.00'
                  className='w-full px-4 py-3.5 bg-[#F6F4FB] rounded-xl border border-[#EDEBFC] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1]/20 font-medium text-lg'
                />
                <div className='flex items-center justify-between px-1 mt-1'>
                  <span className='text-gray-400 text-xs font-medium'>Available balance: {withdrawableXLM} XLM</span>
                  <span className='text-gray-400 text-xs font-medium'>Value: ₦{(Number(amount) * 1500).toLocaleString()}</span>
                </div>
              </div>

              <div className='flex gap-4 mt-10'>
                <Button
                  onClick={resetAndClose}
                  variant='outline'
                  className='flex-1 py-6 rounded-md border border-gray-100 bg-[#F6F4FB] text-gray-600 hover:bg-gray-200 font-medium text-base transition-all'
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    const xlmAmount = Number(amount);
                    if (!xlmAmount || xlmAmount < 5) {
                      toast.error('Minimum withdrawal is 5 XLM');
                      return;
                    }
                    setStep('review');
                  }}
                  disabled={!isAddressValid || !amount}
                  className='flex-1 py-6 rounded-md bg-[#6B46C1] hover:bg-[#553C9A] text-white font-medium text-base transition-all'
                >
                  Continue
                </Button>
              </div>
            </>
          )}

          {step === 'review' && (
            <div className='animate-in slide-in-from-right-4 duration-300'>
              <div className='text-center space-y-1 mb-8'>
                <h3 className='text-2xl font-semibold text-gray-900'>{amount || "0"} XLM</h3>
                <p className='text-gray-400 text-sm'>Amount you are withdrawing</p>
              </div>

              <div className='bg-[#F6F4FB] border border-[#EDEBFC] rounded-xl p-6 space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-400 font-medium text-sm'>Asset</span>
                  <span className='text-gray-900 font-medium text-sm'>Stellar (XLM)</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-400 font-medium text-sm'>Network</span>
                  <span className='text-gray-900 font-medium text-sm'>XLM</span>
                </div>
                <div className='flex justify-between items-start gap-4'>
                  <span className='text-gray-400 font-medium text-sm shrink-0'>Wallet Address</span>
                  <span className='text-gray-900 font-medium text-sm text-right break-all max-w-[200px]'>
                    {address}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-400 font-medium text-sm'>Network fee</span>
                  <span className='text-gray-900 font-medium text-sm'>0.1 XLM</span>
                </div>
              </div>

              <div className='flex gap-4 mt-10'>
                <Button
                  onClick={() => setStep('input')}
                  variant='outline'
                  className='flex-1 py-6 rounded-md border border-gray-100 bg-[#F6F4FB] text-gray-600 hover:bg-gray-200 font-medium text-base transition-all'
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep('pin')}
                  className='flex-1 py-6 rounded-md bg-[#6B46C1] hover:bg-[#553C9A] text-white font-medium text-base transition-all'
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 'pin' && (
            <div className='animate-in slide-in-from-right-4 duration-300 text-center pb-2'>
              <h3 className='text-lg font-bold text-gray-900 mb-1'>Transaction Pin</h3>
              <p className='text-gray-400 text-sm font-medium mb-8'>Enter Transaction PIN</p>
              
              <div className='flex justify-center gap-3 mb-10'>
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={pinRefs[index]}
                    type='password'
                    inputMode='numeric'
                    pattern='[0-9]*'
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value.replace(/[^0-9]/g, ''))}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className='w-14 h-14 bg-white border border-gray-200 rounded-lg text-center text-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent transition-all shadow-sm'
                  />
                ))}
              </div>

              <div className='flex gap-4'>
                <Button
                  onClick={() => setStep('review')}
                  variant='outline'
                  className='flex-1 py-6 rounded-md border border-gray-100 bg-[#F6F4FB] text-gray-600 hover:bg-gray-200 font-medium text-base transition-all'
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    // Backend always expects NGN — convert XLM → NGN (1 XLM = 1500 NGN)
                    const xlmAmount = Number(amount);
                    const ngnAmount = Math.round(xlmAmount * 1500);
                    withdraw(
                      {
                        amount: ngnAmount,
                        payoutMethod: 'stellar_crypto',
                        stellarAddress: address,
                        transactionPin: pin.join('')
                      },
                      {
                        onSuccess: () => {
                          setStep('success');
                        },
                        onError: (err: any) => {
                          const msg = err?.response?.data?.message || err?.message || 'Invalid PIN or withdrawal failed';
                          toast.error(msg);
                          setPin(['', '', '', '']);
                          pinRefs[0].current?.focus();
                        }
                      }
                    );
                  }}
                  disabled={pin.join('').length < 4 || isWithdrawing}
                  className='flex-1 py-6 rounded-md bg-[#6B46C1] hover:bg-[#553C9A] text-white font-medium text-base transition-all'
                >
                  {isWithdrawing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Withdraw"}
                </Button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className='animate-in zoom-in duration-300 text-center py-10'>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                Withdrawal Successful
              </h2>
              <p className='text-gray-400 text-base font-medium mb-12'>
                Your withdrawal has been made successfully
              </p>
              
              <div className='flex justify-center mb-6'>
                <Image src="/assets/check.png" alt="Success" width={200} height={200} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
