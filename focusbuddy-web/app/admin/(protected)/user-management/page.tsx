"use client";

import { Suspense } from "react";
import { Tabs, useActiveTab } from "@/components/ui/Tabs";
import { UsersTab } from "./tabs/UsersTab";
import { SubscriptionsTab } from "./tabs/SubscriptionsTab";

const TABS = [
    { key: "users", label: "Users" },
    { key: "subscriptions", label: "Subscriptions" },
];

function UserManagementContent() {
    const activeTab = useActiveTab("users");

    return (
        <div className="flex flex-col gap-5">
            <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#483bfc]">
                    People
                </p>
                <h1>Quản lý người dùng</h1>
                <p className="text-sm font-semibold text-muted-foreground">
                    Theo dõi tài khoản, trạng thái Premium và lịch sử giao dịch.
                </p>
            </div>
            <Tabs tabs={TABS} defaultTab="users" />
            {activeTab === "users" && <UsersTab />}
            {activeTab === "subscriptions" && <SubscriptionsTab />}
        </div>
    );
}

export default function UserManagementPage() {
    return (
        <Suspense fallback={null}>
            <UserManagementContent />
        </Suspense>
    );
}
