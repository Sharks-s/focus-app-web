import { apiClient } from "@/lib/apiClient";
import type { AuthApiResponse, LoginApiData, LoginRequest, AdminUser } from "../types/auth.types";

async function post<T>(path: string, body?: unknown): Promise<AuthApiResponse<T>> {
    const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
}

export const authApi = {
    login: (data: LoginRequest) => post<LoginApiData>("/api/admin/auth/login", data),
    logout: () => post<null>("/api/admin/auth/logout"),
    getMe: () => apiClient.get<AdminUser>("/api/admin/users/me"),
};