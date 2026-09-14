"use client";

import { ViolationStatsOverview } from "./ViolationStatsOverview";
import { ViolationSearchTable } from "./ViolationSearchTable";

export function ViolationsPanel() {
    return (
        <div className="flex flex-col gap-8">
            <ViolationStatsOverview />
            <div className="border-t pt-6">
                <h3 className="mb-3 text-sm font-semibold">Tra cứu chi tiết</h3>
                <ViolationSearchTable />
            </div>
        </div>
    );
}