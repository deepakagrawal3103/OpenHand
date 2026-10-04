/**
 * Calculates Haversine distance between two coordinates in Kilometers
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 100) / 100; // 2 decimal places
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Normalizes distance into a 0-100 score according to TRD Section 10.3:
 * DistanceScore = max(0, 100 * (1 - distance / radius))
 */
export function calculateDistanceScore(distanceKm: number, maxRadiusKm: number = 5.0): number {
  if (distanceKm <= 0) return 100;
  const score = Math.max(0, 100 * (1 - distanceKm / maxRadiusKm));
  return Math.round(score);
}
