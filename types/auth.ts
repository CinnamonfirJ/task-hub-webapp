export type UserType = "user" | "tasker";

export interface User {
  _id: string; 
  id?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  emailAddress: string;
  email?: string;
  phoneNumber?: string;
  role?: UserType;
  isEmailVerified: boolean;
  profilePicture?: string;
  categories?: any[];
  wallet?: number;
  
  // Profile Fields
  address?: string;
  country?: string;
  residentState?: string;
  originState?: string; // Tasker only
  dateOfBirth?: string;
  location?: {
    latitude: number;
    longitude: number;
    lastUpdated?: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
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
}

export interface VerifyEmailInput {
  email: string;
  code: string;
  type?: UserType;
}
