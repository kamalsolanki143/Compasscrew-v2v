"use client";

import { useMemo } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { Heartbeat } from "@/types/emergency";

interface ResponseChartProps {
  heartbeats: Heartbeat[];
}

interface ResponseStats {
  onTime: number;
  late: number;
  missed: number;
  total: number;
  onTimePct: number;
  missedPct: number;
}

function computeStats(heartbeats: Heartbeat[]): ResponseStats {
  const total = heartbeats.length;
  if (total === 0)
    return { onTime: 0, late: 0, missed: 0, total: 0, onTimePct: 0, missedPct: 0 };

  const onTime = heartbeats.filter((h) => h.status === "on_time").length;
  const late = heartbeats.filter((h) => h.status === "late").length;
  const missed = heartbeats.filter((h) => h.status === "missed").length;

  return {
    onTime,
    late,
    missed,
    total,
    onTimePct: Math.round((onTime / total) * 100),
    missedPct: Math.round((missed / total) * 100),
  };
}

export default function ResponseChart({ heartbeats }: ResponseChartProps) {
  const stats = useMemo(() => computeStats(heartbeats), [heartbeats]);

  const segments = [
    {
      label: "On Time",
      count: stats.onTime,
      pct: stats.onTimePct,
      color: "bg-emerald-500",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
    },
    {
      label: "Late",
      count: stats.late,
      pct: stats.total > 0 ? Math.round((stats.late / stats.total) * 100) : 0,
      color: "bg-amber-500",
      icon: Clock,
      iconColor: "text-amber-400",
    },
    {
      label: "Missed",
      count: stats.missed,
      pct: stats.missedPct,
      color: "bg-red-500",
      icon: XCircle,
      iconColor: "text-red-400",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Response Rate</h3>
        <span className="text-xs text-gray-500">{stats.total} heartbeats</span>
      </div>

      {stats.total === 0 ? (
        <div className="flex h-24 items-center justify-center text-sm text-gray-600">
          No heartbeat data yet
        </div>
      ) : (
        <>
          <div className="mb-1 flex h-3 w-full overflow-hidden rounded-full bg-gray-800">
            {segments.map((seg) =>
              seg.count > 0 ? (
                <div
                  key={seg.label}
                  className={cn("h-full transition-all duration-500", seg.color)}
                  style={{ width: `${seg.pct}%` }}
                />
              ) : null
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {segments.map((seg) => {
              const Icon = seg.icon;
              return (
                <div key={seg.label} className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <Icon className={cn("size-3.5", seg.iconColor)} />
                    <span className="text-xs text-gray-400">{seg.label}</span>
                  </div>
                  <span className="text-lg font-bold tabular-nums text-white">
                    {seg.pct}%
                  </span>
                  <span className="text-[11px] text-gray-600">
                    {seg.count} / {stats.total}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
