"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// Schema for profile completion form
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  country: z.string().min(1, "Country is required"),
  residentState: z.string().min(1, "State is required"),
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

  // Mutation for updating profile info (Step 1)
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<ProfileValues>) => authApi.updateProfile(data as any),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
      setStep(2);
    },
  });

  // Mutation for NIN verification (Step 2)
  const verifyIdentityMutation = useMutation({
    mutationFn: (nin: string) => {
        // Extract names from fullName for verification
        const [firstName, ...rest] = (user?.fullName || "").split(" ");
        const lastName = rest.join(" ") || "User";
        
        return authApi.verifyIdentity({
            nin,
            firstName,
            lastName,
            dateOfBirth: form.getValues("dateOfBirth"),
            gender: "male", // Mock for now or add to form
        });
    },
    onSuccess: (data) => {
        if (data.isVerified) {
            router.push("/home");
        }
    },
  });

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      dateOfBirth: (user as any)?.dateOfBirth || "",
      country: user?.country || "Nigeria",
      residentState: user?.residentState || "",
      address: (user as any)?.address || "",
      category: "",
      portfolioLink: "",
      nin: "",
    },
    values: {
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      dateOfBirth: (user as any)?.dateOfBirth || "",
      country: user?.country || "Nigeria",
      residentState: user?.residentState || "",
      address: (user as any)?.address || "",
    },
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
  };
}
