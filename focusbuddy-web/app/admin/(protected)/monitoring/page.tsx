"use client";

import { Suspense } from "react";
import { Tabs, useActiveTab } from "@/components/ui/Tabs";
import { AiLogsPanel } from "@/features/ai-logs";
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
        <div className="flex flex-col gap-5">
            <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#483bfc]">
                    Operations
                </p>
                <h1>Giám sát & Vận hành</h1>
                <p className="text-sm font-semibold text-muted-foreground">
                    Theo dõi session đang chạy, vi phạm và lịch sử AI Cloud.
                </p>
            </div>
            <Tabs tabs={TABS} defaultTab="sessions" />

            {activeTab === "sessions" && <SessionMonitorTable />}
            {activeTab === "violations" && <ViolationsPanel />}
            {activeTab === "ai-logs" && <AiLogsPanel />}
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
