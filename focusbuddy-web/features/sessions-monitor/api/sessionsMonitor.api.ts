import { apiClient } from "@/lib/apiClient";
import type { AdminSessionMonitorItem } from "../types/sessionsMonitor.types";

export const sessionsMonitorApi = {
    getActive: () =>
        apiClient.get<AdminSessionMonitorItem[]>("/api/admin/admin/sessions/active"),
};