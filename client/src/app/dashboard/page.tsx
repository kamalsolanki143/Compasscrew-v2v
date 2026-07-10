"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import EmergencyCard from "@/components/emergency/EmergencyCard";
import ContactList from "@/components/contacts/ContactList";
import IncidentTimeline from "@/components/timeline/IncidentTimeline";
import PageHeader from "@/components/common/PageHeader";
import { useEmergency } from "@/context/EmergencyContext";
import { useEffect } from "react";

export default function DashboardPage() {
  const { activeSession, loadActiveSession } = useEmergency();

  useEffect(() => {
    loadActiveSession();
  }, [loadActiveSession]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Your safety overview at a glance"
      />
      <div className="space-y-6">
        <DashboardStats />
        {activeSession && <EmergencyCard />}
        <QuickActions />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContactList />
          <IncidentTimeline />
        </div>
      </div>
    </DashboardLayout>
  );
}
