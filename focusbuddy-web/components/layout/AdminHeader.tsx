"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth";

export function AdminHeader() {
    const router = useRouter();
    const { user, logout } = useAuthStore();

    async function handleLogout() {
        await logout();
        router.replace("/admin/login");
    }

    return (
        <header className="flex h-14 items-center justify-between border-b px-6">
            <div />
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                    {user?.fullName ?? user?.email}
                </span>
                <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:underline"
                >
                    Đăng xuất
                </button>
            </div>
        </header>
    );
}