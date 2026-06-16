"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  ChevronRight,
  Fingerprint,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { VerifyIdentityButton } from "@/components/VerifyIdentityButton";
import { QoreIDVerifyButton } from "@/components/QoreIDVerifyButton";
import { useAuth } from "@/hooks/useAuth";
import { NINManualSubmission } from "@/components/NINManualSubmission";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VerificationPendingCard } from "@/components/VerificationPendingCard";
import { Suspense } from "react";

function VerificationContent() {
  const router = useRouter();
  const [verificationMode, setVerificationMode] = useState<
    "sdk" | "manual"
  >("sdk");

  const { data, isLoading } = useQuery({
    queryKey: ["verificationStatus"],
    queryFn: () => authApi.getVerificationStatus(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  const { user } = useAuth();

  const isVerified =
    data?.isVerified ||
    user?.isKYCVerified ||
    user?.verifyIdentity ||
    user?.isVerified ||
    false;

  const isPending = data?.isPending || false;

  return (
    <div className='p-4 md:p-8 max-w-2xl mx-auto space-y-10 pb-20'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => router.back()}
          className='bg-white border text-gray-400 rounded-xl w-12 h-12'
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className='text-2xl font-bold text-gray-900'>
          KYC Verification
        </h1>
      </div>

      <div className='flex flex-col items-center text-center space-y-8'>
        {isLoading ? (
          <div className='flex flex-col items-center space-y-4'>
            <Loader2 className='w-12 h-12 animate-spin text-[#6B46C1]' />
            <p className='text-gray-400 font-medium'>
              Checking verification status...
            </p>
          </div>
        ) : (
          <>
            <div
              className={`p-8 rounded-full ${isVerified ? "bg-green-50" : "bg-orange-50"}`}
            >
              {isVerified ? (
                <ShieldCheck className='w-20 h-20 text-green-500' />
              ) : (
                <ShieldAlert className='w-20 h-20 text-orange-500' />
              )}
            </div>

            <div className='space-y-3'>
              <h2 className='text-2xl font-bold text-gray-900'>
                {isVerified ? "Account Verified" : "Verify Your Identity"}
              </h2>
              <p className='text-sm text-gray-400 max-w-md mx-auto leading-relaxed'>
                {isVerified
                  ? "Your identity has been successfully verified. You now have full access to all TaskHub features including withdrawals."
                  : "Complete your identity verification to unlock all features and build trust. Choose a verification method below."}
              </p>
            </div>

            {!isVerified && (
              <div className='w-full pt-4'>
                {isPending ? (
                  <VerificationPendingCard />
                ) : (
                  <AnimatePresence mode="wait">
                    {verificationMode === "sdk" && (
                      <motion.div
                        key="sdk"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full space-y-4"
                      >
                        {/* Option 1: Document Upload via Didit */}
                        <Card className="border border-gray-100 rounded-2xl overflow-hidden hover:border-[#6B46C1]/30 transition-colors">
                          <CardContent className="p-0">
                            <div className="p-5 space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="bg-purple-50 p-2.5 rounded-xl">
                                  <ShieldCheck size={20} className="text-[#6B46C1]" />
                                </div>
                                <div className="text-left">
                                  <p className="font-bold text-gray-900 text-sm">Document Upload (Didit)</p>
                                  <p className="text-xs text-gray-400">Use this if you have your passport</p>
                                </div>
                              </div>
                              <VerifyIdentityButton
                                userId={user?._id}
                                className='w-full bg-[#6B46C1] hover:bg-[#553C9A] py-6 text-sm font-bold rounded-xl'
                              />
                            </div>
                          </CardContent>
                        </Card>

                        {/* Option 2: NIN Verification via QoreID */}
                        <Card className="border border-gray-100 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-colors">
                          <CardContent className="p-0">
                            <div className="p-5 space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-50 p-2.5 rounded-xl">
                                  <Fingerprint size={20} className="text-blue-600" />
                                </div>
                                <div className="text-left">
                                  <p className="font-bold text-gray-900 text-sm">NIN Verification (QoreID)</p>
                                  <p className="text-xs text-gray-400">Use this if you have an NIN slip or card</p>
                                </div>
                              </div>
                              <QoreIDVerifyButton
                                className='w-full bg-blue-600 hover:bg-blue-700 py-6 text-sm font-bold rounded-xl text-white'
                              />
                            </div>
                          </CardContent>
                        </Card>

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
            )}

            <div className='w-full space-y-4 pt-8'>
              <h3 className='text-xs font-bold text-gray-400 uppercase tracking-widest text-left px-2'>
                Why verify?
              </h3>
              <div className='grid gap-4'>
                <VerificationBenefit
                  icon={<ShieldCheck size={20} className='text-blue-500' />}
                  title='Build Trust'
                  description='Verified badges help you stand out and build trust with taskers and clients.'
                />
                <VerificationBenefit
                  icon={<ShieldCheck size={20} className='text-blue-500' />}
                  title='Secure Payments'
                  description='Identity verification is required for secure processing of high-value tasks and withdrawals.'
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={
      <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#6B46C1]" />
        <p className="text-gray-400 font-medium">Loading verification...</p>
      </div>
    }>
      <VerificationContent />
    </Suspense>
  );
}

function VerificationBenefit({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className='flex items-start gap-4 p-5 bg-white border border-gray-50 rounded-2xl text-left '>
      <div className='bg-blue-50 p-2.5 rounded-xl'>{icon}</div>
      <div>
        <p className='font-bold text-gray-900 text-sm'>{title}</p>
        <p className='text-xs text-gray-400 leading-relaxed mt-1'>
          {description}
        </p>
      </div>
    </div>
  );
}
