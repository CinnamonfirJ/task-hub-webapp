"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { UserType, AuthResponse, GoogleProfilePrefill } from "@/types/auth";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";
import { googleStore } from "@/lib/google-store";
import { useQueryClient } from "@tanstack/react-query";

export function useGoogleAuth() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleGoogleSignIn = async (idToken: string, role: UserType) => {
    setIsProcessing(true);
    try {
      const result = await authApi.googleSignIn(idToken, role);
      
      // Success (200)
      if (result.status === "success") {
        if (result.linkedNow) {
          toast.success("Google account linked successfully!");
        }
        
        // Sync React Query cache
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        router.push("/home");
        return;
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        const { status, data } = error;

        // 404 - Account Not Found -> Onboarding
        if (status === 404 && data.code === "account_not_found") {
          googleStore.setState({
            idToken,
            role,
            prefill: data.googleProfile,
          });
          router.push("/google-complete");
          return;
        }

        // Handle Specialized Errors (4xx/5xx)
        handleAuthError(status, data, role, idToken);
      } else {
        toast.error(error.message || "Google sign-in failed");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteSignup = async (fields: any) => {
    const { idToken, role } = googleStore.getState();
    if (!idToken || !role) {
      toast.error("Session expired. Please sign in with Google again.");
      router.push("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await authApi.googleCompleteSignup({
        idToken,
        user_type: role,
        ...fields,
      });

      if (result.status === "success") {
        toast.success("Account created successfully!");
        googleStore.clear();
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        router.push("/home");
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        handleAuthError(error.status, error.data, role as UserType, idToken);
      } else {
        toast.error(error.message || "Signup completion failed");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAuthError = (status: number, data: any, role: UserType, idToken: string) => {
    const code = data.code;

    switch (code) {
      case "email_in_use":
      case "account_exists":
      case "account_conflict":
        toast.error("Already have an account? Please sign in with your password or use standard login.");
        break;

      case "role_conflict":
        const otherRole = role === "user" ? "tasker" : "user";
        toast.error(
          `This Google account is already registered as a ${otherRole}.`,
          {
            action: {
              label: `Sign in as ${otherRole}`,
              onClick: () => handleGoogleSignIn(idToken, otherRole),
            },
          }
        );
        break;

      case "invalid_token":
      case "google_reauth_required":
        toast.error("Your Google session has expired. Please try again.");
        break;

      case "missing_fields":
        toast.error("Please fill in all required fields.");
        break;

      case "no_password_set":
        router.push("/set-password");
        break;

      default:
        toast.error(data.message || "An error occurred during authentication");
    }
  };

  return {
    handleGoogleSignIn,
    handleCompleteSignup,
    isProcessing,
  };
}
