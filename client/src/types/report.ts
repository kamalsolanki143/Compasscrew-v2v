import type { EmergencySession, Heartbeat, Incident, LocationPing, Evidence } from "./emergency";

export interface SessionReport {
  sessionId: string;
  status: string;
  triggerType: string;
  startedAt: string;
  endedAt: string | null;
  duration: number | null;
  escalationLevel: number;
  missedHeartbeatCount: number;
  summary: {
    totalIncidents: number;
    totalLocationPings: number;
    totalHeartbeats: number;
    missedHeartbeats: number;
    checkIns: number;
    evidenceCount: number;
  };
  incidents: Incident[];
  locationHistory: LocationPing[];
  heartbeats: Heartbeat[];
  evidence: Evidence[];
}
