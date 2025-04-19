import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  GeoJSON,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Sample polygon bounding box as Area Overlay
const samplePolygon = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [115.5, -3.5],
        [115.7, -3.5],
        [115.7, -3.7],
        [115.5, -3.7],
        [115.5, -3.5],
      ],
    ],
  },
};

export default function MapView({
  tracks,
  showDT,
  showEX,
  showArea,
  onToggleDT,
  onToggleEX,
  onToggleArea,
}) {
  const mapRef = useRef();

  // center on load
  useEffect(() => {
    const map = mapRef.current;
    if (map) map.setView([-3.6, 115.6], 12);
  }, []);

  return (
    <div className="flex-1 relative">
      {/* Overlay Toggle */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded shadow space-y-1 z-20 text-sm">
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={showDT} onChange={onToggleDT} />
          <span>Dumping Heatmap</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={showEX} onChange={onToggleEX} />
          <span>Loading Heatmap</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={showArea} onChange={onToggleArea} />
          <span>Area Overlay</span>
        </label>
      </div>

      <MapContainer
        center={[ -3.6, 115.6 ]}
        zoom={12}
        whenCreated={(m) => (mapRef.current = m)}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {showArea && (
          <GeoJSON
            data={samplePolygon}
            style={{ color: "#38a169", weight: 2, fillOpacity: 0.1 }}
          />
        )}

        {showDT &&
          tracks.dt.map((t) => (
            <Polyline
              key={t.id}
              positions={t.coords}
              pathOptions={{ color: t.color, weight: 3, dashArray: "4" }}
            />
          ))}

        {showEX &&
          tracks.ex.map((t) => (
            <CircleMarker
              key={t.id}
              center={t.coords[0]}
              radius={6}
              pathOptions={{ color: t.color, fillOpacity: 0.7 }}
            >
              {/* no popup */}
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  );
}
