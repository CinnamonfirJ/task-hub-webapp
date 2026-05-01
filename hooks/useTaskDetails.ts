"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api/tasks";
import { useRouter, useParams } from "next/navigation";

export function useTaskDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["task", id],
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id,
  });

  const goBack = () => {
    router.back();
  };

  return {
    // Task data
    task,
    isLoading,
    error,

    // Navigation
    goBack,
  };
}

/**
 * Hook to fetch completion code (for task posters).
 */
export function useCompletionCode(taskId: string) {
  return useQuery({
    queryKey: ["completionCode", taskId],
    queryFn: () => tasksApi.getCompletionCode(taskId),
    enabled: !!taskId,
  });
}

/**
 * Hook for taskers to manage task status (start/complete).
 */
export function useUpdateTaskStatusTasker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: { status: "in-progress" | "completed"; completionCode?: string };
    }) => tasksApi.updateTaskStatusTasker(taskId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ["userTasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskerWallet"] });
    },
  });
}

/**
 * Hook to fetch tasker's own tasks (history).
 */
export function useTaskerTasks(
  filters: { status?: string; page?: number; limit?: number } = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["taskerTasks", filters],
    queryFn: () => tasksApi.getTaskerTasks(filters),
    ...options,
  });
}

export function useRateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { rating: number; reviewText?: string } }) =>
      tasksApi.rateTask(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["userTasks"] });
    },
  });
}
