export interface ContactFormData {
  name: string;
  phone: string;
  relation?: string;
  priority?: number;
  notifyBy?: ("sms" | "push" | "email")[];
  isPrimary?: boolean;
}
