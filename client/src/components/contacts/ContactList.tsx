"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Loader2, Users } from "lucide-react";
import { contactService } from "@/services/report.service";
import ContactCard from "@/components/contacts/ContactCard";
import type { TrustedContact } from "@/types/user";

interface ContactListProps {
  onEdit?: (contact: TrustedContact) => void;
  onAdd?: () => void;
}

export default function ContactList({ onEdit, onAdd }: ContactListProps) {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await contactService.getAll();
      const data = res.data;
      setContacts(Array.isArray(data) ? data : []);
    } catch {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await contactService.remove(id);
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch {
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Trusted Contacts</h2>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-400">
            {contacts.length}
          </span>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-xl bg-purple-500/15 px-4 py-2 text-sm font-medium text-purple-400 transition-colors hover:bg-purple-500/25"
        >
          <UserPlus className="h-4 w-4" />
          Add Contact
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {contacts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-12 text-center"
          >
            <Users className="h-10 w-10 text-zinc-600" />
            <p className="text-sm text-zinc-400">No trusted contacts yet.</p>
            <button
              onClick={onAdd}
              className="text-sm font-medium text-purple-400 hover:text-purple-300"
            >
              Add your first contact
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <motion.div
                key={contact._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <ContactCard
                  contact={contact}
                  onEdit={() => onEdit?.(contact)}
                  onDelete={() => handleDelete(contact._id)}
                  deleting={deleting === contact._id}
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
