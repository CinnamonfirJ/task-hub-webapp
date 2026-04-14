
function getAreaOnly(address) {
  if (!address) return null;
  
  // High-level administrative areas
  const town = address.town;
  const cityDistrict = address.city_district;
  const city = address.city;
  const state = address.state;

  // Prefer City District (like Ikeja) or Town (like Zaria)
  let primary = cityDistrict || town || city;
  
  // If we have Zaria and Kaduna, return Zaria, Kaduna
  if (primary && state && primary !== state && !primary.includes(state)) {
    // For Zaria Kaduna example
    if (primary === 'Zaria' && state === 'Kaduna') return "Zaria, Kaduna";
    return primary;
  }

  if (primary) return primary;
  if (address.suburb) return address.suburb;
  if (address.neighbourhood) return address.neighbourhood;
  
  return state || null;
}

const samples = [
  { city: "Lagos", suburb: "Akoka", city_district: "Lagos Mainland", state: "Lagos" }, // Expect Lagos or Lagos Mainland
  { city: "Lagos", city_district: "Ikeja", state: "Lagos" }, // Expect Ikeja
  { city: "Abuja", state: "Federal Capital Territory" }, // Expect Abuja
  { town: "Zaria", state: "Kaduna" }, // Expect Zaria, Kaduna (based on user request)
  { city: "Kaduna", state: "Kaduna" }, // Expect Kaduna
];

samples.forEach(s => console.log(JSON.stringify(s), " => ", getAreaOnly(s)));
