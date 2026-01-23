"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export function useLogin() {
  const [role, setRole] = useState<"user" | "tasker">("user");
  const { loginAsync, isLoggingIn, loginError } = useAuth();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      await loginAsync({ ...data, role });
    } catch (err: any) {
      // Error handled by hook
    }
  };

  return {
    form,
    role,
    setRole,
    onSubmit,
    isLoggingIn,
    loginError,
  };
}
