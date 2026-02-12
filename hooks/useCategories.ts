import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api/categories";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => categoriesApi.getCategory(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
