export default function TireBox({ psi, temp }) {
  return (
    <div className="w-13 h-13 bg-yellow-200 rounded-md flex flex-col items-center justify-center text-xs font-medium shadow">
      <span>{psi ? `${psi} PSI` : "PSI"}</span>
      <span>{temp ? `${temp}°C` : "°C"}</span>
    </div>
  );
}