export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  emergencyPreferences: EmergencyPreferences;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: string;
}

export interface EmergencyPreferences {
  heartbeatIntervalSeconds: number;
  missedHeartbeatThreshold: number;
  autoNotifyContacts: boolean;
  shareLiveLocation: boolean;
}

export interface TrustedContact {
  _id: string;
  user: string;
  name: string;
  phone: string;
  relation?: string;
  priority: number;
  notifyBy: ("sms" | "push" | "email")[];
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}
