import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Tooltip,
  Marker,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Transition } from "@headlessui/react";
import L from "leaflet";
import TireLayout from "./TireLayout";
const STATUS_COLORS = {
  active: "#00FF00",
  inactive: "#FF0000",
  maintenance: "#FFFF00",
};

// Custom DivIcon generator for ping effect
function createPingIcon(color) {
  if (color === "#FF0000") {
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
  } else {
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

function ZoomWatcher({ setZoom }) {
  useMapEvents({
    zoomend: (e) => {
      setZoom(e.target.getZoom());
      console.log("Zoom level:", e.target.getZoom());
    },
  });
  return null;
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
  const [zoom, setZoom] = useState(12);

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

        <ZoomWatcher setZoom={setZoom} />
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
                radius={zoom >= 15 ? 5 : 1}
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
            className="bg-white w-[1100px] p-6 rounded-2xl shadow-xl relative"
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

            {/* Tire Pressures Visualization */}
            <TireLayout
              tpdata={{
                sn: "987654321",
                simNumber: "89860814262380084181",
                tires: [
                  { tireNo: 1, exType: "", tiprValue: 248.2, tempValue: 38.2 },
                  { tireNo: 2, exType: "", tiprValue: 250.0, tempValue: 37.0 },
                  { tireNo: 3, exType: "", tiprValue: 245.0, tempValue: 36.0 },
                  { tireNo: 4, exType: "", tiprValue: 246.0, tempValue: 35.0 },
                  { tireNo: 5, exType: "", tiprValue: 247.0, tempValue: 34.0 },
                  { tireNo: 6, exType: "", tiprValue: 249.0, tempValue: 36.0 },
                  { tireNo: 7, exType: "", tiprValue: 244.0, tempValue: 35.0 },
                  { tireNo: 8, exType: "", tiprValue: 243.0, tempValue: 34.0 },
                  { tireNo: 9, exType: "", tiprValue: 242.0, tempValue: 33.0 },
                  { tireNo: 10, exType: "", tiprValue: 241.0, tempValue: 32.0 }
                ]
              }}
            />

            {/* Last update */}
            <div className="text-sm text-gray-500 italic mt-4">
              Last updated: {new Date().toLocaleString()}
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </div>
  );
}
