"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useAuthStore } from "@/features/auth";

interface SidebarItem {
    label: string;
    href: string;
}

interface SidebarGroup {
    label: string;
    items: SidebarItem[];
}

const GROUPS: SidebarGroup[] = [
    {
        label: "Tổng quan",
        items: [{ label: "Dashboard", href: "/admin/dashboard" }],
    },
    {
        label: "Quản lý người dùng",
        items: [
            { label: "Users", href: "/admin/users" },
            { label: "Roles & Permissions", href: "/admin/roles-permissions" },
            { label: "Subscriptions", href: "/admin/subscriptions" },
        ],
    },
    {
        label: "Nội dung hệ thống",
        items: [
            { label: "Personalities", href: "/admin/personalities" },
            { label: "Pets", href: "/admin/pets" },
            { label: "System Songs", href: "/admin/system-songs" },
            { label: "App Rules", href: "/admin/app-rules" },
            { label: "Prompt Templates", href: "/admin/prompt-templates" },
        ],
    },
    {
        label: "Giám sát & Vận hành",
        items: [
            { label: "Sessions Monitor", href: "/admin/sessions-monitor" },
            { label: "Violations Log", href: "/admin/violations-log" },
            { label: "AI Logs", href: "/admin/ai-logs" },
        ],
    },
    {
        label: "Phân tích",
        items: [
            { label: "System Analytics", href: "/admin/system-analytics" },
        ],
    },
    {
        label: "Cấu hình",
        items: [
            { label: "App Settings", href: "/admin/app-settings" },
        ],
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
        Object.fromEntries(
            GROUPS.map((group) => [group.label, group.label === "Tổng quan"])
        ),
    );

    function toggleGroup(label: string) {
        setOpenGroups((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    }

    async function handleLogout() {
        await logout();
        window.location.href = "/admin/login";
    }

    return (
        <aside className="flex h-screen w-64 shrink-0 flex-col border-r bg-background">
            {/* Logo */}
            <div className="flex h-14 shrink-0 items-center border-b px-4">
                <span className="text-lg font-semibold">
                    FocusBuddy Admin
                </span>
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto px-2 py-3">
                <div className="flex flex-col gap-1">
                    {GROUPS.map((group) => {
                        const isOpen = openGroups[group.label];

                        return (
                            <div key={group.label} className="mb-1">
                                <button
                                    type="button"
                                    onClick={() => toggleGroup(group.label)}
                                    className="flex w-full items-center justify-between px-2 py-2 text-xs font-semibold uppercase text-muted-foreground hover:text-foreground"
                                >
                                    <span>{group.label}</span>

                                    <ChevronDown
                                        size={14}
                                        className={`shrink-0 transition-transform ${isOpen
                                            ? "rotate-0"
                                            : "-rotate-90"
                                            }`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="flex flex-col gap-0.5">
                                        {group.items.map((item) => {
                                            const active =
                                                pathname === item.href;

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${active
                                                        ? "bg-black text-white"
                                                        : "text-foreground/80 hover:bg-muted"
                                                        }`}
                                                >
                                                    {item.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* User / Logout */}
            <div className="shrink-0 border-t p-3">
                <div className="mb-3 min-w-0">
                    <p className="truncate text-sm font-medium">
                        {user?.fullName ?? "Admin"}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                        {user?.email}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-red-500 transition-colors hover:bg-red-50"
                >
                    Đăng xuất
                </button>
            </div>
        </aside>
    );
}