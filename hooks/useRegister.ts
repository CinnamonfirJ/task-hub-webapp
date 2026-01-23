"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { UserType } from "@/types/auth";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Valid phone number is required"),
  role: z.enum(["user", "tasker"]),
});

export type RegisterValues = z.infer<typeof registerSchema>;

export function useRegister() {
  const { registerAsync, isRegistering, registerError } = useAuth();
  
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      role: "user",
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    try {
      await registerAsync(data);
    } catch (err) {
       // Error handled by useMutation state
    }
  };

  const currentRole = form.watch("role");

  // Helper to set role from Tabs
  const setRole = (role: string) => {
    form.setValue("role", role as UserType);
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
