"use client";

import { useCompleteProfile } from "@/hooks/useCompleteProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Upload,
  Link as LinkIcon,
  Loader2,
  FileText,
  Hash,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { VerifyIdentityButton } from "@/components/VerifyIdentityButton";
import { NINManualSubmission } from "@/components/NINManualSubmission";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
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
  // Which verification method is selected in Step 2
  const [selectedMethod, setSelectedMethod] = useState<
    "document" | "nin" | null
  >(null);
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
    <div className='p-4 md:p-8 max-w-3xl mx-auto'>
      {/* ── Header ── */}
      <div className='flex items-center gap-3 mb-6'>
        <button
          type='button'
          onClick={() => step === 2 && setStep(1)}
          className={`flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-gray-500 ${
            step === 1 ? "opacity-0 pointer-events-none" : ""
          }`}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className='font-bold text-gray-900 text-xl leading-tight'>
            Complete profile
          </h1>
          <p className='text-gray-400 text-sm'>
            Step {step} of 2:{" "}
            {step === 1 ? "Profile Information" : "Verification"}
          </p>
        </div>
      </div>

      {/* ── Horizontal Stepper ── */}
      <div className='flex items-center gap-4 mb-8'>
        {/* Step 1 */}
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full bg-[#6B46C1] text-white flex items-center justify-center font-bold text-sm shrink-0'>
            1
          </div>
          <div>
            <p className='text-sm font-bold text-gray-900 leading-tight'>
              Profile Info
            </p>
            <p className='text-xs text-gray-400'>Basic details</p>
          </div>
        </div>

        {/* Connector */}
        <div className='flex-1 border-t-2 border-dashed border-gray-200' />

        {/* Step 2 */}
        <div className='flex items-center gap-3'>
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
              step >= 2
                ? "bg-[#6B46C1] text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            2
          </div>
          <div>
            <p
              className={`text-sm font-bold leading-tight ${
                step >= 2 ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Verification
            </p>
            <p className='text-xs text-gray-400'>ID verification</p>
          </div>
        </div>
      </div>

      {/* ── Step Content ── */}
      {step === 1 ? (
        <div className='space-y-6'>
          {/* Profile Image */}
          <div className='flex flex-col items-center gap-2'>
            <label className='relative cursor-pointer group'>
              <div className='w-20 h-20 rounded-full bg-[#6B46C1] flex items-center justify-center text-white text-2xl font-bold overflow-hidden border-4 border-white shadow-md'>
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
              <span className='absolute bottom-0 right-0 bg-white border border-gray-100 rounded-full p-1.5 shadow-sm group-hover:bg-gray-50 transition-colors'>
                <Camera size={13} className='text-[#6B46C1]' />
              </span>
              <input
                type='file'
                className='hidden'
                accept='image/*'
                onChange={handleProfilePictureChange}
              />
            </label>
            <p className='text-sm text-gray-500 font-medium'>
              Upload profile image
            </p>
          </div>

          {/* Step 1 Form */}
          <form
            onSubmit={form.handleSubmit(handleNext as any)}
            className='space-y-5'
          >
            {/* Basic Information */}
            <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-50'>
                <h3 className='font-bold text-gray-900 text-base'>
                  Basic Information
                </h3>
              </div>
              <div className='p-6 space-y-5'>
                {/* Full name shown as single label but backed by firstName + lastName */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <Label className='text-sm text-gray-700 font-medium'>
                      First name
                    </Label>
                    <Input
                      {...form.register("firstName")}
                      className='bg-gray-100/60 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] shadow-none'
                      placeholder='First name'
                    />
                    {form.formState.errors.firstName && (
                      <p className='text-red-500 text-xs'>
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-1.5'>
                    <Label className='text-sm text-gray-700 font-medium'>
                      Last name
                    </Label>
                    <Input
                      {...form.register("lastName")}
                      className='bg-gray-100/60 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] shadow-none'
                      placeholder='Last name'
                    />
                    {form.formState.errors.lastName && (
                      <p className='text-red-500 text-xs'>
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-sm text-gray-700 font-medium'>
                    Phone number
                  </Label>
                  <Input
                    {...form.register("phoneNumber")}
                    className='bg-gray-100/60 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] shadow-none'
                    placeholder='Enter phone number'
                  />
                  {form.formState.errors.phoneNumber && (
                    <p className='text-red-500 text-xs'>
                      {form.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-sm text-gray-700 font-medium'>
                    Date of Birth
                  </Label>
                  <Input
                    type='date'
                    {...form.register("dateOfBirth")}
                    className='bg-gray-100/60 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] shadow-none'
                    placeholder='Select date of Birth'
                  />
                  {form.formState.errors.dateOfBirth && (
                    <p className='text-red-500 text-xs'>
                      {form.formState.errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-50'>
                <h3 className='font-bold text-gray-900 text-base'>Location</h3>
              </div>
              <div className='p-6 space-y-5'>
                <div className='space-y-1.5'>
                  <Label className='text-sm text-gray-700 font-medium'>
                    Country
                  </Label>
                  <Input
                    {...form.register("country")}
                    className='bg-gray-100/60 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] shadow-none opacity-80'
                    placeholder='Nigeria'
                    readOnly
                  />
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-sm text-gray-700 font-medium'>
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
                    placeholder='Select your state of residence'
                    searchPlaceholder='Search state...'
                    error={!!form.formState.errors.residentState}
                  />
                  {form.formState.errors.residentState && (
                    <p className='text-red-500 text-xs mt-1'>
                      {form.formState.errors.residentState.message}
                    </p>
                  )}
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-sm text-gray-700 font-medium'>
                    Home Address
                  </Label>
                  <Textarea
                    {...form.register("address")}
                    className='bg-gray-100/60 border-0 rounded-xl ring-0 focus-visible:ring-1 focus-visible:ring-[#6B46C1] min-h-[100px] shadow-none resize-none'
                    placeholder='Enter your full address'
                  />
                  {form.formState.errors.address && (
                    <p className='text-red-500 text-xs mt-1'>
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Service Information Taskers Only */}
            {user?.role === "tasker" && (
              <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
                <div className='px-6 py-4 border-b border-gray-50'>
                  <h3 className='font-bold text-gray-900 text-base'>
                    Service Information
                  </h3>
                </div>
                <div className='p-6 space-y-5'>
                  <div className='space-y-1.5'>
                    <Label className='text-sm text-gray-900 font-semibold'>
                      Previous work
                    </Label>
                    <p className='text-xs text-gray-400 font-medium'>
                      Upload images showcasing previous work
                    </p>
                    <label className='flex flex-col items-center justify-center gap-2 p-8 border border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group mt-2'>
                      <Upload
                        size={20}
                        className='text-gray-400 group-hover:text-[#6B46C1] transition-colors'
                      />
                      <span className='text-xs text-gray-400 font-medium'>
                        Upload Images
                      </span>
                      <input type='file' className='hidden' accept='image/*' multiple />
                    </label>
                  </div>

                  <div className='space-y-1.5'>
                    <Label className='text-sm text-gray-700 font-medium'>
                      Website or portfolio Link (Optional)
                    </Label>
                    <div className='relative'>
                      <LinkIcon
                        size={16}
                        className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
                      />
                      <Input
                        {...form.register("portfolioLink")}
                        className='bg-gray-100/60 border-0 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#6B46C1] pl-10 shadow-none'
                        placeholder='https://yourportfolio.com'
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-[#6B46C1] hover:bg-[#553C9A] h-13 rounded-xl font-bold text-white shadow-none text-sm'
            >
              {isSubmitting ? (
                <Loader2 className='mr-2 w-4 h-4 animate-spin' />
              ) : null}
              Continue to Verification
            </Button>
          </form>
        </div>
      ) : (
        /* ── Step 2 ── */
        <div className='space-y-5 animate-in fade-in slide-in-from-right-4 duration-300'>
          <p className='text-sm font-medium text-gray-700'>
            Choose your verification method
          </p>

          {/* Document Upload Option */}
          <button
            type='button'
            onClick={() => setSelectedMethod("document")}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
              selectedMethod === "document"
                ? "border-[#6B46C1] bg-purple-50/30"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className='flex items-center gap-3'>
              <div className='bg-purple-100 p-2.5 rounded-lg shrink-0'>
                <FileText size={18} className='text-[#6B46C1]' />
              </div>
              <div>
                <p className='font-bold text-gray-900 text-sm'>
                  Document Upload
                </p>
                <p className='text-xs text-gray-400 mt-0.5'>
                  Upload your International Passport or NIN card/Slip
                </p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                selectedMethod === "document"
                  ? "border-[#6B46C1]"
                  : "border-gray-300"
              }`}
            >
              {selectedMethod === "document" && (
                <div className='w-2.5 h-2.5 rounded-full bg-[#6B46C1]' />
              )}
            </div>
          </button>

          {/* NIN Number Option */}
          <button
            type='button'
            onClick={() => setSelectedMethod("nin")}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
              selectedMethod === "nin"
                ? "border-[#6B46C1] bg-purple-50/30"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className='flex items-center gap-3'>
              <div className='bg-purple-100 p-2.5 rounded-lg shrink-0'>
                <Hash size={18} className='text-[#6B46C1]' />
              </div>
              <div>
                <p className='font-bold text-gray-900 text-sm'>NIN Number</p>
                <p className='text-xs text-gray-400 mt-0.5'>
                  Enter your 11-digit NIN verification number
                </p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                selectedMethod === "nin"
                  ? "border-[#6B46C1]"
                  : "border-gray-300"
              }`}
            >
              {selectedMethod === "nin" && (
                <div className='w-2.5 h-2.5 rounded-full bg-[#6B46C1]' />
              )}
            </div>
          </button>

          {/* Encryption Notice */}
          <div className='flex items-center gap-3 p-3.5 bg-gray-100/80 rounded-xl'>
            <AlertTriangle size={16} className='text-gray-500 shrink-0' />
            <p className='text-xs text-gray-500 font-medium leading-relaxed'>
              Your information is encrypted and only used for verification
              purposes.
            </p>
          </div>

          {/* Verification Action shown after selection */}
          <AnimatePresence mode='wait'>
            {selectedMethod === "document" && (
              <div key='document-action' className='space-y-4 pt-1'>
                <VerifyIdentityButton
                  userId={user?._id}
                  className='w-full bg-[#6B46C1] hover:bg-[#553C9A] h-12 rounded-xl font-bold text-sm text-white shadow-none'
                />
              </div>
            )}
            {selectedMethod === "nin" && verificationMode === "sdk" && (
              <div key='nin-action' className='space-y-4 pt-1'>
                <Button
                  onClick={() => setVerificationMode("manual")}
                  className='w-full bg-[#6B46C1] hover:bg-[#553C9A] h-12 rounded-xl font-bold text-sm text-white shadow-none'
                >
                  Enter 11-digit NIN
                </Button>
              </div>
            )}
            {selectedMethod === "nin" && verificationMode === "manual" && (
              <NINManualSubmission
                key='manual-card'
                onCancel={() => setVerificationMode("sdk")}
              />
            )}
          </AnimatePresence>

          {/* Why verify? */}
          <div className='bg-blue-50 rounded-xl p-5 space-y-4'>
            <div className='flex items-center gap-2.5 text-blue-600'>
              <div className='bg-blue-100 p-1.5 rounded-lg'>
                <Shield size={16} className='text-blue-500' />
              </div>
              <h4 className='font-bold text-sm text-blue-600'>
                Why verify your identity?
              </h4>
            </div>
            <ul className='space-y-2.5'>
              {[
                "Build trust with clients and taskers",
                "Access all platforms features",
                "Increase your chances of getting hired",
                "Secure your account",
              ].map((benefit, i) => (
                <li key={i} className='flex items-center gap-3'>
                  <div className='w-4 h-4 rounded-full border-2 border-blue-400 shrink-0' />
                  <span className='text-sm text-blue-500 font-medium'>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
