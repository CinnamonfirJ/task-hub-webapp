"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { supportApi, SupportTicketInput } from "@/lib/api/support";
import { toast } from "sonner";

const supportSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export type SupportValues = z.infer<typeof supportSchema>;

export function useSupport() {
  const form = useForm<SupportValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SupportTicketInput) => supportApi.sendTicket(data),
    onSuccess: (res) => {
      toast.success(res.message || "Your message has been sent successfully!");
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to send message. Please try again later.");
    },
  });

  const onSubmit = (data: SupportValues) => {
    mutate(data);
  };

  return {
    form,
    onSubmit,
    isSubmitting: isPending,
  };
}
