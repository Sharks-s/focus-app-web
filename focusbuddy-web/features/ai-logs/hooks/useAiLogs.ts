"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { aiLogsApi } from "../api/aiLogs.api";
import type { AiLogsParams } from "../types/aiLogs.types";

export function useAiLogStats(days: number) {
    return useQuery({
        queryKey: ["admin-ai-log-stats", days],
        queryFn: () => aiLogsApi.getStats(days),
    });
}

export function useAiLogsSearch(params: AiLogsParams) {
    return useQuery({
        queryKey: ["admin-ai-logs", params],
        queryFn: () => aiLogsApi.search(params),
        placeholderData: keepPreviousData,
    });
}
