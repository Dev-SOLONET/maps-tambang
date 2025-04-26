/* MapView.jsx */
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const STATUS_COLORS = {
  active: "#00FF00",       // Bright green
  inactive: "#FF0000",     // Bright red
  maintenance: "#FFFF00",   // Bright yellow
};

export default function MapView({
  areaGeoJson,
  trucks,
  showGeoJson,
  onToggleGeoJson,
  showStatus,
  onToggleStatus,
}) {
  return (
    <div className="flex-1 relative">
      <MapContainer center={[-3.6, 115.6]} zoom={12} className="h-full w-full z-0">
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="© OpenStreetMap contributors"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />

        {showGeoJson && (
          <GeoJSON data={areaGeoJson} style={{ color: '#FFFFFF', weight: 2, fillOpacity: 0.2 }} />
        )}

        {trucks.map((t) => (
          <CircleMarker
            key={t.id}
            center={t.coords}
            radius={1}
            pathOptions={{ color: STATUS_COLORS[t.status], fillOpacity: 0.8 }}
          >
            <Tooltip direction="top" offset={[0, -5]} opacity={0.9}>
              <div className="text-xs">
                <strong>{t.name}</strong><br />
                Status: {t.status}
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Overlay Toggle */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded shadow space-y-1 z-20 text-sm">
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={showGeoJson} onChange={onToggleGeoJson} />
          <span>Mining Area</span>
        </label>
        {Object.keys(showStatus).map((key) => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showStatus[key]}
              onChange={() => onToggleStatus(key)}
            />
            <span>Truck {key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
