/* MapView.jsx */
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const STATUS_COLORS = {
  active: "#38a169",
  inactive: "#a0aec0",
  maintenance: "#dd6b20",
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
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {showGeoJson && (
          <GeoJSON data={areaGeoJson} style={{ color: '#FFA725', weight: 2, fillOpacity: 0.2 }} />
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
          <span>Area GeoJSON</span>
        </label>
        {Object.keys(showStatus).map((key) => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showStatus[key]}
              onChange={() => onToggleStatus(key)}
            />
            <span>Show {key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
