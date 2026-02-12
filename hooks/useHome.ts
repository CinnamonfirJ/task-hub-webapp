"use client";

import { useQuery } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api/tasks";
import { useAuth } from "@/hooks/useAuth";
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
  const isProfileComplete = (() => {
    if (!user) return false;

    // Basic fields required for everyone
    const hasBasicInfo = !!(
      (user.fullName || (user.firstName && user.lastName)) &&
      user.phoneNumber &&
      user.country &&
      user.residentState
    );

    if (!hasBasicInfo) return false;

    // Tasker specific requirements
    if (user.role === "tasker") {
      const hasCategories =
        Array.isArray(user.categories) && user.categories.length > 0;
      return hasCategories;
    }

    return true;
  })();

  // Fetch recent tasks from the API
  const {
    data: tasks,
    isLoading,
    isError,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ["recentTasks"],
    queryFn: () => tasksApi.getTasks({ limit: 6, status: "open" }),
    enabled: !!user, // Fetch if user exists, even if profile is incomplete
  });

  // Use the first task as the featured task
  const featuredTask = tasks?.[0];
  // Use remaining tasks as recent activities
  const recentTasks = tasks?.slice(1) || [];

  // Get user initials
  const userInitials = user?.fullName
    ? user.fullName
        .trim()
        .split(/\s+/)
        .map((word) => word[0].toUpperCase())
        .join("")
    : "U";

  // Tasker specific state
  // Tasker specific state
  const isVerified = (user as any)?.isVerified || (user as any)?.verifyIdentity || false;

  return {
    // User data
    user,
    userInitials,
    isProfileComplete,
    isLoadingUser,
    isUserError: isError || isUserFetchError,
    isVerified,

    // Tasks data
    featuredTask,
    recentTasks,
    isLoading: isLoading || isRefetching,
    isError,
    refetchTasks: refetch,
  };
}

/**
 * Specialized hook for Tasker Feed
 */
export function useTaskerFeed(params: { maxDistance?: number; status?: string } = {}) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["taskerFeed", params],
    queryFn: () => tasksApi.getTaskerFeed(params),
    enabled: !!user && user.role === "tasker",
  });
}

/**
 * Helper function to format deadline dates
 */
export function formatDeadline(deadline?: string): string {
  if (!deadline) return "No deadline";
  return new Date(deadline).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Helper function to get category name from task
 */
export function getCategoryName(categories: Task["categories"]): string {
  if (!categories || categories.length === 0) return "Uncategorized";
  const category = categories[0];
  if (typeof category === "string") return category;
  return category?.name || "Uncategorized";
}
