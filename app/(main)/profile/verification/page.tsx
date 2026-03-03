"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VerifyIdentityButton } from "@/components/VerifyIdentityButton";
import { useAuth } from "@/hooks/useAuth";

export default function VerificationPage() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["verificationStatus"],
    queryFn: () => authApi.getVerificationStatus(),
  });

  const { user } = useAuth();

  const isVerified = data?.isVerified || false;

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
          Identity Verification
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
                {isVerified ? "Verified Account" : "Unverified Identity"}
              </h2>
              <p className='text-sm text-gray-400 max-w-md mx-auto leading-relaxed'>
                {isVerified
                  ? "Your identity has been successfully verified using your NIN. You have full access to all TaskHub features including withdrawals."
                  : "Your identity has not been verified yet. Verify your identity using your NIN to unlock all features and build trust with other users."}
              </p>
            </div>

            {!isVerified && (
              <div className='w-full pt-4'>
                <VerifyIdentityButton
                  userId={user?._id}
                  className='w-full bg-[#6B46C1] hover:bg-[#553C9A] py-8 text-lg font-bold rounded-2xl shadow-lg shadow-purple-200'
                />
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
    <div className='flex items-start gap-4 p-5 bg-white border border-gray-50 rounded-2xl text-left shadow-sm'>
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
