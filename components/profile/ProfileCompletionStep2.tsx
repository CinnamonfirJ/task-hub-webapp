"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  ShieldQuestion,
  ChevronRight,
  Fingerprint,
} from "lucide-react";
import { VerifyIdentityButton } from "@/components/VerifyIdentityButton";
import { QoreIDVerifyButton } from "@/components/QoreIDVerifyButton";
import { NINManualSubmission } from "@/components/NINManualSubmission";
import { VerificationPendingCard } from "@/components/VerificationPendingCard";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ProfileCompletionStep2Props {
  setStep: (step: number) => void;
  userId?: string;
  isVerificationPending?: boolean;
}

export function ProfileCompletionStep2({
  setStep,
  userId,
  isVerificationPending = false,
}: ProfileCompletionStep2Props) {
  const [verificationMode, setVerificationMode] = useState<"sdk" | "manual">("sdk");

  return (
    <div className='max-w-2xl mx-auto p-4 md:p-0'>
      {/* Header */}
      <div className='flex items-center gap-4 mb-8'>
        <Button
          variant='outline'
          size='icon'
          className='h-10 w-10 rounded-xl'
          onClick={() => setStep(1)}
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className='text-xl font-bold text-gray-900'>Complete profile</h1>
          <p className='text-gray-500 text-sm'>Step 2 of 2: Verification</p>
        </div>
      </div>

      {/* Stepper */}
      <div className='flex justify-between items-center mb-10 px-4'>
        <div className='flex items-center gap-3 opacity-50'>
          <div className='w-10 h-10 rounded-full bg-[#6B46C1] text-white flex items-center justify-center font-bold'>
            1
          </div>
          <div>
            <p className='text-sm font-bold text-gray-900'>Profile Info</p>
            <p className='text-xs text-gray-500'>Basic details</p>
          </div>
        </div>
        <div className='flex-1 border-t-2 border-[#6B46C1] mx-4 border-dashed' />
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-[#6B46C1] text-white flex items-center justify-center font-bold'>
            2
          </div>
          <div>
            <p className='text-sm font-bold text-gray-900'>Verification</p>
            <p className='text-xs text-gray-500'>ID verification</p>
          </div>
        </div>
      </div>

      <div className='bg-white p-8 rounded-[2rem]  border border-gray-50 space-y-8'>
        <div className='flex flex-col items-center justify-center text-center'>
          <h3 className='font-bold text-lg text-gray-900 mb-6'>
            Identity Verification
          </h3>

          <div className='bg-purple-50 p-6 rounded-full mb-6'>
            <ShieldCheck size={48} className='text-[#6B46C1]' />
          </div>

          <div className='space-y-6 w-full'>
            <div className='space-y-2'>
              <p className='font-bold text-gray-900'>
                Official ID Verification
              </p>
              <p className='text-sm text-gray-500 mb-6'>
                Choose a verification method below to verify your identity.
              </p>
            </div>

            {isVerificationPending ? (
              <VerificationPendingCard />
            ) : (
              <AnimatePresence mode="wait">
                {verificationMode === "sdk" && (
                  <motion.div
                    key="sdk"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 w-full"
                  >
                    {/* Option 1: Document Upload via Didit */}
                    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-50 p-2.5 rounded-xl">
                          <ShieldCheck size={18} className="text-[#6B46C1]" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-900 text-sm">Document Upload (Didit)</p>
                          <p className="text-xs text-gray-400">Use this if you have your passport</p>
                        </div>
                      </div>
                      <VerifyIdentityButton
                        userId={userId}
                        className='w-full bg-[#6B46C1] hover:bg-[#553C9A] text-white h-14 rounded-xl font-bold text-sm transition-all active:scale-[0.99]'
                      />
                    </div>

                    {/* Option 2: NIN Verification via QoreID */}
                    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2.5 rounded-xl">
                          <Fingerprint size={18} className="text-blue-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-900 text-sm">NIN Verification (QoreID)</p>
                          <p className="text-xs text-gray-400">Use this if you have an NIN slip or card</p>
                        </div>
                      </div>
                      <QoreIDVerifyButton
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-xl font-bold text-sm transition-all active:scale-[0.99]'
                      />
                    </div>

                    {/* Manual NIN Fallback */}
                    <Button
                      variant="ghost"
                      onClick={() => setVerificationMode("manual")}
                      className="w-full text-gray-400 hover:text-gray-600 font-medium text-xs h-10"
                    >
                      Enter 11-digit NIN manually instead
                      <ChevronRight size={14} className="ml-1" />
                    </Button>
                  </motion.div>
                )}

                {verificationMode === "manual" && (
                  <motion.div
                    key="manual"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full"
                  >
                    <NINManualSubmission
                      onCancel={() => setVerificationMode("sdk")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Information Box */}
      <div className='bg-[#E0F2FE] p-6 rounded-[2rem] mt-8'>
        <div className='flex items-center gap-3 mb-4 text-[#0284C7]'>
          <div className='bg-[#BAE6FD] p-2 rounded-lg'>
            <Shield size={20} fill='currentColor' className='text-[#0284C7]' />
          </div>
          <h4 className='font-bold text-[#0284C7]'>
            Why verify your identity?
          </h4>
        </div>

        <ul className='space-y-3'>
          <li className='flex items-center gap-3 text-[#0EA5E9] text-sm font-medium'>
            <div className='min-w-4 min-h-4 rounded-full border-2 border-[#0EA5E9]' />
            Build trust with clients and taskers
          </li>
          <li className='flex items-center gap-3 text-[#0EA5E9] text-sm font-medium'>
            <div className='min-w-4 min-h-4 rounded-full border-2 border-[#0EA5E9]' />
            Access all platforms features
          </li>
          <li className='flex items-center gap-3 text-[#0EA5E9] text-sm font-medium'>
            <div className='min-w-4 min-h-4 rounded-full border-2 border-[#0EA5E9]' />
            Increase your chances of getting hired
          </li>
          <li className='flex items-center gap-3 text-[#0EA5E9] text-sm font-medium'>
            <div className='min-w-4 min-h-4 rounded-full border-2 border-[#0EA5E9]' />
            Secure your account
          </li>
        </ul>
      </div>
    </div>
  );
}
