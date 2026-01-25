"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, Shield, ShieldCheck } from "lucide-react";
import { ProfileValues } from "@/hooks/useCompleteProfile";

interface ProfileCompletionStep2Props {
    form: UseFormReturn<ProfileValues>;
    handleVerify: () => void;
    setStep: (step: number) => void;
    isVerifying: boolean;
}

export function ProfileCompletionStep2({ form, handleVerify, setStep, isVerifying }: ProfileCompletionStep2Props) {
  const { register, formState: { errors } } = form;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-xl" 
            onClick={() => setStep(1)}
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Complete profile</h1>
          <p className="text-gray-500 text-sm">Step 2 of 2: Verification</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex justify-between items-center mb-10 px-4">
        <div className="flex items-center gap-3 opacity-50">
          <div className="w-10 h-10 rounded-full bg-[#6B46C1] text-white flex items-center justify-center font-bold">1</div>
          <div>
            <p className="text-sm font-bold text-gray-900">Profile Info</p>
            <p className="text-xs text-gray-500">Basic details</p>
          </div>
        </div>
        <div className="flex-1 border-t-2 border-[#6B46C1] mx-4 border-dashed" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#6B46C1] text-white flex items-center justify-center font-bold">2</div>
          <div>
            <p className="text-sm font-bold text-gray-900">Verification</p>
            <p className="text-xs text-gray-500">ID verification</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 space-y-8">
        <div>
            <h3 className="font-bold text-lg text-gray-900 mb-6">Provide your Details</h3>
            
            <div className="space-y-3">
              <Label htmlFor="nin">National Identification Number (NIN)</Label>
              <Input
                id="nin"
                {...register("nin")}
                className="bg-gray-100/50 border-0 h-14 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1]"
                placeholder="Enter NIN number"
                maxLength={11}
              />
              {errors.nin && <p className="text-red-500 text-xs">{errors.nin.message}</p>}
              <p className="text-xs text-gray-400">Your NIN is required for identifying verification</p>
            </div>

            <Button 
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full bg-[#D6BCFA] hover:bg-[#B794F4] text-white h-14 rounded-xl font-bold text-lg mt-6 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Verifiy"}
            </Button>
        </div>
      </div>
      
      {/* Information Box */}
      <div className="bg-[#E0F2FE] p-6 rounded-[2rem] mt-8">
        <div className="flex items-center gap-3 mb-4 text-[#0284C7]">
            <div className="bg-[#BAE6FD] p-2 rounded-lg">
                <Shield size={20} fill="currentColor" className="text-[#0284C7]" />
            </div>
            <h4 className="font-bold text-[#0284C7]">Why verify your identity?</h4>
        </div>
        
        <ul className="space-y-3">
            <li className="flex items-center gap-3 text-[#0EA5E9] text-sm font-medium">
                <div className="min-w-4 min-h-4 rounded-full border-2 border-[#0EA5E9]" />
                Build trust with clients and taskers
            </li>
            <li className="flex items-center gap-3 text-[#0EA5E9] text-sm font-medium">
                <div className="min-w-4 min-h-4 rounded-full border-2 border-[#0EA5E9]" />
                Access all platforms features
            </li>
            <li className="flex items-center gap-3 text-[#0EA5E9] text-sm font-medium">
                <div className="min-w-4 min-h-4 rounded-full border-2 border-[#0EA5E9]" />
                Increase your chances of getting hired
            </li>
            <li className="flex items-center gap-3 text-[#0EA5E9] text-sm font-medium">
                <div className="min-w-4 min-h-4 rounded-full border-2 border-[#0EA5E9]" />
                Secure your account
            </li>
        </ul>
      </div>
    </div>
  );
}
