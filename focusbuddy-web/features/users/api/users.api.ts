import { apiClient } from "@/lib/apiClient";
import type {
    AdminUserDetailResponse,
    AdminUserListItem,
    ListUsersParams,
    PagedResponse,
    RoleCode,
    UserStatus,
} from "../types/users.types";

function buildQuery(params: ListUsersParams): string {
    const query = new URLSearchParams();
    if (params.keyword) query.set("keyword", params.keyword);
    if (params.status) query.set("status", params.status);
    query.set("page", String(params.page ?? 0));
    query.set("size", String(params.size ?? 20));
    return query.toString();
}

export const usersApi = {
    list: (params: ListUsersParams = {}) =>
        apiClient.get<PagedResponse<AdminUserListItem>>(
            `/api/admin/admin/users?${buildQuery(params)}`,
        ),

    getDetail: (id: number) =>
        apiClient.get<AdminUserDetailResponse>(`/api/admin/admin/users/${id}`),

    updateStatus: (id: number, status: UserStatus) =>
        apiClient.patch<AdminUserDetailResponse>(`/api/admin/admin/users/${id}/status`, {
            status,
        }),

    updateRole: (id: number, roleCode: RoleCode) =>
        apiClient.patch<AdminUserDetailResponse>(`/api/admin/admin/users/${id}/role`, {
            roleCode,
        }),
};