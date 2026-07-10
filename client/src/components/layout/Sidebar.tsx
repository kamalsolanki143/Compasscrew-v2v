"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import {
  LayoutDashboard,
  Siren,
  AlertTriangle,
  Clock,
  User,
  Settings,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import SidebarItem from "@/components/sidebar/SidebarItem";
import Logo from "@/components/common/Logo";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Siren,
  AlertTriangle,
  Clock,
  User,
  Settings,
};

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export default function Sidebar({ className, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col bg-gray-950 text-white",
        className
      )}
    >
      <div className="flex items-center gap-3 px-5 py-6">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon];
          return (
            <SidebarItem
              key={item.href}
              label={item.label}
              href={item.href}
              icon={Icon}
              isActive={pathname === item.href}
            />
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={() => {
            logout();
            onClose?.();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="size-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
