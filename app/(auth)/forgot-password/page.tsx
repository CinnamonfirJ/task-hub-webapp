"use client";

import Link from "next/link";
import { useForgotPassword } from "@/hooks/usePasswordReset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export default function ForgotPasswordPage() {
  const { form, onSubmit, isSubmitting, isSuccess, error } = useForgotPassword();

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <Logo />
      </div>

      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex justify-center items-center bg-purple-50 mb-4 rounded-full w-16 h-16">
          <div className="flex justify-center items-center bg-white shadow-sm rounded-full w-12 h-12">
            <Mail className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
        <p className="text-muted-foreground text-sm text-center max-w-[300px]">
          No worries! Enter your email and we&apos;ll send you a reset code.
        </p>
      </div>

      <div className="space-y-6">
        {isSuccess ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
              <p className="font-semibold text-green-800 text-center">
                Reset code sent!
              </p>
              <p className="text-green-700 text-sm text-center">
                Check your email for a 5-digit reset code. It expires in 1 hour.
              </p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Redirecting to reset page...
            </p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {(error as Error).message || "An error occurred"}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="emailAddress">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="emailAddress"
                  type="email"
                  placeholder="you@example.domain"
                  className="pl-9 h-12 bg-gray-50/50"
                  {...form.register("emailAddress")}
                />
              </div>
              {form.formState.errors.emailAddress && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.emailAddress.message}
                </p>
              )}
            </div>

            {/* Role selection (hidden field, same as login) */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={form.watch("type") === "user" ? "default" : "outline"}
                className={`w-full ${
                  form.watch("type") === "user"
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-transparent border-input hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => form.setValue("type", "user")}
              >
                User
              </Button>
              <Button
                type="button"
                variant={form.watch("type") === "tasker" ? "default" : "outline"}
                className={`w-full ${
                  form.watch("type") === "tasker"
                    ? "bg-[#6B46C1] hover:bg-[#553C9A] text-white"
                    : "bg-transparent border-input hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => form.setValue("type", "tasker")}
              >
                Tasker
              </Button>
            </div>

            <Button
              className="w-full h-12 text-lg font-medium"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Code"}
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
