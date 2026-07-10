import { api } from "@/lib/api";
import type { LocationPing } from "@/types/emergency";
import type { PaginatedResponse } from "@/types/api";

export const mapsService = {
  saveLocation(sessionId: string, data: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    speed?: number;
    heading?: number;
  }) {
    return api.post<LocationPing>(`/api/maps/${sessionId}/location`, data);
  },
  getHistory(sessionId: string, page = 1, limit = 100) {
    return api.get<PaginatedResponse<LocationPing>>(
      `/api/maps/${sessionId}/history?page=${page}&limit=${limit}`
    );
  },
  getLastLocation(sessionId: string) {
    return api.get<LocationPing | null>(`/api/maps/${sessionId}/last-location`);
  },
};
