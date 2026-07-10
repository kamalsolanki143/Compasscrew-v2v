"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  Crosshair,
  Navigation,
  Shield,
  Phone,
  AlertTriangle,
  MapPin,
  Wifi,
  WifiOff,
  RotateCw,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Position {
  lat: number;
  lng: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  timestamp: number;
}

type PermissionState = "prompt" | "granted" | "denied" | "checking";

const DEMO_SAFE_ROUTE: [number, number][] = [
  [28.6139, 77.209],
  [28.6145, 77.21],
  [28.6152, 77.211],
  [28.616, 77.2115],
  [28.617, 77.212],
  [28.618, 77.213],
];

const SAFE_PLACES = [
  { name: "Nearest Police Station", distance: "0.8 km", icon: Shield },
  { name: "Safe House - NGO Center", distance: "1.2 km", icon: Shield },
  { name: "Hospital Emergency", distance: "1.5 km", icon: Phone },
];

function createLocationIcon() {
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<div style="width:28px;height:28px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 0 0 6px rgba(239,68,68,0.25),0 2px 8px rgba(0,0,0,0.3);"></div>`,
  });
}

function createDestinationIcon() {
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<div style="width:28px;height:28px;border-radius:50%;background:#10b981;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
    </div>`,
  });
}

function MapUpdater({ position }: { position: Position | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], 16, { animate: true });
    }
  }, [map, position]);
  return null;
}

