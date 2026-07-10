"use client";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { emergencyService } from "@/services/emergency.service";
import { heartbeatService } from "@/services/heartbeat.service";
import type { EmergencySession, HeartbeatStatus, TriggerType, SessionStatus } from "@/types/emergency";

interface EmergencyContextType {
  activeSession: EmergencySession | null;
  heartbeatStatus: HeartbeatStatus | null;
  loading: boolean;
  startEmergency: (triggerType?: TriggerType, notes?: string) => Promise<EmergencySession>;
  stopEmergency: () => Promise<void>;
  updateStatus: (status: SessionStatus, notes?: string) => Promise<void>;
  sendHeartbeat: () => Promise<void>;
  refreshSession: () => Promise<void>;
  loadActiveSession: () => Promise<void>;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export function EmergencyProvider({ children }: { children: ReactNode }) {
  const [activeSession, setActiveSession] = useState<EmergencySession | null>(null);
  const [heartbeatStatus, setHeartbeatStatus] = useState<HeartbeatStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const loadActiveSession = useCallback(async () => {
    try {
      const res = await emergencyService.getHistory(1, 50);
      const sessions = res.data.sessions || [];
      const active = sessions.find(
        (s: EmergencySession) => s.status === "active" || s.status === "escalated"
      );
      if (active) {
        setActiveSession(active);
        const hbRes = await heartbeatService.getStatus(active._id);
        setHeartbeatStatus(hbRes.data);
      } else {
        setActiveSession(null);
        setHeartbeatStatus(null);
      }
    } catch {
      setActiveSession(null);
    }
  }, []);

  const startEmergency = async (triggerType: TriggerType = "manual_sos", notes?: string) => {
    setLoading(true);
    try {
      const res = await emergencyService.start({ triggerType, notes });
      setActiveSession(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const stopEmergency = async () => {
    if (!activeSession) return;
    setLoading(true);
    try {
      await emergencyService.stop(activeSession._id);
      setActiveSession(null);
      setHeartbeatStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: SessionStatus, notes?: string) => {
    if (!activeSession) return;
    const res = await emergencyService.updateStatus(activeSession._id, { status, notes });
    setActiveSession(res.data);
  };

  const sendHeartbeat = async () => {
    if (!activeSession) return;
    await heartbeatService.checkIn(activeSession._id);
    const hbRes = await heartbeatService.getStatus(activeSession._id);
    setHeartbeatStatus(hbRes.data);
  };

  const refreshSession = async () => {
    if (!activeSession) return;
    const res = await emergencyService.getById(activeSession._id);
    setActiveSession(res.data);
    const hbRes = await heartbeatService.getStatus(activeSession._id);
    setHeartbeatStatus(hbRes.data);
  };

  return (
    <EmergencyContext.Provider
      value={{
        activeSession,
        heartbeatStatus,
        loading,
        startEmergency,
        stopEmergency,
        updateStatus,
        sendHeartbeat,
        refreshSession,
        loadActiveSession,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const ctx = useContext(EmergencyContext);
  if (!ctx) throw new Error("useEmergency must be used within EmergencyProvider");
  return ctx;
}
