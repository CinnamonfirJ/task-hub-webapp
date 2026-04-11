"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { tasksApi, TaskerFeedResponse } from "@/lib/api/tasks";
import { useAuth } from "@/hooks/useAuth";
import { checkProfileCompleteness } from "@/hooks/useCompleteProfile";
import { Task } from "@/types/task";

/**
 * Custom hook for the Home page.
 * Encapsulates:
 * - User data from auth context
 * - Profile completeness check logic
 * - Recent tasks fetching (useQuery)
 * - Derived state for featured task and recent activities
 * - Helper functions for formatting
 */
export function useHome() {
  const { user, isLoadingUser, isUserError: isUserFetchError } = useAuth();

  // Profile Completeness Check
  const isProfileComplete = checkProfileCompleteness(user);

  // Determine if user is a tasker
  const isTasker = user?.role === "tasker";

  // Fetch recent tasks from the API
  // For taskers: use tasker feed endpoint
  // For users: use general tasks endpoint
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    isError: isTasksError,
    refetch: refetchTasks,
    isRefetching: isRefetchingTasks,
  } = useQuery({
    queryKey: isTasker
      ? ["taskerFeed", { maxDistance: 200 }]
      : ["userDashboardTasks"],
    queryFn: async () => {
      const res = isTasker
        ? await tasksApi.getTaskerFeed({ maxDistance: 200 })
        : await tasksApi.getUserDashboardTasks({ limit: 6 });

      return Array.isArray(res) ? res : (res as any).tasks || [];
    },
    enabled: !!user, // Fetch if user exists, even if profile is incomplete
  });

  // For taskers: fetch their bids for recent activities
  const {
    data: myBids,
    isLoading: isLoadingBids,
    isError: isBidsError,
    refetch: refetchBids,
  } = useQuery({
    queryKey: ["myBids"],
    queryFn: async () => {
      const { bidsApi } = await import("@/lib/api/bids");
      return bidsApi.getMyBids();
    },
    enabled: !!user && isTasker,
  });

  // Use the first task as the featured task (for users)
  const featuredTask = !isTasker ? tasks?.[0] : undefined;

  // For users: use remaining tasks as recent activities
  // For taskers: use available tasks from feed (limit to 2 for homepage)
  const recentTasks = isTasker
    ? tasks?.slice(0, 2) || []
    : tasks?.slice(1) || [];

  // For taskers: recent activities are their bids
  const recentActivities = isTasker ? myBids || [] : [];

  // Get display name
  const userName =
    user?.fullName ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || "User");

  // Get user initials
  const userInitials = (() => {
    if (user?.fullName) {
      return user.fullName
        .trim()
        .split(/\s+/)
        .map((word) => word[0].toUpperCase())
        .join("")
        .substring(0, 2);
    }
    if (user?.firstName || user?.lastName) {
      const first = user.firstName?.[0] || "";
      const last = user.lastName?.[0] || "";
      return (first + last).toUpperCase() || "U";
    }
    return "U";
  })();

  // Tasker specific state
  const isVerified =
    !!(user as any)?.isVerified ||
    !!(user as any)?.verifyIdentity ||
    !!(user as any)?.isKYCVerified ||
    !!(user as any)?.kycVerified ||
    !!(user as any)?.verified ||
    user?.role === "admin" ||
    false;

  const hasCategories = isTasker
    ? (Array.isArray(user?.categories) && user.categories.length > 0) ||
      (Array.isArray((user as any)?.mainCategories) &&
        (user as any).mainCategories.length > 0) ||
      (Array.isArray((user as any)?.subCategories) &&
        (user as any).subCategories.length > 0)
    : true;

  return {
    // User data
    user,
    userName,
    userInitials,
    isProfileComplete,
    isLoadingUser,
    isUserError: isUserFetchError,
    isVerified,
    isTasker,
    hasCategories,

    // Tasks data
    featuredTask,
    recentTasks,
    recentActivities, // For taskers: their bids
    isLoading: isLoadingTasks || isRefetchingTasks,
    isError: isTasksError,
    isLoadingActivities: isTasker && isLoadingBids,
    isActivitiesError: isTasker && isBidsError,
    refetchTasks: () => {
      refetchTasks();
      if (isTasker) refetchBids();
    },
  };
}

/**
 * Specialized hook for Tasker Feed
 */
export function useTaskerFeed(
  params: { maxDistance?: number; status?: string } = {},
) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["taskerFeed", params],
    queryFn: async () => {
      const res = await tasksApi.getTaskerFeed(params);
      return res.tasks;
    },
    enabled: !!user && user.role === "tasker",
    refetchInterval: params.status?.includes("assigned") ? 5000 : false, // Poll only if looking at status tab
  });
}

/**
 * Infinite scroll hook for Tasker Feed
 */
export function useInfiniteTaskerFeed(
  params: {
    maxDistance?: number;
    status?: string;
    limit?: number;
    biddingOnly?: boolean;
    budget_min?: number;
    budget_max?: number;
  } = {},
) {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: ["infiniteTaskerFeed", params],
    queryFn: ({ pageParam }) =>
      tasksApi.getTaskerFeed({ ...params, cursor: pageParam as string }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor || undefined,
    enabled: !!user && user.role === "tasker",
    refetchInterval: params.status?.includes("assigned") ? 5000 : false,
  });
}

/**
 * Helper function to format deadline dates
 */
export function formatDeadline(deadline?: string): string {
  if (!deadline) return "Pending";
  return new Date(deadline).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Helper function to get category name from task
 */
export function getCategoryName(task?: Partial<Task>): string {
  if (!task) return "Uncategorized";

  const sub = task.subCategory;
  if (sub) {
    if (typeof sub === "object") return sub.displayName || sub.name;
    return sub;
  }

  const main = task.mainCategory;
  if (main) {
    if (typeof main === "object") return main.displayName || main.name;
    return main;
  }

  const categories = task.categories || [];
  if (categories.length > 0) {
    const category = categories[0];
    if (typeof category === "object")
      return category.displayName || category.name;
    return category;
  }

  return "Uncategorized";
}
