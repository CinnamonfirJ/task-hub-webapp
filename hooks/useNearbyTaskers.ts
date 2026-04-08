import { useQuery } from "@tanstack/react-query";
import { taskersApi } from "@/lib/api/taskers";

export function useNearbyTaskers(latitude?: number, longitude?: number, enabled = true) {
  return useQuery({
    queryKey: ["nearby-taskers", latitude, longitude],
    queryFn: () => taskersApi.getNearbyTaskers({ latitude, longitude }),
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
