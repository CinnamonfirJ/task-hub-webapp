/**
 * Utility for reverse geocoding from latitude and longitude.
 * Uses Nominatim OpenStreetMap API.
 */

export async function getAreaFromCoords(lat: number, lon: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return getAreaOnly(data.address);
  } catch (error) {
    console.warn("Reverse geocoding error:", error);
    return null;
  }
}

export function getAreaOnly(address: any): string | null {
  if (!address) return null;
  if (address.suburb) return address.suburb;
  if (address.city_district) return address.city_district;
  if (address.neighbourhood) return address.neighbourhood;
  if (address.town) return address.town;
  if (address.city) return address.city;
  return null;
}
