import type { TrustedContact } from "@/types/user";

export function calculateDistanceKm(
  lat1: number, lon1: number, lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical": return "text-red-500";
    case "warning": return "text-amber-500";
    default: return "text-blue-500";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "active": return "bg-red-500";
    case "escalated": return "bg-orange-500";
    case "resolved": return "bg-green-500";
    case "cancelled": return "bg-gray-500";
    default: return "bg-gray-400";
  }
}

export function getContactDisplayName(contact: TrustedContact): string {
  return contact.relation ? `${contact.name} (${contact.relation})` : contact.name;
}
