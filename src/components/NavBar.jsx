export default function NavBar({ active }) {
  return (
    <header className="bg-gray-800 shadow px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">PT BORNEO INDOBARA</h1>
      <nav className="space-x-6 text-sm font-medium text-white">
        <a
          href="#"
          className={
            active === "Live Dispatch"
              ? "text-blue-400 font-semibold"
              : "hover:text-gray-300"
          }
        >
          Live Dispatch
        </a>
        <a href="#" className="hover:text-gray-300">
          History
        </a>
        <a href="#" className="hover:text-gray-300">
          Settings
        </a>
      </nav>
    </header>
  );
}