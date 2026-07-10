"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DangerButton from "@/components/emergency/DangerButton";
import EmergencyCard from "@/components/emergency/EmergencyCard";
import HeartbeatStatus from "@/components/emergency/HeartbeatStatus";
import PageHeader from "@/components/common/PageHeader";
import { useEmergency } from "@/context/EmergencyContext";
import { useState } from "react";
import EmergencyModal from "@/components/modals/EmergencyModal";
import toast from "react-hot-toast";

export default function EmergencyPage() {
  const { activeSession, startEmergency, loading } = useEmergency();
  const [showModal, setShowModal] = useState(false);

  const handleTrigger = async () => {
    try {
      await startEmergency("manual_sos", "Triggered from emergency page");
      toast.success("Emergency session started!");
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err
        ? (err as { message: string }).message
        : "Failed to start emergency";
      toast.error(msg);
    }
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Emergency"
        description="Trigger SOS and monitor your safety"
      />
      <div className="space-y-6">
        {activeSession ? (
          <>
            <EmergencyCard />
            <HeartbeatStatus />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <DangerButton
              onPress={() => setShowModal(true)}
              isActive={false}
              loading={loading}
            />
            <p className="mt-6 text-muted-foreground text-center max-w-md">
              Press the SOS button to start an emergency session.
              Your trusted contacts will be notified immediately.
            </p>
          </div>
        )}
        <EmergencyModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleTrigger}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}
