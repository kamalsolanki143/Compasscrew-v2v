"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import IncidentTimeline from "@/components/timeline/IncidentTimeline";
import PageHeader from "@/components/common/PageHeader";
import { incidentService } from "@/services/incident.service";
import { useEffect, useState } from "react";
import type { Incident } from "@/types/emergency";

export default function HistoryPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    incidentService.getHistory(1, 100).then((res) => {
      setIncidents(res.data.incidents || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title="Incident History"
        description="View all past incidents and emergencies"
      />
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : incidents.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No incidents recorded yet.
        </div>
      ) : (
        <IncidentTimeline incidents={incidents} />
      )}
    </DashboardLayout>
  );
}
