import { apiClient } from "@/lib/apiClient";
import type { AdminAiLogStats, AiLogsPage, AiLogsParams } from "../types/aiLogs.types";

function buildQuery(params: AiLogsParams): string {
    const query = new URLSearchParams();
    if (params.feature) query.set("feature", params.feature);
    if (params.status) query.set("status", params.status);
    if (params.jsonParseStatus) query.set("jsonParseStatus", params.jsonParseStatus);
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);
    query.set("page", String(params.page ?? 0));
    query.set("size", String(params.size ?? 20));
    return query.toString();
}

export const aiLogsApi = {
    getStats: (days: number) =>
        apiClient.get<AdminAiLogStats>(`/api/admin/admin/ai-logs/stats?days=${days}`),

    search: (params: AiLogsParams) =>
        apiClient.get<AiLogsPage>(`/api/admin/admin/ai-logs?${buildQuery(params)}`),
};
