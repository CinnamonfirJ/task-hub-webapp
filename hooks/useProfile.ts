"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCategories } from "@/hooks/useCategories";
import { tasksApi } from "@/lib/api/tasks";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { UserType, User } from "@/types/auth";

// -- Schemas --

const personalSchema = z.object({
  fullName: z.string().min(2, "Full Name is too short"),
  phoneNumber: z.string().min(10, "Phone number is invalid"),
  dateOfBirth: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  residentState: z.string().min(1, "State is required"),
  address: z.string().min(5, "Address is too short"),
});

const taskerSchema = z.object({
  categories: z.array(z.string()).min(1, "Select at least one category"),
});

export type PersonalValues = z.infer<typeof personalSchema>;
export type TaskerValues = z.infer<typeof taskerSchema>;

/**
 * Custom hook for the Profile page.
 * Encapsulates:
 * - User data from auth context
 * - Step navigation state
 * - Role state synced from user
 * - Profile update mutation
 * - Categories update mutation
 * - Profile picture update mutation
 * - Categories query for taskers
 */
export function useProfile() {
  const queryClient = useQueryClient();
  const { user, isLoadingUser, isUserError } = useAuth();
  const { data: allCategories, isLoading: isCategoriesLoading } = useCategories();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserType>("user");

  // Sync role from user when loaded
  useEffect(() => {
    if (user) {
      setRole(user.role || "user");
    }
  }, [user]);

  // -- Mutations --
  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      // If User, go to verification. If Tasker, go to Service Info
      if (role === "user") {
        setStep(3); // Verification
      } else {
        setStep(2); // Service Info
      }
    },
  });

  const updateCategoriesMutation = useMutation({
    mutationFn: authApi.updateCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setStep(3); // Verification
    },
  });

  const updatePictureMutation = useMutation({
    mutationFn: authApi.updateProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      // Toast or simple refresh
    },
  });

  // -- Step handlers --
  const handleProfileSubmit = (data: PersonalValues) => {
    updateProfileMutation.mutate(data);
  };

  const handleCategoriesSubmit = (categories: string[]) => {
    // Split categories into main and sub by checking our local category list
    const mains: string[] = [];
    const subs: string[] = [];

    categories.forEach((id) => {
      const cat = allCategories?.find((c: any) => c._id === id);
      if (cat) {
        if (cat.parentCategory || cat.mainCategory) {
          subs.push(id);
        } else {
          mains.push(id);
        }
      } else {
        // Default to main if not found (fallback)
        mains.push(id);
      }
    });

    updateCategoriesMutation.mutate({
      mainCategories: mains,
      subCategories: subs,
    });
  };

  const handlePictureUpload = (base64: string) => {
    updatePictureMutation.mutate(base64);
  };

  const goToStep = (stepNumber: number) => {
    setStep(stepNumber);
  };

  return {
    // User data
    user,
    isLoadingUser,
    isUserError,
    role,

    // Step navigation
    step,
    setStep: goToStep,

    // Mutations state
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingCategories: updateCategoriesMutation.isPending,

    // Handlers
    handleProfileSubmit,
    handleCategoriesSubmit,
    handlePictureUpload,
  };
}

/**
 * Hook for the Personal Info step form
 */
export function usePersonalInfoForm(user: User | null) {
  const form = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      dateOfBirth: user?.dateOfBirth || "",
      country: user?.country || "Nigeria",
      residentState: user?.residentState || "",
      address: user?.address || "",
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onUpload: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpload(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    form,
    handleFileChange,
  };
}

/**
 * Hook for the Tasker Service step
 */
export function useTaskerServiceStep(user: User | null) {
  const { data: allCategories, isLoading: isCategoriesLoading } = useCategories();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Initial sync from user profile if exists
  useEffect(() => {
    if (user?.categories && Array.isArray(user.categories)) {
      const ids = user.categories.map((c: any) =>
        typeof c === "string" ? c : c._id
      );
      setSelectedCategories(ids);
    }
  }, [user?.categories]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return {
    allCategories,
    isCategoriesLoading,
    selectedCategories,
    toggleCategory,
  };
}
