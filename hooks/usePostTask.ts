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
  categories: z.array(z.string()).min(1, "Please select at least one category").max(3, "Max 3 categories allowed"),
  budget: z.string().min(1, "Budget is required"),
  location: z.any().optional(),
  deadline: z.string().min(1, "Deadline is required"),
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
      title: "",
      description: "",
      budget: "",
      categories: [],
      isBiddingEnabled: false,
      tags: [],
      images: [],
    },
  });

  // Submit handler that transforms data and calls mutation
  const onSubmit = (data: PostTaskValues) => {
    createTaskMutation.mutate({
      ...data,
      budget: Number(data.budget),
      // If location is string, we might need a better format or mock coordinates
      location: data.location || { latitude: 6.5244, longitude: 3.3792 }, 
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
