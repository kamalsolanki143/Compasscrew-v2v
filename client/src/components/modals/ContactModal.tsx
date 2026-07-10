"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrustedContact } from "@/types/user";
import type { ContactFormData } from "@/types/contact";
import ContactForm from "@/components/forms/ContactForm";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: TrustedContact;
  onSaved: () => void;
}

export default function ContactModal({
  isOpen,
  onClose,
  initialData,
  onSaved,
}: ContactModalProps) {
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

  const isEditing = !!initialData;
  const defaultValues: ContactFormData | undefined = initialData
    ? {
        name: initialData.name,
        phone: initialData.phone,
        relation: initialData.relation,
        priority: initialData.priority,
        notifyBy: initialData.notifyBy,
        isPrimary: initialData.isPrimary,
      }
    : undefined;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "relative w-full max-w-lg rounded-2xl border border-gray-700/50 bg-gray-900 p-6 shadow-2xl",
          "outline-none max-h-[90vh] overflow-y-auto"
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-gray-200"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <h2
          id="contact-modal-title"
          className="mb-6 text-lg font-semibold text-white"
        >
          {isEditing ? "Edit Contact" : "Add Contact"}
        </h2>

        <ContactForm
          contactId={initialData?._id}
          defaultValues={defaultValues}
          onSuccess={() => {
            onSaved();
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
