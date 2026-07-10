"use client";

import { useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContactFormData } from "@/types/contact";
import { contactService } from "@/services/report.service";

interface ContactFormProps {
  contactId?: string;
  defaultValues?: ContactFormData;
  onSuccess: () => void;
  onCancel: () => void;
}

const NOTIFY_OPTIONS = ["sms", "push", "email"] as const;

const INITIAL: ContactFormData = {
  name: "",
  phone: "",
  relation: "",
  priority: 1,
  notifyBy: ["sms"],
  isPrimary: false,
};

export default function ContactForm({
  contactId,
  defaultValues,
  onSuccess,
  onCancel,
}: ContactFormProps) {
  const [form, setForm] = useState<ContactFormData>(defaultValues ?? INITIAL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!contactId;

  function update<K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function toggleNotify(channel: "sms" | "push" | "email") {
    const current = form.notifyBy ?? [];
    const next = current.includes(channel)
      ? current.filter((c) => c !== channel)
      : [...current, channel];
    update("notifyBy", next.length > 0 ? next : ["sms"]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) return setError("Name is required");
    if (!form.phone.trim()) return setError("Phone number is required");

    setSaving(true);
    setError(null);

    try {
      if (isEditing) {
        await contactService.update(contactId, form);
      } else {
        await contactService.add(form);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save contact");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="contact-name" className="mb-1 block text-xs font-medium text-gray-400">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Jane Doe"
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        />
      </div>

      <div>
        <label htmlFor="contact-phone" className="mb-1 block text-xs font-medium text-gray-400">
          Phone Number
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+1 (555) 000-0000"
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="contact-relation" className="mb-1 block text-xs font-medium text-gray-400">
            Relationship
          </label>
          <input
            id="contact-relation"
            type="text"
            value={form.relation ?? ""}
            onChange={(e) => update("relation", e.target.value)}
            placeholder="Friend, family..."
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          />
        </div>

        <div>
          <label htmlFor="contact-priority" className="mb-1 block text-xs font-medium text-gray-400">
            Priority
          </label>
          <select
            id="contact-priority"
            value={form.priority ?? 1}
            onChange={(e) => update("priority", Number(e.target.value))}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">
          Notify By
        </label>
        <div className="flex gap-2">
          {NOTIFY_OPTIONS.map((channel) => {
            const active = form.notifyBy?.includes(channel) ?? false;
            return (
              <button
                key={channel}
                type="button"
                onClick={() => toggleNotify(channel)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  active
                    ? "border-blue-500/50 bg-blue-500/15 text-blue-300"
                    : "border-gray-700 bg-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-400"
                )}
              >
                {channel}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-400">
        <input
          type="checkbox"
          checked={form.isPrimary ?? false}
          onChange={(e) => update("isPrimary", e.target.checked)}
          className="size-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500/50"
        />
        Set as primary contact
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 disabled:opacity-50"
        >
          <X className="size-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-4" />
              {isEditing ? "Update" : "Add Contact"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
