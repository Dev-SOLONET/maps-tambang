/* App.jsx */
import { useState, useEffect, useMemo } from "react";
import * as turf from "@turf/turf";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar.jsx";
import MapView from "./components/MapView";
import LoadingOverlay from "./components/LoadingOverlay";

// Daftar mitra
const BUSINESS_PARTNERS = Array.from({ length: 11 }, (_, i) => ({
  id: i + 1,
  name: `Partner ${i + 1}`,
}));

// Area GeoJSON polygon
const AREA_GEOJSON = {
  type: "Feature",
  properties: { Name: "PT INDOBARA" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [115.604399949931505, -3.545400075547209, 0.0],
        [115.604399841131098, -3.608799574004828, 0.0],
        [115.649400029697503, -3.608799509217319, 0.0],
        [115.649400017089704, -3.663100293456181, 0.0],
        [115.617400059975793, -3.663099780174879, 0.0],
        [115.617399737213503, -3.685699156803738, 0.0],
        [115.649299960676103, -3.685699068800897, 0.0],
        [115.649300362663595, -3.699299673460462, 0.0],
        [115.617800049745696, -3.699300020057011, 0.0],
        [115.6177999530113, -3.717199908413447, 0.0],
        [115.658299919322602, -3.717200000114277, 0.0],
        [115.6582955763173, -3.473005894715275, 0.0],
        [115.568699602091598, -3.473001685807625, 0.0],
        [115.568700182646694, -3.464001541662113, 0.0],
        [115.555099828419003, -3.463999391784724, 0.0],
        [115.555099291465098, -3.473003271644793, 0.0],
        [115.532700208403895, -3.473001476768178, 0.0],
        [115.532699846387402, -3.463900605411753, 0.0],
        [115.550701359743002, -3.463902395098822, 0.0],
        [115.5507013482556, -3.454898213912309, 0.0],
        [115.568701230550005, -3.454902873855015, 0.0],
        [115.568700726908006, -3.445900276606981, 0.0],
        [115.577700266719404, -3.445900134950424, 0.0],
        [115.577700019488205, -3.431898966201222, 0.0],
        [115.559699638559096, -3.431899648314737, 0.0],
        [115.559699554334102, -3.437400397522957, 0.0],
        [115.550100512253806, -3.437398099998878, 0.0],
        [115.550099020797404, -3.450002211390146, 0.0],
        [115.532703272530895, -3.449999179807085, 0.0],
        [115.532700637088993, -3.454899270607867, 0.0],
        [115.523702194253303, -3.454899042442723, 0.0],
        [115.523699255391406, -3.463901335023041, 0.0],
        [115.517901076646893, -3.463899658740474, 0.0],
        [115.517900197349306, -3.467902281514015, 0.0],
        [115.514600138263603, -3.467902292826565, 0.0],
        [115.514601072048507, -3.50010155304351, 0.0],
        [115.496599227790597, -3.50009900533689, 0.0],
        [115.496599869340898, -3.518100005601176, 0.0],
        [115.466797471563495, -3.518103740087548, 0.0],
        [115.466801168336701, -3.550206921843847, 0.0],
        [115.442500430814604, -3.550203582815326, 0.0],
        [115.442497952207603, -3.563204681010987, 0.0],
        [115.432199323066001, -3.563200126588743, 0.0],
        [115.432199985374197, -3.575400350745974, 0.0],
        [115.4738011947736, -3.575400021250577, 0.0],
        [115.473797766754501, -3.667299052802766, 0.0],
        [115.478300326726696, -3.667298846101514, 0.0],
        [115.478299650158803, -3.699001512244875, 0.0],
        [115.473698702561805, -3.698999777578339, 0.0],
        [115.473698840205799, -3.706300548298581, 0.0],
        [115.481699037262302, -3.706400782574116, 0.0],
        [115.4817010345688, -3.717102490691376, 0.0],
        [115.505201004278504, -3.717098288779876, 0.0],
        [115.505299006694997, -3.635700209735227, 0.0],
        [115.487399266748895, -3.635701682784649, 0.0],
        [115.487397660302193, -3.545299693708786, 0.0],
        [115.5010009898878, -3.545299520128636, 0.0],
        [115.500999334020705, -3.536300365773843, 0.0],
        [115.514602134835499, -3.536297749737575, 0.0],
        [115.514599616947706, -3.518200242642467, 0.0],
        [115.532599668902606, -3.518200602467881, 0.0],
        [115.532599481961398, -3.509199349853453, 0.0],
        [115.541641655013905, -3.509228095023962, 0.0],
        [115.541599827827795, -3.500200339853857, 0.0],
        [115.577599166446404, -3.500199675893057, 0.0],
        [115.577599706645202, -3.509299212907206, 0.0],
        [115.604599070000702, -3.509301495077436, 0.0],
        [115.604600094546797, -3.518300046458291, 0.0],
        [115.613499987067996, -3.518300064005411, 0.0],
        [115.613499543131596, -3.54540116002996, 0.0],
        [115.604399949931505, -3.545400075547209, 0.0],
      ],
    ],
  },
};

