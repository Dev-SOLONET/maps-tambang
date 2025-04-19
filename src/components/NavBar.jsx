export default function NavBar({ active }) {
    const items = [
      "Maps",
      "Cycle Review",
      "Cycle Productivity",
      "Live Dispatch",
      "Fleet Historical",
      "Management",
      "Master Data",
      "Settings",
      "Analytics",
    ];
    return (
      <nav className="bg-gray-800 text-white px-4 py-2 flex space-x-4 overflow-x-auto">
        {items.map((it) => (
          <span
            key={it}
            className={`px-2 py-1 rounded ${
              it === active ? "bg-blue-600" : "hover:bg-gray-700"
            } cursor-pointer whitespace-nowrap`}
          >
            {it}
          </span>
        ))}
      </nav>
    );
  }
  