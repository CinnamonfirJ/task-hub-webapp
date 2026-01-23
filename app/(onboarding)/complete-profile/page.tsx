import { useCompleteProfile } from "@/hooks/useCompleteProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Camera, Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import Link from "next/link";

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
    isVerifying 
  } = useCompleteProfile();

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#6B46C1]" />
      </div>
    );
  }

  const userInitials = user?.fullName
    ? user.fullName.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase()
    : 'U';

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className='flex flex-col mx-auto p-4 md:p-8 w-full max-w-6xl min-h-screen bg-gray-50/20'>
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-10 w-full max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => step === 2 && setStep(1)}
          className={`bg-white border text-gray-400 rounded-xl w-12 h-12 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complete profile</h1>
          <p className="text-sm text-gray-400">Step {step} of 2: {step === 1 ? 'Profile Information' : 'Verification'}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 w-full max-w-4xl mx-auto">
        {/* Left Side: Step Indicators */}
        <div className="lg:w-1/3 flex lg:flex-col gap-6 lg:gap-10">
          <div className="flex lg:flex-row flex-col lg:items-center items-start gap-4">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                step >= 1 ? "bg-[#6B46C1] border-[#6B46C1] text-white shadow-lg shadow-purple-100" : "bg-white border-gray-200 text-gray-400"
             }`}>1</div>
             <div className="text-left">
                <p className={`font-bold text-sm ${step >= 1 ? "text-gray-900" : "text-gray-400"}`}>Profile Info</p>
                <p className="text-xs text-gray-400">Basic details</p>
             </div>
          </div>
          
          <div className="flex lg:flex-row flex-col lg:items-center items-start gap-4">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                step >= 2 ? "bg-[#6B46C1] border-[#6B46C1] text-white shadow-lg shadow-purple-100" : "bg-white border-gray-200 text-gray-400"
             }`}>2</div>
             <div className="text-left">
                <p className={`font-bold text-sm ${step >= 2 ? "text-gray-900" : "text-gray-400"}`}>Verification</p>
                <p className="text-xs text-gray-400">ID verification</p>
             </div>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="lg:w-2/3 space-y-8 pb-20">
          {step === 1 ? (
            <div className="space-y-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#6B46C1] flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-4 border-white shadow-sm transition-transform active:scale-95">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : userInitials}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border cursor-pointer hover:bg-gray-50">
                    <Camera size={16} className="text-[#6B46C1]" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleProfilePictureChange} />
                  </label>
                </div>
                <p className="text-sm text-gray-500 font-medium">Upload profile image</p>
              </div>

              {/* Step 1 Form Cards */}
              <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
                {/* Basic Information */}
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                  <CardHeader className="bg-white border-b border-gray-50 py-5">
                    <CardTitle className="text-lg font-bold">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                       <Label className="text-sm font-bold text-gray-700">Full name</Label>
                       <Input 
                          {...form.register("fullName")} 
                          className="bg-gray-50 border-none h-12 rounded-xl px-4 focus-visible:ring-purple-400 disabled:opacity-80"
                          placeholder="Full name"
                          disabled
                       />
                       <p className="text-[10px] text-gray-400 px-1">Full name is locked to your account identity.</p>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-sm font-bold text-gray-700">Phone number</Label>
                       <Input 
                          {...form.register("phoneNumber")} 
                          className="bg-gray-50 border-none h-12 rounded-xl px-4 focus-visible:ring-purple-400"
                          placeholder="Enter phone number"
                       />
                       {form.formState.errors.phoneNumber && <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.phoneNumber.message}</p>}
                    </div>

                    <div className="space-y-2">
                       <Label className="text-sm font-bold text-gray-700">Date of Birth</Label>
                       <Input 
                         type="date" 
                         {...form.register("dateOfBirth")} 
                         className="bg-gray-50 border-none h-12 rounded-xl px-4 focus-visible:ring-purple-400"
                       />
                       {form.formState.errors.dateOfBirth && <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.dateOfBirth.message}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Location */}
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                  <CardHeader className="bg-white border-b border-gray-50 py-5">
                    <CardTitle className="text-lg font-bold">Location</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                       <Label className="text-sm font-bold text-gray-700">Country</Label>
                       <Input 
                          {...form.register("country")} 
                          className="bg-gray-50 border-none h-12 rounded-xl px-4 focus-visible:ring-purple-400"
                          placeholder="Nigeria"
                          readOnly
                       />
                    </div>

                    <div className="space-y-2">
                       <Label className="text-sm font-bold text-gray-700">State of residence</Label>
                       <Input 
                          {...form.register("residentState")} 
                          className="bg-gray-50 border-none h-12 rounded-xl px-4 focus-visible:ring-purple-400"
                          placeholder="Select your state of residence"
                       />
                       {form.formState.errors.residentState && <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.residentState.message}</p>}
                    </div>

                    <div className="space-y-2">
                       <Label className="text-sm font-bold text-gray-700">Home Address</Label>
                       <Textarea 
                          {...form.register("address")} 
                          className="bg-gray-50 border-none rounded-xl px-4 py-3 min-h-[120px] focus-visible:ring-purple-400 ring-offset-white ring-0"
                          placeholder="Enter your full address"
                       />
                       {form.formState.errors.address && <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.address.message}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Service Information */}
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                  <CardHeader className="bg-white border-b border-gray-50 py-5">
                    <CardTitle className="text-lg font-bold">Service Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                       <Label className="text-sm font-bold text-gray-700">Service category</Label>
                       <select 
                          {...form.register("category")}
                          className="w-full bg-gray-50 border-none h-12 rounded-xl px-4 focus:ring-2 focus:ring-purple-400 outline-none text-sm appearance-none"
                       >
                         <option value="">Select service category</option>
                         <option value="delivery">Delivery</option>
                         <option value="cleaning">Cleaning</option>
                         <option value="handyman">Handyman</option>
                       </select>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-sm font-bold text-gray-700">Previous work</Label>
                       <p className="text-[10px] text-gray-400 mb-2 font-medium uppercase tracking-tight">Upload images showcasing previous work</p>
                       <div className="border border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center space-y-3 cursor-pointer hover:bg-gray-50 transition-colors group">
                          <div className="bg-purple-50 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <Upload size={24} className="text-[#6B46C1]" />
                          </div>
                          <span className="text-xs font-bold text-gray-400">Upload Images</span>
                       </div>
                    </div>

                    <div className="space-y-2 pt-4">
                       <Label className="text-sm font-bold text-gray-700">Website or portfolio Link (Optional)</Label>
                       <div className="relative">
                          <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input 
                            {...form.register("portfolioLink")} 
                            className="bg-gray-50 border-none h-12 rounded-xl pl-12 pr-4 focus-visible:ring-purple-400"
                            placeholder="https://yourportfolio.com"
                          />
                       </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#6B46C1] hover:bg-[#553C9A] py-8 text-lg font-bold rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-[0.99]"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                  Continue to Verification
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden min-h-[400px] bg-white">
                <CardHeader className="bg-white border-b border-gray-50 py-6 px-8">
                  <CardTitle className="text-xl font-bold">Verification</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-gray-700">NIN</Label>
                    <Input 
                      {...form.register("nin")}
                      placeholder="Enter NIN number"
                      maxLength={11}
                      className="bg-gray-50 border-none h-14 rounded-xl px-5 text-lg font-medium focus-visible:ring-purple-400"
                    />
                    {form.formState.errors.nin && <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.nin.message}</p>}
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={handleVerify}
                      disabled={isVerifying || form.watch("nin")?.length !== 11}
                      className="w-full bg-[#6B46C1] hover:bg-[#553C9A] py-8 text-xl font-bold rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-[0.99]"
                    >
                      {isVerifying ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                      Verifiy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50/30 p-8 rounded-[2rem] border border-blue-100/50">
                 <p className="text-sm text-center text-blue-600/60 font-medium leading-relaxed">
                    Your NIN is only used for identity verification purposes and is never shared publicly. We value your privacy and security.
                 </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
