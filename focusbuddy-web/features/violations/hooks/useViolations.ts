"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { violationsApi } from "../api/violations.api";
import type { SearchViolationsParams } from "../types/violations.types";

export function useViolationStats(days: number) {
    return useQuery({
        queryKey: ["admin-violation-stats", days],
        queryFn: () => violationsApi.getStats(days),
    });
}

export function useViolationsSearch(params: SearchViolationsParams, enabled: boolean) {
    return useQuery({
        queryKey: ["admin-violations-search", params],
        queryFn: () => violationsApi.search(params),
        placeholderData: keepPreviousData,
        enabled,
    });
}