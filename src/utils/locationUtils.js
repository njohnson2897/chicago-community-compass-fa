/**
 * Location utilities: haversine distance, geocoding, ZIP center fallback.
 * Used for radius-based search so the map and list show only pantries within range.
 */

/** Earth radius in miles for haversine */
const R_MI = 3959;

/**
 * Haversine distance between two points in miles.
 * @param {{ lat: number, lng: number }} a - { lat, lng } in degrees
 * @param {{ lat: number, lng: number }} b - { lat, lng } in degrees
 * @returns {number} distance in miles
 */
export function haversineMiles(a, b) {
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R_MI * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/**
 * Geocode a place string (address or ZIP) using Mapbox Geocoding API.
 * @param {string} query - e.g. "60637" or "Lincoln Park, Chicago IL"
 * @param {string} token - VITE_MAPBOX_ACCESS_TOKEN
 * @returns {Promise<{ lat: number, lng: number } | null>} center or null
 */
export async function geocodeSearchQuery(query, token) {
  if (!query || typeof query !== "string") return null;
  const trimmed = query.trim();
  if (!trimmed) return null;

  // ZIP-only: try static Chicagoland ZIP centers first (no API call)
  const zipCenter = getZipCenter(trimmed);
  if (zipCenter) return zipCenter;

  if (!token) return null;

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmed)}.json?access_token=${token}&country=US&limit=1`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.features || data.features.length === 0) return null;
    const [lng, lat] = data.features[0].center;
    return { lat, lng };
  } catch {
    return null;
  }
}

/**
 * Approximate center (lat, lng) for Chicagoland ZIP codes.
 * Used when Mapbox token is missing or for instant ZIP search.
 * Coordinates are approximate (ZIP centroid / well-known point).
 */
const ZIP_CENTERS = {
  60076: { lat: 42.032, lng: -87.747 }, // Skokie
  60153: { lat: 41.879, lng: -87.844 }, // Maywood
  60160: { lat: 41.9, lng: -87.833 }, // Melrose Park
  60201: { lat: 42.045, lng: -87.687 }, // Evanston
  60601: { lat: 41.885, lng: -87.622 },
  60602: { lat: 41.883, lng: -87.629 },
  60603: { lat: 41.88, lng: -87.629 },
  60604: { lat: 41.878, lng: -87.629 },
  60605: { lat: 41.869, lng: -87.624 },
  60606: { lat: 41.881, lng: -87.637 },
  60607: { lat: 41.875, lng: -87.651 },
  60608: { lat: 41.849, lng: -87.67 },
  60609: { lat: 41.812, lng: -87.653 },
  60610: { lat: 41.904, lng: -87.637 },
  60611: { lat: 41.894, lng: -87.621 },
  60612: { lat: 41.88, lng: -87.687 },
  60613: { lat: 41.953, lng: -87.655 },
  60614: { lat: 41.924, lng: -87.653 },
  60615: { lat: 41.802, lng: -87.602 },
  60616: { lat: 41.844, lng: -87.629 },
  60617: { lat: 41.713, lng: -87.565 },
  60618: { lat: 41.947, lng: -87.703 },
  60619: { lat: 41.744, lng: -87.606 },
  60620: { lat: 41.741, lng: -87.652 },
  60621: { lat: 41.776, lng: -87.641 },
  60622: { lat: 41.902, lng: -87.679 },
  60623: { lat: 41.846, lng: -87.717 },
  60624: { lat: 41.881, lng: -87.703 },
  60625: { lat: 41.971, lng: -87.702 },
  60626: { lat: 42.009, lng: -87.669 },
  60628: { lat: 41.692, lng: -87.621 },
  60629: { lat: 41.775, lng: -87.711 },
  60630: { lat: 41.972, lng: -87.759 },
  60631: { lat: 41.995, lng: -87.707 },
  60632: { lat: 41.81, lng: -87.708 },
  60633: { lat: 41.653, lng: -87.549 },
  60634: { lat: 41.946, lng: -87.796 },
  60636: { lat: 41.776, lng: -87.669 },
  60637: { lat: 41.781, lng: -87.604 },
  60638: { lat: 41.782, lng: -87.771 },
  60639: { lat: 41.92, lng: -87.755 },
  60640: { lat: 41.972, lng: -87.663 },
  60641: { lat: 41.946, lng: -87.747 },
  60642: { lat: 41.899, lng: -87.657 },
  60643: { lat: 41.699, lng: -87.662 },
  60644: { lat: 41.882, lng: -87.757 },
  60645: { lat: 42.008, lng: -87.694 },
  60646: { lat: 41.994, lng: -87.761 },
  60647: { lat: 41.921, lng: -87.704 },
  60649: { lat: 41.762, lng: -87.571 },
  60651: { lat: 41.902, lng: -87.741 },
  60652: { lat: 41.748, lng: -87.714 },
  60653: { lat: 41.819, lng: -87.611 },
  60654: { lat: 41.889, lng: -87.637 },
  60655: { lat: 41.692, lng: -87.701 },
  60656: { lat: 41.974, lng: -87.817 },
  60657: { lat: 41.94, lng: -87.654 },
  60659: { lat: 41.996, lng: -87.707 },
  60660: { lat: 41.985, lng: -87.663 },
  60661: { lat: 41.883, lng: -87.644 },
};

/**
 * If query looks like a 5-digit ZIP, return its center from ZIP_CENTERS.
 * @param {string} query
 * @returns {{ lat: number, lng: number } | null}
 */
function getZipCenter(query) {
  const zip = query.replace(/\D/g, "");
  if (zip.length !== 5) return null;
  return ZIP_CENTERS[zip] || null;
}

/**
 * Get zoom level that roughly fits a radius (miles) at Chicago latitude.
 * Approximate: 1 mi ≈ zoom 14, 2 mi ≈ 13, 5 mi ≈ 12.
 */
export function zoomForRadiusMiles(radiusMiles) {
  if (radiusMiles <= 0.5) return 15;
  if (radiusMiles <= 1) return 14;
  if (radiusMiles <= 2) return 13;
  if (radiusMiles <= 5) return 12;
  if (radiusMiles <= 10) return 11;
  return 10;
}
