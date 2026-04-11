import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { chatApi } from "@/lib/api/chat";
import { CreateConversationInput, SendMessageInput } from "@/types/chat";

export function useConversations(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["conversations", page, limit],
    queryFn: () => chatApi.getMyConversations(page, limit),
    refetchInterval: 5000, // Poll every 5 seconds for new messages/conversations
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: () => chatApi.getConversation(id),
    enabled: !!id,
    refetchInterval: 10000,
  });
}

export function useMessages(
  conversationId: string,
  limit = 20,
  before?: string,
) {
  return useQuery({
    queryKey: ["messages", conversationId, before],
    queryFn: () => chatApi.getMessages(conversationId, limit, before),
    enabled: !!conversationId,
    refetchInterval: 3000, // Frequent polling for active chat
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateConversationInput) =>
      chatApi.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      conversationId,
      data,
    }: {
      conversationId: string;
      data: SendMessageInput | FormData;
    }) => chatApi.sendMessage(conversationId, data),
    onSuccess: (_, variables) => {
      // Immediate refetch for smooth UI
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => chatApi.markAsRead(conversationId),
    onSuccess: (_, conversationId) => {
      // Force update of conversations and the specific conversation object
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversationId],
      });
    },
  });
}

export function useInfiniteMessages(conversationId: string, limit = 20) {
  return useInfiniteQuery({
    queryKey: ["messages-infinite", conversationId],
    queryFn: ({ pageParam }) =>
      chatApi.getMessages(conversationId, limit, pageParam as string),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore || lastPage.messages.length === 0) return undefined;
      return lastPage.messages[lastPage.messages.length - 1]._id; // Use the last message's ID as the older cursor
    },
    enabled: !!conversationId,
    refetchInterval: 3000,
  });
}
