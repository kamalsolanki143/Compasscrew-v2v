"use client";

import { usePathname } from "next/navigation";
import { Moon, Sun, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ROUTES } from "@/constants/routes";
import ProfileMenu from "@/components/navbar/ProfileMenu";

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: "Dashboard",
  [ROUTES.EMERGENCY]: "Emergency",
  [ROUTES.DANGER_MODE]: "Danger Mode",
  [ROUTES.HISTORY]: "History",
  [ROUTES.PROFILE]: "Profile",
  [ROUTES.SETTINGS]: "Settings",
};

interface NavbarProps {
  onMenuToggle?: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>

        {user && <ProfileMenu user={user} />}
      </div>
    </header>
  );
}
