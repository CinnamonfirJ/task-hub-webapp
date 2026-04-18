export type UserType = "user" | "tasker" | "admin";

export interface User {
  _id: string; 
  id?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  gender?: "male" | "female";
  emailAddress: string;
  email?: string;
  phoneNumber?: string;
  role?: UserType;
  isEmailVerified: boolean;
  isActive?: boolean;
  lastLogin?: string;
  profilePicture?: string;
  bio?: string;
  categories?: any[];
  university?: any;
  wallet?: number;
  notificationId?: string | null;
  
  // Profile Fields
  address?: string;
  country?: string;
  residentState?: string;
  dateOfBirth?: string;
  location?: {
    latitude: number;
    longitude: number;
    lastUpdated?: string;
  };
  isProfileComplete?: boolean;

  // Tasker-specific
  verifyIdentity?: boolean;
  isVerified?: boolean;
  isKYCVerified?: boolean;
  websiteLink?: string;
  previousWork?: { url: string; publicId: string }[];
}

// API returns accessToken (not "token") and user/tasker depending on role
export interface GoogleSignInSuccess {
  status: "success";
  token: string;
  user_type: UserType;
  isEmailVerified: boolean;
  expiresIn: string;
  linkedNow?: boolean;
  created?: boolean;
}

export interface GoogleProfilePrefill {
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  picture: string;
}

export interface GoogleOnboardingPayload extends Partial<RegisterInput> {
  idToken: string;
  user_type: UserType;
}

export interface AuthResponse {
  status: string;
  message: string;
  accessToken: string;
  user?: User;
  tasker?: User;
  emailVerificationRequired?: boolean;
  // Google specific
  code?: string;
  googleProfile?: GoogleProfilePrefill;
  token?: string; // Some endpoints might return 'token' instead of 'accessToken'
  linkedNow?: boolean;
  created?: boolean;
}



// Registration response (no token, just confirmation)
export interface RegisterResponse {
  status: string;
  message: string;
  emailVerificationRequired: boolean;
  user?: Partial<User>;
  tasker?: Partial<User>;
}

// Input Types
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: UserType;
  country?: string;
  residentState?: string;
  address?: string;
  dateOfBirth?: string;
  // Tasker-specific (filled by API layer mapping)
  firstName?: string;
  lastName?: string;
  categories?: string[];
}

export interface VerifyEmailInput {
  token: string;
  type: UserType;
  emailAddress?: string;
}

export interface ForgotPasswordInput {
  emailAddress: string;
  type: UserType;
}

export interface ResetPasswordInput {
  code: string;
  newPassword: string;
  emailAddress: string;
  type: UserType;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface DeactivateAccountInput {
  password: string;
}
