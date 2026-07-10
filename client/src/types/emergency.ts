export type TriggerType = "manual_sos" | "heartbeat_escalation" | "voice_trigger" | "auto_detect";
export type SessionStatus = "active" | "escalated" | "resolved" | "cancelled";

export interface EmergencySession {
  _id: string;
  user: string;
  triggerType: TriggerType;
  status: SessionStatus;
  heartbeatIntervalSeconds: number;
  missedHeartbeatCount: number;
  escalationLevel: number;
  startedAt: string;
  endedAt: string | null;
  lastKnownLocation: {
    type: "Point";
    coordinates: [number, number];
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Heartbeat {
  _id: string;
  user: string;
  session: string;
  kind: "checkin" | "missed";
  sequence: number;
  status: "on_time" | "late" | "missed";
  receivedAt: string;
  metadata?: Record<string, unknown>;
}

export interface HeartbeatStatus {
  sessionId: string;
  status: SessionStatus;
  missedHeartbeatCount: number;
  escalationLevel: number;
  threshold: number;
  lastHeartbeat: Heartbeat | null;
}

export interface LocationPing {
  _id: string;
  user: string;
  session: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number;
  heading: number;
  capturedAt: string;
}

export interface Incident {
  _id: string;
  user: string;
  session: string | { _id: string; triggerType: string; status: string; startedAt: string };
  type: IncidentType;
  message: string;
  severity: "info" | "warning" | "critical";
  metadata: Record<string, unknown>;
  timestamp: string;
}

export type IncidentType =
  | "EMERGENCY_STARTED"
  | "HEARTBEAT_RECEIVED"
  | "HEARTBEAT_MISSED"
  | "ESCALATION_TRIGGERED"
  | "SESSION_RESOLVED"
  | "SESSION_CANCELLED"
  | "LOCATION_UPDATED"
  | "CONTACT_NOTIFIED"
  | "EVIDENCE_UPLOADED"
  | "REPORT_GENERATED"
  | "AI_ANALYSIS_COMPLETED"
  | "STATUS_CHANGED";

export interface Evidence {
  _id: string;
  user: string;
  session: string;
  kind: "audio" | "photo" | "video" | "text" | "screenshot";
  fileUrl: string;
  storagePath: string;
  mimeType: string;
  size: number;
  transcript: string;
  aiSummary: string;
  uploadedAt: string;
}
