"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api/tasks";
import { useCategories } from "@/hooks/useCategories";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

// Schema for task creation form
const postTaskSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z.string().min(20, "Description must be at least 20 characters long"),
  mainCategory: z.string().min(1, "Please select a main category"),
  categories: z.array(z.string()).min(1, "Please select at least one subcategory"),
  university: z.string().optional(),
  budget: z.string().min(1, "Budget is required"),
  location: z.any().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  isBiddingEnabled: z.boolean(),
  tags: z.array(z.string()),
  images: z.array(z.any()).max(5, "Maximum 5 images allowed").optional(),
});

export type PostTaskValues = z.infer<typeof postTaskSchema>;

export function useEditTask(taskId: string) {
  const router = useRouter();

  // Fetch categories for the dropdown
  const {
    data: categories,
    isLoading: isLoadingCategories,
  } = useCategories();

  const { data: task, isLoading: isLoadingTask } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => tasksApi.getTask(taskId),
    enabled: !!taskId,
  });

  // Mutation for updating task
  const updateTaskMutation = useMutation({
    mutationFn: (data: FormData) => tasksApi.updateTask(taskId, data),
    onSuccess: (data) => {
      toast.success("Task updated successfully!");
      router.push(`/tasks/${data._id}`);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update task. Please try again or check your input.");
    }
  });

  // Form setup with zod validation
  const form = useForm<PostTaskValues>({
    resolver: zodResolver(postTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "",
      mainCategory: "",
      categories: [],
      university: "",
      isBiddingEnabled: true,
      dueDate: "",
      tags: [],
      images: [],
    },
  });

  // Effect to prepopulate form when task is loaded
  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title || "",
        description: task.description || "",
        budget: String(task.budget || ""),
        mainCategory: (typeof task.mainCategory === 'object' && task.mainCategory?._id) 
          ? task.mainCategory._id 
          : (typeof task.mainCategory === 'string' ? task.mainCategory : ""),
        categories: Array.isArray(task.categories) 
          ? task.categories.map((c: any) => typeof c === "string" ? c : c._id) 
          : [],
        university: (typeof task.university === "object" && task.university?._id) 
          ? task.university._id 
          : (task.university || ""),
        isBiddingEnabled: task.isBiddingEnabled !== false,
        dueDate: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : "",
        tags: Array.isArray(task.tags) ? task.tags : [],
        images: Array.isArray(task.images) ? task.images.map((img: any) => ({ url: typeof img === 'string' ? img : img.url })) : [],
      });
    }
  }, [task, form]);

  // Submit handler that transforms data and calls mutation
  const onSubmit = (data: PostTaskValues) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.mainCategory) formData.append("mainCategory", data.mainCategory);
    if (data.categories?.length) {
      formData.append("categories", JSON.stringify(data.categories));
    }
    formData.append("budget", String(data.budget));
    
    // Format deadline
    if (data.dueDate) {
      formData.append("deadline", new Date(data.dueDate).toISOString());
    }

    if (data.isBiddingEnabled !== undefined) {
      formData.append("isBiddingEnabled", String(data.isBiddingEnabled));
    }

    if (data.university) {
      formData.append("university", data.university);
    }

    if (data.tags?.length) {
      formData.append("tags", JSON.stringify(data.tags));
    }

    const loc = typeof data.location === 'object' ? {
      latitude: data.location?.latitude || 6.5244,
      longitude: data.location?.longitude || 3.3792,
      address: data.location?.address || "Lagos, Nigeria"
    } : {
      latitude: 6.5244,
      longitude: 3.3792,
      address: data.location || "Lagos, Nigeria"
    };
    formData.append("location", JSON.stringify(loc));

    // Images
    if (data.images && data.images.length > 0) {
      data.images.forEach((img: any) => {
        // Appends each file object
        if (img.file) {
          formData.append("images", img.file);
        } else if (img instanceof File) {
          formData.append("images", img);
        }
      });
    }

    updateTaskMutation.mutate(formData);
  };

  return {
    form,
    onSubmit,
    categories,
    isLoadingCategories,
    isLoadingTask,
    isSubmitting: updateTaskMutation.isPending,
  };
}
