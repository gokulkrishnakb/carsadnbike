import { api } from "@/lib/api";
import type { TokenResponse, User } from "@/types";

export const authService = {
  async register(data: { email: string; password: string; full_name: string }): Promise<User> {
    const res = await api.post<User>("/auth/register", data);
    return res.data;
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await api.post<TokenResponse>("/auth/login", { email, password });
    const { access_token } = res.data;
    const me = await api.get<User>("/auth/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return { user: me.data, token: access_token };
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post("/auth/logout", { refresh_token: refreshToken });
  },

  async me(): Promise<User> {
    const res = await api.get<User>("/auth/me");
    return res.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post("/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  async forgotPassword(email: string): Promise<{ message: string; reset_token?: string }> {
    const res = await api.post<{ message: string; reset_token?: string }>("/auth/forgot-password", { email });
    return res.data;
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post("/auth/reset-password", { token, new_password: newPassword });
  },
};
