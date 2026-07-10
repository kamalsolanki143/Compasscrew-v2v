"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Users, FileWarning, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEmergency } from "@/hooks/useEmergency";
import { contactService } from "@/services/report.service";
import { incidentService } from "@/services/incident.service";
import { cn } from "@/lib/utils";

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accentClass: string;
}

export default function DashboardStats() {
  const { user } = useAuth();
  const { activeSession, heartbeatStatus } = useEmergency();
  const [contactsCount, setContactsCount] = useState(0);
  const [incidentsCount, setIncidentsCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    contactService.getAll().then((res) => {
      const list = res.data;
      setContactsCount(Array.isArray(list) ? list.length : 0);
    }).catch(() => {});

    incidentService.getHistory(1, 1).then((res) => {
      setIncidentsCount(res.data.total ?? 0);
    }).catch(() => {});
  }, [user]);

  const emergencyStatus = activeSession
    ? activeSession.status === "escalated"
      ? "Escalated"
      : "Active"
    : "None";

  const heartbeatLabel = heartbeatStatus
    ? heartbeatStatus.missedHeartbeatCount > 0
      ? `${heartbeatStatus.missedHeartbeatCount} missed`
      : "Healthy"
    : "Inactive";

  const stats: StatCard[] = [
    {
      label: "Active Emergency",
      value: emergencyStatus,
      icon: <Shield className="h-5 w-5" />,
      accentClass: activeSession
        ? "text-red-400 bg-red-500/15"
        : "text-green-400 bg-green-500/15",
    },
    {
      label: "Trusted Contacts",
      value: contactsCount,
      icon: <Users className="h-5 w-5" />,
      accentClass: "text-purple-400 bg-purple-500/15",
    },
    {
      label: "Recent Incidents",
      value: incidentsCount,
      icon: <FileWarning className="h-5 w-5" />,
      accentClass: "text-orange-400 bg-orange-500/15",
    },
    {
      label: "Heartbeat Status",
      value: heartbeatLabel,
      icon: <Heart className="h-5 w-5" />,
      accentClass: heartbeatStatus
        ? heartbeatStatus.missedHeartbeatCount > 0
          ? "text-red-400 bg-red-500/15"
          : "text-green-400 bg-green-500/15"
        : "text-zinc-400 bg-zinc-500/15",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
        >
          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", stat.accentClass)}>
            {stat.icon}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-zinc-400">{stat.label}</p>
            <p className="truncate text-xl font-bold text-white">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
