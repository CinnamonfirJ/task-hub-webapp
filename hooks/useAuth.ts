"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { User, LoginInput, RegisterInput, VerifyEmailInput } from "@/types/auth";
import { useEffect } from "react";

const USER_QUERY_KEY = ["currentUser"];

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Query for current user
  const { data: user, isLoading: isLoadingUser, isError: isUserError } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: authApi.getProfile,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput & { role?: 'user' | 'tasker' }) => {
      const role = data.role || 'user';
      return role === 'tasker' ? authApi.loginTasker(data) : authApi.loginUser(data);
    },
    onSuccess: (data, variables) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", variables.role || 'user'); // Store userType for profile fetch
      queryClient.setQueryData(USER_QUERY_KEY, data.user);
      router.push("/home"); // Redirect to home/dashboard
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => {
      const role = data.role || 'user';
      return role === 'tasker' ? authApi.registerTasker(data) : authApi.registerUser(data);
    },
    onSuccess: (data, variables) => {
       // Backend logic: User/Tasker needs verification.
       // Redirect to verify-email, passing email and type.
       const role = variables.role || 'user';
       router.replace(`/verify-email?email=${encodeURIComponent(data.user?.emailAddress || variables.email)}&type=${role}`);
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    queryClient.setQueryData(USER_QUERY_KEY, null);
    queryClient.clear(); // clear all cache
    router.push("/login"); // Redirect to login
  };

  return {
    user,
    isLoadingUser,
    isUserError,
    isAuthenticated: !!user,
    
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    logout,
  };
}

export function useVerifyEmail() {
  const router = useRouter();

  const verifyMutation = useMutation({
    mutationFn: (data: VerifyEmailInput) => authApi.verifyEmail(data),
    onSuccess: () => {
      router.push("/login"); // Redirect to login after verification
    },
  });

  const resendMutation = useMutation({
    mutationFn: (variables: { email: string; type: 'user' | 'tasker' }) => 
      authApi.resendCode(variables.email, variables.type),
  });

  return {
    verify: verifyMutation.mutate,
    verifyAsync: verifyMutation.mutateAsync,
    isVerifying: verifyMutation.isPending,
    verifyError: verifyMutation.error,

    resendCode: resendMutation.mutate,
    isResending: resendMutation.isPending,
  };
}
