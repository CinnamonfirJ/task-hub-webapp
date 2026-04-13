import React from "react";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskLocationProps {
  latitude?: number;
  longitude?: number;
  fallbackAddress?: string;
  className?: string;
}

/**
 * Displays the area name for a task.
 * If coordinates are provided, it attempts to reverse geocode them.
 * Otherwise, it shows the fallback address.
 */
export function TaskLocation({
  latitude,
  longitude,
  fallbackAddress,
  className = "",
}: TaskLocationProps) {
  // Only geocode if we don't have a reliable specific address or if it looks like a generic city
  const isGeneric = 
    !fallbackAddress || 
    fallbackAddress.toLowerCase() === "lekki phase 1" || 
    fallbackAddress.toLowerCase() === "lagos, nigeria";

  const { data: areaName, isLoading } = useReverseGeocode(latitude, longitude, isGeneric && !!latitude && !!longitude);

  if (isLoading) {
    return <Skeleton className="h-3 w-24 inline-block align-middle" />;
  }

  // Priority: 
  // 1. Geocoded area name (if fetching was triggered and succeeded)
  // 2. Fallback address (if it's not the generic placeholder)
  // 3. "Nearby"
  
  const displayAddress = areaName || (fallbackAddress && !isGeneric ? fallbackAddress : "Nearby Location");

  return <span className={className}>{displayAddress}</span>;
}
