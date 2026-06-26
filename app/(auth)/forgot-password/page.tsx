"use client";

import Link from "next/link";
import { useForgotPassword } from "@/hooks/usePasswordReset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Headset } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const { form, onSubmit, isSubmitting, isSuccess, error } = useForgotPassword();
  const router = useRouter();

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

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-semibold mb-2 text-[#111122]">Forgot Password?</h1>
        <p className="text-[#575762] text-[15px] max-w-[320px]">
          Enter your email address we will send you a reset link
        </p>
      </div>

      <div className="space-y-6">
        {isSuccess ? (
          <div className="flex flex-col items-start gap-1 bg-green-50/50 border border-green-100 rounded-xl p-5 mb-8">
            <h3 className="font-semibold text-green-700 text-base">
              Check your Email
            </h3>
            <p className="text-green-600/90 text-sm">
              A reset Link was sent to
            </p>
            <p className="text-green-600 font-medium text-sm">
              {form.getValues("emailAddress")}
            </p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {(error as Error).message || "An error occurred"}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="emailAddress" className="font-semibold text-gray-700">Email Addressss</Label>
              <div className="relative">
                <Input
                  id="emailAddress"
                  type="email"
                  placeholder="you@example.com"
                  className="h-12 border-gray-200 bg-white placeholder:text-gray-400"
                  {...form.register("emailAddress")}
                />
              </div>
              {form.formState.errors.emailAddress && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.emailAddress.message}
                </p>
              )}
            </div>

            {/* Role selection is hidden as per new design */}
            <input type="hidden" {...form.register("type")} value="user" />

            <Button
              className="w-full h-12 text-base font-semibold bg-[#6c48f2] hover:bg-[#5b3cce] text-white rounded-lg mt-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}

        <div className="text-center pt-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

