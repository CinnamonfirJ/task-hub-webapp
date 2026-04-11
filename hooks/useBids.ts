import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bidsApi } from "@/lib/api/bids";
import { CreateBidInput, UpdateBidInput } from "@/types/bid";

export function useMyBids(status?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["myBids", status],
    queryFn: () => bidsApi.getMyBids(status),
    enabled: options?.enabled,
  });
}

export function useTaskBids(taskId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["taskBids", taskId],
    queryFn: () => bidsApi.getTaskBids(taskId),
    enabled: options?.enabled !== undefined ? options.enabled : !!taskId,
  });
}

export function useBidDetails(id: string) {
  return useQuery({
    queryKey: ["bid", id],
    queryFn: () => bidsApi.getBid(id),
    enabled: !!id,
  });
}

export function useCreateBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBidInput) => bidsApi.createBid(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["myBids"] });
      queryClient.invalidateQueries({
        queryKey: ["taskBids", variables.taskId],
      });
    },
  });
}

export function useUpdateBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBidInput }) =>
      bidsApi.updateBid(id, data),
    onSuccess: (data) => {
      const taskId = typeof data.task === "object" ? data.task?._id : data.task;
      queryClient.invalidateQueries({ queryKey: ["myBids"] });
      queryClient.invalidateQueries({ queryKey: ["bid", data._id] });
      if (taskId) {
        queryClient.invalidateQueries({ queryKey: ["taskBids", taskId] });
        queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      }
    },
  });
}

export function useDeleteBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bidsApi.deleteBid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBids"] });
      queryClient.invalidateQueries({ queryKey: ["taskBids"] });
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });
}

export function useAcceptBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bidsApi.acceptBid(id),
    onMutate: async (bidId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["myBids"] });
      await queryClient.cancelQueries({ queryKey: ["taskBids"] });
      await queryClient.cancelQueries({ queryKey: ["task"] });

      // Snapshot the previous value
      const previousBids = queryClient.getQueryData(["myBids"]);
      const previousTaskBids = queryClient.getQueriesData({ queryKey: ["taskBids"] });

      // Optimistically update to the new value
      // Note: We don't have the taskId yet in onMutate, but we can update all lists if needed
      // or wait for onSuccess if we want to be very precise. 
      // To be immediate, we trigger the loading states already handled by isPending.
      
      return { previousBids, previousTaskBids };
    },
    onSuccess: (data) => {
      const taskId = data.task?._id || data.task;
      queryClient.invalidateQueries({ queryKey: ["taskBids", taskId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["myBids"] });
      queryClient.invalidateQueries({ queryKey: ["userTasks"] });
      queryClient.invalidateQueries({ queryKey: ["bid", data.bid?._id] });
      queryClient.invalidateQueries({ queryKey: ["taskerFeed"] });
    },
    onError: (err, bidId, context) => {
      if (context?.previousBids) {
        queryClient.setQueryData(["myBids"], context.previousBids);
      }
    },
    onSettled: (data) => {
      const taskId = data?.task?._id || data?.task;
      if (taskId) {
        queryClient.invalidateQueries({ queryKey: ["taskBids", taskId] });
        queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      }
      queryClient.invalidateQueries({ queryKey: ["myBids"] });
    },
  });
}

export function useRejectBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      bidsApi.rejectBid(id, reason),
    onSuccess: (data) => {
      const bidId = data?._id;
      const taskId = typeof data?.task === "object" ? data.task?._id : data?.task;

      queryClient.invalidateQueries({ queryKey: ["taskBids", taskId] });
      queryClient.invalidateQueries({ queryKey: ["bid", bidId] });
      queryClient.invalidateQueries({ queryKey: ["myBids"] });
      queryClient.invalidateQueries({ queryKey: ["userTasks"] });
      if (taskId) {
        queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      }
    },
  });
}
