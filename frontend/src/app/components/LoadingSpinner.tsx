export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-[#EAF2FB] border-t-[#0A6ED1] rounded-full animate-spin mb-4"></div>
      <p className="text-[#6a6d70] text-sm font-medium animate-pulse">Loading content...</p>
    </div>
  );
}
