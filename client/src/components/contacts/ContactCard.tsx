"use client";

import { motion } from "framer-motion";
import { Star, Pencil, Trash2, MessageSquare, Bell, Mail, Loader2, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrustedContact } from "@/types/user";

interface ContactCardProps {
  contact: TrustedContact;
  onEdit: () => void;
  onDelete: () => void;
  deleting?: boolean;
}

const notifyIcons: Record<string, React.ReactNode> = {
  sms: <MessageSquare className="h-3 w-3" />,
  push: <Bell className="h-3 w-3" />,
  email: <Mail className="h-3 w-3" />,
};

function priorityColor(priority: number): string {
  if (priority <= 3) return "bg-red-500/15 text-red-400 border border-red-500/30";
  if (priority <= 6) return "bg-orange-500/15 text-orange-400 border border-orange-500/30";
  return "bg-green-500/15 text-green-400 border border-green-500/30";
}

export default function ContactCard({ contact, onEdit, onDelete, deleting = false }: ContactCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-colors hover:bg-white/[0.07]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-sm font-bold text-purple-400">
        {contact.name.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate text-sm font-semibold text-white">{contact.name}</h4>
          {contact.isPrimary && (
            <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
          )}
          <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", priorityColor(contact.priority))}>
            P{contact.priority}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {contact.phone}
          </span>
          {contact.relation && (
            <span className="rounded-full bg-white/5 px-2 py-0.5">{contact.relation}</span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <div className="mr-2 flex items-center gap-1 text-zinc-500">
          {contact.notifyBy.map((method) => (
            <span key={method} className="rounded bg-white/5 p-1">
              {notifyIcons[method] ?? null}
            </span>
          ))}
        </div>

        <button
          onClick={onEdit}
          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Edit contact"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/15 hover:text-red-400 disabled:opacity-50"
          aria-label="Delete contact"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
      </div>
    </motion.div>
  );
}
