"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Logo } from "@/components/layout/Logo";
import { useSetupAdmin } from "@/hooks/useAdmin";
import Link from "next/link";

const setupAdminSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SetupAdminValues = z.infer<typeof setupAdminSchema>;

// Inner component uses useSearchParams — must be wrapped in Suspense
function AdminSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: setupAccount, isPending, error } = useSetupAdmin();

  const form = useForm<SetupAdminValues>({
    resolver: zodResolver(setupAdminSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      // If no token is provided, the API will reject submission anyway
    }
  }, [token]);

  const onSubmit = (data: SetupAdminValues) => {
    if (!token) return;

    setupAccount({
      token,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/admin/login");
        }, 3000);
      },
    });
  };

  if (!token) {
    return (
      <div className='min-h-screen w-full flex flex-col items-center justify-center bg-[#F9FAFB] p-4 text-center'>
        <div className='w-full max-w-md'>
          <div className='flex justify-center mb-8'>
            <Logo />
          </div>
          <div className='bg-white p-8 rounded-2xl shadow-xl border border-gray-100'>
            <div className='flex justify-center mb-4'>
              <AlertCircle size={48} className='text-red-500' />
            </div>
            <h1 className='text-xl font-bold text-gray-900 mb-2 uppercase tracking-tight'>
              Invalid Access Link
            </h1>
            <p className='text-gray-500 text-sm mb-6'>
              This account setup link is missing its security token. Please check the link sent to your email.
            </p>
            <Link href='/admin/login'>
              <Button className='w-full bg-[#6B46C1] hover:bg-[#553C9A]'>
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className='min-h-screen w-full flex flex-col items-center justify-center bg-[#F9FAFB] p-4 text-center'>
        <div className='w-full max-w-md'>
          <div className='flex justify-center mb-8'>
            <Logo />
          </div>
          <div className='bg-white p-8 rounded-2xl shadow-xl border border-gray-100'>
            <div className='flex justify-center mb-4'>
              <CheckCircle2 size={48} className='text-green-500 animate-bounce' />
            </div>
            <h1 className='text-xl font-bold text-gray-900 mb-2 uppercase tracking-tight'>
              Account Secured
            </h1>
            <p className='text-gray-500 text-sm mb-6'>
              Your administrator account has been successfully set up. You will be redirected to the login page momentarily.
            </p>
            <div className='flex items-center justify-center gap-2 text-xs font-bold text-[#6B46C1] uppercase tracking-widest'>
              <Loader2 size={14} className='animate-spin' />
              <span>Redirecting...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center bg-[#F9FAFB] p-4'>
      <div className='w-full max-w-md'>
        <div className='flex justify-center mb-8'>
          <Logo />
        </div>

        <div className='bg-white rounded-2xl shadow-xl shadow-purple-100/50 border border-gray-100 overflow-hidden'>
          <div className='bg-linear-to-r from-[#6B46C1] to-[#805AD5] p-6 text-white flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-bold italic tracking-tight uppercase'>
                Complete Setup
              </h1>
              <p className='text-xs text-purple-100 mt-1'>
                Activate your administrator credentials
              </p>
            </div>
            <Shield size={32} className='opacity-20' />
          </div>

          <div className='p-8'>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
              {error && (
                <Alert
                  variant='destructive'
                  className='bg-red-50 border-red-100 text-red-600'
                >
                  <AlertCircle size={18} className='mr-2' />
                  <AlertDescription>
                    {(error as Error).message ||
                      "Verification failed. Your link may have expired."}
                  </AlertDescription>
                </Alert>
              )}

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='firstName'
                    className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'
                  >
                    First Name
                  </Label>
                  <div className='relative'>
                    <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <Input
                      id='firstName'
                      placeholder='John'
                      className='pl-10 h-11 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-[#6B46C1]'
                      {...form.register("firstName")}
                    />
                  </div>
                  {form.formState.errors.firstName && (
                    <p className='text-[10px] font-bold text-red-500 mt-1 uppercase'>
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='lastName'
                    className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'
                  >
                    Last Name
                  </Label>
                  <div className='relative'>
                    <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <Input
                      id='lastName'
                      placeholder='Doe'
                      className='pl-10 h-11 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-[#6B46C1]'
                      {...form.register("lastName")}
                    />
                  </div>
                  {form.formState.errors.lastName && (
                    <p className='text-[10px] font-bold text-red-500 mt-1 uppercase'>
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='password'
                  className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'
                >
                  Create Password
                </Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <Input
                    id='password'
                    type={showPassword ? "text" : "password"}
                    placeholder='••••••••'
                    className='pl-10 pr-10 h-11 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-[#6B46C1]'
                    {...form.register("password")}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6B46C1]'
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className='text-[10px] font-bold text-red-500 mt-1 uppercase'>
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='confirmPassword'
                  className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'
                >
                  Confirm Password
                </Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <Input
                    id='confirmPassword'
                    type={showPassword ? "text" : "password"}
                    placeholder='••••••••'
                    className='pl-10 pr-10 h-11 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-[#6B46C1]'
                    {...form.register("confirmPassword")}
                  />
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className='text-[10px] font-bold text-red-500 mt-1 uppercase'>
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                className='w-full h-11 bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-purple-200 transition-all active:scale-95 disabled:opacity-70 mt-2'
                type='submit'
                disabled={isPending}
              >
                {isPending ? (
                  <div className='flex items-center gap-2'>
                    <Loader2 size={16} className='animate-spin' />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Secure My Account"
                )}
              </Button>
            </form>

            <div className='mt-8 pt-6 border-t border-gray-50 text-center'>
              <p className='text-[10px] text-gray-400 uppercase tracking-widest'>
                Invitation for security token: <span className='text-gray-900'>{token.substring(0, 8)}...</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SetupPageFallback() {
  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center bg-[#F9FAFB] p-4'>
      <div className='flex flex-col items-center gap-4'>
        <Loader2 className='h-8 w-8 animate-spin text-[#6B46C1]' />
        <p className='text-gray-500 text-sm font-medium'>Loading setup page...</p>
      </div>
    </div>
  );
}

// Outer page wraps the content (which uses useSearchParams) in Suspense
// Required by Next.js for SSG builds
export default function AdminSetupPage() {
  return (
    <Suspense fallback={<SetupPageFallback />}>
      <AdminSetupContent />
    </Suspense>
  );
}
