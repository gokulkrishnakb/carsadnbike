import axios, { AxiosError, AxiosInstance } from "axios";
import { authClient } from "@/lib/auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  try {
    const tokenRes = await authClient.token();
    if (tokenRes.data?.token) {
      config.headers.Authorization = `Bearer ${tokenRes.data.token}`;
    }
  } catch {
    // No active session — request will be sent unauthenticated
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/api/v1";
