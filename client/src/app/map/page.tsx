"use client";

import dynamic from "next/dynamic";

const MapScreen = dynamic(() => import("@/components/maps/MapScreen"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
        <span className="text-sm text-gray-400">Loading map...</span>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return <MapScreen />;
}
