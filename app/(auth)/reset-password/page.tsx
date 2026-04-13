"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/usePasswordReset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, KeyRound, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useState, Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "user";

  const { form, onSubmit, isSubmitting, isSuccess, error } = useResetPassword(email, type);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <Logo />
      </div>

      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex justify-center items-center bg-purple-50 mb-4 rounded-full w-16 h-16">
          <div className="flex justify-center items-center bg-white shadow-sm rounded-full w-12 h-12">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
        <p className="text-muted-foreground text-sm text-center max-w-[300px]">
          Enter the 5-digit code from your email and choose a new password.
        </p>
      </div>

      <div className="space-y-6">
        {isSuccess ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
              <p className="font-semibold text-green-800 text-center">
                Password reset successful!
              </p>
              <p className="text-green-700 text-sm text-center">
                You can now log in with your new password.
              </p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {(error as Error).message || "An error occurred"}
                </AlertDescription>
              </Alert>
            )}

            {/* Hidden email field (pre-filled from URL) */}
            <input type="hidden" {...form.register("emailAddress")} />
            <input type="hidden" {...form.register("type")} />

            {/* Reset Code */}
            <div className="space-y-2">
              <Label htmlFor="code" className="font-semibold text-gray-700 text-sm">
                Reset Code
              </Label>
              <Input
                id="code"
                placeholder="Enter 5-digit code"
                className="bg-gray-50/50 border-gray-200 h-12 font-bold text-lg text-center tracking-widest"
                maxLength={5}
                autoComplete="one-time-code"
                {...form.register("code")}
              />
              {form.formState.errors.code && (
                <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="pl-9 pr-10 h-12 bg-gray-50/50"
                  autoComplete="new-password"
                  {...form.register("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.newPassword && (
                <p className="text-sm text-red-500">{form.formState.errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="pl-9 pr-10 h-12 bg-gray-50/50"
                  autoComplete="new-password"
                  {...form.register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              className="w-full h-12 text-lg font-medium"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
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
