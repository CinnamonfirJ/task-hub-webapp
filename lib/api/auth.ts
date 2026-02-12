import { apiData } from "@/lib/api";
import {
  AuthResponse,
  RegisterResponse,
  LoginInput,
  RegisterInput,
  VerifyEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  DeactivateAccountInput,
  User,
} from "@/types/auth";

export const authApi = {
  // ── Login ──────────────────────────────────────────────────────────────

  loginUser: async (data: LoginInput): Promise<AuthResponse> => {
    return apiData<AuthResponse>("/api/auth/user-login", {
      method: "POST",
      body: JSON.stringify({ emailAddress: data.email, password: data.password }),
    });
  },

  loginTasker: async (data: LoginInput): Promise<AuthResponse> => {
    return apiData<AuthResponse>("/api/auth/tasker-login", {
      method: "POST",
      body: JSON.stringify({ emailAddress: data.email, password: data.password }),
    });
  },

  // ── Register ───────────────────────────────────────────────────────────

  registerUser: async (data: RegisterInput): Promise<RegisterResponse> => {
    return apiData<RegisterResponse>("/api/auth/user-register", {
      method: "POST",
      body: JSON.stringify({
        fullName: data.fullName,
        emailAddress: data.email,
        password: data.password,
        phoneNumber: data.phone,
        country: data.country,
        residentState: data.residentState,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
      }),
    });
  },

  registerTasker: async (data: RegisterInput): Promise<RegisterResponse> => {
    const [firstName, ...rest] = data.fullName.split(" ");
    const lastName = rest.join(" ") || "Lastname";

    return apiData<RegisterResponse>("/api/auth/tasker-register", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        emailAddress: data.email,
        password: data.password,
        phoneNumber: data.phone,
        country: data.country,
        residentState: data.residentState,
        originState: data.residentState,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        categories: data.categories || [],
      }),
    });
  },

  // ── Email Verification ─────────────────────────────────────────────────

  verifyEmail: async (data: VerifyEmailInput): Promise<{ status: string; message: string }> => {
    return apiData<{ status: string; message: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({
        code: data.token,
        emailAddress: data.emailAddress,
        type: data.type,
      }),
    });
  },

  resendCode: async (email: string, type: "user" | "tasker" = "user"): Promise<void> => {
    return apiData<void>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ emailAddress: email, type }),
    });
  },

  // ── Password Management ────────────────────────────────────────────────

  forgotPassword: async (data: ForgotPasswordInput): Promise<{ status: string; message: string }> => {
    return apiData<{ status: string; message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (data: ResetPasswordInput): Promise<{ status: string; message: string }> => {
    return apiData<{ status: string; message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: ChangePasswordInput): Promise<{ status: string; message: string }> => {
    return apiData<{ status: string; message: string }>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // ── Profile ────────────────────────────────────────────────────────────

  getProfile: async (): Promise<User> => {
    // Try the unified profile endpoint first
    try {
      const res = await apiData<any>("/api/auth/profile", { method: "GET" });
      const userData = res.user || res.tasker || res.data?.user || res.data?.tasker || res.data || res;
      
      if (userData) {
        // Detect role from response structure if possible
        if (res.tasker || res.data?.tasker) {
          userData.role = "tasker";
        } else if (res.user || res.data?.user) {
          userData.role = "user";
        } 
        
        // Final fallback: use localStorage or default
        if (!userData.role) {
          userData.role = (localStorage.getItem("userType") as any) || "user";
        }
      }
      return userData;
    } catch (err) {
      // Fallback
      const userType = localStorage.getItem("userType");
      
      // If we know the type, try that specifically
      if (userType) {
        const endpoint = userType === "tasker" ? "/api/auth/tasker" : "/api/auth/user";
        const res = await apiData<any>(endpoint, { method: "GET" });
        const userData = res.user || res.tasker || res.data?.user || res.data?.tasker || res.data || res;
        
        // Aggressively force the role based on the endpoint we just hit
        if (userData) {
          userData.role = userType as any;
        }
        return userData;
      }

      // If we don't know, try both
      try {
        const res = await apiData<any>("/api/auth/user", { method: "GET" });
        localStorage.setItem("userType", "user");
        const userData = res.user || res.data?.user || res.data || res;
        if (userData) userData.role = "user";
        return userData;
      } catch (userErr) {
        const res = await apiData<any>("/api/auth/tasker", { method: "GET" });
        localStorage.setItem("userType", "tasker");
        const userData = res.tasker || res.data?.tasker || res.data || res;
        if (userData) userData.role = "tasker";
        return userData;
      }
    }
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await apiData<{ status: string; user: User }>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.user;
  },

  updateProfilePicture: async (url: string): Promise<{ profilePicture: string }> => {
    return apiData<{ profilePicture: string }>("/api/auth/profile-picture", {
      method: "PUT",
      body: JSON.stringify({ profilePicture: url }),
    });
  },

  updateCategories: async (categories: string[]): Promise<{ tasker: User }> => {
    return apiData<{ tasker: User }>("/api/auth/categories", {
      method: "PUT",
      body: JSON.stringify({ categories }),
    });
  },

  // ── Notification ID ────────────────────────────────────────────────────

  updateNotificationId: async (notificationId: string): Promise<{ status: string; data: any }> => {
    const userType = localStorage.getItem("userType") || "user";
    const endpoint =
      userType === "tasker" ? "/api/auth/tasker/notification-id" : "/api/auth/user/notification-id";

    return apiData<{ status: string; data: any }>(endpoint, {
      method: "PUT",
      body: JSON.stringify({ notificationId }),
    });
  },

  removeNotificationId: async (): Promise<{ status: string; data: any }> => {
    const userType = localStorage.getItem("userType") || "user";
    const endpoint =
      userType === "tasker" ? "/api/auth/tasker/notification-id" : "/api/auth/user/notification-id";

    return apiData<{ status: string; data: any }>(endpoint, {
      method: "DELETE",
    });
  },

  // ── Identity Verification (Taskers) ────────────────────────────────────

  verifyIdentity: async (data: {
    nin: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: "male" | "female";
    phoneNumber?: string;
    email?: string;
  }): Promise<{ isVerified: boolean; matchStatus: string }> => {
    const res = await apiData<{ status: string; data: { isVerified: boolean; matchStatus: string } }>(
      "/api/auth/verify-identity",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return res.data;
  },

  getVerificationStatus: async (): Promise<{ isVerified: boolean }> => {
    const res = await apiData<{ data: { isVerified: boolean } }>("/api/auth/verification-status", {
      method: "GET",
    });
    return res.data;
  },

  // ── Session ────────────────────────────────────────────────────────────

  logout: async (): Promise<{ status: string; message: string }> => {
    return apiData<{ status: string; message: string }>("/api/auth/logout", {
      method: "POST",
    });
  },

  deactivateAccount: async (data: DeactivateAccountInput): Promise<{ status: string; message: string }> => {
    return apiData<{ status: string; message: string }>("/api/auth/deactivate-account", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
