"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/usePasswordReset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Eye, EyeOff, Headset, BadgeCheck } from "lucide-react";
import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "user";
  const code = searchParams.get("code") || "";
  const router = useRouter();

  const { form, onSubmit, isSubmitting, isSuccess, error } = useResetPassword(email, type);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Auto-fill the code from URL if present
  useEffect(() => {
    if (code) {
      form.setValue("code", code);
    }
  }, [code, form]);

  return (
    <div className="w-full max-w-md mx-auto pt-6 px-4">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-16">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </button>
        <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <Headset className="h-4 w-4 mr-2" /> Support
        </button>
      </div>

      <div className="space-y-6">
        {isSuccess ? (
          <div className="flex flex-col items-center pt-8 space-y-6">
            <div className="w-24 h-24 bg-green-500 rounded-[2rem] rotate-3 flex items-center justify-center mb-2 shadow-sm">
              <div className="-rotate-3">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-bold">Password changed</h1>
              <p className="text-muted-foreground text-[15px]">
                You can now continue to dashboard
              </p>
            </div>
            
            <Button
              onClick={() => router.push("/login")}
              className="w-full h-12 text-base font-semibold bg-[#6c48f2] hover:bg-[#5b3cce] text-white rounded-lg"
            >
              Continue
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-10">
              <h1 className="text-3xl font-semibold mb-2">Create Password</h1>
              <p className="text-muted-foreground text-[15px]">
                Enter a new password to complete
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {(error as Error).message || "An error occurred"}
                  </AlertDescription>
                </Alert>
              )}

              {/* Hidden fields */}
              <input type="hidden" {...form.register("emailAddress")} />
              <input type="hidden" {...form.register("type")} />
              <input type="hidden" {...form.register("code")} />

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="font-semibold text-gray-700">New password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pr-10 h-12 border-gray-200 bg-white placeholder:text-gray-400"
                    autoComplete="new-password"
                    {...form.register("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {form.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">{form.formState.errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-semibold text-gray-700">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="pr-10 h-12 border-gray-200 bg-white placeholder:text-gray-400"
                    autoComplete="new-password"
                    {...form.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                className="w-full h-12 text-base font-semibold bg-[#6c48f2] hover:bg-[#5b3cce] text-white rounded-lg mt-8"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

