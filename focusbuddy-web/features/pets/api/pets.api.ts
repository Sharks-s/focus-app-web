import { apiClient } from "@/lib/apiClient";
import type { AdminPetResponse, UpdatePetRequest } from "../types/pets.types";

export const petsApi = {
    list: () => apiClient.get<AdminPetResponse[]>("/api/admin/pets/admin/all"),

    getById: (id: number) => apiClient.get<AdminPetResponse>(`/api/admin/pets/${id}`),

    update: (id: number, data: UpdatePetRequest) =>
        apiClient.put<AdminPetResponse>(`/api/admin/pets/${id}`, data),
};