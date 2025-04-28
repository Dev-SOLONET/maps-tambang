export default function LoadingOverlay() {
    return (
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-30">
        <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center">
          <div className="animate-spin border-4 border-blue-500 rounded-full h-10 w-10 border-t-transparent mb-4"></div>
          <p className="font-semibold">Fetching data…</p>
          <p className="text-sm text-gray-600">
            Please wait, this action may take a few seconds
          </p>
        </div>
      </div>
    );
  }
  