"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Heart,
  HeartOff,
  ArrowUpCircle,
  CheckCircle2,
  XCircle,
  MapPin,
  Users,
  FileText,
  Brain,
  Shield,
  Clock,
  Loader2,
} from "lucide-react";
import { incidentService } from "@/services/incident.service";
import { cn } from "@/lib/utils";
import type { Incident, IncidentType } from "@/types/emergency";

interface IncidentTimelineProps {
  sessionId?: string;
  incidents?: Incident[];
}

const incidentIcons: Record<IncidentType, React.ReactNode> = {
  EMERGENCY_STARTED: <AlertTriangle className="h-4 w-4" />,
  HEARTBEAT_RECEIVED: <Heart className="h-4 w-4" />,
  HEARTBEAT_MISSED: <HeartOff className="h-4 w-4" />,
  ESCALATION_TRIGGERED: <ArrowUpCircle className="h-4 w-4" />,
  SESSION_RESOLVED: <CheckCircle2 className="h-4 w-4" />,
  SESSION_CANCELLED: <XCircle className="h-4 w-4" />,
  LOCATION_UPDATED: <MapPin className="h-4 w-4" />,
  CONTACT_NOTIFIED: <Users className="h-4 w-4" />,
  EVIDENCE_UPLOADED: <FileText className="h-4 w-4" />,
  REPORT_GENERATED: <FileText className="h-4 w-4" />,
  AI_ANALYSIS_COMPLETED: <Brain className="h-4 w-4" />,
  STATUS_CHANGED: <Shield className="h-4 w-4" />,
};

const severityDot: Record<string, string> = {
  info: "bg-blue-400",
  warning: "bg-orange-400",
  critical: "bg-red-400",
};

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function IncidentTimeline({ sessionId, incidents: externalIncidents }: IncidentTimelineProps) {
  const [incidents, setIncidents] = useState<Incident[]>(externalIncidents ?? []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (externalIncidents) {
      setIncidents(externalIncidents);
      setLoading(false);
      return;
    }
    if (!sessionId) {
      setLoading(false);
      return;
    }

    incidentService
      .getTimeline(sessionId, 1, 50)
      .then((res) => {
        setIncidents(res.data.incidents ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId, externalIncidents]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-12 text-center">
        <Clock className="h-10 w-10 text-zinc-600" />
        <p className="text-sm text-zinc-400">No incidents recorded for this session.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />

      <div className="space-y-1">
        {incidents.map((incident, i) => (
          <motion.div
            key={incident._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="relative flex gap-4 pl-2"
          >
            <div className="relative z-10 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 ring-2 ring-[#1a0533]">
              <span className={cn("h-2 w-2 rounded-full", severityDot[incident.severity] ?? "bg-zinc-500")} />
            </div>

            <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">{incidentIcons[incident.type] ?? <Shield className="h-4 w-4" />}</span>
                <span className="text-xs font-medium text-zinc-400">{formatTime(incident.timestamp)}</span>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  incident.severity === "critical"
                    ? "bg-red-500/15 text-red-400"
                    : incident.severity === "warning"
                      ? "bg-orange-500/15 text-orange-400"
                      : "bg-blue-500/15 text-blue-400"
                )}>
                  {incident.severity}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-zinc-300">{incident.message}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
