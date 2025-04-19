import { useState } from "react";

export default function Sidebar({
  date,
  onDateChange,
  shift,
  onShiftChange,
  dumpTrucks,
  selectedDT,
  onToggleDT,
  excavators,
  selectedEX,
  onToggleEX,
}) {
  const [searchDT, setSearchDT] = useState("");
  const [searchEX, setSearchEX] = useState("");

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0 overflow-y-auto">
      <div className="mb-4">
        <label className="block text-sm">Date</label>
        <input
          type="date"
          className="w-full border p-1"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm">Shift</label>
        <select
          className="w-full border p-1"
          value={shift}
          onChange={(e) => onShiftChange(e.target.value)}
        >
          <option>Day Shift</option>
          <option>Night Shift</option>
        </select>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold">Dump Trucks</h3>
        <input
          type="text"
          placeholder="Search"
          className="w-full border p-1 my-2"
          value={searchDT}
          onChange={(e) => setSearchDT(e.target.value)}
        />
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {dumpTrucks
            .filter((id) =>
              id.toLowerCase().includes(searchDT.toLowerCase())
            )
            .map((id) => (
              <label key={id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedDT.has(id)}
                  onChange={() => onToggleDT(id)}
                />
                <span>{id}</span>
              </label>
            ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Excavators</h3>
        <input
          type="text"
          placeholder="Search"
          className="w-full border p-1 my-2"
          value={searchEX}
          onChange={(e) => setSearchEX(e.target.value)}
        />
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {excavators
            .filter((id) =>
              id.toLowerCase().includes(searchEX.toLowerCase())
            )
            .map((id) => (
              <label key={id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedEX.has(id)}
                  onChange={() => onToggleEX(id)}
                />
                <span>{id}</span>
              </label>
            ))}
        </div>
      </div>
    </aside>
  );
}
