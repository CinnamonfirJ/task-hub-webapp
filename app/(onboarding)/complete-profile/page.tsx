"use client";

import { useCompleteProfile } from "@/hooks/useCompleteProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Upload,
  Link as LinkIcon,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { VerifyIdentityButton } from "@/components/VerifyIdentityButton";
import { NINManualSubmission } from "@/components/NINManualSubmission";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { NIGERIAN_STATES } from "@/utils/constants/nigeria-states";

export default function CompleteProfilePage() {
  const {
    user,
    isLoadingUser,
    step,
    setStep,
    form,
    handleNext,
    handlePictureUpload,
    isSubmitting,
    isProfileComplete,
  } = useCompleteProfile();
  const [verificationMode, setVerificationMode] = useState<"sdk" | "manual">(
    "sdk",
  );
  const router = useRouter();

  // Redirect if already complete
  useEffect(() => {
    if (isProfileComplete && !isLoadingUser) {
      router.replace("/profile");
    }
  }, [isProfileComplete, isLoadingUser, router]);

  if (isLoadingUser) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='w-8 h-8 text-[#6B46C1] animate-spin' />
      </div>
    );
  }

  const userInitials = user?.fullName
    ? user.fullName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePictureUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='flex flex-col bg-gray-50/20 mx-auto p-4 md:p-8 w-full max-w-7xl min-h-screen'>
      {/* Header with Back Button */}
      <div className='flex items-center gap-4 mx-auto mb-10 w-full max-w-7xl'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => step === 2 && setStep(1)}
          className={`bg-white border border-gray-100 text-gray-400 rounded-sm w-12 h-12 transition-colors hover:bg-gray-50 hover:text-gray-600 ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className='font-bold text-gray-900 text-2xl'>Complete profile</h1>
          <p className='text-gray-400 text-sm'>
            Step {step} of 2:{" "}
            {step === 1 ? "Profile Information" : "Verification"}
          </p>
        </div>
      </div>

      <div className='flex lg:flex-row flex-col gap-12 mx-auto w-full'>
        {/* Left Side: Step Indicators */}
        <div className='flex lg:flex-col gap-6 lg:gap-10 lg:w-1/3'>
          <div className='flex lg:flex-row flex-col items-start lg:items-center gap-6'>
            <div
              className={`w-12 h-12 rounded-sm flex items-center justify-center font-bold border-2 transition-all ${
                step >= 1
                  ? "bg-[#6B46C1] border-[#6B46C1] text-white"
                  : "bg-white border-gray-100 text-gray-400"
              }`}
            >
              1
            </div>
            <div className='text-left'>
              <p
                className={`font-bold text-[15px] uppercase tracking-wider ${step >= 1 ? "text-gray-900" : "text-gray-400"}`}
              >
                Profile Info
              </p>
              <p className='text-gray-400 text-xs font-medium'>Basic details</p>
            </div>
          </div>

          <div className='flex lg:flex-row flex-col items-start lg:items-center gap-6'>
            <div
              className={`w-12 h-12 rounded-sm flex items-center justify-center font-bold border-2 transition-all ${
                step >= 2
                  ? "bg-[#6B46C1] border-[#6B46C1] text-white"
                  : "bg-white border-gray-100 text-gray-400"
              }`}
            >
              2
            </div>
            <div className='text-left'>
              <p
                className={`font-bold text-[15px] uppercase tracking-wider ${step >= 2 ? "text-gray-900" : "text-gray-400"}`}
              >
                Verification
              </p>
              <p className='text-gray-400 text-xs font-medium'>ID verification</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className='space-y-8 pb-20 lg:w-2/3'>
          {step === 1 ? (
            <div className='space-y-8'>
              {/* Profile Image Section */}
              <div className='flex flex-col justify-center items-center space-y-3'>
                <div className='relative'>
                  <div className='flex justify-center items-center bg-[#6B46C1] border-2 border-white rounded-sm w-28 h-28 overflow-hidden font-bold text-white text-4xl active:scale-95 transition-transform shadow-none'>
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt='Profile'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <label className='right-[-10px] bottom-[-10px] absolute bg-white hover:bg-gray-50 p-2.5 border border-gray-100 rounded-sm cursor-pointer transition-colors shadow-none'>
                    <Camera size={18} className='text-[#6B46C1]' />
                    <input
                      type='file'
                      className='hidden'
                      accept='image/*'
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                </div>
                <p className='font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em] mt-2'>
                  Profile Image
                </p>
              </div>

              {/* Step 1 Form Cards */}
              <form
                onSubmit={form.handleSubmit(handleNext as any)}
                className='grid grid-cols-1 gap-8'
              >
                {/* Basic Information */}
                <Card className='bg-white border border-gray-100 rounded-sm overflow-hidden shadow-none'>
                  <CardHeader className='bg-white px-8 py-6 border-gray-50 border-b'>
                    <CardTitle className='font-bold text-lg text-gray-900'>
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6 p-8'>
                    <div className='grid grid-cols-2 gap-6'>
                      <div className='space-y-3'>
                        <Label className='font-bold text-gray-700 text-[13px] uppercase tracking-wider'>
                          First name
                        </Label>
                        <Input
                          {...form.register("firstName")}
                          className='bg-gray-100/50 px-4 border border-transparent rounded-sm focus-visible:ring-purple-400 focus:bg-white focus:border-purple-100 h-14 font-medium transition-all shadow-none'
                          placeholder='First name'
                        />
                        {form.formState.errors.firstName && (
                          <p className='px-1 font-medium text-red-500 text-[11px]'>
                            {form.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div className='space-y-3'>
                        <Label className='font-bold text-gray-700 text-[13px] uppercase tracking-wider'>
                          Last name
                        </Label>
                        <Input
                          {...form.register("lastName")}
                          className='bg-gray-100/50 px-4 border border-transparent rounded-sm focus-visible:ring-purple-400 focus:bg-white focus:border-purple-100 h-14 font-medium transition-all shadow-none'
                          placeholder='Last name'
                        />
                        {form.formState.errors.lastName && (
                          <p className='px-1 font-medium text-red-500 text-[11px]'>
                            {form.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-6'>
                      <div className='space-y-3'>
                        <Label className='font-bold text-gray-700 text-[13px] uppercase tracking-wider'>
                          Gender
                        </Label>
                        <select
                          {...form.register("gender")}
                          className='bg-gray-100/50 px-4 border border-transparent rounded-sm outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-purple-100 w-full h-14 text-sm appearance-none transition-all'
                        >
                          <option value='male'>Male</option>
                          <option value='female'>Female</option>
                        </select>
                        {form.formState.errors.gender && (
                          <p className='px-1 font-medium text-red-500 text-[11px]'>
                            {form.formState.errors.gender.message}
                          </p>
                        )}
                      </div>

                      <div className='space-y-3'>
                        <Label className='font-bold text-gray-700 text-[13px] uppercase tracking-wider'>
                          Phone number
                        </Label>
                        <Input
                          {...form.register("phoneNumber")}
                          className='bg-gray-100/50 px-4 border border-transparent rounded-sm focus-visible:ring-purple-400 focus:bg-white focus:border-purple-100 h-14 font-medium transition-all shadow-none'
                          placeholder='Enter phone number'
                        />
                        {form.formState.errors.phoneNumber && (
                          <p className='px-1 font-medium text-red-500 text-[11px]'>
                            {form.formState.errors.phoneNumber.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <Label className='font-bold text-gray-700 text-[13px] uppercase tracking-wider'>
                        Date of Birth
                      </Label>
                      <div className='relative'>
                        <Input
                          type='date'
                          {...form.register("dateOfBirth")}
                          className='bg-gray-100/50 px-4 border border-transparent rounded-sm focus-visible:ring-purple-400 focus:bg-white focus:border-purple-100 h-14 font-medium transition-all shadow-none'
                        />
                      </div>
                      {form.formState.errors.dateOfBirth && (
                        <p className='px-1 font-medium text-red-500 text-[11px]'>
                          {form.formState.errors.dateOfBirth.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card className='bg-white border border-gray-100 rounded-sm overflow-hidden shadow-none'>
                  <CardHeader className='bg-white px-8 py-6 border-gray-50 border-b'>
                    <CardTitle className='font-bold text-lg text-gray-900'>
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6 p-8'>
                    <div className='space-y-3'>
                      <Label className='font-bold text-gray-700 text-[13px] uppercase tracking-wider'>
                        Country
                      </Label>
                      <Input
                        {...form.register("country")}
                        className='bg-gray-100/50 px-4 border border-transparent rounded-sm focus-visible:ring-purple-400 h-14 transition-all opacity-80 shadow-none'
                        placeholder='Nigeria'
                        readOnly
                      />
                    </div>

                    <div className='space-y-3'>
                      <Label className='font-bold text-gray-700 text-[13px] uppercase tracking-wider'>
                        State of residence
                      </Label>
                      <SearchableSelect
                        options={NIGERIAN_STATES}
                        value={form.watch("residentState") || ""}
                        onValueChange={(value) =>
                          form.setValue("residentState", value, {
                            shouldValidate: true,
                          })
                        }
                        placeholder='Select State'
                        searchPlaceholder='Search state...'
                        error={!!form.formState.errors.residentState}
                      />
                      {form.formState.errors.residentState && (
                        <p className='px-1 font-medium text-red-500 text-[11px] mt-2'>
                          {form.formState.errors.residentState.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-3'>
                      <Label className='font-bold text-gray-700 text-[13px] uppercase tracking-wider'>
                        Home Address
                      </Label>
                      <Textarea
                        {...form.register("address")}
                        className='bg-gray-100/50 px-4 py-4 border border-transparent rounded-sm ring-0 focus-visible:ring-purple-400 ring-offset-white min-h-[120px] focus:bg-white focus:border-purple-100 transition-all shadow-none'
                        placeholder='Enter your full address'
                      />
                      {form.formState.errors.address && (
                        <p className='px-1 font-medium text-red-500 text-[11px] mt-2'>
                          {form.formState.errors.address.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Service Information - Taskers Only */}
                {user?.role === "tasker" && (
                  <Card className='bg-white border border-gray-100 rounded-sm overflow-hidden shadow-none'>
                    <CardHeader className='bg-white px-8 py-6 border-gray-50 border-b'>
                      <CardTitle className='font-bold text-lg text-gray-900'>
                        Service Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6 p-8'>
                      <div className='space-y-2'>
                        <Label className='font-bold text-gray-900 text-sm'>
                          Previous work
                        </Label>
                        <p className='mb-4 font-medium text-[11px] text-gray-400'>
                          Upload images showcasing previous work
                        </p>
                        <div className='group flex flex-col justify-center items-center space-y-3 hover:bg-gray-50 p-10 border border-gray-100 border-dashed rounded-sm transition-colors cursor-pointer'>
                          <Upload
                            size={20}
                            className='text-gray-400 group-hover:text-[#6B46C1] transition-colors'
                          />
                          <span className='font-bold text-gray-400 text-[11px] uppercase tracking-wider'>
                            Upload Images
                          </span>
                        </div>
                      </div>

                      <div className='space-y-3 pt-4'>
                        <Label className='font-bold text-gray-700 text-[13px] uppercase tracking-wider'>
                          Website or portfolio Link (Optional)
                        </Label>
                        <div className='relative'>
                          <LinkIcon
                            size={18}
                            className='top-1/2 left-4 absolute text-gray-400 -translate-y-1/2'
                          />
                          <Input
                            {...form.register("portfolioLink")}
                            className='bg-gray-100/50 pr-4 pl-12 border border-transparent rounded-sm focus-visible:ring-purple-400 focus:bg-white focus:border-purple-100 h-14 transition-all shadow-none'
                            placeholder='https://yourportfolio.com'
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-[#6B46C1] hover:bg-[#553C9A] h-14 rounded-sm w-full font-bold text-sm uppercase tracking-widest transition-all shadow-none'
                >
                  {isSubmitting ? (
                    <Loader2 className='mr-2 w-5 h-5 animate-spin' />
                  ) : null}
                  Continue to Verification
                </Button>
              </form>
            </div>
          ) : (
            <div className='slide-in-from-right-4 space-y-8 animate-in duration-500 fade-in'>
              <div className='grid lg:grid-cols-5 gap-8'>
                <div className='lg:col-span-3 space-y-6'>
                  <div className='bg-white border border-gray-100 rounded-sm p-8 space-y-10'>
                    <div>
                      <h2 className='font-bold text-2xl text-gray-900 tracking-tight'>
                        Identity Verification
                      </h2>
                      <p className='text-gray-400 text-[13px] font-medium uppercase tracking-wider mt-1.5'>
                        Official ID Verification
                      </p>
                    </div>

                    <div className='space-y-6'>
                      <p className='text-gray-600 text-[15px] leading-relaxed font-medium'>
                        Please enter your 11-digit National Identification
                        Number (NIN) for verification.
                      </p>

                      <AnimatePresence mode='wait'>
                        {verificationMode === "sdk" ? (
                          <div key='sdk-view' className='space-y-6'>
                            <Button
                              onClick={() => setVerificationMode("manual")}
                              className='bg-gray-100 hover:bg-gray-200 text-gray-900 shadow-none h-14 rounded-sm w-full font-bold text-sm uppercase tracking-widest transition-all border-none'
                            >
                              Enter 11-digit NIN
                            </Button>

                            <div className='relative py-2'>
                              <div className='absolute inset-0 flex items-center'>
                                <span className='w-full border-t border-gray-100'></span>
                              </div>
                              <div className='relative flex justify-center text-[10px] uppercase font-bold text-gray-300'>
                                <span className='bg-white px-4 tracking-[0.2em]'>
                                  OR
                                </span>
                              </div>
                            </div>

                            <VerifyIdentityButton
                              userId={user?._id}
                              className='bg-[#6B46C1] hover:bg-[#553C9A] h-14 rounded-sm w-full font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-none'
                            />
                            <p className='text-center text-[11px] text-gray-400 font-medium'>
                              Upload Document (Passport, Drivers License, etc.)
                            </p>
                          </div>
                        ) : (
                          <NINManualSubmission
                            key='manual-card'
                            onCancel={() => setVerificationMode("sdk")}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className='lg:col-span-2'>
                  <div className='bg-purple-50/30 border border-purple-100/20 rounded-sm p-10 space-y-8'>
                    <h3 className='font-bold text-gray-900 text-lg tracking-tight'>
                      Why verify your identity?
                    </h3>
                    <ul className='space-y-6'>
                      {[
                        "Build trust with clients and taskers",
                        "Access all platforms features",
                        "Increase your chances of getting hired",
                        "Secure your account",
                      ].map((benefit, i) => (
                        <li key={i} className='flex items-start gap-4'>
                          <div className='mt-0.5 bg-white p-1 rounded-sm shadow-none border border-green-50 text-green-500 shrink-0'>
                            <ShieldCheck
                              size={14}
                              fill='currentColor'
                              className='text-white fill-green-500'
                            />
                          </div>
                          <span className='text-[13px] text-gray-600 font-medium leading-relaxed'>
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
