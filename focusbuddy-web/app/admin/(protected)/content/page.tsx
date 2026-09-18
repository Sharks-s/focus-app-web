"use client";

import { Suspense } from "react";
import { Tabs, useActiveTab } from "@/components/ui/Tabs";
import { PersonalityTable } from "@/features/personalities";
import { PetTable } from "@/features/pets";
import { AppRuleTable } from "@/features/app-rules";
import { PromptTemplateList } from "@/features/prompt-templates";

const TABS = [
    { key: "personalities", label: "Personalities" },
    { key: "pets", label: "Pets" },
    { key: "app-rules", label: "App Rules" },
    { key: "prompt-templates", label: "Prompt Templates" },
];

function ContentPageInner() {
    const activeTab = useActiveTab("personalities");

    return (
        <div className="flex flex-col gap-5">
            <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#483bfc]">
                    Content
                </p>
                <h1>Nội dung hệ thống</h1>
                <p className="text-sm font-semibold text-muted-foreground">
                    Quản lý buddy, tính cách, prompt và rule ứng dụng.
                </p>
            </div>
            <Tabs tabs={TABS} defaultTab="personalities" />

            {activeTab === "personalities" && <PersonalityTable />}
            {activeTab === "pets" && <PetTable />}
            {activeTab === "app-rules" && <AppRuleTable />}
            {activeTab === "prompt-templates" && <PromptTemplateList />}
        </div>
    );
}

export default function ContentPage() {
    return (
        <Suspense fallback={null}>
            <ContentPageInner />
        </Suspense>
    );
}
