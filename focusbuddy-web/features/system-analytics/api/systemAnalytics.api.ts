import { apiClient } from "@/lib/apiClient";
import type { SystemAnalyticsResponse } from "../types/systemAnalytics.types";

export const systemAnalyticsApi = {
    getOverview: (days: number) =>
        apiClient.get<SystemAnalyticsResponse>(`/api/admin/admin/analytics/system?days=${days}`),
};
