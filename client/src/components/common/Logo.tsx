"use client";

import { Shield } from "lucide-react";

const sizes = {
  sm: { icon: 20, text: "text-lg" },
  md: { icon: 28, text: "text-2xl" },
  lg: { icon: 36, text: "text-3xl" },
} as const;

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({ size = "md" }: LogoProps) {
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <Shield className="text-rose-500" size={s.icon} strokeWidth={2.2} />
      <span className={`font-bold tracking-tight text-white ${s.text}`}>
        EscapeHer
      </span>
    </div>
  );
}
