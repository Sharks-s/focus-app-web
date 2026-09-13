"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

// Dùng trong các trang con để bắt sự kiện phiên hết hạn khi đang thao tác
// (vd gọi API users, personalities... nhận 401 SESSION_EXPIRED từ proxy)
export function useAuth() {
    const store = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        function handleExpired() {
            store.clearSession();
            router.replace("/admin/login");
        }
        window.addEventListener("auth:session-expired", handleExpired);
        return () => window.removeEventListener("auth:session-expired", handleExpired);
    }, [router, store]);

    return store;
}