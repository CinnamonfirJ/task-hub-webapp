"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api/tasks";
import { useRouter } from "next/navigation";

// Schema for task creation form
const postTaskSchema = z.object({
  title: z.string().min(5, "Title is too short"),
  description: z.string().min(20, "Description is too short"),
  category: z.string().min(1, "Please select a category"),
  budget: z.string().min(1, "Budget is required"),
  location: z.string().optional(),
  deadline: z.string().optional(),
});

export type PostTaskValues = z.infer<typeof postTaskSchema>;

/**
 * Custom hook for the Post Task page.
 * Encapsulates:
 * - Category fetching (useQuery)
 * - Task creation mutation (useMutation)
 * - Form initialization and validation (useForm)
 * - Navigation side-effect on success
 */
export function usePostTask() {
  const router = useRouter();

  // Fetch categories for the dropdown
  const {
    data: categories,
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: tasksApi.getCategories,
  });

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
      budget: "",
    },
  });

  // Submit handler that transforms data and calls mutation
  const onSubmit = (data: PostTaskValues) => {
    createTaskMutation.mutate({
      ...data,
      budget: Number(data.budget),
    });
  };

  return {
    // Form
    form,
    onSubmit,

    // Categories
    categories,
    isLoadingCategories,

    // Mutation state
    isSubmitting: createTaskMutation.isPending,
  };
}
