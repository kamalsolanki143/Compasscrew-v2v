import { api } from "@/lib/api";
import type { Heartbeat, HeartbeatStatus } from "@/types/emergency";

export const heartbeatService = {
  checkIn(sessionId: string, metadata?: Record<string, unknown>) {
    return api.post<Heartbeat>(`/api/heartbeat/${sessionId}/check-in`, { metadata });
  },
  markMissed(sessionId: string) {
    return api.post<Heartbeat>(`/api/heartbeat/${sessionId}/missed`);
  },
  getStatus(sessionId: string) {
    return api.get<HeartbeatStatus>(`/api/heartbeat/${sessionId}/status`);
  },
};
