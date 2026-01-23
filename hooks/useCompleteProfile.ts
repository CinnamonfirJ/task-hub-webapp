"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// Schema for profile completion form
const profileSchema = z.object({
  fullName: z.string().min(2),
  bio: z.string().optional(),
  location: z.string().min(2, "Location is required"),
});

export type ProfileValues = z.infer<typeof profileSchema>;

/**
 * Custom hook for the Complete Profile page.
 * Encapsulates:
 * - User data from auth context
 * - Profile update mutation with cache invalidation
 * - Form initialization and validation
 * - Navigation side-effect on success
 */
export function useCompleteProfile() {
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileValues) => authApi.updateProfile(data as any),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser"], updatedUser);
      router.push("/home");
    },
  });

  // Form setup with zod validation
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      bio: "",
      location: "",
    },
    values: {
      // Update form when user data loads
      fullName: user?.fullName || "",
      bio: (user as any)?.bio || "",
      location: (user as any)?.location || "",
    },
  });

  // Submit handler
  const onSubmit = (data: ProfileValues) => {
    updateProfileMutation.mutate(data);
  };

  return {
    // User state
    user,
    isLoadingUser,

    // Form
    form,
    onSubmit,

    // Mutation state
    isSubmitting: updateProfileMutation.isPending,
  };
}
