"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth";

interface SidebarItem {
    label: string;
    href: string;
}

const ITEMS: SidebarItem[] = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Quản lý người dùng", href: "/admin/user-management" },
    { label: "Nội dung hệ thống", href: "/admin/content" },
    { label: "Giám sát & Vận hành", href: "/admin/monitoring" },
    { label: "Phân tích", href: "/admin/system-analytics" },
    { label: "Cấu hình", href: "/admin/app-settings" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    async function handleLogout() {
        await logout();
        window.location.href = "/admin/login";
    }

    return (
        <aside className="flex h-screen w-64 shrink-0 flex-col border-r bg-background">
            <div className="flex h-14 shrink-0 items-center border-b px-4">
                <span className="text-lg font-semibold">FocusBuddy Admin</span>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-3">
                <div className="flex flex-col gap-0.5">
                    {ITEMS.map((item) => {
                        const active = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-black text-white" : "text-foreground/80 hover:bg-muted"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="shrink-0 border-t p-3">
                <div className="mb-3 min-w-0">
                    <p className="truncate text-sm font-medium">{user?.fullName ?? "Admin"}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                >
                    Đăng xuất
                </button>
            </div>
        </aside>
    );
}