"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Camera, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ProfileValues } from "@/hooks/useCompleteProfile";

interface ProfileCompletionStep1Props {
    form: UseFormReturn<ProfileValues>;
    handleNext: (data: ProfileValues) => void;
    handlePictureUpload: (base64: string) => void;
    user: any;
}

export function ProfileCompletionStep1({ form, handleNext, handlePictureUpload, user }: ProfileCompletionStep1Props) {
  const { register, handleSubmit, formState: { errors, isValid } } = form;
  const [activeField, setActiveField] = useState<string | null>(null);

  const onSubmit = (data: any) => {
    handleNext(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handlePictureUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl" onClick={() => window.history.back()}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Complete profile</h1>
          <p className="text-gray-500 text-sm">Step 1 of 2: Profile Information</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex justify-between items-center mb-10 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#6B46C1] text-white flex items-center justify-center font-bold">1</div>
          <div>
            <p className="text-sm font-bold text-gray-900">Profile Info</p>
            <p className="text-xs text-gray-500">Basic details</p>
          </div>
        </div>
        <div className="flex-1 border-t-2 border-gray-100 mx-4 border-dashed" />
        <div className="flex items-center gap-3 opacity-50">
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold">2</div>
          <div>
            <p className="text-sm font-bold text-gray-900">Verification</p>
            <p className="text-xs text-gray-500">ID verification</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Profile Image */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-[#6B46C1] flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-4 border-white shadow-lg">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.[0] || "U"
              )}
            </div>
            <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md text-[#6B46C1] cursor-pointer hover:bg-gray-50 transition-colors">
              <Camera size={16} />
              <input 
                id="profile-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
            </label>
          </div>
          <p className="text-sm font-medium text-gray-500">Upload profile image</p>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-3xl space-y-6 shadow-sm border border-gray-50">
          <h3 className="font-bold text-gray-900">Basic Information</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <div className="relative">
                <Input
                  id="fullName"
                  {...register("fullName")}
                  className="bg-gray-100/50 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1]"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone number</Label>
              <Input
                id="phoneNumber"
                 {...register("phoneNumber")}
                className="bg-gray-100/50 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1]"
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <div className="relative">
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                  className="bg-gray-100/50 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] pr-10"
                />
              </div>
              {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth.message}</p>}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-6 rounded-3xl space-y-6 shadow-sm border border-gray-50">
          <h3 className="font-bold text-gray-900">Location</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register("country")}
                className="bg-gray-100/50 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1]"
                placeholder="Select country"
                readOnly // Simulating select for now or keep text if not strict
              />
              {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="residentState">State of residence</Label>
              <Input
                id="residentState"
                {...register("residentState")}
                className="bg-gray-100/50 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1]"
                placeholder="Select your state of residence"
              />
              {errors.residentState && <p className="text-red-500 text-xs">{errors.residentState.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Home Address</Label>
              <Input
                id="address"
                {...register("address")}
                className="bg-gray-100/50 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1]"
                placeholder="Enter your full address"
              />
              {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
            </div>
          </div>
        </div>

        <Button 
            type="submit" 
            className="w-full bg-[#6B46C1] hover:bg-[#553C9A] text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-purple-200"
        >
          Continue to Verification
        </Button>
      </form>
    </div>
  );
}
