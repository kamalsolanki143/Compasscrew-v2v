import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/user";

interface AuthData {
  user: User;
  token: string;
}

export const authService = {
  signup(data: { name: string; email: string; password: string; phone?: string }) {
    return api.post<AuthData>("/api/auth/signup", data);
  },
  login(data: { email: string; password: string }) {
    return api.post<AuthData>("/api/auth/login", data);
  },
  getMe() {
    return api.get<User>("/api/auth/me");
  },
};