function InnerMap({
  position,
  permissionState,
}: {
  position: Position | null;
  permissionState: PermissionState;
}) {
  const center: [number, number] = position
    ? [position.lat, position.lng]
    : [28.6139, 77.209];

  const locationIcon = React.useMemo(() => createLocationIcon(), []);
  const destIcon = React.useMemo(() => createDestinationIcon(), []);

  return (
    <MapContainer
      center={center}
      zoom={position ? 16 : 13}
      scrollWheelZoom={true}
      className="h-full w-full"
      style={{ background: "#030712" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater position={position} />

      {position && permissionState === "granted" && (
        <>
          <Circle
            center={[position.lat, position.lng]}
            radius={position.accuracy}
            pathOptions={{
              color: "#ef4444",
              fillColor: "#ef4444",
              fillOpacity: 0.08,
              weight: 1,
            }}
          />
          <Marker
            position={[position.lat, position.lng]}
            icon={locationIcon}
          />
        </>
      )}

      <Polyline
        positions={DEMO_SAFE_ROUTE}
        pathOptions={{
          color: "#10b981",
          weight: 4,
          opacity: 0.8,
          dashArray: "10 6",
        }}
      />

      <Marker
        position={DEMO_SAFE_ROUTE[DEMO_SAFE_ROUTE.length - 1]}
        icon={destIcon}
      />
    </MapContainer>
  );
}

function LocationPermissionUI({
  onRetry,
  onOpenMaps,
}: {
  onRetry: () => void;
  onOpenMaps: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-950/90 backdrop-blur-sm">
      <div className="mx-4 flex max-w-sm flex-col items-center gap-5 rounded-2xl border border-white/10 bg-gray-900/95 p-8 text-center shadow-2xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <MapPin className="h-8 w-8 text-red-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">
            Location Permission Required
          </h3>
          <p className="text-sm text-gray-400">
            EscapeHer needs access to your location to provide real-time safety
            tracking and route guidance. Your location data stays private and is
            only shared during active emergency sessions.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3">
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-red-600 active:scale-95"
          >
            <RotateCw className="h-4 w-4" />
            Grant Permission
          </button>
          <button
            onClick={onOpenMaps}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-gray-300 transition-all hover:bg-white/10"
          >
            Open Google Maps Instead
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoPanel({
  position,
  permissionState,
  isTracking,
  onLocate,
  onEmergency,
}: {
  position: Position | null;
  permissionState: PermissionState;
  isTracking: boolean;
  onLocate: () => void;
  onEmergency: () => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-gray-950 p-4 lg:p-6">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white">Live Tracking</h2>
          <p className="mt-1 text-sm text-gray-400">
            {permissionState === "granted" && position
              ? "Your location is being tracked in real-time"
              : "Enable location to start tracking"}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onLocate}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-red-600 active:scale-95"
          >
            <Crosshair className="h-4 w-4" />
            Locate Me
          </button>
          <button
            onClick={onEmergency}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20"
          >
            <AlertTriangle className="h-4 w-4" />
            SOS
          </button>
        </div>

        {position && permissionState === "granted" && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 font-medium">Tracking Active</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500">Latitude</span>
                <p className="font-mono text-white">{position.lat.toFixed(5)}</p>
              </div>
              <div>
                <span className="text-gray-500">Longitude</span>
                <p className="font-mono text-white">{position.lng.toFixed(5)}</p>
              </div>
              <div>
                <span className="text-gray-500">Accuracy</span>
                <p className="text-white">±{Math.round(position.accuracy)}m</p>
              </div>
              <div>
                <span className="text-gray-500">Speed</span>
                <p className="text-white">
                  {position.speed !== null
                    ? `${(position.speed * 3.6).toFixed(1)} km/h`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {position && permissionState === "granted" && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {isTracking ? (
                <Wifi className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <WifiOff className="h-3.5 w-3.5 text-gray-500" />
              )}
              <span>
                {isTracking
                  ? `Last update: ${new Date(position.timestamp).toLocaleTimeString()}`
                  : "Waiting for signal..."}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Navigation className="h-4 w-4 text-emerald-400" />
            Safe Route
          </h3>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Demo route to nearest safe place
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-gray-400">You</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-gray-400">Safe Place</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">
            Nearby Safe Places
          </h3>
          <div className="space-y-2">
            {SAFE_PLACES.map((place) => (
              <div
                key={place.name}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.06]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <place.icon className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {place.name}
                  </p>
                  <p className="text-xs text-gray-500">{place.distance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">Emergency Actions</h3>
          <div className="space-y-2">
            <button className="flex w-full items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-left transition-colors hover:bg-red-500/10">
              <Phone className="h-4 w-4 text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-400">
                  Call Emergency (112)
                </p>
                <p className="text-xs text-gray-500">
                  Dial national emergency number
                </p>
              </div>
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-left transition-colors hover:bg-white/[0.06]">
              <Shield className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">
                  Alert Trusted Contacts
                </p>
                <p className="text-xs text-gray-500">
                  Notify your emergency contacts
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MapScreen() {
  const [position, setPosition] = useState<Position | null>(null);
  const [permissionState, setPermissionState] =
    useState<PermissionState>("checking");
  const [isTracking, setIsTracking] = useState(false);
  const watchRef = useRef<number | null>(null);

  const handleSuccess = useCallback((pos: GeolocationPosition) => {
    setPosition({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      speed: pos.coords.speed,
      heading: pos.coords.heading,
      timestamp: pos.timestamp,
    });
    setPermissionState("granted");
    setIsTracking(true);
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    if (err.code === err.PERMISSION_DENIED) {
      setPermissionState("denied");
    }
    setIsTracking(false);
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setPermissionState("denied");
      return;
    }

    setPermissionState("checking");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleSuccess(pos);
        watchRef.current = navigator.geolocation.watchPosition(
          handleSuccess,
          handleError,
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
        );
      },
      handleError,
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [handleSuccess, handleError]);

  useEffect(() => {
    startTracking();
    return () => {
      if (watchRef.current !== null) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
    };
  }, [startTracking]);

  const handleLocate = useCallback(() => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
    }
    startTracking();
  }, [startTracking]);

  const handleOpenMaps = useCallback(() => {
    const q = position
      ? `${position.lat},${position.lng}`
      : "28.6139,77.209";
    window.open(`https://www.google.com/maps?q=${q}`, "_blank");
  }, [position]);

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-950">
      <div className="flex h-full flex-col lg:flex-row">
        <div className="relative h-[55vh] flex-1 lg:h-full">
          {permissionState === "denied" && (
            <LocationPermissionUI
              onRetry={startTracking}
              onOpenMaps={handleOpenMaps}
            />
          )}

          <InnerMap position={position} permissionState={permissionState} />

          {position && permissionState === "granted" && (
            <div className="absolute bottom-4 left-4 z-10 rounded-xl bg-gray-900/90 px-3 py-2 text-xs text-gray-400 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Live • {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
              </div>
            </div>
          )}

          <button
            onClick={handleLocate}
            className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900/90 text-gray-400 backdrop-blur-sm transition-colors hover:bg-gray-800 hover:text-white"
          >
            <Crosshair className="h-5 w-5" />
          </button>
        </div>

        <div className="h-[45vh] border-t border-white/5 lg:h-full lg:w-[380px] lg:border-l lg:border-t-0">
          <InfoPanel
            position={position}
            permissionState={permissionState}
            isTracking={isTracking}
            onLocate={handleLocate}
            onEmergency={() => (window.location.href = "/emergency")}
          />
        </div>
      </div>
    </div>
  );
}
