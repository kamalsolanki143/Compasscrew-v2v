"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { profileSchema, type ProfileFormData } from "@/utils/validators";
import { api } from "@/lib/api";
import type { User } from "@/types/user";
import { Button } from "@/components/ui/button";

export default function ProfileForm() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, phone: user.phone ?? "" });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      const res = await api.patch<User>("/users/profile", data);
      updateUser(res.data);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-300">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          placeholder="Your name"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-300">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          placeholder="+1 (555) 000-0000"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-rose-400">{errors.phone.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading || !isDirty}
        className="w-full bg-rose-600 text-white hover:bg-rose-700"
      >
        {loading ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
