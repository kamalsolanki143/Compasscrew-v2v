"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, Loader2, Phone, ShieldAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function EmergencyModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: EmergencyModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    panelRef.current.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "relative w-full max-w-md rounded-2xl border border-red-500/30 bg-gray-950 p-6 shadow-2xl shadow-red-500/20",
          "outline-none"
        )}
      >
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-gray-200 disabled:opacity-50"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/30">
            <ShieldAlert className="size-8 text-red-400" />
          </div>

          <h2
            id="emergency-modal-title"
            className="mb-2 text-xl font-bold text-white"
          >
            Start Emergency Mode?
          </h2>

          <p className="mb-6 text-sm leading-relaxed text-gray-400">
            This will activate emergency protocols immediately. Your trusted
            contacts will be notified and your live location will be shared.
          </p>

          <div className="mb-6 w-full space-y-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <div className="flex items-start gap-3 text-left">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-400" />
              <span className="text-sm text-red-200">
                Contacts will receive SMS and push notifications
              </span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <Phone className="mt-0.5 size-4 shrink-0 text-red-400" />
              <span className="text-sm text-red-200">
                Emergency services may be contacted at escalation level 3
              </span>
            </div>
            <div className="flex items-start gap-3 text-left">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-400" />
              <span className="text-sm text-red-200">
                All audio and location data will be recorded
              </span>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors",
                "hover:bg-red-500 active:bg-red-700 disabled:opacity-50"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <ShieldAlert className="size-4" />
                  Activate Emergency
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
