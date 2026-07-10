"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, ArrowUpCircle, Square, Loader2 } from "lucide-react";
import { useEmergency } from "@/hooks/useEmergency";
import { cn } from "@/lib/utils";
import type { SessionStatus, TriggerType } from "@/types/emergency";

const statusConfig: Record<SessionStatus, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-red-500/15 text-red-400 border border-red-500/30",
  },
  escalated: {
    label: "Escalated",
    className: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  },
  resolved: {
    label: "Resolved",
    className: "bg-green-500/15 text-green-400 border border-green-500/30",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-zinc-500/15 text-zinc-400 border border-zinc-500/30",
  },
};

const triggerLabels: Record<TriggerType, string> = {
  manual_sos: "Manual SOS",
  heartbeat_escalation: "Heartbeat Escalation",
  voice_trigger: "Voice Trigger",
  auto_detect: "Auto Detect",
};

function formatElapsed(startedAt: string): string {
  const elapsed = Date.now() - new Date(startedAt).getTime();
  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export default function EmergencyCard() {
  const { activeSession, loading, stopEmergency } = useEmergency();
  const [, setTick] = useState(0);

  if (!activeSession) return null;

  const status = statusConfig[activeSession.status] ?? statusConfig.active;
  const elapsed = formatElapsed(activeSession.startedAt);

  setInterval(() => setTick((t) => t + 1), 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Active Emergency</h3>
          <p className="text-sm text-zinc-400">Session in progress</p>
        </div>
      </div>

      <div className="mb-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Status</span>
          <span className={cn("rounded-full px-3 py-1 text-xs font-medium", status.className)}>
            {status.label}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Trigger Type</span>
          <span className="text-sm font-medium text-white">
            {triggerLabels[activeSession.triggerType] ?? activeSession.triggerType}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-zinc-400">
            <Clock className="h-3.5 w-3.5" />
            Time Elapsed
          </span>
          <span className="text-sm font-medium text-white">{elapsed}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-zinc-400">
            <ArrowUpCircle className="h-3.5 w-3.5" />
            Escalation Level
          </span>
          <span className="text-sm font-medium text-orange-400">
            Level {activeSession.escalationLevel}
          </span>
        </div>
      </div>

      <button
        onClick={stopEmergency}
        disabled={loading}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all",
          "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Square className="h-4 w-4" />
        )}
        Stop Emergency
      </button>
    </motion.div>
  );
}
