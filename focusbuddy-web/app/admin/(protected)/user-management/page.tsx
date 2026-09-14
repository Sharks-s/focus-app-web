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
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold">Quản lý người dùng</h1>
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