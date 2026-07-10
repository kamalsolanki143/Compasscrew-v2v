"use client";

import { useMemo } from "react";
import { AlertTriangle, TrendingUp } from "lucide-react";
import type { EmergencySession } from "@/types/emergency";

interface EmergencyChartProps {
  sessions: EmergencySession[];
}

interface DayBucket {
  label: string;
  count: number;
  isToday: boolean;
}

function getLast7Days(): Date[] {
  const days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

function isSameDay(date: Date, target: Date): boolean {
  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth() &&
    date.getDate() === target.getDate()
  );
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export default function EmergencyChart({ sessions }: EmergencyChartProps) {
  const buckets = useMemo<DayBucket[]>(() => {
    const days = getLast7Days();
    return days.map((day, i) => ({
      label: formatDayLabel(day),
      count: sessions.filter((s) => {
        const created = new Date(s.createdAt);
        return isSameDay(created, day);
      }).length,
      isToday: i === days.length - 1,
    }));
  }, [sessions]);

  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  const total = sessions.length;

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-orange-400" />
          <h3 className="text-sm font-semibold text-white">
            Emergency Sessions
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <TrendingUp className="size-3" />
          {total} total
        </div>
      </div>

      <div className="flex items-end gap-2" role="img" aria-label="Emergency sessions bar chart for the last 7 days">
        {buckets.map((bucket) => {
          const heightPct = maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;

          return (
            <div
              key={bucket.label}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <span className="text-[11px] font-medium tabular-nums text-gray-400">
                {bucket.count}
              </span>

              <div className="relative flex w-full items-end" style={{ height: 100 }}>
                <div
                  className={cn(
                    "w-full rounded-t-md transition-all duration-300",
                    bucket.isToday ? "bg-orange-400" : "bg-orange-500/40",
                    bucket.count === 0 && "bg-gray-800"
                  )}
                  style={{
                    height: bucket.count === 0 ? 4 : `${Math.max(heightPct, 8)}%`,
                  }}
                />
              </div>

              <span
                className={cn(
                  "text-[11px] font-medium",
                  bucket.isToday ? "text-white" : "text-gray-500"
                )}
              >
                {bucket.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
