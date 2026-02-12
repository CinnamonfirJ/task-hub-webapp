"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api/tasks";
import { useCategories } from "@/hooks/useCategories";
import { useRouter } from "next/navigation";

// Schema for task creation form
const postTaskSchema = z.object({
  title: z.string().min(5, "Title is too short"),
  description: z.string().min(20, "Description is too short"),
  categories: z.array(z.string()).min(1, "Please select at least one category").max(3, "Max 3 categories allowed"),
  budget: z.string().min(1, "Budget is required"),
  location: z.any().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  isBiddingEnabled: z.boolean(),
  tags: z.array(z.string()),
  images: z.array(z.any()).optional(),
});

export type PostTaskValues = z.infer<typeof postTaskSchema>;

export function usePostTask() {
  const router = useRouter();

  // Fetch categories for the dropdown
  const {
    data: categories,
    isLoading: isLoadingCategories,
  } = useCategories();

  // Mutation for creating a new task
  const createTaskMutation = useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: (data) => {
      router.push(`/tasks/${data._id}`);
    },
  });

  // Form setup with zod validation
  const form = useForm<PostTaskValues>({
    resolver: zodResolver(postTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "",
      categories: [],
      isBiddingEnabled: true,
      dueDate: "",
      tags: [],
      images: [],
    },
  });

  // Submit handler that transforms data and calls mutation
  const onSubmit = (data: PostTaskValues) => {
    createTaskMutation.mutate({
      ...data,
      budget: Number(data.budget),
      // Ensure location matches spec
      location: typeof data.location === 'object' ? {
        latitude: data.location?.latitude || 6.5244,
        longitude: data.location?.longitude || 3.3792,
        address: data.location?.address || "Lagos, Nigeria"
      } : {
        latitude: 6.5244,
        longitude: 3.3792,
        address: data.location || "Lagos, Nigeria"
      },
    } as any);
  };

  return {
    form,
    onSubmit,
    categories,
    isLoadingCategories,
    isSubmitting: createTaskMutation.isPending,
  };
}
