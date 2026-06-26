"use client";

import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Eye, EyeOff, ArrowLeft, Headset } from "lucide-react";
import { useState } from "react";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { form, role, setRole, onSubmit, isLoggingIn, loginError } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  if (step === 1) {
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

        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold font-bold mb-2">Welcome</h1>
          <p className="text-muted-foreground">Select your account type to continue</p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              setRole("user");
              setStep(2);
            }}
            className="w-full h-16 flex items-center justify-center rounded-xl border-2 border-gray-100 bg-white hover:border-primary/50 hover:bg-gray-50 transition-all font-bold text-lg"
          >
            Login as User
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("tasker");
              setStep(2);
            }}
            className="w-full h-16 flex items-center justify-center rounded-xl border-2 border-gray-100 bg-white hover:border-primary/50 hover:bg-gray-50 transition-all font-bold text-lg"
          >
            Login as Tasker
          </button>
        </div>

        <div className="mt-12 text-center text-muted-foreground text-sm">
          Do not have an Account?{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto pt-6 px-4">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-12">
        <button
          onClick={() => setStep(1)}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </button>
        <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <Headset className="h-4 w-4 mr-2" /> Support
        </button>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold mb-2">Welcome back</h1>
        <p className="text-muted-foreground">
          Sign into your account
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {loginError && (
            <Alert variant="destructive">
              <AlertDescription>
                {(loginError as Error).message || "An error occurred during login"}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-gray-700">Email Addressss</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 border-gray-200 bg-white placeholder:text-gray-400"
                aria-invalid={!!form.formState.errors.email}
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-xs font-semibold text-red-500 mt-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold text-gray-700">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="pr-10 h-12 border-gray-200 bg-white placeholder:text-gray-400"
                aria-invalid={!!form.formState.errors.password}
                {...form.register("password")}
              />

              {/* Eye toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-xs font-semibold text-red-500 mt-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-1">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline font-semibold"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            className="w-full h-12 text-base font-semibold bg-[#6c48f2] hover:bg-[#5b3cce] text-white rounded-lg mt-2"
            type="submit"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-4 text-gray-400 bg-white">or</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <GoogleSignInButton role={role} />

          <button
            type="button"
            className="w-full h-12 flex items-center justify-center gap-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.641-.026 2.669-1.48 3.666-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.68.727-1.35 2.158-1.165 3.522 1.346.104 2.61-.714 3.452-1.51z" />
            </svg>
            Continue with Apple
          </button>
        </div>
      </div>
    </div>
  );
}
