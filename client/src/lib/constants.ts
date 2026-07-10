import { ROUTES } from "@/constants/routes";

export const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
  { label: "Emergency", href: ROUTES.EMERGENCY, icon: "Siren" },
  { label: "Danger Mode", href: ROUTES.DANGER_MODE, icon: "AlertTriangle" },
  { label: "History", href: ROUTES.HISTORY, icon: "Clock" },
  { label: "Profile", href: ROUTES.PROFILE, icon: "User" },
  { label: "Settings", href: ROUTES.SETTINGS, icon: "Settings" },
] as const;
