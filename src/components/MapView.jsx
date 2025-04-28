import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Tooltip,
  Marker
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Transition } from "@headlessui/react";
import L from "leaflet";
const STATUS_COLORS = {
  active: "#00FF00",
  inactive: "#FF0000",
  maintenance: "#FFFF00",
};

// Custom DivIcon generator for ping effect
function createPingIcon(color) {
  if(color === "#FF0000") {
    return new L.DivIcon({
      html: `
        <span class="relative flex items-center justify-center h-3 w-3">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full" style="background-color:${color}; opacity:0.75"></span>
          <span class="relative inline-flex h-2 w-2 rounded-full" style="background-color:${color};"></span>
        </span>
      `,
      className: "",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  }else {
    return new L.DivIcon({
      html: `
        <span class="relative flex items-center justify-center h-4 w-4">
          <span class="relative inline-flex h-2 w-2 rounded-full" style="background-color:${color};"></span>
        </span>
      `,
      className: "",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  }
}

export default function MapView({
  areaGeoJson,
  trucks,
  showGeoJson,
  onToggleGeoJson,
  showStatus,
  onToggleStatus,
}) {
  const [selectedTruck, setSelectedTruck] = useState(null);

  return (
    <div className="flex-1 relative">
      <MapContainer
        center={[-3.6, 115.6]}
        zoom={12}
        className="h-full w-full z-0"
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="© OpenStreetMap contributors"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />

        {showGeoJson && (
          <GeoJSON
            data={areaGeoJson}
            style={{ color: "#FFFFFF", weight: 2, fillOpacity: 0.2 }}
          />
        )}

        {trucks
          .filter((t) => showStatus[t.status])
          .map((t) => (
            <React.Fragment key={t.id}>
              {/* Ping effect behind circle marker */}
              <Marker
                position={t.coords}
                icon={createPingIcon(STATUS_COLORS[t.status])}
                interactive={false}
              />
              {/* Original circle marker */}
              <CircleMarker
                center={t.coords}
                radius={1}
                pathOptions={{
                  color: STATUS_COLORS[t.status],
                  fillOpacity: 0.8,
                }}
                eventHandlers={{ click: () => setSelectedTruck(t) }}
              >
                <Tooltip direction="top" offset={[0, -5]}>
                  <div className="text-xs">
                    <strong>{t.name}</strong>
                    <br />
                    Status: {t.status}
                  </div>
                </Tooltip>
              </CircleMarker>
            </React.Fragment>
          ))}
      </MapContainer>

      {/* Overlay Toggle */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded shadow space-y-1 z-20 text-sm">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showGeoJson}
            onChange={onToggleGeoJson}
          />
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

      {/* Modal Dialog */}
      <Transition show={!!selectedTruck} appear>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300">
          <Transition.Child
            as="div"
            enter="transition-transform duration-300 ease-out"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="transition-transform duration-200 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
            className="bg-white p-6 rounded-xl shadow-2xl w-96"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedTruck?.name}</h2>
              <button
                onClick={() => setSelectedTruck(null)}
                className="text-gray-700 hover:text-gray-900 text-lg"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {/* GPS History */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">GPS Data</h3>
              <div className="text-sm text-gray-700">
                Lat: {selectedTruck?.coords[0]?.toFixed(5)}, Lng: {selectedTruck?.coords[1]?.toFixed(5)}
              </div>
            </div>

            {/* Tire Pressures */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Tire Pressures</h3>
              {/* Front Tires */}
              <div className="text-xs text-gray-500 mb-1 text-center">Front Tires</div>
              <div className="flex justify-center space-x-4 mb-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-2 bg-gray-100 rounded-full text-center text-xs"
                  >
                    {Math.floor(30 + Math.random() * 10)} PSI
                  </div>
                ))}
              </div>
              {/* Rear Tires */}
              <div className="text-xs text-gray-500 mb-1 text-center">Rear Tires</div>
              <div className="flex justify-center space-x-8">
                {/* Left side rear */}
                <div className="flex flex-col items-center space-y-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-2 bg-gray-100 rounded-full text-center text-xs"
                    >
                      {Math.floor(30 + Math.random() * 10)} PSI
                    </div>
                  ))}
                </div>
                {/* Right side rear */}
                <div className="flex flex-col items-center space-y-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-2 bg-gray-100 rounded-full text-center text-xs"
                    >
                      {Math.floor(30 + Math.random() * 10)} PSI
                    </div>
                  ))}
                </div>
              </div>
              {/* Last update */}
            </div>
            <div className="text-sm text-gray-500">
              Last updated: { new Date().toLocaleString() }
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </div>
  );
}