"use client";

import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { appRulesApi } from "../api/appRules.api";
import type { CreateAppRuleRequest } from "../types/appRules.types";

export function useAppRulesList() {
    return useQuery({
        queryKey: ["admin-app-rules"],
        queryFn: () => appRulesApi.list(),
    });
}

export function useCreateAppRule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAppRuleRequest) =>
            appRulesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-app-rules"],
            });
        },
    });
}

export function useDeleteAppRule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => appRulesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-app-rules"],
            });
        },
    });
}