"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";

// ── Change Password ──────────────────────────────────────────────────────

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export function useChangePassword() {
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ChangePasswordValues) =>
      authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      form.reset();
    },
  });

  const onSubmit = (data: ChangePasswordValues) => {
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

// ── Deactivate Account ───────────────────────────────────────────────────

const deactivateSchema = z.object({
  password: z.string().min(1, "Password is required to deactivate your account"),
});

export type DeactivateAccountValues = z.infer<typeof deactivateSchema>;

export function useDeactivateAccount() {
  const { logout } = useAuth();

  const form = useForm<DeactivateAccountValues>({
    resolver: zodResolver(deactivateSchema),
    defaultValues: {
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: authApi.deactivateAccount,
    onSuccess: () => {
      // After deactivation, logout and clear session
      logout();
    },
  });

  const onSubmit = (data: DeactivateAccountValues) => {
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
