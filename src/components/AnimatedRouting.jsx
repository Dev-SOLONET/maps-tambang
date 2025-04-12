// AnimatedRouting.js
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

export default function AnimatedRouting({ waypoints }) {
  const map = useMap();
  const [routeCoords, setRouteCoords] = useState([]);
  const [index, setIndex] = useState(0);
  const markerRef = useRef(null);

  // Mount the routing control and capture the route
  useEffect(() => {
    const control = L.Routing.control({
      waypoints: waypoints.map((p) => L.latLng(p)),
      lineOptions: { styles: [{ color: "#6FA1EC", weight: 4 }] },
      show: false,
    showAlternatives: false,
    addWaypoints: false,
    routeWhileDragging: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    })
      .on("routesfound", (e) => {
        const coords = e.routes[0].coordinates.map((c) => [c.lat, c.lng]);
        setRouteCoords(coords);
        // place marker at start
        if (!markerRef.current) {
          markerRef.current = L.marker(coords[0]).addTo(map);
        } else {
          markerRef.current.setLatLng(coords[0]);
        }
      })
      .addTo(map);

    return () => {
      map.removeControl(control);
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    };
  }, [map, waypoints]);

  // Animate marker along the route
  useEffect(() => {
    if (!routeCoords.length) return;
    setIndex(0);
    const iv = setInterval(() => {
      setIndex((i) => {
        const next = i + 1;
        if (next < routeCoords.length) {
          markerRef.current.setLatLng(routeCoords[next]);
          return next;
        } else {
          clearInterval(iv);
          return i;
        }
      });
    }, 500);
    return () => clearInterval(iv);
  }, [routeCoords]);

  return null;
}
