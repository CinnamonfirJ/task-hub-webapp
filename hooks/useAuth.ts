"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { User, LoginInput, RegisterInput, VerifyEmailInput } from "@/types/auth";

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
    onSuccess: (data: any, variables) => {
      // API might return { accessToken } or { token } or { data: { ... } }
      let accessToken = data.accessToken || data.token || data.data?.accessToken || data.data?.token;
      
      // If it's an object, try to drill down further (unlikely but safe)
      if (accessToken && typeof accessToken === 'object') {
        accessToken = accessToken.token || accessToken.accessToken;
      }

      const role = variables.role || 'user';
      
      if (!accessToken || typeof accessToken !== 'string') {
        console.error("Invalid or missing access token in login response:", data);
        return;
      }

      localStorage.setItem("token", accessToken);
      localStorage.setItem("userType", role);

      // Handle dual response shapes (user vs tasker, wrapped or unwrapped)
      let userData = data.user || data.tasker || data.data?.user || data.data?.tasker;
      
      if (userData) {
        // Detect role from response structure first
        if (data.tasker || data.data?.tasker) {
          userData.role = "tasker";
        } else if (data.user || data.data?.user) {
          userData.role = "user";
        } else {
          // Fallback to the intent from variables
          userData.role = role;
        }
        
        queryClient.setQueryData(USER_QUERY_KEY, userData);
      }
      
      router.push("/home");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => {
      const role = data.role || 'user';
      return role === 'tasker' ? authApi.registerTasker(data) : authApi.registerUser(data);
    },
    onSuccess: (data, variables) => {
      // Registration does NOT return a token — redirect to email verification
      const role = variables.role || 'user';
      const emailAddress = data.user?.emailAddress || data.tasker?.emailAddress || variables.email;
      
      // Store email in localStorage as a fallback for the verification page
      if (emailAddress) {
        localStorage.setItem("lastRegisteredEmail", emailAddress);
      }
      
      router.replace(`/verify-email?email=${encodeURIComponent(emailAddress)}&type=${role}`);
    },
  });

  const logout = async () => {
    try {
      // Remove notification ID before logout
      await authApi.removeNotificationId().catch(() => {});
      // Call server-side logout
      await authApi.logout().catch(() => {});
    } finally {
      // Always clear client state even if server calls fail
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      queryClient.setQueryData(USER_QUERY_KEY, null);
      queryClient.clear();
      router.push("/login");
    }
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
      router.push("/login");
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
