import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bidsApi } from "@/lib/api/bids";
import { CreateBidInput, UpdateBidInput } from "@/types/bid";

export function useMyBids(status?: string) {
  return useQuery({
    queryKey: ["myBids", status],
    queryFn: () => bidsApi.getMyBids(status),
  });
}

export function useTaskBids(taskId: string) {
  return useQuery({
    queryKey: ["taskBids", taskId],
    queryFn: () => bidsApi.getTaskBids(taskId),
    enabled: !!taskId,
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
      queryClient.invalidateQueries({ queryKey: ["taskBids", variables.taskId] });
    },
  });
}

export function useUpdateBid() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBidInput }) => 
      bidsApi.updateBid(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["myBids"] });
      queryClient.invalidateQueries({ queryKey: ["bid", data._id] });
      // Note: We might not have taskId easily available here to invalidate taskBids
      // but the details and list will be updated.
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
    },
  });
}

export function useAcceptBid() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => bidsApi.acceptBid(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["taskBids", data.task._id] });
      queryClient.invalidateQueries({ queryKey: ["task", data.task._id] });
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
      queryClient.invalidateQueries({ queryKey: ["taskBids"] });
      queryClient.invalidateQueries({ queryKey: ["bid", data._id] });
    },
  });
}
