"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProfileForm from "@/components/forms/ProfileForm";
import PageHeader from "@/components/common/PageHeader";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Profile"
        description="Manage your account settings"
      />
      <div className="max-w-2xl">
        <ProfileForm />
      </div>
    </DashboardLayout>
  );
}
