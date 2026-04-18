"use client";

import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useState } from "react";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export default function LoginPage() {
  const { form, role, setRole, onSubmit, isLoggingIn, loginError } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='w-full max-w-md mx-auto'>
      <div className='flex justify-center mb-6'>
        <Logo />
      </div>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Welcome back</h1>
        <p className='text-muted-foreground'>
          Sign in to manage your {role === "tasker" ? "Work" : "Tasks"}
        </p>
      </div>

      <div className='space-y-6'>
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <Button
            type='button'
            variant={role === "user" ? "default" : "outline"}
            className={`w-full ${role === "user" ? "bg-primary hover:bg-primary/90" : "bg-transparent border-input hover:bg-accent hover:text-accent-foreground"}`}
            onClick={() => setRole("user")}
          >
            User
          </Button>
          <Button
            type='button'
            variant={role === "tasker" ? "default" : "outline"}
            className={`w-full ${role === "tasker" ? "bg-[#6B46C1] hover:bg-[#553C9A] text-white" : "bg-transparent border-input hover:bg-accent hover:text-accent-foreground"}`}
            onClick={() => setRole("tasker")}
          >
            Tasker
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {loginError && (
            <Alert variant='destructive'>
              <AlertDescription>
                {(loginError as Error).message ||
                  "An error occurred during login"}
              </AlertDescription>
            </Alert>
          )}

          <div className='space-y-2'>
            <Label htmlFor='email'>Email Address</Label>
            <div className='relative'>
              <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                id='email'
                type='email'
                placeholder='you@example.domain'
                className='pl-9 h-12 bg-gray-50/50'
                aria-invalid={!!form.formState.errors.email}
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <p className='text-xs font-semibold text-red-500 mt-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1'>
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              {/* Left lock icon */}
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />

              <Input
                id='password'
                type={showPassword ? "text" : "password"}
                placeholder='Enter your password'
                className='pl-9 pr-10 h-12 bg-gray-50/50'
                aria-invalid={!!form.formState.errors.password}
                {...form.register("password")}
              />

              {/* Eye toggle button */}
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className='text-xs font-semibold text-red-500 mt-1 transition-all duration-200 animate-in fade-in slide-in-from-top-1'>
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className='flex justify-end'>
            <Link
              href='/forgot-password'
              className='text-sm text-primary hover:underline font-semibold'
            >
              Forgot password?
            </Link>
          </div>

          <Button
            className='w-full h-12 text-lg font-medium'
            type='submit'
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>OR</span>
          </div>
        </div>

        <div className='flex justify-center'>
          <GoogleSignInButton role={role} />
        </div>

      </div>

      <div className='mt-8 text-center text-muted-foreground'>
        Do not have an Account ?{" "}
        <Link
          href='/register'
          className='text-primary font-semibold hover:underline'
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
