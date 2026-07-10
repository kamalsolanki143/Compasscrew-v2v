import { api } from "@/lib/api";
import type { TrustedContact } from "@/types/user";
import type { ContactFormData } from "@/types/contact";

export const contactService = {
  getAll() {
    return api.get<TrustedContact[]>("/api/contacts");
  },
  add(data: ContactFormData) {
    return api.post<TrustedContact>("/api/contacts", data);
  },
  update(id: string, data: Partial<ContactFormData>) {
    return api.patch<TrustedContact>(`/api/contacts/${id}`, data);
  },
  remove(id: string) {
    return api.delete<null>(`/api/contacts/${id}`);
  },
};
