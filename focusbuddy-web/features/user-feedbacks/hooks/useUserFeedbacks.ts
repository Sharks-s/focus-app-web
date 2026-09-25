"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userFeedbacksApi } from "../api/userFeedbacks.api";
import type { UserFeedback, UserFeedbackStatus } from "../types/userFeedbacks.types";

const USER_FEEDBACKS_QUERY_KEY = ["admin-user-feedbacks"];

function updateFeedbackCache(queryClient: ReturnType<typeof useQueryClient>, updated: UserFeedback) {
    queryClient.setQueryData<UserFeedback[]>(USER_FEEDBACKS_QUERY_KEY, (current) =>
        current?.map((item) => (item.id === updated.id ? updated : item)) ?? [updated],
    );
}

export function useUserFeedbacks() {
    return useQuery({
        queryKey: USER_FEEDBACKS_QUERY_KEY,
        queryFn: userFeedbacksApi.list,
    });
}

export function useUpdateFeedbackStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: UserFeedbackStatus }) =>
            userFeedbacksApi.updateStatus(id, status),
        onSuccess: (data) => updateFeedbackCache(queryClient, data),
    });
}

export function useUpdateFeedbackReply() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, adminReply }: { id: number; adminReply?: string | null }) =>
            userFeedbacksApi.updateReply(id, adminReply),
        onSuccess: (data) => updateFeedbackCache(queryClient, data),
    });
}
