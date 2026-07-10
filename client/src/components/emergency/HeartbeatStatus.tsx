"use client";

import { motion } from "framer-motion";
import { Heart, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useEmergency } from "@/context/EmergencyContext";
import { heartbeatService } from "@/services/heartbeat.service";
import type { HeartbeatStatus as HeartbeatStatusType } from "@/types/emergency";

interface HeartbeatStatusProps {
  status?: HeartbeatStatusType;
}

export default function HeartbeatStatus({ status: externalStatus }: HeartbeatStatusProps) {
  const { activeSession } = useEmergency();
  const [status, setStatus] = useState<HeartbeatStatusType | null>(externalStatus ?? null);

  useEffect(() => {
    if (externalStatus) {
      setStatus(externalStatus);
      return;
    }
    if (!activeSession) return;
    heartbeatService.getStatus(activeSession._id)
      .then((res) => setStatus(res.data))
      .catch(() => {});
  }, [activeSession, externalStatus]);

  if (!status) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
      </div>
    );
  }
  const thresholdPercent = status.threshold > 0
    ? Math.min((status.missedHeartbeatCount / status.threshold) * 100, 100)
    : 0;

  const isCritical = status.escalationLevel >= 2;
  const isWarning = status.escalationLevel === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
    >
      <div className="mb-5 flex items-center gap-3">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15"
        >
          <Heart className="h-5 w-5 fill-red-400 text-red-400" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-white">Heartbeat Status</h3>
          <p className="text-sm text-zinc-400">
            {status.status === "active" ? "Monitoring active" : `Session ${status.status}`}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Last Heartbeat</span>
          <span className="text-sm font-medium text-white">
            {status.lastHeartbeat
              ? new Date(status.lastHeartbeat.receivedAt).toLocaleTimeString()
              : "No heartbeat yet"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Missed Count</span>
          <span
            className={cn(
              "text-sm font-medium",
              status.missedHeartbeatCount > 0 ? "text-red-400" : "text-green-400"
            )}
          >
            {status.missedHeartbeatCount} / {status.threshold}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-zinc-400">
            {isCritical ? (
              <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
            ) : null}
            Escalation Level
          </span>
          <span
            className={cn(
              "text-sm font-medium",
              isCritical ? "text-red-400" : isWarning ? "text-orange-400" : "text-green-400"
            )}
          >
            Level {status.escalationLevel}
          </span>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Threshold Progress</span>
            <span className="text-xs text-zinc-500">{Math.round(thresholdPercent)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${thresholdPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                thresholdPercent > 75
                  ? "bg-red-500"
                  : thresholdPercent > 40
                    ? "bg-orange-500"
                    : "bg-green-500"
              )}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
