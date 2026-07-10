"use client";

import { motion } from "framer-motion";
import { Siren, UserPlus, History, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  accentClass: string;
}

interface QuickActionsProps {
  onAddContact?: () => void;
}

export default function QuickActions({ onAddContact }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      label: "Start Emergency",
      icon: <Siren className="h-5 w-5" />,
      href: ROUTES.EMERGENCY,
      accentClass: "text-red-400 bg-red-500/15 hover:bg-red-500/25",
    },
    {
      label: "Add Contact",
      icon: <UserPlus className="h-5 w-5" />,
      onClick: onAddContact,
      accentClass: "text-purple-400 bg-purple-500/15 hover:bg-purple-500/25",
    },
    {
      label: "View History",
      icon: <History className="h-5 w-5" />,
      href: ROUTES.HISTORY,
      accentClass: "text-orange-400 bg-orange-500/15 hover:bg-orange-500/25",
    },
    {
      label: "View Profile",
      icon: <User className="h-5 w-5" />,
      href: ROUTES.PROFILE,
      accentClass: "text-blue-400 bg-blue-500/15 hover:bg-blue-500/25",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action, i) => {
        const content = (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all cursor-pointer",
              action.accentClass
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
              {action.icon}
            </div>
            <span className="text-sm font-medium text-white">{action.label}</span>
          </motion.div>
        );

        if (action.href) {
          return (
            <Link key={action.label} href={action.href} className="no-underline">
              {content}
            </Link>
          );
        }

        return (
          <button
            key={action.label}
            onClick={action.onClick}
            className="cursor-pointer border-0 bg-transparent p-0 text-left"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
