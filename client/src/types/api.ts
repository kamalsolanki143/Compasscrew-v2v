export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  stack?: string;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  sessions?: T[];
  incidents?: T[];
  pings?: T[];
}

export interface DashboardSummary {
  activeEmergency: {
    id: string;
    status: string;
    triggerType: string;
    startedAt: string;
    escalationLevel: number;
  } | null;
  trustedContactsCount: number;
  recentIncidentsCount: number;
}
