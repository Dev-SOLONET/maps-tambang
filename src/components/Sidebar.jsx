// Sidebar.jsx
import { useState } from "react";
import { Combobox } from "@headlessui/react";
import LoadingOverlay from "./LoadingOverlay"; // import the overlay component

const STATUS_COLORS = {
  active: "#00FF00",
  inactive: "#FF0000",
  maintenance: "#FFFF00",
};

export default function Sidebar({
  businessPartners,
  selectedPartners,
  onTogglePartner,
  dumpTrucks,
  selectedTrucks,
  onSelectAllVisible,
  onUnselectAllVisible,
}) {
  const [searchTruck, setSearchTruck] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Filter by partner & search
  const filteredByPartner = dumpTrucks.filter((t) =>
    selectedPartners.has(t.businessPartnerId)
  );
  const displayedTrucks = filteredByPartner.filter((t) =>
    t.name.toLowerCase().includes(searchTruck.toLowerCase())
  );
  const visibleIds = displayedTrucks.map((t) => t.id);

  // Status counts
  const countByStatus = dumpTrucks.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    { active: 0, inactive: 0, maintenance: 0 }
  );

  // Handlers with overlay
  const handleSelectAll = () => {
    setIsLoading(true);
    onSelectAllVisible(visibleIds);
    setTimeout(() => setIsLoading(false), 1000);
  };
  const handleUnselectAll = () => {
    setIsLoading(true);
    onUnselectAllVisible(visibleIds);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50">
          <LoadingOverlay />
        </div>
      )}

      {/* Legend */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Legend</h3>
        <ul className="space-y-1 text-sm">
          {Object.entries(countByStatus).map(([key, count]) => (
            <li key={key} className="flex items-center space-x-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[key] }}
              />
              <span className="capitalize">{key}</span>
              <span className="ml-auto">{count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Business Partners */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Business Partners</h3>
        <ul className="space-y-1 max-h-40 overflow-y-auto text-sm">
          {businessPartners.map((p) => (
            <li key={p.id}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedPartners.has(p.id)}
                  onChange={() => onTogglePartner(p.id)}
                />
                <span>{p.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Dump Trucks */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Dump Trucks</h3>
          <div className="flex space-x-4 text-xs text-blue-600">
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={handleSelectAll}
            >
              Select All
            </button>
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={handleUnselectAll}
            >
              Unselect All
            </button>
          </div>
        </div>

        {/* Search Input */}
        <Combobox value={null} onChange={() => {}}>
          <Combobox.Input
            className="w-full border p-1 rounded mb-2"
            placeholder="Search trucks..."
            onChange={(e) => setSearchTruck(e.target.value)}
          />
        </Combobox>

        {/* Truck List */}
        <ul className="space-y-1 max-h-56 overflow-y-auto text-sm">
          {displayedTrucks.map((t) => (
            <li key={t.id}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTrucks.has(t.id)}
                  onChange={() => onSelectAllVisible([t.id])}
                />
                <span>{t.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
