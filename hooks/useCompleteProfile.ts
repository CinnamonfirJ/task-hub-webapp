"use client";

const formatDateForInput = (dateString?: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
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
  nin: z.string().length(11, "NIN must be 11 digits").optional(),
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
        
        if (hasBasicInfo && user.role === "tasker") {
            setStep(2);
        }
        setIsInitialized(true);
    }
  }, [user, isLoadingUser, isInitialized]);

  // Mutation for updating profile info (Step 1)
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<ProfileValues>) => authApi.updateProfile(data as any),
    onSuccess: (updatedUser) => {
      
      // We need to optimistically update the user data
      const optimisticUser = { ...user, ...updatedUser };
      queryClient.setQueryData(["currentUser"], optimisticUser);
      
      // If user is tasker, move to next step, otherwise stay (ProfilePage will redirect if complete)
      if (user?.role === "tasker") {
         setStep(2);
      } else {
         // Force refetch and redirect for regular users
         queryClient.invalidateQueries({ queryKey: ["currentUser"] });
         router.push("/home");
      }
    },
  });

  // Mutation for NIN verification (Step 2)
  const verifyIdentityMutation = useMutation({
    mutationFn: (nin: string) => {
        const values = form.getValues();
        
        return authApi.verifyIdentity({
            nin,
            firstName: values.firstName,
            lastName: values.lastName,
            dateOfBirth: values.dateOfBirth,
            gender: values.gender as "male" | "female",
            email: user?.emailAddress,
            phoneNumber: values.phoneNumber || user?.phoneNumber
        });
    },
    onSuccess: (data) => {
        if (data.isVerified) {
          // Optimistically update user to set isProfileComplete to true
           queryClient.setQueryData(["currentUser"], (oldUser: any) => ({
            ...oldUser,
            isProfileComplete: true,
          }));
          // Force a refetch to ensure we have the latest state
          queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        }
    },
  });

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || user?.fullName?.split(" ")[0] || "",
      lastName: user?.lastName || user?.fullName?.split(" ").slice(1).join(" ") || "",
      gender: (user as any)?.gender || "male",
      phoneNumber: user?.phoneNumber || "",
      dateOfBirth: formatDateForInput((user as any)?.dateOfBirth),
      country: user?.country || "Nigeria",
      residentState: user?.residentState || "",
      address: (user as any)?.address || "",
      category: "",
      portfolioLink: "",
      nin: "",
    },
    values: {
      firstName: user?.firstName || user?.fullName?.split(" ")[0] || "",
      lastName: user?.lastName || user?.fullName?.split(" ").slice(1).join(" ") || "",
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

  const handleVerify = () => {
    const nin = form.getValues("nin");
    if (nin && nin.length === 11) {
        verifyIdentityMutation.mutate(nin);
    }
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
    handleVerify,
    handlePictureUpload,
    isSubmitting: updateProfileMutation.isPending,
    isVerifying: verifyIdentityMutation.isPending,
    isProfileComplete: user ? checkProfileCompleteness(user) : false,
  };
}

function checkProfileCompleteness(user: any): boolean {
  if (!user) return false;

  const isTasker = user.role === "tasker";
  // Basic fields required for everyone
  const hasBasicInfo = !!(
    (user.fullName || (user.firstName && user.lastName)) &&
    user.phoneNumber &&
    user.country &&
    user.residentState && 
    user.address &&
    user.dateOfBirth
  );

  if (!hasBasicInfo) return false;

  // Tasker specific requirements: Verification
  // Note: API only allows verifyIdentity for taskers.
  // We assume 'isProfileComplete' is manually set if verified, or we check another flag if available.
  // Since we rely on 'isProfileComplete' flag from backend OR optimistic update.
  // AND for a clean flow, if I see no way to check verification, I will rely on user.isProfileComplete property if present.
  
  if (user.role === "tasker") {
    // If we have an explicit flag from backend, use it.
    if (typeof user.isProfileComplete === 'boolean') {
      return user.isProfileComplete; 
    }
    // Otherwise fallback to basic info + maybe categories?
    // Based on user request, NIN verification MARKS isProfileComplete as true.
    // So if that flag is missing/false, it is false.
    return false;
  }

  // Regular users only need basic info
  return true;
}
