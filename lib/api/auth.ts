import { apiData } from "@/lib/api";
import { AuthResponse, LoginInput, RegisterInput, VerifyEmailInput, User } from "@/types/auth";

export const authApi = {
  // Login endpoints
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

  // Register endpoints
  registerUser: async (data: RegisterInput): Promise<AuthResponse> => {
    // Adapter: map frontend 'fullName' to backend required fields if strictly one name field used
    // Backend expects: fullName, emailAddress, phoneNumber, password, country, residentState, address, etc.
    // Frontend only provides: fullName, email, password, phone. We'll send defaults for others or frontend should expand.
    return apiData<AuthResponse>("/api/auth/user-register", {
      method: "POST",
      body: JSON.stringify({
        fullName: data.fullName,
        emailAddress: data.email,
        password: data.password,
        phoneNumber: data.phone,
        // Mock defaults for required fields not in UI
        country: "Nigeria", // Default or extract
        residentState: "Lagos", 
        originState: "Lagos",
        address: "Default Address",
        dateOfBirth: "2000-01-01"
      }),
    });
  },

  registerTasker: async (data: RegisterInput): Promise<AuthResponse> => {
     // Backend for tasker expects firstName, lastName. Frontend has fullName.
     const [firstName, ...rest] = data.fullName.split(' ');
     const lastName = rest.join(' ') || "Lastname";

    return apiData<AuthResponse>("/api/auth/tasker-register", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        emailAddress: data.email,
        password: data.password,
        phoneNumber: data.phone,
        // Mock defaults
        country: "Nigeria",
        residentState: "Lagos",
        originState: "Lagos",
        address: "Default Address",
        dateOfBirth: "2000-01-01"
      }),
    });
  },

  verifyEmail: async (data: VerifyEmailInput): Promise<{ message: string }> => {
    return apiData<{ message: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ code: data.code, emailAddress: data.email, type: data.type || 'user' }), // Default type
    });
  },

  resendCode: async (email: string, type: 'user' | 'tasker' = 'user'): Promise<void> => {
    return apiData<void>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ emailAddress: email, type }),
    });
  },

  getProfile: async (): Promise<User> => {
    const userType = localStorage.getItem('userType') || 'user';
    const endpoint = userType === 'tasker' ? '/api/auth/tasker' : '/api/auth/user';
    
    // Response wrapper usually has { user: ... }
    const res = await apiData<{ user: User }>(endpoint, {
      method: "GET",
    });
    return res.user;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await apiData<{ user: User }>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.user;
  },

  updateProfilePicture: async (base64OrUrl: string): Promise<{ profilePicture: string }> => {
    return apiData<{ profilePicture: string }>("/api/auth/profile-picture", {
      method: "PUT",
      body: JSON.stringify({ profilePicture: base64OrUrl }),
    });
  },

  updateLocation: async (lat: number, lng: number): Promise<{ location: any }> => {
    return apiData<{ location: any }>("/api/auth/location", {
      method: "PUT",
      body: JSON.stringify({ latitude: lat, longitude: lng }),
    });
  },

  updateCategories: async (categories: string[]): Promise<string[]> => {
     const res = await apiData<{ categories: string[] }>("/api/auth/categories", {
      method: "PUT",
      body: JSON.stringify({ categories }),
    });
    return res.categories;
  },

  // Identity Verification (NIN)
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

  // Password Management
  changePassword: async (data: any): Promise<{ message: string }> => {
    return apiData<{ message: string }>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
