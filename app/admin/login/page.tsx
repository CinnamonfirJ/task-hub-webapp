"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Logo } from "@/components/layout/Logo";
import { useAdminLogin } from "@/hooks/useAdmin";
import Link from "next/link";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid admin email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useAdminLogin();

  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: AdminLoginValues) => {
    login(data, {
      onSuccess: () => {
        router.push("/admin/dashboard");
      },
    });
  };

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
                Admin Access
              </h1>
              <p className='text-xs text-purple-100 mt-1'>
                Authorized personnel only
              </p>
            </div>
            <Shield size={32} className='opacity-20' />
          </div>

          <div className='p-8'>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {error && (
                <Alert
                  variant='destructive'
                  className='bg-red-50 border-red-100 text-red-600'
                >
                  <AlertCircle size={18} className='mr-2' />
                  <AlertDescription>
                    {(error as Error).message ||
                      "Authentication failed. Please check your credentials."}
                  </AlertDescription>
                </Alert>
              )}

              <div className='space-y-2'>
                <Label
                  htmlFor='email'
                  className='text-xs font-bold text-gray-400 uppercase tracking-widest'
                >
                  Admin Email
                </Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='admin@taskhub.com'
                    className='pl-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-[#6B46C1]'
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className='text-[10px] font-bold text-red-500 mt-1 uppercase'>
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='password'
                  className='text-xs font-bold text-gray-400 uppercase tracking-widest'
                >
                  Password
                </Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                  <Input
                    id='password'
                    type={showPassword ? "text" : "password"}
                    placeholder='••••••••'
                    className='pl-10 pr-10 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-[#6B46C1]'
                    {...form.register("password")}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6B46C1]'
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className='text-[10px] font-bold text-red-500 mt-1 uppercase'>
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                className='w-full h-12 bg-[#6B46C1] hover:bg-[#553C9A] text-white rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-purple-200 transition-all active:scale-95 disabled:opacity-70'
                type='submit'
                disabled={isPending}
              >
                {isPending ? (
                  <div className='flex items-center gap-2'>
                    <Loader2 size={18} className='animate-spin' />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Authenticate"
                )}
              </Button>
            </form>

            <div className='mt-8 pt-6 border-t border-gray-50 text-center'>
              <p className='text-xs text-gray-400'>
                Facing issues? Contact{" "}
                <span className='font-bold text-[#6B46C1]'>
                  System Infrastructure
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className='mt-8 text-center'>
          <Link
            href='/'
            className='text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest'
          >
            Back to main platform
          </Link>
        </div>
      </div>
    </div>
  );
}
