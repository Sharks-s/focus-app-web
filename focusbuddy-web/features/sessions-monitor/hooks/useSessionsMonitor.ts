"use client";

import { useQuery } from "@tanstack/react-query";
import { sessionsMonitorApi } from "../api/sessionsMonitor.api";

const POLL_INTERVAL_MS = 2 * 60 * 1000; // 2 phút

export function useActiveSessions() {
    return useQuery({
        queryKey: ["admin-active-sessions"],
        queryFn: () => sessionsMonitorApi.getActive(),
        refetchInterval: POLL_INTERVAL_MS,
        refetchIntervalInBackground: false, // không poll khi tab admin không được xem, đỡ tốn tải
    });
}