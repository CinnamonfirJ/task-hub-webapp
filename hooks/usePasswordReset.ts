"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserType } from "@/types/auth";

// ── Forgot Password ──────────────────────────────────────────────────────

const forgotPasswordSchema = z.object({
  emailAddress: z.string().email("Invalid email address"),
  type: z.enum(["user", "tasker"]),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function useForgotPassword() {
  const router = useRouter();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      emailAddress: "",
      type: "user",
    },
  });

  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (_data, variables) => {
      // Redirect to reset-password page with email pre-filled
      router.push(
        `/reset-password?email=${encodeURIComponent(variables.emailAddress)}&type=${variables.type}`
      );
    },
  });

  const onSubmit = (data: ForgotPasswordValues) => {
    mutation.mutate(data);
  };

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}

// ── Reset Password ───────────────────────────────────────────────────────

const resetPasswordSchema = z
  .object({
    code: z.string().length(5, "Code must be 5 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    emailAddress: z.string().email(),
    type: z.enum(["user", "tasker"]),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function useResetPassword(email?: string, type?: string) {
  const router = useRouter();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
      emailAddress: email || "",
      type: (type as UserType) || "user",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordValues) =>
      authApi.resetPassword({
        code: data.code,
        newPassword: data.newPassword,
        emailAddress: data.emailAddress,
        type: data.type as UserType,
      }),
    onSuccess: () => {
      router.push("/login");
    },
  });

  const onSubmit = (data: ResetPasswordValues) => {
    mutation.mutate(data);
  };

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}
