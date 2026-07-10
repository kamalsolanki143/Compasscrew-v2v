"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { user, updateUser } = useAuth();

  const handleTogglePref = async (key: string, value: boolean) => {
    if (!user) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"}/api/users/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            emergencyPreferences: { ...user.emergencyPreferences, [key]: value },
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        updateUser(data.data);
        toast.success("Settings updated");
      }
    } catch {
      toast.error("Failed to update settings");
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Settings"
        description="Configure your preferences"
      />
      <div className="max-w-2xl space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Appearance</h3>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
            </div>
            <button
              onClick={toggle}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-foreground transition-transform ${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Emergency Preferences</h3>
          <div className="space-y-3">
            {[
              { key: "autoNotifyContacts", label: "Auto-notify contacts", desc: "Automatically notify trusted contacts on emergency" },
              { key: "shareLiveLocation", label: "Share live location", desc: "Share your GPS location during emergencies" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <button
                  onClick={() => {
                    if (user) {
                      const current = user.emergencyPreferences;
                      handleTogglePref(key, !(current as unknown as Record<string, boolean>)[key]);
                    }
                  }}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-foreground transition-transform ${
                      (user?.emergencyPreferences as unknown as Record<string, boolean>)?.[key]
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Account</h3>
          <div className="p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              Email: <span className="text-foreground">{user?.email}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Role: <span className="text-foreground capitalize">{user?.role}</span>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
