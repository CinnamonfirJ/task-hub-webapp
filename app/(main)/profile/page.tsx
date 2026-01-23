"use client";

import { useProfile, usePersonalInfoForm, useTaskerServiceStep, PersonalValues } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Camera, CheckCircle2 } from "lucide-react";
import { User } from "@/types/auth";

export default function ProfilePage() {
  const {
    user,
    isLoadingUser,
    isUserError,
    role,
    step,
    setStep,
    isUpdatingProfile,
    isUpdatingCategories,
    handleProfileSubmit,
    handleCategoriesSubmit,
    handlePictureUpload,
  } = useProfile();

  if (isLoadingUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (isUserError || !user) {
    return (
      <div className="p-8 text-center">
        Failed to load profile. Please login again.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header / Stepper UI */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Complete profile</h1>
          <p className="text-gray-500">
            {step === 1
              ? "Step 1: Profile Information"
              : step === 2 && role === "tasker"
                ? "Step 2: Service Information"
                : "Verification"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <StepIndicator number={1} label="Profile Info" active={step === 1} completed={step > 1} />
        {role === "tasker" && (
          <>
            <div className="h-[1px] bg-gray-200 flex-1 max-w-[50px]"></div>
            <StepIndicator number={2} label="Service Info" active={step === 2} completed={step > 2} />
          </>
        )}
        <div className="h-[1px] bg-gray-200 flex-1 max-w-[50px]"></div>
        <StepIndicator
          number={role === "tasker" ? 3 : 2}
          label="Verification"
          active={step === (role === "tasker" ? 3 : 2)}
          completed={false}
        />
      </div>

      {/* Content */}
      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-6">
          {step === 1 && (
            <PersonalInfoStep
              user={user}
              onSubmit={handleProfileSubmit}
              isLoading={isUpdatingProfile}
              onUpload={handlePictureUpload}
            />
          )}

          {step === 2 && role === "tasker" && (
            <TaskerServiceStep
              user={user}
              onSubmit={handleCategoriesSubmit}
              isLoading={isUpdatingCategories}
              onBack={() => setStep(1)}
            />
          )}

          {step === (role === "tasker" ? 3 : 2) && (
            <VerificationStep onBack={() => setStep(role === "tasker" ? 2 : 1)} user={user} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// -- Sub Components --

function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${active || completed ? "opacity-100" : "opacity-50"}`}>
      <div
        className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
          completed
            ? "bg-green-500 text-white"
            : active
              ? "bg-[#6B46C1] text-white"
              : "bg-gray-200 text-gray-500"
        }`}
      >
        {completed ? <CheckCircle2 size={16} /> : number}
      </div>
      <span className={`font-medium ${active ? "text-[#6B46C1]" : "text-gray-500"}`}>{label}</span>
    </div>
  );
}

function PersonalInfoStep({
  user,
  onSubmit,
  isLoading,
  onUpload,
}: {
  user: User;
  onSubmit: (data: PersonalValues) => void;
  isLoading: boolean;
  onUpload: (data: string) => void;
}) {
  const { form, handleFileChange } = usePersonalInfoForm(user);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col items-center mb-6">
        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mb-2 relative group cursor-pointer">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-gray-400">{user.fullName?.charAt(0) || "U"}</span>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white" />
          </div>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
            onChange={(e) => handleFileChange(e, onUpload)}
          />
        </div>
        <p className="text-sm text-gray-500">Upload profile image</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Basic Information</h3>

        <div className="space-y-2">
          <Label>Full name</Label>
          <Input {...form.register("fullName")} disabled />
          <p className="text-xs text-gray-400">Name cannot be changed directly.</p>
        </div>

        <div className="space-y-2">
          <Label>Phone number</Label>
          <Input {...form.register("phoneNumber")} placeholder="Enter phone number" />
          {form.formState.errors.phoneNumber && (
            <p className="text-red-500 text-sm">{form.formState.errors.phoneNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Input type="date" {...form.register("dateOfBirth")} />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-lg">Location</h3>

        <div className="space-y-2">
          <Label>Country</Label>
          <Input {...form.register("country")} readOnly className="bg-gray-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>State of residence</Label>
            <Input {...form.register("residentState")} placeholder="Lagos" />
            {form.formState.errors.residentState && (
              <p className="text-red-500 text-sm">{form.formState.errors.residentState.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Home Address</Label>
            <Input {...form.register("address")} placeholder="Full address" />
            {form.formState.errors.address && (
              <p className="text-red-500 text-sm">{form.formState.errors.address.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          type="submit"
          className="w-full md:w-auto min-w-[200px] bg-[#6B46C1] hover:bg-[#553C9A]"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Next Step"}
        </Button>
      </div>
    </form>
  );
}

function TaskerServiceStep({
  user,
  onSubmit,
  isLoading,
  onBack,
}: {
  user: User;
  onSubmit: (cats: string[]) => void;
  isLoading: boolean;
  onBack: () => void;
}) {
  const { allCategories, isCategoriesLoading, selectedCategories, toggleCategory } =
    useTaskerServiceStep(user);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Service Information</h3>
        <p className="text-sm text-gray-500">Select the services you offer.</p>

        {isCategoriesLoading ? (
          <div>Loading categories...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allCategories?.map((cat) => (
              <div
                key={cat._id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedCategories.includes(cat._id)
                    ? "bg-[#6B46C1]/10 border-[#6B46C1] text-[#6B46C1]"
                    : "hover:bg-gray-50 border-gray-200"
                }`}
                onClick={() => toggleCategory(cat._id)}
              >
                <span className="font-medium">{cat.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={() => onSubmit(selectedCategories)}
          className="bg-[#6B46C1] hover:bg-[#553C9A]"
          disabled={isLoading || selectedCategories.length === 0}
        >
          {isLoading ? "Saving..." : "Next Step"}
        </Button>
      </div>
    </div>
  );
}

function VerificationStep({ onBack, user }: { onBack: () => void; user: User }) {
  return (
    <div className="space-y-6 text-center py-8">
      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold">Verification Pending</h2>
      <p className="text-gray-500 max-w-md mx-auto">
        Thank you for updating your profile. Your ID verification status is currently
        <span className="font-bold text-gray-900 mx-1">Pending</span>.
      </p>

      <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto text-sm text-blue-700">
        You can now access the dashboard features. Verification for ID (NIN) will be required later
        for withdrawals.
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <a href="/home">
          <Button className="bg-[#6B46C1] hover:bg-[#553C9A]">Go to Dashboard</Button>
        </a>
      </div>
    </div>
  );
}
