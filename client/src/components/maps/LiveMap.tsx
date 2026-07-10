"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationPoint {
  latitude: number;
  longitude: number;
}

interface LiveMapProps {
  locations: LocationPoint[];
  center?: LocationPoint;
  className?: string;
}

const MapInner = dynamic(
  () => import("./LiveMapInner").then((m) => m.default),
  { ssr: false }
);

export default function LiveMap({ locations, center, className }: LiveMapProps) {
  const [leafletReady, setLeafletReady] = useState(false);

  useEffect(() => {
    import("leaflet").then((L) => {
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setLeafletReady(true);
    });
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900",
        className
      )}
    >
      {locations.length === 0 && leafletReady ? (
        <div className="flex h-72 flex-col items-center justify-center gap-2 text-gray-500">
          <MapPin className="size-6" />
          <span className="text-sm">No location data available</span>
        </div>
      ) : leafletReady ? (
        <div className="h-72 w-full">
          <MapInner locations={locations} center={center} />
        </div>
      ) : (
        <div className="flex h-72 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-gray-500" />
        </div>
      )}

      {locations.length > 0 && (
        <div className="absolute bottom-3 left-3 rounded-lg bg-gray-900/90 px-2.5 py-1 text-xs text-gray-400 backdrop-blur-sm">
          {locations.length} location{locations.length !== 1 && "s"} tracked
        </div>
      )}
    </div>
  );
}
