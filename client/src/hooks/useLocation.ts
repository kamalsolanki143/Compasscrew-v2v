"use client";
import { useState, useEffect, useCallback } from "react";

interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
}

interface UseLocationReturn {
  location: GeoLocation | null;
  error: string | null;
  loading: boolean;
  refresh: () => void;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSuccess = (pos: GeolocationPosition) => {
    setLocation({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      speed: pos.coords.speed,
      heading: pos.coords.heading,
    });
    setLoading(false);
  };

  const handleError = (err: GeolocationPositionError) => {
    setError(err.message);
    setLoading(false);
  };

  const refresh = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { location, error, loading, refresh };
}
