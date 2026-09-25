import { apiClient } from "@/lib/apiClient";
import type { UserFeedback, UserFeedbackStatus } from "../types/userFeedbacks.types";

export const userFeedbacksApi = {
    list: () => apiClient.get<UserFeedback[]>("/api/admin/admin/user-feedbacks"),

    updateStatus: (id: number, status: UserFeedbackStatus) =>
        apiClient.patch<UserFeedback>(`/api/admin/admin/user-feedbacks/${id}/status`, {
            status,
        }),

    updateReply: (id: number, adminReply?: string | null) =>
        apiClient.patch<UserFeedback>(`/api/admin/admin/user-feedbacks/${id}/reply`, {
            adminReply,
        }),
};
