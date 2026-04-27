"use client";

import { useSearchParams } from "next/navigation";
import { useVerifyEmail } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

import { UserType } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const type = (searchParams.get("type") as UserType) || "user";
  const [autoVerified, setAutoVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoggingInAfterVerify, setIsLoggingInAfterVerify] = useState(false);

  const {
    verifyAsync,
    isVerifying,
    verifyError,
    resendCode,
    isResending,
  } = useVerifyEmail();

  const { loginAsync } = useAuth();

  // Initialize email from URL or localStorage
  useEffect(() => {
    const urlEmail = searchParams.get("email");
    if (urlEmail) {
      setEmail(urlEmail);
    } else if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("lastRegisteredEmail");
      if (storedEmail) setEmail(storedEmail);
    }
  }, [searchParams]);

  const handlePostVerify = async () => {
    try {
      setIsLoggingInAfterVerify(true);
      
      // Try to auto-login using stored credentials
      const pendingEmail = sessionStorage.getItem("pendingEmail");
      const pendingPassword = sessionStorage.getItem("pendingPassword");
      const pendingRole = sessionStorage.getItem("pendingRole") as UserType;

      if (pendingEmail && pendingPassword) {
        await loginAsync({ 
          email: pendingEmail, 
          password: pendingPassword, 
          role: pendingRole || type 
        });
        
        // Success! loginAsync will redirect to /home
        sessionStorage.removeItem("pendingEmail");
        sessionStorage.removeItem("pendingPassword");
        sessionStorage.removeItem("pendingRole");
      } else {
        // Fallback if no credentials found
        router.push("/login");
      }
    } catch (err) {
      console.error("Auto-login failed:", err);
      router.push("/login");
    } finally {
      setIsLoggingInAfterVerify(false);
    }
  };

  // Auto-verify when token is present in URL (user clicked link from email)
  useEffect(() => {
    const runAutoVerify = async () => {
      if (token && email && !autoVerified) {
        setAutoVerified(true);
        try {
          await verifyAsync({ token, type, emailAddress: email });
          await handlePostVerify();
        } catch (err) {
          // Error handled by useMutation state
        }
      }
    };
    runAutoVerify();
  }, [token, type, email, autoVerified, verifyAsync]);

  const handleResend = () => {
    if (email) resendCode({ email, type });
  };

  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 5 && email) {
      try {
        await verifyAsync({ token: otp, type, emailAddress: email });
        await handlePostVerify();
      } catch (err) {
        // Error handled by useMutation state
      }
    }
  };

  // If token is in URL show auto-verification state
  if (token) {
    return (
      <div className='mx-auto px-4 py-10 w-full max-w-md'>
        <div className='flex flex-col items-center mb-8'>
          <div className='flex justify-center items-center bg-purple-50 mb-4 rounded-full w-16 h-16'>
            <div className='flex justify-center items-center bg-white shadow-sm rounded-full w-12 h-12'>
              {isVerifying || isLoggingInAfterVerify ? (
                <Loader2 className='w-6 h-6 text-primary animate-spin' />
              ) : verifyError ? (
                <AlertTriangle className='w-6 h-6 text-red-500' />
              ) : (
                <CheckCircle2 className='w-6 h-6 text-green-600' />
              )}
            </div>
          </div>

          <h1 className='font-extrabold text-[#111827] text-3xl'>
            {isVerifying
              ? "Verifying..."
              : isLoggingInAfterVerify
              ? "Logging you in..."
              : verifyError
                ? "Verification Failed"
                : "Email Verified!"}
          </h1>

          {(isVerifying || isLoggingInAfterVerify) && (
            <p className='mt-2 text-gray-500 text-sm text-center'>
              {isVerifying ? "Please wait while we verify your email address." : "Verification successful! Signing you in..."}
            </p>
          )}

          {verifyError && (
            <div className='mt-4 space-y-4 w-full'>
              <Alert variant='destructive'>
                <AlertDescription>
                  {(verifyError as Error).message ||
                    "Invalid or expired verification link"}
                </AlertDescription>
              </Alert>
              <p className='text-sm text-muted-foreground text-center'>
                The link may have expired. Request a new verification email.
              </p>
            </div>
          )}

          {!isVerifying && !verifyError && !isLoggingInAfterVerify && (
            <div className='mt-4 space-y-4 w-full'>
              <div className='flex flex-col items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-6'>
                <p className='font-semibold text-green-800 text-center'>
                  Your email has been verified successfully!
                </p>
                <p className='text-green-700 text-sm text-center'>
                  Redirecting to home...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If no token show "check your email" info screen (after registration)
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
          We&apos;ve sent a verification link to your email address. Click the
          link in the email to verify your account.
        </p>
      </div>

      <div className='space-y-6'>
        {/* Email Info Box */}
        {email && (
          <div className='flex items-center gap-4 bg-[#F5F3FF] p-4 border border-[#DDD6FE] rounded-xl'>
            <div className='flex justify-center items-center bg-[#E0E7FF] rounded-lg w-10 h-10 shrink-0'>
              <Mail className='w-5 h-5 text-primary' />
            </div>
            <div className='flex flex-col'>
              <span className='mb-0.5 font-semibold text-primary/70 text-xs'>
                Verification link sent to:
              </span>
              <span className='font-bold text-primary text-sm'>{email}</span>
            </div>
          </div>
        )}

        {/* OTP Input Section */}
        <div className='space-y-4 pt-4'>
          <div className='flex flex-col items-center gap-3'>
            <label className='text-sm font-semibold text-gray-700'>
              Enter 5-digit code
            </label>
            <div className='flex gap-3'>
              {[0, 1, 2, 3, 4].map((index) => (
                <input
                  key={index}
                  type='text'
                  maxLength={1}
                  value={otp[index] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    if (val) {
                      setOtp((prev) => {
                        const chars = prev.split("");
                        while (chars.length < 5) chars.push("");
                        chars[index] = val.slice(-1);
                        return chars.join("");
                      });

                      // Auto focus next
                      if (index < 4) {
                        const nextInput = document.getElementById(
                          `otp-${index + 1}`,
                        );
                        nextInput?.focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[index] && index > 0) {
                      const prevInput = document.getElementById(
                        `otp-${index - 1}`,
                      );
                      prevInput?.focus();

                      const newOtp = otp.split("");
                      newOtp[index - 1] = "";
                      setOtp(newOtp.join(""));
                    }
                  }}
                  id={`otp-${index}`}
                  className='w-12 h-14 text-center text-xl font-bold bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all'
                />
              ))}
            </div>
          </div>

          {!email && (
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-gray-700'>
                Email Address
              </label>
              <input
                type='email'
                placeholder='name@example.com'
                className='w-full h-12 px-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <Button
            className='w-full h-12 text-lg font-bold shadow-lg shadow-purple-200'
            disabled={otp.length !== 5 || isVerifying || isLoggingInAfterVerify}
            onClick={handleManualVerify}
          >
            {isVerifying || isLoggingInAfterVerify ? (
              <>
                <Loader2 className='mr-2 w-5 h-5 animate-spin' />
                {isVerifying ? "Verifying..." : "Logging in..."}
              </>
            ) : (
              "Verify Code"
            )}
          </Button>

          {verifyError && !token && (
            <Alert variant='destructive' className='mt-4'>
              <AlertDescription>
                {(verifyError as Error).message || "Invalid or expired code"}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Spam Alert Box */}
        <div className='flex gap-3 bg-[#EFF6FF] p-4 border border-[#BFDBFE] rounded-lg text-[#1E40AF] text-sm'>
          <div className='flex justify-center items-center bg-[#BFDBFE] rounded-md w-8 h-8 shrink-0'>
            <AlertTriangle className='w-5 h-5' />
          </div>
          <div className='flex flex-col'>
            <span className='mb-1 font-bold'>Check your spam folder</span>
            <p className='text-[#3B82F6] text-xs'>
              If you don&apos;t see the email in your inbox, please check your
              spam or junk folder
            </p>
          </div>
        </div>

        <div className='font-medium text-gray-500 text-sm text-center'>
          Didn&apos;t receive the email?{" "}
          <Button
            variant='link'
            onClick={handleResend}
            className='p-0 h-auto font-bold text-primary hover:text-primary/80'
            disabled={isResending}
          >
            {isResending ? "Resending..." : "Resend verification email"}
          </Button>
        </div>

        <div className='text-center'>
          <Link
            href='/register'
            className='text-sm font-medium text-primary hover:underline'
          >
            Back to Signup
          </Link>
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
