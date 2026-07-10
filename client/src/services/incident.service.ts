import { api } from "@/lib/api";
import type { Incident, LocationPing } from "@/types/emergency";
import type { PaginatedResponse } from "@/types/api";

export const incidentService = {
  getHistory(page = 1, limit = 50) {
    return api.get<PaginatedResponse<Incident>>(`/api/incidents/history?page=${page}&limit=${limit}`);
  },
  getById(id: string) {
    return api.get<Incident>(`/api/incidents/${id}`);
  },
  getTimeline(sessionId: string, page = 1, limit = 50) {
    return api.get<PaginatedResponse<Incident>>(
      `/api/incidents/session/${sessionId}/timeline?page=${page}&limit=${limit}`
    );
  },
};
