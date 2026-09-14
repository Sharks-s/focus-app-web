import { apiClient } from "@/lib/apiClient";
import type {
    PersonalityResponse,
    CreatePersonalityRequest,
    UpdatePersonalityRequest,
} from "../types/personalities.types";

export const personalitiesApi = {
    list: () => apiClient.get<PersonalityResponse[]>("/api/admin/personalities"),

    getById: (id: number) =>
        apiClient.get<PersonalityResponse>(`/api/admin/personalities/${id}`),

    create: (data: CreatePersonalityRequest) =>
        apiClient.post<PersonalityResponse>("/api/admin/personalities", data),

    update: (id: number, data: UpdatePersonalityRequest) =>
        apiClient.put<PersonalityResponse>(`/api/admin/personalities/${id}`, data),

    delete: (id: number) => apiClient.delete<null>(`/api/admin/personalities/${id}`),
};