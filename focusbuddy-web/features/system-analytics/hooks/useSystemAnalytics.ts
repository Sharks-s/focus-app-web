"use client";

import { useQuery } from "@tanstack/react-query";
import { systemAnalyticsApi } from "../api/systemAnalytics.api";

export function useSystemAnalytics(days: number) {
    return useQuery({
        queryKey: ["admin-system-analytics", days],
        queryFn: () => systemAnalyticsApi.getOverview(days),
    });
}
