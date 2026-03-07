"use client";

const formatDateForInput = (dateString?: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  } catch (e) {
    return "";
  }
};

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// Schema for profile completion form
const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  gender: z.enum(["male", "female"]),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  country: z.string().min(1, "Country is required"),
  residentState: z.string().optional(),
  address: z.string().min(5, "Full address is required"),
  category: z.string().optional(),
  portfolioLink: z.string().url().optional().or(z.literal("")),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export function useCompleteProfile() {
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Determine initial step based on user data once loaded
  // Determine initial step based on user data once loaded
  useEffect(() => {
    if (user && !isLoadingUser && !isInitialized) {
      if (checkProfileCompleteness(user)) {
        setIsInitialized(true);
        // If complete, no step changes needed
        return;
      }

      const isTasker = user.role === "tasker";
      const hasBasicInfo = !!(
        (user.firstName || user.fullName) &&
        user.phoneNumber &&
        user.country &&
        user.residentState &&
        user.address &&
        (user as any).dateOfBirth
      );

      if (hasBasicInfo) {
        setStep(2);
      }
      setIsInitialized(true);
    }
  }, [user, isLoadingUser, isInitialized]);

  // Mutation for updating profile info (Step 1)
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<ProfileValues>) =>
      authApi.updateProfile(data as any),
    onSuccess: (updatedUser) => {
      // We need to optimistically update the user data
      const optimisticUser = { ...user, ...updatedUser };
      queryClient.setQueryData(["currentUser"], optimisticUser);

      setStep(2);
      // Force refetch to ensure we have updated basic info locally
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || user?.fullName?.split(" ")[0] || "",
      lastName:
        user?.lastName || user?.fullName?.split(" ").slice(1).join(" ") || "",
      gender: (user as any)?.gender || "male",
      phoneNumber: user?.phoneNumber || "",
      dateOfBirth: formatDateForInput((user as any)?.dateOfBirth),
      country: user?.country || "Nigeria",
      residentState: user?.residentState || "",
      address: (user as any)?.address || "",
      category: "",
      portfolioLink: "",
    },
    values: {
      firstName: user?.firstName || user?.fullName?.split(" ")[0] || "",
      lastName:
        user?.lastName || user?.fullName?.split(" ").slice(1).join(" ") || "",
      gender: (user as any)?.gender || "male",
      phoneNumber: user?.phoneNumber || "",
      dateOfBirth: formatDateForInput((user as any)?.dateOfBirth),
      country: user?.country || "Nigeria",
      residentState: user?.residentState || "",
      address: (user as any)?.address || "",
    } as any,
  });

  const handleNext = (data: ProfileValues) => {
    updateProfileMutation.mutate(data);
  };

  const handlePictureUpload = async (base64: string) => {
    try {
      await authApi.updateProfilePicture(base64);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    } catch (err) {
      console.error("Failed to upload profile picture", err);
    }
  };

  return {
    user,
    isLoadingUser,
    step,
    setStep,
    form,
    handleNext,
    handlePictureUpload,
    isSubmitting: updateProfileMutation.isPending,
    isProfileComplete: user ? checkProfileCompleteness(user) : false,
  };
}

export function checkProfileCompleteness(user: any): boolean {
  if (!user) return false;

  // 1. Basic Information Check
  const hasBasicInfo = !!(
    (user.fullName || (user.firstName && user.lastName)) &&
    user.phoneNumber &&
    user.country &&
    user.residentState &&
    user.address &&
    user.dateOfBirth
  );

  if (!hasBasicInfo) return false;

  // 2. Email Verification Check
  if (!user.isEmailVerified) return false;

  // 3. Identity Verification Check
  // Based on request: "dashboard should only show as normal after isEmailVerified is true and the verifyIdentity is true"
  if (!user.verifyIdentity) return false;

  // 4. Tasker Specific: Categories
  if (user.role === "tasker") {
    const hasCategories =
      Array.isArray(user.categories) && user.categories.length > 0;
    if (!hasCategories) return false;
  }

  // If all checks pass, profile is complete
  return true;
}
