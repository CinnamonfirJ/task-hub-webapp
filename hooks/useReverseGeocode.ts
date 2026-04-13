import { useQuery } from "@tanstack/react-query";
import { getAreaFromCoords } from "@/lib/utils/geocoding";

/**
 * Hook to get area name from coordinates.
 * Results are cached by coordinates.
 */
export function useReverseGeocode(lat?: number, lon?: number, enabled = true) {
  return useQuery({
    queryKey: ["reverse-geocode", lat, lon],
    queryFn: async () => {
      if (lat === undefined || lon === undefined) return null;
      return getAreaFromCoords(lat, lon);
    },
    enabled: enabled && lat !== undefined && lon !== undefined,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours as locations don't change often
    retry: 1,
  });
}
