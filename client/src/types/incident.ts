export interface IncidentTimeline {
  incidents: import("./emergency").Incident[];
  total: number;
  page: number;
  limit: number;
}
