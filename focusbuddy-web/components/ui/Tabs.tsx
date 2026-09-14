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
        <div className="flex gap-1 border-b">
            {tabs.map((tab) => {
                const active = tab.key === activeTab;
                return (
                    <button
                        key={tab.key}
                        onClick={() => selectTab(tab.key)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${active
                                ? "border-black text-black"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
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