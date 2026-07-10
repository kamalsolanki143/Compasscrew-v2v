"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DangerButton from "@/components/emergency/DangerButton";
import PageHeader from "@/components/common/PageHeader";
import { useEmergency } from "@/context/EmergencyContext";
import { useLocation } from "@/hooks/useLocation";
import { useEffect, useState } from "react";
import { mapsService } from "@/services/maps.service";
import toast from "react-hot-toast";

export default function DangerModePage() {
  const { activeSession, startEmergency, loading } = useEmergency();
  const { location } = useLocation();
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!activeSession || !location || !isTracking) return;
    const interval = setInterval(async () => {
      try {
        await mapsService.saveLocation(activeSession._id, {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          speed: location.speed ?? undefined,
          heading: location.heading ?? undefined,
        });
      } catch {
        // silent
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [activeSession, location, isTracking]);

  const handleTrigger = async () => {
    try {
      await startEmergency("manual_sos", "Triggered from danger mode");
      setIsTracking(true);
      toast.success("Emergency started! Location is being tracked.");
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err
        ? (err as { message: string }).message
        : "Failed to start emergency";
      toast.error(msg);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Danger Mode"
        description="One-tap emergency with live location tracking"
      />
      <div className="flex flex-col items-center justify-center py-16 space-y-8">
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold text-red-500">
            {activeSession ? "ACTIVE" : "SAFE"}
          </div>
          <p className="text-muted-foreground max-w-md">
            {activeSession
              ? "Emergency session is active. Your location is being tracked and shared with trusted contacts."
              : "Press the button below to activate danger mode. This will start an emergency session and begin live location tracking."}
          </p>
        </div>
        {!activeSession && (
          <DangerButton
            onPress={handleTrigger}
            isActive={false}
            loading={loading}
          />
        )}
        {activeSession && location && (
          <div className="text-sm text-muted-foreground">
            Current location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
