import { apiClient } from "@/lib/apiClient";
import type { PromptTemplateResponse, UpdatePromptTemplateRequest } from "../types/promptTemplates.types";

export const promptTemplatesApi = {
    list: () => apiClient.get<PromptTemplateResponse[]>("/api/admin/admin/prompt-templates"),

    getById: (id: number) =>
        apiClient.get<PromptTemplateResponse>(`/api/admin/admin/prompt-templates/${id}`),

    update: (id: number, data: UpdatePromptTemplateRequest) =>
        apiClient.put<PromptTemplateResponse>(`/api/admin/admin/prompt-templates/${id}`, data),
};