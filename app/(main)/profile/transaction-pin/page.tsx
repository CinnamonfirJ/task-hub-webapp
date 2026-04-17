"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSetupPin } from "@/hooks/useWithdrawal";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

type Step = "pin" | "confirm" | "password" | "success";

export default function TransactionPinPage() {
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();
  const { mutate: setupPin, isPending } = useSetupPin();

  const [step, setStep] = useState<Step>("pin");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const confirmRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  if (isLoadingUser) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='animate-spin text-[#6B46C1]' size={40} />
      </div>
    );
  }

  // Only taskers can set a PIN
  if (user?.role !== "tasker") {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4'>
        <ShieldCheck size={48} className='text-gray-200' />
        <p className='text-gray-500 font-medium'>
          Transaction PINs are only available for Taskers.
        </p>
        <Button onClick={() => router.back()} variant='outline' className='rounded-xl'>
          Go Back
        </Button>
      </div>
    );
  }

  // ── PIN input helpers ─────────────────────────────────────────────────────────

  const handlePinChange = (
    refs: React.RefObject<HTMLInputElement | null>[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    current: string[],
    index: number,
    value: string
  ) => {
    if (value.length > 1) return;
    const next = [...current];
    next[index] = value;
    setter(next);
    if (value && index < 3) {
      refs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (
    refs: React.RefObject<HTMLInputElement | null>[],
    current: string[],
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !current[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  // ── Navigation ────────────────────────────────────────────────────────────────

  const handlePinContinue = () => {
    if (pin.join("").length < 4) return;
    setConfirmPin(["", "", "", ""]);
    setStep("confirm");
    setTimeout(() => confirmRefs[0].current?.focus(), 100);
  };

  const handleConfirmContinue = () => {
    if (pin.join("") !== confirmPin.join("")) {
      toast.error("PINs do not match. Please try again.");
      setConfirmPin(["", "", "", ""]);
      setTimeout(() => confirmRefs[0].current?.focus(), 100);
      return;
    }
    setStep("password");
  };

  const handleSubmit = () => {
    if (!password) {
      toast.error("Please enter your account password");
      return;
    }

    setupPin(
      { pin: pin.join(""), password },
      {
        onSuccess: () => {
          setStep("success");
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to set up PIN. Please check your password.";
          toast.error(msg);
        },
      }
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className='flex flex-col mx-auto p-4 w-full max-w-md min-h-screen bg-white pb-24'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-8'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() =>
            step === "pin" ? router.back() : setStep(step === "confirm" ? "pin" : step === "password" ? "confirm" : "pin")
          }
          className='hover:bg-gray-50 rounded-full w-10 h-10 text-gray-700'
        >
          <ChevronLeft size={24} />
        </Button>
        <h1 className='font-bold text-gray-900 text-xl'>Transaction PIN</h1>
      </div>

      {/* Step: Create PIN */}
      {step === "pin" && (
        <div className='flex flex-col items-center text-center gap-6'>
          <div className='bg-purple-50 p-5 rounded-full'>
            <Lock size={32} className='text-[#6B46C1]' />
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 mb-1'>
              Create your PIN
            </h2>
            <p className='text-gray-500 text-sm'>
              Set a 4-digit PIN to authorize your withdrawals.
            </p>
          </div>

          <div className='flex justify-center gap-3 mt-2'>
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={pinRefs[index]}
                type='password'
                inputMode='numeric'
                pattern='[0-9]*'
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handlePinChange(
                    pinRefs,
                    setPin,
                    pin,
                    index,
                    e.target.value.replace(/[^0-9]/g, "")
                  )
                }
                onKeyDown={(e) => handlePinKeyDown(pinRefs, pin, index, e)}
                className='w-16 h-16 bg-gray-50 border-2 border-gray-200 rounded-2xl text-center text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] focus:border-[#6B46C1] transition-all shadow-sm'
              />
            ))}
          </div>

          <Button
            onClick={handlePinContinue}
            disabled={pin.join("").length < 4}
            className='w-full py-6 rounded-2xl bg-[#6B46C1] hover:bg-[#553C9A] text-white font-bold text-base mt-4'
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step: Confirm PIN */}
      {step === "confirm" && (
        <div className='flex flex-col items-center text-center gap-6'>
          <div className='bg-blue-50 p-5 rounded-full'>
            <ShieldCheck size={32} className='text-blue-500' />
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 mb-1'>
              Confirm your PIN
            </h2>
            <p className='text-gray-500 text-sm'>
              Re-enter the 4-digit PIN to confirm.
            </p>
          </div>

          <div className='flex justify-center gap-3 mt-2'>
            {confirmPin.map((digit, index) => (
              <input
                key={index}
                ref={confirmRefs[index]}
                type='password'
                inputMode='numeric'
                pattern='[0-9]*'
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handlePinChange(
                    confirmRefs,
                    setConfirmPin,
                    confirmPin,
                    index,
                    e.target.value.replace(/[^0-9]/g, "")
                  )
                }
                onKeyDown={(e) => handlePinKeyDown(confirmRefs, confirmPin, index, e)}
                className='w-16 h-16 bg-gray-50 border-2 border-gray-200 rounded-2xl text-center text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] focus:border-[#6B46C1] transition-all shadow-sm'
              />
            ))}
          </div>

          <Button
            onClick={handleConfirmContinue}
            disabled={confirmPin.join("").length < 4}
            className='w-full py-6 rounded-2xl bg-[#6B46C1] hover:bg-[#553C9A] text-white font-bold text-base mt-4'
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step: Password */}
      {step === "password" && (
        <div className='flex flex-col gap-8'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-gray-900 mb-1'>
              Verify your identity
            </h2>
            <p className='text-gray-500 text-sm'>
              Enter your account password to confirm the PIN setup.
            </p>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-semibold text-gray-700'>
              Account Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                className='w-full px-4 py-4 bg-gray-100/80 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1]/30 pr-12 font-medium'
              />
              <button
                type='button'
                onClick={() => setShowPassword((s) => !s)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!password || isPending}
            className='w-full py-6 rounded-2xl bg-[#6B46C1] hover:bg-[#553C9A] text-white font-bold text-base'
          >
            {isPending ? (
              <Loader2 size={20} className='animate-spin' />
            ) : (
              "Set Transaction PIN"
            )}
          </Button>
        </div>
      )}

      {/* Step: Success */}
      {step === "success" && (
        <div className='flex flex-col items-center text-center gap-6 pt-8'>
          <div className='bg-green-50 p-6 rounded-full'>
            <CheckCircle2 size={56} className='text-green-500' />
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              PIN Set Successfully!
            </h2>
            <p className='text-gray-500 text-sm'>
              Your 4-digit transaction PIN has been set. You can now use it to
              authorize withdrawals.
            </p>
          </div>
          <Button
            onClick={() => router.push("/profile")}
            className='w-full py-6 rounded-2xl bg-[#6B46C1] hover:bg-[#553C9A] text-white font-bold text-base mt-4'
          >
            Back to Profile
          </Button>
        </div>
      )}
    </div>
  );
}
