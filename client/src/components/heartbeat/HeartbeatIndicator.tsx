"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeartbeatIndicatorProps {
  lastHeartbeatAt?: string | null;
  missed?: boolean;
  className?: string;
}

function timeSince(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ago`;
}

export default function HeartbeatIndicator({
  lastHeartbeatAt,
  missed = false,
  className,
}: HeartbeatIndicatorProps) {
  const [elapsed, setElapsed] = useState(lastHeartbeatAt ? timeSince(lastHeartbeatAt) : "—");

  useEffect(() => {
    if (!lastHeartbeatAt) return;
    const interval = setInterval(() => setElapsed(timeSince(lastHeartbeatAt)), 5000);
    return () => clearInterval(interval);
  }, [lastHeartbeatAt]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <motion.div
        animate={missed ? { scale: [1, 1.3, 1] } : { scale: [1, 1.15, 1] }}
        transition={{ duration: missed ? 0.6 : 1.2, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "h-2.5 w-2.5 rounded-full",
          missed
            ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]"
            : "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]"
        )}
      />
      <span className="text-xs text-zinc-400">
        {lastHeartbeatAt ? elapsed : "No heartbeat"}
      </span>
    </div>
  );
}
