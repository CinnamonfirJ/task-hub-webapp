"use client";

import { useQuery } from "@tanstack/react-query";
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
