// TireLayout.jsx
import React from "react";

const Tire = ({ pressure, temperature, warning }) => (
  <div className="relative flex flex-col items-center justify-center p-3 bg-gray-900 text-white rounded-lg shadow-md w-20 h-20">
    {warning && (
      <span className="absolute -top-4 text-red-500 text-lg">⚠️</span>
    )}
    <span className="font-semibold text-xs">{pressure.toFixed(1)} PSI</span>
    <span className="text-[10px]">{temperature.toFixed(1)}°C</span>
  </div>
);

export default function TireLayout({ tpdata }) {
  if (!tpdata) return null;

  const kpaToPsi = (kpa) => kpa * 0.145038;

  const tires = tpdata.tires.map((t) => ({
    no: t.tireNo,
    pressure: kpaToPsi(t.tiprValue),
    temperature: t.tempValue,
    warning: t.exType && t.exType.length > 0,
  }));

  // Depan
  const frontLeft = tires.find((t) => t.no === 1);
  const frontRight = tires.find((t) => t.no === 2);

  // Belakang
  const rearLeftTop = tires.filter((t) => t.no === 3 || t.no === 4);
  const rearLeftBottom = tires.filter((t) => t.no === 5 || t.no === 6);
  const rearRightTop = tires.filter((t) => t.no === 7 || t.no === 8);
  const rearRightBottom = tires.filter((t) => t.no === 9 || t.no === 10);

  return (
    <div>
      {/* Info kendaraan */}
      <div className="mb-4 text-sm text-gray-700">
        <p>
          <span className="font-semibold">Serial Number:</span> {tpdata.sn}
        </p>
        <p>
          <span className="font-semibold">SIM Number:</span> {tpdata.simNumber}
        </p>
      </div>

      <div className="flex items-stretch justify-center gap-12 mt-6">
        {/* Ban kiri (depan + belakang) */}
        <div className="flex flex-col justify-between">
          {/* Depan kiri */}
          <div className="flex justify-center mb-4">
            {frontLeft && <Tire {...frontLeft} />}
          </div>
          {/* Belakang kiri */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              {rearLeftTop.map((t) => (
                <Tire key={t.no} {...t} />
              ))}
            </div>
            <div className="flex gap-4">
              {rearLeftBottom.map((t) => (
                <Tire key={t.no} {...t} />
              ))}
            </div>
          </div>
        </div>

        {/* TRUCK */}
        <div className="w-50 h-[400px] flex items-center justify-center border-2 border-gray-400 rounded-xl self-stretch">
          <span className="rotate-90 font-semibold text-gray-600">TRUCK</span>
        </div>

        {/* Ban kanan (depan + belakang) */}
        <div className="flex flex-col justify-between">
          {/* Depan kanan */}
          <div className="flex justify-center mb-4">
            {frontRight && <Tire {...frontRight} />}
          </div>
          {/* Belakang kanan */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              {rearRightTop.map((t) => (
                <Tire key={t.no} {...t} />
              ))}
            </div>
            <div className="flex gap-4">
              {rearRightBottom.map((t) => (
                <Tire key={t.no} {...t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
