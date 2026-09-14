import { apiClient } from "@/lib/apiClient";
import type { AppRuleResponse, CreateAppRuleRequest } from "../types/appRules.types";

export const appRulesApi = {
    list: () => apiClient.get<AppRuleResponse[]>("/api/admin/admin/app-rules"),

    create: (data: CreateAppRuleRequest) =>
        apiClient.post<AppRuleResponse>("/api/admin/admin/app-rules", data),

    delete: (id: number) => apiClient.delete<null>(`/api/admin/admin/app-rules/${id}`),
};