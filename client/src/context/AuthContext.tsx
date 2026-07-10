"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { storage } from "@/utils/storage";
import type { User } from "@/types/user";
import { ROUTES } from "@/constants/routes";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    const token = storage.getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authService.getMe();
      setUser(res.data);
      storage.setUser(res.data);
    } catch {
      storage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    storage.setToken(res.data.token);
    storage.setUser(res.data.user);
    setUser(res.data.user);
    router.push(ROUTES.DASHBOARD);
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    const res = await authService.signup({ name, email, password, phone });
    storage.setToken(res.data.token);
    storage.setUser(res.data.user);
    setUser(res.data.user);
    router.push(ROUTES.DASHBOARD);
  };

  const logout = () => {
    storage.clear();
    setUser(null);
    router.push(ROUTES.HOME);
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    storage.setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
