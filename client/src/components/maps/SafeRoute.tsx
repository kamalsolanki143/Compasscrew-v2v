"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface SafeRouteProps {
  origin: Coordinate;
  destination: Coordinate;
  destinationLabel?: string;
  className?: string;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [map, center]);
  return null;
}

function RouteMap({ origin, destination }: { origin: Coordinate; destination: Coordinate }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const center = useMemo<[number, number]>(
    () => [
      (origin.latitude + destination.latitude) / 2,
      (origin.longitude + destination.longitude) / 2,
    ],
    [origin, destination]
  );

  const originIcon = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const L = require("leaflet");
    return L.divIcon({
      className: "",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      html: `<div style="width:28px;height:28px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/></svg>
      </div>`,
    });
  }, []);

  const destinationIcon = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const L = require("leaflet");
    return L.divIcon({
      className: "",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      html: `<div style="width:28px;height:28px;border-radius:50%;background:#10b981;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      </div>`,
    });
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: "#111827" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater center={center} />

      <Polyline
        positions={[
          [origin.latitude, origin.longitude],
          [destination.latitude, destination.longitude],
        ]}
        pathOptions={{ color: "#10b981", weight: 3, opacity: 0.8, dashArray: "8 6" }}
      />

      <Marker
        position={[origin.latitude, origin.longitude]}
        icon={originIcon}
      />
      <Marker
        position={[destination.latitude, destination.longitude]}
        icon={destinationIcon}
      />
    </MapContainer>
  );
}

export default function SafeRoute({
  origin,
  destination,
  destinationLabel = "Safe Destination",
  className,
}: SafeRouteProps) {
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
        "overflow-hidden rounded-2xl border border-gray-800 bg-gray-900",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Navigation className="size-4 text-emerald-400" />
          <span className="text-sm font-semibold text-white">Safe Route</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <MapPin className="size-3" />
          {destinationLabel}
        </div>
      </div>

      <div className="h-64 w-full">
        {leafletReady ? (
          <RouteMap origin={origin} destination={destination} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-6 animate-spin text-gray-500" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 border-t border-gray-800 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-blue-500" />
          <span className="text-xs text-gray-400">Origin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-400">Destination</span>
        </div>
      </div>
    </div>
  );
}
