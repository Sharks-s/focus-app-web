import { create } from "zustand";
import type { AdminUser, LoginRequest } from "../types/auth.types";
import { loginService, logoutService, getMeService } from "../services/auth.service";

interface AuthState {
    user: AdminUser | null;
    isInitializing: boolean;
    isLoading: boolean;
    error: string | null;

    bootstrap: () => Promise<void>;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    clearSession: () => void;
    clearError: () => void;

    isAuthenticated: () => boolean;
}

// Giữ Promise của lần bootstrap đang chạy, ngoài phạm vi store state
// (không đưa vào state vì Promise không nên là reactive state của zustand)
let bootstrapPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isInitializing: true,
    isLoading: false,
    error: null,

    isAuthenticated: () => !!get().user,

    bootstrap: () => {
        // Đã có 1 lần bootstrap đang chạy (hoặc đã chạy xong) -> tái sử dụng, không gọi lại API
        if (bootstrapPromise) return bootstrapPromise;

        bootstrapPromise = (async () => {
            try {
                const user = await getMeService();
                set({ user, isInitializing: false });
            } catch {
                set({ user: null, isInitializing: false });
            }
        })();

        return bootstrapPromise;
    },

    login: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const user = await loginService(data);
            set({
                user,
                isInitializing: false,
            });
            // Sau khi login thành công, coi như đã "initialized" luôn,
            // và reset bootstrapPromise để lần logout/login sau vẫn bootstrap lại đúng nếu cần
            bootstrapPromise = Promise.resolve();
        } catch (err: unknown) {
            set({ error: err instanceof Error ? err.message : "LOGIN_FAILED" });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await logoutService();
        } finally {
            bootstrapPromise = null;
            set({ user: null, error: null, isLoading: false });
        }
    },

    clearSession: () => {
        bootstrapPromise = null;
        set({ user: null, error: null });
    },

    clearError: () => set({ error: null }),
}));