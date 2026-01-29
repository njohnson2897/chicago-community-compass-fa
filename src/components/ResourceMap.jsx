import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { zoomForRadiusMiles } from "../utils/locationUtils";

// Mapbox access token should be set in .env file
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

const CHICAGO_CENTER = [-87.6298, 41.8781];
const INITIAL_ZOOM = 11;

/** Escape for safe use inside HTML attributes and text. */
function escapeHtml(str) {
  if (str == null) return "";
  const s = String(str);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function ResourceMap({
  resources,
  onResourceClick,
  searchCenter,
  radiusMiles = 1,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [mapError, setMapError] = useState(null);
  const [noGeoData, setNoGeoData] = useState(false);

  useEffect(() => {
    if (map.current) return;

    if (!MAPBOX_TOKEN) {
      setMapError(
        "Map isn’t set up yet. Add VITE_MAPBOX_ACCESS_TOKEN to your .env file (see README).",
      );
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: CHICAGO_CENTER,
      zoom: INITIAL_ZOOM,
      dragPan: true, // click-drag pans the map N/S/E/W
      dragRotate: false, // avoid accidental tilt/rotation
      touchZoomRotate: true,
      pitchWithRotate: false,
      boxZoom: false,
      keyboard: false,
    });

    // Use UI controls (and pinch on trackpads) for zooming; don't hijack page scroll
    map.current.scrollZoom.disable();
    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when resources change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const resourcesWithCoords = resources.filter(
      (resource) =>
        resource.address &&
        Array.isArray(resource.address.coordinates) &&
        resource.address.coordinates.length === 2,
    );

    setNoGeoData(resources.length > 0 && resourcesWithCoords.length === 0);

    // Center and zoom on search location when user has searched (even if no markers)
    if (
      searchCenter &&
      typeof searchCenter.lat === "number" &&
      typeof searchCenter.lng === "number"
    ) {
      const center = [searchCenter.lng, searchCenter.lat];
      map.current.setCenter(center);
      const zoom = zoomForRadiusMiles(radiusMiles);
      map.current.setZoom(zoom);
    }

    if (resourcesWithCoords.length === 0) {
      return;
    }

    // Add markers for each resource
    resourcesWithCoords.forEach((resource) => {
      const [lng, lat] = resource.address.coordinates;

      // Create a popup with styled content
      const name = escapeHtml(resource.name);
      const street = escapeHtml(resource.address.street);
      const city = escapeHtml(resource.address.city);
      const zip = escapeHtml(resource.address.zip);
      const addressParts = [street, city, zip ? `IL ${zip}` : "IL"].filter(
        Boolean,
      );
      const addressLine = addressParts.join(", ");
      const id = escapeHtml(resource.id);
      const typeLabel =
        resource.type === "food_pantry" ? "Food Pantry" : "Food Delivery";

      const popup = new mapboxgl.Popup({
        offset: 25,
        className: "pantry-map-popup",
        maxWidth: "320px",
      }).setHTML(`
          <div class="pantry-popup-inner">
            <span class="pantry-popup-type">${escapeHtml(typeLabel)}</span>
            <h3 class="pantry-popup-name">${name}</h3>
            <p class="pantry-popup-address">${addressLine}</p>
            <button type="button" class="pantry-popup-btn" onclick="window.handleResourceClick('${id}')">
              View Details
            </button>
          </div>
        `);

      // Create marker
      const marker = new mapboxgl.Marker({
        color: resource.type === "food_pantry" ? "#1976d2" : "#dc004e",
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current);

      // Store reference for cleanup
      markersRef.current.push(marker);
    });

    // Expose click handler globally (workaround for popup button clicks)
    if (resourcesWithCoords.length > 0) {
      window.handleResourceClick = onResourceClick;
    }
  }, [resources, onResourceClick, searchCenter, radiusMiles]);

  if (mapError) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#d32f2f" }}>
        <p>{mapError}</p>
        <p style={{ fontSize: "0.875rem", marginTop: "8px" }}>
          Get a free token at mapbox.com, then add
          VITE_MAPBOX_ACCESS_TOKEN=your_token to a .env file in the project
          root. See the README for details.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      role="application"
      aria-label="Map of food pantries and delivery. Search by address or ZIP to see what’s nearby."
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
        position: "relative",
      }}
    >
      {noGeoData && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            background:
              "linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
          }}
        >
          <div
            style={{
              maxWidth: 420,
              padding: 16,
              textAlign: "center",
              fontSize: 14,
            }}
          >
            <strong>No coordinates for these results</strong>
            <p style={{ marginTop: 8 }}>
              This batch doesn’t have map pins, but you can still use the list
              and open each place for full details.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceMap;
