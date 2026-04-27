"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { UserType } from "@/types/auth";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Valid phone number is required"),
  country: z.string().min(1, "Country is required"),
  residentState: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  role: z.enum(["user", "tasker", "admin"]),
});

export type RegisterValues = z.infer<typeof registerSchema>;

export function useRegister(): {
  form: UseFormReturn<RegisterValues, any, RegisterValues>;
  onSubmit: (data: RegisterValues) => Promise<void>;
  currentRole: UserType;
  setRole: (role: string) => void;
  isRegistering: boolean;
  registerError: any;
} {
  const { registerAsync, isRegistering, registerError } = useAuth();

  const form = useForm<RegisterValues, any, RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      country: "Nigeria",
      residentState: "",
      address: "",
      dateOfBirth: "",
      role: "user",
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    try {
      // Store credentials temporarily for auto-login after OTP
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pendingEmail", data.email);
        sessionStorage.setItem("pendingPassword", data.password);
        sessionStorage.setItem("pendingRole", data.role);
      }
      
      await registerAsync(data);
    } catch (err) {
      // Error handled by useMutation state
    }
  };

  const currentRole = form.watch("role");

  // Helper to set role
  const setRole = (role: string) => {
    form.setValue("role", role as UserType, { shouldValidate: true });
  };

  return {
    form,
    onSubmit,
    currentRole,
    setRole,
    isRegistering,
    registerError,
  };
}
