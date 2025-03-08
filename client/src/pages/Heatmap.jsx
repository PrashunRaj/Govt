import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat"; // Ensure this is installed via npm

const Heatmap = () => {
  useEffect(() => {
    // Initialize Map
    const map = L.map("heatmap").setView([20.5937, 78.9629], 5); // Default center: India

    // Add Tile Layer (Background Map)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    // Dummy Proposal Data (lat, lng, intensity)
    const proposalLocations=[
      { lat: 28.6139, lng: 77.2090, intensity: 2 }, // Delhi
      { lat: 19.0760, lng: 72.8777, intensity: 3 }, // Mumbai
      { lat: 13.0827, lng: 80.2707, intensity: 4 }, // Chennai
      { lat: 22.5726, lng: 88.3639, intensity: 5 }, // Kolkata (Highest intensity)
      { lat: 12.9716, lng: 77.5946, intensity: 1 }, // Bangalore
    ];

    // Convert Data for Heat Layer
    const heatData = proposalLocations.map((loc) => [loc.lat, loc.lng, loc.intensity]);

    // Add Heatmap Layer
    const heatLayer = L.heatLayer(heatData, { radius: 25, blur: 15, maxZoom: 10 }).addTo(map);
    // Animate Highest Intensity Points
    proposalLocations.forEach((loc) => {
      if (loc.intensity >= 4) {
        const pulseMarker = L.circleMarker([loc.lat, loc.lng], {
          radius: 10,
          fillColor: "red",
          color: "red",
          fillOpacity: 0.7,
          className: "blinking-marker",
        }).addTo(map);
      }
    });

    return () => map.remove(); // Cleanup on unmount
  }, []);
  return (
    <>
      <style>
        {`
          .blinking-marker {
            animation: pulse 1s infinite alternate ease-in-out;
          }

          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.7; }
            100% { transform: scale(1.5); opacity: 0.2; }
          }
        `}
      </style>
      <div className="w-full h-[500px] rounded-lg shadow-md border-2 border-gray-200 overflow-hidden">
        <div id="heatmap" className="w-full h-full"></div>
      </div>
    </>
  );
};
export default Heatmap;
