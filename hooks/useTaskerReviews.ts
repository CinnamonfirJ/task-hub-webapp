"use client";

import { useQuery } from "@tanstack/react-query";
import { taskersApi } from "@/lib/api/taskers";

export function useTaskerReviews(taskerId: string, params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["taskerReviews", taskerId, params],
    queryFn: () => taskersApi.getTaskerReviews(taskerId, params),
    enabled: !!taskerId,
  });
}
