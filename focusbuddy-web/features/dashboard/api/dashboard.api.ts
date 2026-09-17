import { apiClient } from "@/lib/apiClient";
import type { AdminUserListItem, PagedResponse } from "@/features/users/types/users.types";
import type { AdminSessionMonitorItem } from "@/features/sessions-monitor/types/sessionsMonitor.types";

// Lấy tất cả users (size lớn) để tổng hợp stats
export const dashboardApi = {
    getAllUsers: () =>
        apiClient.get<PagedResponse<AdminUserListItem>>(
            `/api/admin/admin/users?page=0&size=1000`,
        ),

    getActiveSessions: () =>
        apiClient.get<AdminSessionMonitorItem[]>("/api/admin/admin/sessions/active"),
};
