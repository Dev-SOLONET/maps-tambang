// Final App.js
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
} from "react-leaflet";
import { Menu } from "@headlessui/react";
import "leaflet/dist/leaflet.css";
import miningAreas from "./assets/wilayah.json";
import RoutineMachine from "./components/RoutineMachine";
import AnimatedRouting from "./components/AnimatedRouting";

const waypoints = [
  [-3.506558, 115.643138],
  [-3.588372, 115.619539],
];

const miningStyle = {
  color: "#ff7800",
  weight: 2,
  opacity: 0.8,
  fillColor: "#ffaa00",
  fillOpacity: 0.2,
};

function initVehicles() {
  const realNames = [
    "CAT 793F",
    "Komatsu 930E",
    "BelAZ 75710",
    "Hitachi EH5000AC-3",
    "Volvo A40G",
    "Liebherr T 284",
    "Terex MT 6300AC",
    "Komatsu HD785-7",
    "CAT 789D",
    "Hitachi EX8000",
  ];
  return Array.from({ length: 10 }, (_, i) => {
    return {
      id: i + 1,
      name: realNames[i],
      status: i % 2 === 0 ? "active" : "inactive",
      index: 0,
      speed: `${Math.floor(Math.random() * 40 + 10)} km/h`,
      fuel: `${Math.floor(Math.random() * 100)}%`,
      tirePressure: `${Math.floor(Math.random() * 30 + 20)} PSI`,
      lastUpdate: "baru saja",
    };
  });
}

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const feat = miningAreas.features[0];
    setGeoData(miningAreas);
    const init = initVehicles(feat);
    setVehicles(init);
    setSelected(init[0]);
  }, []);

  useEffect(() => {
    const resize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const filtered = vehicles.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white px-4 md:px-6 py-4 flex items-center justify-between border-b border-gray-700 relative z-50">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-700 rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-orange-400">MiningTracker</h1>
        </div>
        <Menu as="div" className="relative z-50">
          <Menu.Button className="flex items-center space-x-2 focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              AD
            </div>
            <span className="text-sm hidden md:block">Admin</span>
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-[200]">
            {["Profil Pengguna", "Pengaturan", "Keluar"].map((txt, i) => (
              <Menu.Item key={i}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-gray-700" : ""
                    } w-full px-4 py-2 text-sm ${
                      txt === "Keluar" ? "text-red-400" : "text-white"
                    } text-left`}
                  >
                    {txt}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={`w-72 bg-gray-800 text-white flex flex-col border-r border-gray-700 fixed md:relative transform h-full transition-transform duration-300 ease-in-out z-[150] ${
            isMobile
              ? isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "md:translate-x-0"
          }`}
        >
          <div className="p-4 border-b border-gray-700">
            <input
              type="text"
              placeholder="Cari kendaraan..."
              className="w-full p-2 rounded bg-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.map((v) => (
              <div
                key={v.id}
                onClick={() => {
                  setSelected(v);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selected?.id === v.id ? "bg-gray-600" : "hover:bg-gray-700"
                }`}
              >
                <h3 className="font-semibold">{v.name}</h3>
                <p className="text-xs text-gray-400">
                  Status: {v.status} | Kecepatan: {v.speed}
                </p>
                <p className="text-xs text-gray-400">
                  Bahan bakar: {v.fuel} | Tekanan Ban: {v.tirePressure}
                </p>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1 relative z-0">
          <MapContainer
            center={[-3.5924, 115.5977]}
            zoom={12}
            className="h-full w-full relative z-[10]"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            {geoData && <GeoJSON data={geoData} style={miningStyle} />}
            <RoutineMachine/>
            {<AnimatedRouting waypoints={waypoints} />}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
