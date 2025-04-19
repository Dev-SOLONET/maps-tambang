import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar.jsx";
import MapView from "./components/MapView";
import LoadingOverlay from "./components/LoadingOverlay";

export default function App() {
  // filter state
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [shift, setShift] = useState("Day Shift");
  const [dumpTrucks, setDumpTrucks] = useState([
    "FDT 01","FDT 02","FDT 03","FDT 04","FDT 05"
  ]);
  const [excavators, setExcavators] = useState([
    "EXC 01","EXC 02","EXC 03","EXC 04"
  ]);
  const [selectedDT, setSelectedDT] = useState(new Set(dumpTrucks));
  const [selectedEX, setSelectedEX] = useState(new Set(excavators));

  // data & loading
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState({ dt: [], ex: [] });

  // overlay toggles
  const [showDT, setShowDT] = useState(true);
  const [showEX, setShowEX] = useState(true);
  const [showArea, setShowArea] = useState(true);

  // simulate fetch on filter change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // generate dummy tracks
      const genTrack = () => {
        const pts = [];
        for (let i = 0; i < 20; i++) {
          const lat = -3.6 + Math.random() * 0.2;
          const lng = 115.5 + Math.random() * 0.2;
          pts.push([lat, lng]);
        }
        return pts;
      };
      const dt = Array.from(selectedDT).map((id) => ({
        id,
        coords: genTrack(),
        color: "#e53e3e",
      }));
      const ex = Array.from(selectedEX).map((id) => ({
        id,
        coords: genTrack(),
        color: "#3182ce",
      }));
      setTracks({ dt, ex });
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [date, shift, selectedDT, selectedEX]);

  return (
    <div className="h-screen flex flex-col">
      <NavBar active="Fleet Historical" />
      <div className="flex flex-1 relative">
        {loading && <LoadingOverlay />}
        <Sidebar
          date={date}
          onDateChange={setDate}
          shift={shift}
          onShiftChange={setShift}
          dumpTrucks={dumpTrucks}
          selectedDT={selectedDT}
          onToggleDT={(id) => {
            const s = new Set(selectedDT);
            s.has(id) ? s.delete(id) : s.add(id);
            setSelectedDT(s);
          }}
          excavators={excavators}
          selectedEX={selectedEX}
          onToggleEX={(id) => {
            const s = new Set(selectedEX);
            s.has(id) ? s.delete(id) : s.add(id);
            setSelectedEX(s);
          }}
        />
        <MapView
          tracks={tracks}
          showDT={showDT}
          showEX={showEX}
          showArea={showArea}
          onToggleDT={() => setShowDT((v) => !v)}
          onToggleEX={() => setShowEX((v) => !v)}
          onToggleArea={() => setShowArea((v) => !v)}
        />
      </div>
    </div>
  );
}
