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
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold">Nội dung hệ thống</h1>
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