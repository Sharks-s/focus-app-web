"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, LogOut, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/features/auth";

export function AdminHeader() {
    const router = useRouter();
    const { user, logout } = useAuthStore();

    async function handleLogout() {
        await logout();
        router.replace("/admin/login");
    }

    const today = new Date().toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return (
        <header className="admin-header flex min-h-16 items-center justify-between gap-4 px-6">
            <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#2563eb]">
                    <ShieldCheck className="h-4 w-4" />
                    Admin Console
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span className="truncate">{today}</span>
                </div>
            </div>

            <div className="flex min-w-0 items-center gap-3">
                <div className="admin-header-user">
                    <span className="admin-header-avatar">
                        {(user?.fullName ?? user?.email ?? "A").slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold">{user?.fullName ?? "Admin"}</p>
                        <p className="truncate text-xs font-semibold text-muted-foreground">{user?.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="admin-header-logout" title="Đăng xuất">
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </header>
    );
}
