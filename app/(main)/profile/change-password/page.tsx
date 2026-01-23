"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Info, 
  Lock, 
  Eye, 
  EyeOff, 
  Clock, 
  CheckCircle2, 
  Circle,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authApi } from "@/lib/api/auth";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    try {
      setIsSubmitting(true);
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      // Handle success (toast, redirect, etc.)
      router.push("/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const newPasswordValue = form.watch("newPassword") || "";
  const currentPasswordValue = form.watch("currentPassword") || "";

  const requirements = [
    { label: "At least 8 characters long", met: newPasswordValue.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(newPasswordValue) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(newPasswordValue) },
    { label: "Contains number", met: /[0-9]/.test(newPasswordValue) },
    { label: "Different from current password", met: newPasswordValue !== "" && newPasswordValue !== currentPasswordValue },
  ];

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="bg-white border text-gray-400 rounded-xl w-12 h-12"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
      </div>

      {/* Intro Icon & Text */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-purple-50 p-6 rounded-full">
           <Info className="text-[#6B46C1] w-10 h-10" />
        </div>
        <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Change Your Password</h2>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                Please enter your current password and choose a new secure password.
            </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Current password</Label>
                <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                        type={showCurrent ? "text" : "password"}
                        {...form.register("currentPassword")}
                        className="bg-gray-50 border-none h-14 rounded-xl pl-12 pr-12 focus-visible:ring-purple-400"
                        placeholder="Current password"
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {form.formState.errors.currentPassword && <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.currentPassword.message}</p>}
            </div>

            {/* New Password */}
            <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">New password</Label>
                <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                        type={showNew ? "text" : "password"}
                        {...form.register("newPassword")}
                        className="bg-gray-50 border-none h-14 rounded-xl pl-12 pr-12 focus-visible:ring-purple-400"
                        placeholder="New password"
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {form.formState.errors.newPassword && <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.newPassword.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Confirm new password</Label>
                <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                        type={showConfirm ? "text" : "password"}
                        {...form.register("confirmPassword")}
                        className="bg-gray-50 border-none h-14 rounded-xl pl-12 pr-12 focus-visible:ring-purple-400"
                        placeholder="New password"
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {form.formState.errors.confirmPassword && <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.confirmPassword.message}</p>}
            </div>
        </div>

        {/* Requirements */}
        <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100/50 space-y-4">
            <div className="flex items-center gap-3 text-blue-600 mb-2">
                <Clock size={18} />
                <span className="font-bold text-sm">Password Requirement</span>
            </div>
            <div className="space-y-3">
                {requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                        {req.met ? (
                            <CheckCircle2 size={16} className="text-blue-500" />
                        ) : (
                            <Circle size={16} className="text-blue-300" />
                        )}
                        <span className={`text-sm font-medium ${req.met ? "text-blue-600" : "text-blue-400"}`}>{req.label}</span>
                    </div>
                ))}
            </div>
        </div>

        <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#6B46C1] hover:bg-[#553C9A] py-8 text-sm font-bold rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-[0.99]"
        >
            {isSubmitting ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
            Change password
        </Button>
      </form>
    </div>
  );
}
