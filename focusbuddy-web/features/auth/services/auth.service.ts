import { authApi } from "../api/auth.api";
import type { AdminUser, LoginRequest } from "../types/auth.types";

export async function loginService(data: LoginRequest): Promise<AdminUser> {
    const res = await authApi.login(data);
    if (!res.success || !res.data) {
        throw new Error(res.message ?? "Đăng nhập thất bại");
    }
    return res.data.user;
}


export async function getMeService(): Promise<AdminUser> {
    return authApi.getMe();
}

export async function logoutService(): Promise<void> {
    await authApi.logout();
}