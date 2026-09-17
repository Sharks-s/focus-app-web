"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    BarChart3,
    Bot,
    FileSliders,
    LayoutDashboard,
    LogOut,
    Settings2,
    ShieldCheck,
    Users,
} from "lucide-react";
import { useAuthStore } from "@/features/auth";

interface SidebarItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const ITEMS: SidebarItem[] = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Người dùng", href: "/admin/user-management", icon: Users },
    { label: "Nội dung", href: "/admin/content", icon: FileSliders },
    { label: "Vận hành", href: "/admin/monitoring", icon: ShieldCheck },
    { label: "Phân tích", href: "/admin/system-analytics", icon: BarChart3 },
    { label: "Cấu hình", href: "/admin/app-settings", icon: Settings2 },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    async function handleLogout() {
        await logout();
        router.push("/admin/login");
    }

    return (
        <aside className="admin-sidebar flex h-screen w-64 shrink-0 flex-col">
            <div className="admin-brand flex h-[76px] shrink-0 items-center gap-3 px-5">
                <div className="admin-brand-mark">
                    <Image src="/MonkeyLogo.png" alt="FocusBuddy" width={34} height={34} priority />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-base font-bold text-[#1a1b25]">FocusBuddy</p>
                    <p className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-[#483bfc]">
                        Admin
                    </p>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="flex flex-col gap-1.5">
                    {ITEMS.map((item) => {
                        const active = pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`admin-nav-item ${active ? "admin-nav-item-active" : ""}`}
                            >
                                <Icon className="h-[18px] w-[18px]" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="shrink-0 border-t border-[#ded9ef] p-3">
                <div className="admin-user-card mb-3">
                    <div className="admin-user-avatar">
                        {(user?.fullName ?? user?.email ?? "A").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#1a1b25]">{user?.fullName ?? "Admin"}</p>
                        <p className="truncate text-xs font-medium text-[#464557]">{user?.email}</p>
                    </div>
                    <Bot className="h-4 w-4 shrink-0 text-[#483bfc]" />
                </div>
                <button onClick={handleLogout} className="admin-logout-btn">
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
}
