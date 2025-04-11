// App.js
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Menu } from '@headlessui/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// File GeoJSON
import miningAreas from './assets/wilayah.geojson';

// Style untuk area pertambangan
const miningStyle = {
  color: "#ff7800",
  weight: 2,
  opacity: 0.8,
  fillColor: "#ffaa00",
  fillOpacity: 0.2
};

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const vehicles = [
  {
    id: 1,
    name: 'HD-785',
    status: 'active',
    location: [-1.2382, 116.8523],
    lastUpdate: '5 mins ago',
    speed: '32 km/h',
    fuel: '78%'
  },
  {
    id: 2,
    name: 'PC-2000',
    status: 'maintenance',
    location: [-0.5021, 117.1536],
    lastUpdate: '2 hours ago',
    speed: '0 km/h',
    fuel: '45%'
  },
];

export default function App() {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [geoData, setGeoData] = useState(null);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Load GeoJSON data
    fetch(miningAreas)
      .then(response => response.json())
      .then(data => setGeoData(data))
      .catch(error => console.error('Error loading GeoJSON:', error));
  }, []);

  // Fungsi untuk menampilkan popup GeoJSON
  const onEachMiningArea = (feature, layer) => {
    if (feature.properties) {
      const popupContent = `
        <div class="p-2">
          <h4 class="font-semibold mb-1">${feature.properties.nama_wilayah || 'Area Tambang'}</h4>
          <p class="text-sm">Perusahaan: ${feature.properties.perusahaan || '-'}</p>
          <p class="text-sm">Jenis: ${feature.properties.jenis_tambang || '-'}</p>
          <p class="text-sm">Status: ${feature.properties.status || '-'}</p>
        </div>
      `;
      layer.bindPopup(popupContent);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white px-4 md:px-6 py-4 flex items-center justify-between border-b border-gray-700 relative z-50">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-700 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-orange-400">MiningTracker</h1>
        </div>
        
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-2 focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-sm">AD</span>
            </div>
            <span className="text-sm hidden md:block">Admin</span>
          </Menu.Button>
          
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 focus:outline-none z-[1000]">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-700' : ''
                  } w-full px-4 py-2 text-sm text-white text-left hover:bg-gray-700 transition-colors`}
                >
                  Profil Pengguna
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-700' : ''
                  } w-full px-4 py-2 text-sm text-white text-left hover:bg-gray-700 transition-colors`}
                >
                  Pengaturan
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-700' : ''
                  } w-full px-4 py-2 text-sm text-red-400 text-left hover:bg-gray-700 transition-colors`}
                >
                  Keluar
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Mobile Overlay */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`w-80 bg-gray-800 text-white flex flex-col border-r border-gray-700 fixed md:relative md:translate-x-0 transform h-full transition-transform duration-300 ease-in-out z-40 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Daftar Kendaraan</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari kendaraan..."
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => {
                  setSelectedVehicle(vehicle);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedVehicle?.id === vehicle.id
                    ? 'bg-gray-700'
                    : 'bg-gray-900 hover:bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{vehicle.name}</h3>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                        vehicle.status === 'active'
                          ? 'bg-green-600 text-green-100'
                          : 'bg-red-600 text-red-100'
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{vehicle.lastUpdate}</span>
                </div>
                <div className="mt-3 text-sm space-y-1">
                  <p className="text-gray-400">Kecepatan: {vehicle.speed}</p>
                  <p className="text-gray-400">Bahan bakar: {vehicle.fuel}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Map */}
        <div className="flex-1 bg-gray-900 relative z-10">
          <MapContainer
            center={[-1.2382, 116.8523]}
            zoom={6}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

          {geoData && (
            <GeoJSON
              data={geoData}
              style={miningStyle}
              onEachFeature={onEachMiningArea}
            />
          )}

            {vehicles.map((vehicle) => (
              <Marker key={vehicle.id} position={vehicle.location}>
                <Popup>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{vehicle.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          vehicle.status === 'active'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {vehicle.status}
                      </span>
                      <span className="text-xs text-gray-600">{vehicle.lastUpdate}</span>
                    </div>
                    <div className="text-sm">
                      <p>Kecepatan: {vehicle.speed}</p>
                      <p>Bahan bakar: {vehicle.fuel}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}