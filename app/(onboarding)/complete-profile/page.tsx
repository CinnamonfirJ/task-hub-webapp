"use client";

import { useCompleteProfile } from "@/hooks/useCompleteProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Camera,
  Upload,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";

export default function CompleteProfilePage() {
  const {
    user,
    isLoadingUser,
    step,
    setStep,
    form,
    handleNext,
    handleVerify,
    handlePictureUpload,
    isSubmitting,
    isVerifying,
  } = useCompleteProfile();

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
    <div className='flex flex-col bg-gray-50/20 mx-auto p-4 md:p-8 w-full max-w-6xl min-h-screen'>
      {/* Header with Back Button */}
      <div className='flex items-center gap-4 mx-auto mb-10 w-full max-w-4xl'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => step === 2 && setStep(1)}
          className={`bg-white border text-gray-400 rounded-xl w-12 h-12 ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
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

      <div className='flex lg:flex-row flex-col gap-12 mx-auto w-full max-w-4xl'>
        {/* Left Side: Step Indicators */}
        <div className='flex lg:flex-col gap-6 lg:gap-10 lg:w-1/3'>
          <div className='flex lg:flex-row flex-col items-start lg:items-center gap-4'>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                step >= 1
                  ? "bg-[#6B46C1] border-[#6B46C1] text-white shadow-lg shadow-purple-100"
                  : "bg-white border-gray-200 text-gray-400"
              }`}
            >
              1
            </div>
            <div className='text-left'>
              <p
                className={`font-bold text-sm ${step >= 1 ? "text-gray-900" : "text-gray-400"}`}
              >
                Profile Info
              </p>
              <p className='text-gray-400 text-xs'>Basic details</p>
            </div>
          </div>

          <div className='flex lg:flex-row flex-col items-start lg:items-center gap-4'>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                step >= 2
                  ? "bg-[#6B46C1] border-[#6B46C1] text-white shadow-lg shadow-purple-100"
                  : "bg-white border-gray-200 text-gray-400"
              }`}
            >
              2
            </div>
            <div className='text-left'>
              <p
                className={`font-bold text-sm ${step >= 2 ? "text-gray-900" : "text-gray-400"}`}
              >
                Verification
              </p>
              <p className='text-gray-400 text-xs'>ID verification</p>
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
                  <div className='flex justify-center items-center bg-[#6B46C1] shadow-sm border-4 border-white rounded-full w-24 h-24 overflow-hidden font-bold text-white text-3xl active:scale-95 transition-transform'>
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
                  <label className='right-0 bottom-0 absolute bg-white hover:bg-gray-50 shadow-md p-1.5 border rounded-full cursor-pointer'>
                    <Camera size={16} className='text-[#6B46C1]' />
                    <input
                      type='file'
                      className='hidden'
                      accept='image/*'
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                </div>
                <p className='font-medium text-gray-500 text-sm'>
                  Upload profile image
                </p>
              </div>

              {/* Step 1 Form Cards */}
              <form
                onSubmit={form.handleSubmit(handleNext)}
                className='space-y-6'
              >
                {/* Basic Information */}
                <Card className='bg-white shadow-sm border-none rounded-2xl overflow-hidden'>
                  <CardHeader className='bg-white py-5 border-gray-50 border-b'>
                    <CardTitle className='font-bold text-lg'>
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6 p-6'>
                    <div className='space-y-2'>
                      <Label className='font-bold text-gray-700 text-sm'>
                        Full name
                      </Label>
                      <Input
                        {...form.register("fullName")}
                        className='bg-gray-50 disabled:opacity-80 px-4 border-none rounded-xl focus-visible:ring-purple-400 h-12'
                        placeholder='Full name'
                        disabled
                      />
                      <p className='px-1 text-[10px] text-gray-400'>
                        Full name is locked to your account identity.
                      </p>
                    </div>

                    <div className='space-y-2'>
                      <Label className='font-bold text-gray-700 text-sm'>
                        Phone number
                      </Label>
                      <Input
                        {...form.register("phoneNumber")}
                        className='bg-gray-50 px-4 border-none rounded-xl focus-visible:ring-purple-400 h-12'
                        placeholder='Enter phone number'
                      />
                      {form.formState.errors.phoneNumber && (
                        <p className='px-1 font-medium text-red-500 text-xs'>
                          {form.formState.errors.phoneNumber.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label className='font-bold text-gray-700 text-sm'>
                        Date of Birth
                      </Label>
                      <Input
                        type='date'
                        {...form.register("dateOfBirth")}
                        className='bg-gray-50 px-4 border-none rounded-xl focus-visible:ring-purple-400 h-12'
                      />
                      {form.formState.errors.dateOfBirth && (
                        <p className='px-1 font-medium text-red-500 text-xs'>
                          {form.formState.errors.dateOfBirth.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card className='bg-white shadow-sm border-none rounded-2xl overflow-hidden'>
                  <CardHeader className='bg-white py-5 border-gray-50 border-b'>
                    <CardTitle className='font-bold text-lg'>
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6 p-6'>
                    <div className='space-y-2'>
                      <Label className='font-bold text-gray-700 text-sm'>
                        Country
                      </Label>
                      <Input
                        {...form.register("country")}
                        className='bg-gray-50 px-4 border-none rounded-xl focus-visible:ring-purple-400 h-12'
                        placeholder='Nigeria'
                        readOnly
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label className='font-bold text-gray-700 text-sm'>
                        State of residence
                      </Label>
                      <Input
                        {...form.register("residentState")}
                        className='bg-gray-50 px-4 border-none rounded-xl focus-visible:ring-purple-400 h-12'
                        placeholder='Select your state of residence'
                      />
                      {form.formState.errors.residentState && (
                        <p className='px-1 font-medium text-red-500 text-xs'>
                          {form.formState.errors.residentState.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label className='font-bold text-gray-700 text-sm'>
                        Home Address
                      </Label>
                      <Textarea
                        {...form.register("address")}
                        className='bg-gray-50 px-4 py-3 border-none rounded-xl ring-0 focus-visible:ring-purple-400 ring-offset-white min-h-[120px]'
                        placeholder='Enter your full address'
                      />
                      {form.formState.errors.address && (
                        <p className='px-1 font-medium text-red-500 text-xs'>
                          {form.formState.errors.address.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Service Information */}
                <Card className='bg-white shadow-sm border-none rounded-2xl overflow-hidden'>
                  <CardHeader className='bg-white py-5 border-gray-50 border-b'>
                    <CardTitle className='font-bold text-lg'>
                      Service Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6 p-6'>
                    <div className='space-y-2'>
                      <Label className='font-bold text-gray-700 text-sm'>
                        Service category
                      </Label>
                      <select
                        {...form.register("category")}
                        className='bg-gray-50 px-4 border-none rounded-xl outline-none focus:ring-2 focus:ring-purple-400 w-full h-12 text-sm appearance-none'
                      >
                        <option value=''>Select service category</option>
                        <option value='delivery'>Delivery</option>
                        <option value='cleaning'>Cleaning</option>
                        <option value='handyman'>Handyman</option>
                      </select>
                    </div>

                    <div className='space-y-2'>
                      <Label className='font-bold text-gray-700 text-sm'>
                        Previous work
                      </Label>
                      <p className='mb-2 font-medium text-[10px] text-gray-400 uppercase tracking-tight'>
                        Upload images showcasing previous work
                      </p>
                      <div className='group flex flex-col justify-center items-center space-y-3 hover:bg-gray-50 p-12 border border-gray-200 border-dashed rounded-2xl transition-colors cursor-pointer'>
                        <div className='bg-purple-50 p-3 rounded-xl group-hover:scale-110 transition-transform'>
                          <Upload size={24} className='text-[#6B46C1]' />
                        </div>
                        <span className='font-bold text-gray-400 text-xs'>
                          Upload Images
                        </span>
                      </div>
                    </div>

                    <div className='space-y-2 pt-4'>
                      <Label className='font-bold text-gray-700 text-sm'>
                        Website or portfolio Link (Optional)
                      </Label>
                      <div className='relative'>
                        <LinkIcon
                          size={18}
                          className='top-1/2 left-4 absolute text-gray-400 -translate-y-1/2'
                        />
                        <Input
                          {...form.register("portfolioLink")}
                          className='bg-gray-50 pr-4 pl-12 border-none rounded-xl focus-visible:ring-purple-400 h-12'
                          placeholder='https://yourportfolio.com'
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-[#6B46C1] hover:bg-[#553C9A] shadow-lg shadow-purple-200 py-8 rounded-xl w-full font-bold text-lg active:scale-[0.99] transition-all'
                >
                  {isSubmitting ? (
                    <Loader2 className='mr-2 w-6 h-6 animate-spin' />
                  ) : null}
                  Continue to Verification
                </Button>
              </form>
            </div>
          ) : (
            <div className='slide-in-from-right-4 space-y-8 animate-in duration-500 fade-in'>
              <Card className='bg-white shadow-sm border-none rounded-3xl min-h-[400px] overflow-hidden'>
                <CardHeader className='bg-white px-8 py-6 border-gray-50 border-b'>
                  <CardTitle className='font-bold text-xl'>
                    Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-8 p-8'>
                  <div className='space-y-3'>
                    <Label className='font-bold text-gray-700 text-sm'>
                      NIN
                    </Label>
                    <Input
                      {...form.register("nin")}
                      placeholder='Enter NIN number'
                      maxLength={11}
                      className='bg-gray-50 px-5 border-none rounded-xl focus-visible:ring-purple-400 h-14 font-medium text-lg'
                    />
                    {form.formState.errors.nin && (
                      <p className='px-1 font-medium text-red-500 text-xs'>
                        {form.formState.errors.nin.message}
                      </p>
                    )}
                  </div>

                  <div className='pt-4'>
                    <Button
                      onClick={handleVerify}
                      disabled={isVerifying || form.watch("nin")?.length !== 11}
                      className='bg-[#6B46C1] hover:bg-[#553C9A] shadow-lg shadow-purple-200 py-8 rounded-xl w-full font-bold text-xl active:scale-[0.99] transition-all'
                    >
                      {isVerifying ? (
                        <Loader2 className='mr-2 w-6 h-6 animate-spin' />
                      ) : null}
                      Verifiy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className='bg-blue-50/30 p-8 border border-blue-100/50 rounded-[2rem]'>
                <p className='font-medium text-blue-600/60 text-sm text-center leading-relaxed'>
                  Your NIN is only used for identity verification purposes and
                  is never shared publicly. We value your privacy and security.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
