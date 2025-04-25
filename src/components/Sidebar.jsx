/* Sidebar.jsx */
import { useState } from "react";

export default function Sidebar({
  businessPartners,
  selectedPartners,
  onTogglePartner,
  dumpTrucks,
  selectedTrucks,
  onToggleTruck,
}) {
  const [searchTruck, setSearchTruck] = useState("");

  const filteredByPartner = dumpTrucks.filter((t) =>
    selectedPartners.has(t.businessPartnerId)
  );
  const displayedTrucks = filteredByPartner.filter((t) =>
    t.name.toLowerCase().includes(searchTruck.toLowerCase())
  );

  return (
    <aside className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto">
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

      <div>
        <h3 className="font-semibold mb-2">Dump Trucks</h3>
        <input
          type="text"
          placeholder="Search trucks…"
          className="w-full border p-1 rounded mb-2"
          value={searchTruck}
          onChange={(e) => setSearchTruck(e.target.value)}
        />
        <ul className="space-y-1 max-h-56 overflow-y-auto text-sm">
          {displayedTrucks.map((t) => (
            <li key={t.id}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTrucks.has(t.id)}
                  onChange={() => onToggleTruck(t.id)}
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