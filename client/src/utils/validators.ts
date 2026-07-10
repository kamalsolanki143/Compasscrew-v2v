import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Contact name is required").max(100),
  phone: z.string().min(1, "Phone number is required"),
  relation: z.string().max(50).optional(),
  priority: z.number().min(1).max(10).optional(),
  notifyBy: z.array(z.enum(["sms", "push", "email"])).optional(),
  isPrimary: z.boolean().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().optional(),
  emergencyPreferences: z
    .object({
      heartbeatIntervalSeconds: z.number().min(30).max(3600).optional(),
      missedHeartbeatThreshold: z.number().min(1).max(10).optional(),
      autoNotifyContacts: z.boolean().optional(),
      shareLiveLocation: z.boolean().optional(),
    })
    .optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ContactFormInput = z.infer<typeof contactSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
