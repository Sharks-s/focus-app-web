import { apiClient } from "@/lib/apiClient";
import type {
    AdminViolationListItem,
    AdminViolationStatsResponse,
    PagedResponse,
    SearchViolationsParams,
} from "../types/violations.types";

function buildQuery(params: SearchViolationsParams): string {
    const query = new URLSearchParams();
    if (params.userId) query.set("userId", String(params.userId));
    if (params.type) query.set("type", params.type);
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);
    query.set("page", String(params.page ?? 0));
    query.set("size", String(params.size ?? 20));
    return query.toString();
}

export const violationsApi = {
    getStats: (days: number) =>
        apiClient.get<AdminViolationStatsResponse>(`/api/admin/admin/violations/stats?days=${days}`),

    search: (params: SearchViolationsParams) =>
        apiClient.get<PagedResponse<AdminViolationListItem>>(
            `/api/admin/admin/violations?${buildQuery(params)}`,
        ),
};