"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { usersApi } from "../api/users.api";
import type { ListUsersParams, RoleCode, UserStatus } from "../types/users.types";

export function useUsersList(params: ListUsersParams) {
    return useQuery({
        queryKey: ["admin-users", params],
        queryFn: () => usersApi.list(params),
        placeholderData: keepPreviousData,
    });
}

export function useUserDetail(id: number | null) {
    return useQuery({
        queryKey: ["admin-user-detail", id],
        queryFn: () => usersApi.getDetail(id as number),
        enabled: id !== null,
    });
}

export function useUpdateUserStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: UserStatus }) =>
            usersApi.updateStatus(id, status),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            queryClient.invalidateQueries({ queryKey: ["admin-user-detail", variables.id] });
        },
    });
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, roleCode }: { id: number; roleCode: RoleCode }) =>
            usersApi.updateRole(id, roleCode),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            queryClient.invalidateQueries({ queryKey: ["admin-user-detail", variables.id] });
        },
    });
}