export default function NavBar({ active, onMenuClick }) {
  return (
    <header className="bg-gray-800 text-white flex items-center justify-between px-4 py-3 shadow-md">
      <div className="flex items-center">
        {/* Hamburger icon for mobile */}
        <button
          className="md:hidden mr-3"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold">PT BORNEO INDOBARA</h1>
      </div>
      {/* Desktop nav */}
      <nav className="hidden md:flex space-x-6 text-sm font-medium">
        {['Live Dispatch','History','Settings'].map(item => (
          <a
            key={item}
            href="#"
            className={
              active === item
                ? 'text-blue-400 font-semibold'
                : 'hover:text-gray-300'
            }
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}