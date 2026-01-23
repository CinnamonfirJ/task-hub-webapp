"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useVerifyEmail } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, AlertTriangle } from "lucide-react";
import { Suspense } from "react";

const verifySchema = z.object({
  code: z.string().min(5, "Verification code must be 5 digits"),
});

type VerifyValues = z.infer<typeof verifySchema>;

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "taskhubng@gmail.com"; // Fallback for UI testing
  const { verifyAsync, isVerifying, verifyError, resendCode, isResending } =
    useVerifyEmail();

  const form = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const type = (searchParams.get("type") as "user" | "tasker") || "user";

  const onSubmit = async (data: VerifyValues) => {
    if (!email) return;
    try {
      await verifyAsync({ email, code: data.code, type });
    } catch (err) {}
  };

  const handleResend = () => {
    if (email) resendCode({ email, type });
  };

  return (
    <div className='mx-auto px-4 py-10 w-full max-w-md'>
      {/* Icon Header */}
      <div className='flex flex-col items-center mb-8'>
        <div className='flex justify-center items-center bg-purple-50 mb-4 rounded-full w-16 h-16'>
          <div className='flex justify-center items-center bg-white shadow-sm rounded-full w-12 h-12'>
            <Mail className='w-6 h-6 text-primary' />
          </div>
        </div>
        <h1 className='font-extrabold text-[#111827] text-3xl'>
          Verify Your Email
        </h1>
        <p className='mt-2 max-w-[300px] text-gray-500 text-sm text-center'>
          We have sent 6-digit Verification code to your email address. Please
          enter the code below to verify your account
        </p>
      </div>

      <div className='space-y-6'>
        {/* Email Info Box */}
        <div className='flex items-center gap-4 bg-[#F5F3FF] p-4 border border-[#DDD6FE] rounded-xl'>
          <div className='flex justify-center items-center bg-[#E0E7FF] rounded-lg w-10 h-10 shrink-0'>
            <Mail className='w-5 h-5 text-primary' />
          </div>
          <div className='flex flex-col'>
            <span className='mb-0.5 font-semibold text-primary/70 text-xs'>
              Code sent to:
            </span>
            <span className='font-bold text-primary text-sm'>{email}</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {verifyError && (
            <Alert variant='destructive'>
              <AlertDescription>
                {(verifyError as Error).message || "Invalid verification code"}
              </AlertDescription>
            </Alert>
          )}

          <div className='space-y-2'>
            <Label
              htmlFor='code'
              className='font-semibold text-gray-700 text-sm'
            >
              Verification Code
            </Label>
            <Input
              id='code'
              placeholder='Enter code'
              className='bg-gray-50/50 border-gray-200 focus:ring-primary/20 h-12 font-bold text-lg text-center tracking-widest'
              maxLength={6}
              {...form.register("code")}
            />
            {form.formState.errors.code && (
              <p className='text-red-500 text-sm'>
                {form.formState.errors.code.message}
              </p>
            )}
          </div>

          <Button
            className='bg-[#6B46C1] hover:bg-[#553C9A] rounded-xl w-full h-12 font-bold text-lg'
            type='submit'
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </Button>
        </form>

        {/* Spam Alert Box */}
        <div className='flex gap-3 bg-[#EFF6FF] p-4 border border-[#BFDBFE] rounded-lg text-[#1E40AF] text-sm'>
          <div className='flex justify-center items-center bg-[#BFDBFE] rounded-md w-8 h-8 shrink-0'>
            <AlertTriangle className='w-5 h-5' />
          </div>
          <div className='flex flex-col'>
            <span className='mb-1 font-bold'>Check your spam folder</span>
            <p className='text-[#3B82F6] text-xs'>
              If you don't see the email in your inbox, please check your spam
              or junk folder
            </p>
          </div>
        </div>

        <div className='font-medium text-gray-500 text-sm text-center'>
          Didn't receive the code?{" "}
          <Button
            variant='link'
            onClick={handleResend}
            className='p-0 h-auto font-bold text-primary hover:text-primary/80'
            disabled={isResending}
          >
            {isResending ? "Resending..." : "Resend code"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
