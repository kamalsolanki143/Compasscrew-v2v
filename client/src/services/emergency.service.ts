import { api } from "@/lib/api";
import type { EmergencySession, TriggerType, SessionStatus } from "@/types/emergency";
import type { PaginatedResponse } from "@/types/api";

export const emergencyService = {
  start(data: { triggerType?: TriggerType; notes?: string }) {
    return api.post<EmergencySession>("/api/emergency/start", data);
  },
  stop(sessionId: string) {
    return api.post<EmergencySession>(`/api/emergency/${sessionId}/stop`);
  },
  updateStatus(sessionId: string, data: { status: SessionStatus; notes?: string }) {
    return api.patch<EmergencySession>(`/api/emergency/${sessionId}/status`, data);
  },
  getById(sessionId: string) {
    return api.get<EmergencySession>(`/api/emergency/${sessionId}`);
  },
  getHistory(page = 1, limit = 20) {
    return api.get<PaginatedResponse<EmergencySession>>(`/api/emergency?page=${page}&limit=${limit}`);
  },
};
