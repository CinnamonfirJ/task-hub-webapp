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
  UserType,
} from "@/types/auth";

export const authApi = {
  // ── Login ──────────────────────────────────────────────────────────────

  loginUser: async (data: LoginInput): Promise<AuthResponse> => {
    const res = await apiData<any>("/api/auth/user-login", {
      method: "POST",
      body: JSON.stringify({
        emailAddress: data.email,
        password: data.password,
      }),
    });

    // Extract token and user data (handle both wrapped in 'data' and unwrapped)
    // Use optional chaining for the root object 'res' to be safe
    const token =
      res?.data?.token ||
      res?.token ||
      res?.data?.accessToken ||
      res?.accessToken;
    const userData =
      res?.data?.user || res?.user || res?.data?.tasker || res?.tasker;

    // Store token and user type
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userType", "user");
    }

    // Return in AuthResponse format
    return {
      status: res?.status || "error",
      message: res?.message || "",
      accessToken: token,
      user: userData ? { ...userData, role: "user" as const } : undefined,
    };
  },

  loginTasker: async (data: LoginInput): Promise<AuthResponse> => {
    const res = await apiData<any>("/api/auth/tasker-login", {
      method: "POST",
      body: JSON.stringify({
        emailAddress: data.email,
        password: data.password,
      }),
    });

    // Extract token and tasker data (handle both wrapped in 'data' and unwrapped)
    const token =
      res?.data?.token ||
      res?.token ||
      res?.data?.accessToken ||
      res?.accessToken;
    const taskerData =
      res?.data?.tasker || res?.tasker || res?.data?.user || res?.user;

    // Store token and user type
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userType", "tasker");
    }

    // Return in AuthResponse format
    return {
      status: res?.status || "error",
      message: res?.message || "",
      accessToken: token,
      tasker: taskerData
        ? { ...taskerData, role: "tasker" as const }
        : undefined,
    };
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

  verifyEmail: async (
    data: VerifyEmailInput,
  ): Promise<{ status: string; message: string }> => {
    return apiData<{ status: string; message: string }>(
      "/api/auth/verify-email",
      {
        method: "POST",
        body: JSON.stringify({
          code: data.token,
          emailAddress: data.emailAddress,
          type: data.type,
        }),
      },
    );
  },

  resendCode: async (email: string, type: UserType = "user"): Promise<void> => {
    return apiData<void>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ emailAddress: email, type }),
    });
  },

  // ── Password Management ────────────────────────────────────────────────

  forgotPassword: async (
    data: ForgotPasswordInput,
  ): Promise<{ status: string; message: string }> => {
    return apiData<{ status: string; message: string }>(
      "/api/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  resetPassword: async (
    data: ResetPasswordInput,
  ): Promise<{ status: string; message: string }> => {
    return apiData<{ status: string; message: string }>(
      "/api/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  changePassword: async (
    data: ChangePasswordInput,
  ): Promise<{ status: string; message: string }> => {
    return apiData<{ status: string; message: string }>(
      "/api/auth/change-password",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  // ── Profile ────────────────────────────────────────────────────────────

  getProfile: async (): Promise<User> => {
    const userType =
      typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[authApi] getProfile starting. userType from storage: ${userType}`,
      );
    }

    // Determine which endpoints to try in order of probability
    const endpoints = [];
    if (userType === "admin") {
      endpoints.push("/api/admin/me", "/api/auth/user", "/api/auth/tasker");
    } else if (userType === "tasker") {
      endpoints.push("/api/auth/tasker", "/api/auth/user");
    } else {
      endpoints.push("/api/auth/user", "/api/auth/tasker", "/api/admin/me");
    }

    for (const endpoint of endpoints) {
      try {
        if (process.env.NODE_ENV === "development") {
          console.log(`[authApi] Trying endpoint: ${endpoint}`);
        }
        const res = await apiData<any>(endpoint, { method: "GET" });

        // Extract profile data based on standard patterns
        const profileData =
          res?.data?.admin ||
          res?.admin ||
          res?.data?.user ||
          res?.user ||
          res?.data?.tasker ||
          res?.tasker ||
          res?.data ||
          res;

        if (profileData && (profileData._id || profileData.id)) {
          if (process.env.NODE_ENV === "development") {
            console.log(
              `[authApi] getProfile (${endpoint}) success:`,
              profileData,
            );
          }

          // Sync userType based on where we found the profile
          if (endpoint === "/api/admin/me") {
            if (typeof window !== "undefined")
              localStorage.setItem("userType", "admin");
            // Normalize fields for consistency across the app
            if (!profileData._id && profileData.id)
              profileData._id = profileData.id;
            if (!profileData.fullName && profileData.name)
              profileData.fullName = profileData.name;
            if (!profileData.emailAddress && profileData.email)
              profileData.emailAddress = profileData.email;
            // Admin profiles usually already have a specific role (operations, super_admin, etc.)
            // We only default to 'admin' if it's missing or generic
            if (!profileData.role || profileData.role === "admin") {
              profileData.role = "admin";
            }
          } else if (endpoint === "/api/auth/tasker") {
            profileData.role = "tasker";
            if (typeof window !== "undefined")
              localStorage.setItem("userType", "tasker");
          } else if (endpoint === "/api/auth/user") {
            profileData.role = "user";
            if (typeof window !== "undefined")
              localStorage.setItem("userType", "user");
          }

          return profileData;
        }
      } catch (error: any) {
        if (
          process.env.NODE_ENV === "development" &&
          error?.message !== "Unauthorized"
        ) {
          console.error(
            `[authApi] Endpoint ${endpoint} failed:`,
            error.message || error,
          );
        }
        // If it's the last endpoint, we must throw
        if (endpoint === endpoints[endpoints.length - 1]) {
          throw error;
        }
        // Otherwise, ignore 401/404/etc and try next
      }
    }

    throw new Error("Could not retrieve profile from any known endpoint");
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const userType =
      typeof window !== "undefined" ? localStorage.getItem("userType") : "user";
    const endpoint =
      userType === "tasker" ? "/api/auth/tasker" : "/api/auth/user";

    const res = await apiData<any>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    // Extract user or tasker
    const userData =
      res?.data?.user || res?.user || res?.data?.tasker || res?.tasker;
    if (!userData) {
      throw new Error("Invalid update profile response");
    }

    // Preserve role explicitly
    userData.role = userType as any;

    return userData;
  },

  updateProfilePicture: async (
    url: string,
  ): Promise<{ profilePicture: string }> => {
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

  updateNotificationId: async (
    notificationId: string,
  ): Promise<{ status: string; data: any }> => {
    const userType = localStorage.getItem("userType") || "user";
    const endpoint =
      userType === "tasker"
        ? "/api/auth/tasker/notification-id"
        : "/api/auth/user/notification-id";

    return apiData<any>(endpoint, {
      method: "PUT",
      body: JSON.stringify({ notificationId }),
    });
  },

  removeNotificationId: async (): Promise<{ status: string; data: any }> => {
    const userType = localStorage.getItem("userType") || "user";
    const endpoint =
      userType === "tasker"
        ? "/api/auth/tasker/notification-id"
        : "/api/auth/user/notification-id";

    return apiData<any>(endpoint, {
      method: "DELETE",
    });
  },

  // ── Identity Verification (Taskers) ────────────────────────────────────

  verifyIdentity: async (data: {
    nin: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender?: "male" | "female";
    phoneNumber?: string;
    email?: string;
  }): Promise<{
    status: string;
    message: string;
    isVerified: boolean;
    kycId: string;
    verificationUrl?: string;
  }> => {
    const res = await apiData<any>("/api/v1/verify-nin", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res;
  },

  getVerificationStatus: async (): Promise<{ isVerified: boolean }> => {
    const res = await apiData<any>("/api/auth/verification-status", {
      method: "GET",
    });
    return res?.data || { isVerified: false };
  },

  // ── Session ────────────────────────────────────────────────────────────

  logout: async (): Promise<{ status: string; message: string }> => {
    return apiData<{ status: string; message: string }>("/api/auth/logout", {
      method: "POST",
    });
  },

  deactivateAccount: async (
    data: DeactivateAccountInput,
  ): Promise<{ status: string; message: string }> => {
    return apiData<{ status: string; message: string }>(
      "/api/auth/deactivate-account",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },
};
