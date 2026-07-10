"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationPoint {
  latitude: number;
  longitude: number;
}

interface MapInnerProps {
  locations: LocationPoint[];
  center?: LocationPoint;
}

function MapUpdater({ center, locations }: { center?: LocationPoint; locations: LocationPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView([center.latitude, center.longitude], 15);
    } else if (locations.length > 0) {
      map.setView([locations[0].latitude, locations[0].longitude], 15);
    }
  }, [map, center, locations]);

  return null;
}

export default function MapInner({ locations, center }: MapInnerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultCenter: [number, number] = useMemo(() => {
    if (center) return [center.latitude, center.longitude];
    if (locations.length > 0)
      return [locations[0].latitude, locations[0].longitude];
    return [28.6139, 77.209];
  }, [center, locations]);

  const pathCoordinates: [number, number][] = useMemo(
    () => locations.map((loc) => [loc.latitude, loc.longitude]),
    [locations]
  );

  const currentIcon = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const L = require("leaflet");
    return L.divIcon({
      className: "",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      html: `<div style="width:24px;height:24px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 0 6px rgba(59,130,246,0.2);"></div>`,
    });
  }, []);

  const pathIcon = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const L = require("leaflet");
    return L.divIcon({
      className: "",
      iconSize: [12, 12],
      iconAnchor: [6, 6],
      html: `<div style="width:12px;height:12px;border-radius:50%;background:#1e293b;border:2px solid #64748b;"></div>`,
    });
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border border-gray-800 bg-gray-900",
          "h-72"
        )}
      >
        <Loader2 className="size-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={15}
      scrollWheelZoom={false}
      className="h-full w-full rounded-2xl"
      style={{ background: "#111827" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater center={center} locations={locations} />

      {pathCoordinates.length > 1 && (
        <Polyline
          positions={pathCoordinates}
          pathOptions={{ color: "#3b82f6", weight: 3, opacity: 0.7, dashArray: "6 4" }}
        />
      )}

      {pathCoordinates.map(([lat, lng], i) => {
        const isLast = i === pathCoordinates.length - 1;
        return (
          <Marker
            key={i}
            position={[lat, lng]}
            icon={isLast ? currentIcon : pathIcon}
          />
        );
      })}
    </MapContainer>
  );
}
