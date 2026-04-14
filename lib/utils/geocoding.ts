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

  // Administrative areas in order of common recognizability in Nigeria
  const town = address.town;
  const cityDistrict = address.city_district;
  const city = address.city;
  const state = address.state;

  // Prefer City District (like Ikeja) or Town (like Zaria) or City (like Abuja)
  let primary = cityDistrict || town || city;

  // If the city is "Lagos" but it's actually in a district like "Ikeja", 
  // cityDistrict might be more useful. 
  // But if everything is "Lagos", the user said they prefer "Lagos".
  
  // Special case: "Zaria Kaduna" example from user
  // If we have a town/city and a state that are different, combine them
  if (primary && state && primary !== state && !primary.includes(state)) {
    // If it's a major city like Lagos or Abuja, we might not need the state
    if (primary === "Lagos" || primary === "Abuja") return primary;
    return `${primary}, ${state}`;
  }

  if (primary) return primary;

  // Fallback to more specific areas if higher levels are missing
  if (address.suburb) return address.suburb;
  if (address.neighbourhood) return address.neighbourhood;

  return state || null;
}
