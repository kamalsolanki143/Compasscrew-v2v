"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DangerButtonProps {
  onPress: () => void;
  isActive?: boolean;
  loading?: boolean;
}

export default function DangerButton({ onPress, isActive = false, loading = false }: DangerButtonProps) {
  return (
    <div className="relative flex items-center justify-center">
      <AnimatePresence>
        {isActive && (
          <>
            <motion.div
              className="absolute h-40 w-40 rounded-full bg-red-500/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute h-32 w-32 rounded-full bg-red-500/15"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
          </>
        )}
      </AnimatePresence>

      <motion.button
        onClick={onPress}
        disabled={loading}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative z-10 flex h-36 w-36 cursor-pointer items-center justify-center rounded-full border-4 transition-colors",
          "text-4xl font-black uppercase tracking-wider select-none",
          "disabled:cursor-not-allowed disabled:opacity-60",
          isActive
            ? "border-red-400 bg-gradient-to-br from-red-500 to-red-700 text-white shadow-[0_0_40px_rgba(239,68,68,0.5)]"
            : "border-red-500/50 bg-gradient-to-br from-red-600 to-red-800 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)]"
        )}
        aria-label="Emergency SOS button"
      >
        {loading ? (
          <Loader2 className="h-12 w-12 animate-spin" />
        ) : (
          <motion.span
            animate={isActive ? { scale: [1, 1.05, 1] } : {}}
            transition={isActive ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : {}}
          >
            SOS
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}