// Sampling weighted status
const weightedStatus = () => {
  const r = Math.random();
  if (r < 0.7) return "active";
  if (r < 0.8) return "inactive";
  return "maintenance";
};

export default function App() {
  // State filter mitra dan status
  const [selectedPartners, setSelectedPartners] = useState(
    new Set(BUSINESS_PARTNERS.map((p) => p.id))
  );
  const [selectedTrucks, setSelectedTrucks] = useState(new Set());

  // Overlay toggles
  const [showGeoJson, setShowGeoJson] = useState(true);
  const [showStatus, setShowStatus] = useState({
    active: true,
    inactive: true,
    maintenance: true,
  });

  // Generate 1000 dump trucks satu kali dengan posisi di dalam polygon
  const allTrucks = useMemo(() => {
    const trucks = [];
    const perPartner = Math.floor(1000 / BUSINESS_PARTNERS.length);
    let rem = 1000 - perPartner * BUSINESS_PARTNERS.length;
    let idCounter = 1;
    const bbox = turf.bbox(AREA_GEOJSON);

    BUSINESS_PARTNERS.forEach((p) => {
      const count = perPartner + (rem-- > 0 ? 1 : 0);
      for (let i = 0; i < count; i++) {
        // sampling random dalam polygon
        let point;
        do {
          point = turf.randomPoint(1, { bbox }).features[0];
        } while (!turf.booleanPointInPolygon(point, AREA_GEOJSON));
        const [lng, lat] = point.geometry.coordinates;

        trucks.push({
          id: idCounter,
          name: `${p.name} - Truck ${i + 1}`,
          businessPartnerId: p.id,
          status: weightedStatus(),
          coords: [lat, lng],
        });
        idCounter++;
      }
    });

    // init selected all
    setSelectedTrucks(new Set(trucks.map((t) => t.id)));
    return trucks;
  }, []);

  // Hitung yang visible berdasarkan filter
  const visibleTrucks = useMemo(
    () =>
      allTrucks.filter(
        (t) =>
          selectedPartners.has(t.businessPartnerId) &&
          selectedTrucks.has(t.id) &&
          showStatus[t.status]
      ),
    [allTrucks, selectedPartners, selectedTrucks, showStatus]
  );

  const [loading] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <NavBar active="Live Dispatch" />
      <div className="flex flex-1 relative">
        {loading && <LoadingOverlay />}

        <Sidebar
          businessPartners={BUSINESS_PARTNERS}
          selectedPartners={selectedPartners}
          onTogglePartner={(pid) => {
            const s = new Set(selectedPartners);
            s.has(pid) ? s.delete(pid) : s.add(pid);
            setSelectedPartners(s);
          }}
          dumpTrucks={allTrucks}
          selectedTrucks={selectedTrucks}
          onToggleTruck={(tid) => {
            const s = new Set(selectedTrucks);
            s.has(tid) ? s.delete(tid) : s.add(tid);
            setSelectedTrucks(s);
          }}
        />

        <MapView
          areaGeoJson={AREA_GEOJSON}
          trucks={visibleTrucks}
          showGeoJson={showGeoJson}
          onToggleGeoJson={() => setShowGeoJson((v) => !v)}
          showStatus={showStatus}
          onToggleStatus={(key) =>
            setShowStatus((prev) => ({ ...prev, [key]: !prev[key] }))
          }
        />
      </div>
    </div>
  );
}
