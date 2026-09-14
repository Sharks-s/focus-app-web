"use client";

import { Suspense } from "react";
import { Tabs, useActiveTab } from "@/components/ui/Tabs";
import { SessionMonitorTable } from "@/features/sessions-monitor";
import { ViolationsPanel } from "@/features/violations";

const TABS = [
    { key: "sessions", label: "Sessions Monitor" },
    { key: "violations", label: "Violations Log" },
    { key: "ai-logs", label: "AI Logs" },
];

function MonitoringPageInner() {
    const activeTab = useActiveTab("sessions");

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold">Giám sát & Vận hành</h1>
            <Tabs tabs={TABS} defaultTab="sessions" />

            {activeTab === "sessions" && <SessionMonitorTable />}
            {activeTab === "violations" && <ViolationsPanel />}
            {activeTab === "ai-logs" && (
                <p className="pt-6 text-sm text-muted-foreground">
                    Sắp có — chưa có Controller/DTO tương ứng.
                </p>
            )}
        </div>
    );
}

export default function MonitoringPage() {
    return (
        <Suspense fallback={null}>
            <MonitoringPageInner />
        </Suspense>
    );
}