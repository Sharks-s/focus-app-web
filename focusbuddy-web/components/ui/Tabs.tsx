"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface TabItem {
    key: string;
    label: string;
}

export function Tabs({
    tabs,
    defaultTab,
}: {
    tabs: TabItem[];
    defaultTab: string;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") ?? defaultTab;

    function selectTab(key: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", key);
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="admin-tabs">
            {tabs.map((tab) => {
                const active = tab.key === activeTab;
                return (
                    <button
                        key={tab.key}
                        onClick={() => selectTab(tab.key)}
                        className={active ? "active" : ""}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}

export function useActiveTab(defaultTab: string): string {
    const searchParams = useSearchParams();
    return searchParams.get("tab") ?? defaultTab;
}
