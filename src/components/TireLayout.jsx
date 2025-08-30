// TireLayout.jsx
import React from "react";

const Tire = ({ pressure, temperature, warning }) => (
  <div className="relative flex flex-col items-center justify-center p-3 bg-gray-900 text-white rounded-lg shadow-md w-32 h-24">
    {warning && (
      <span className="absolute -top-5 text-red-500 text-xl">⚠️</span>
    )}
    <span className="font-semibold text-base">{pressure} PSI</span>
    <span className="text-sm">{temperature}°C</span>
  </div>
);

export default function TireLayout({ tiresLeft, tiresRight }) {
  return (
    <div className="flex items-center justify-center gap-12 mt-6">
      {/* Ban Kiri */}
      <div className="flex flex-col gap-4">
        {tiresLeft.map((t, i) => (
          <Tire
            key={i}
            pressure={t.pressure}
            temperature={t.temperature}
            warning={t.pressure < 92}
          />
        ))}
      </div>

      {/* Truk */}
      <div className="w-72 h-[520px] flex items-center justify-center border-2 border-gray-400 rounded-xl">
        <span className="rotate-90 font-semibold text-gray-600">TRUCK</span>
      </div>

      {/* Ban Kanan */}
      <div className="flex flex-col gap-4">
        {tiresRight.map((t, i) => (
          <Tire
            key={i}
            pressure={t.pressure}
            temperature={t.temperature}
            warning={t.pressure < 92}
          />
        ))}
      </div>
    </div>
  );
}
