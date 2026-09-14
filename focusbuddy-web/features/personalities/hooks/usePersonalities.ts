"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { personalitiesApi } from "../api/personalities.api";
import type { CreatePersonalityRequest, UpdatePersonalityRequest } from "../types/personalities.types";

export function usePersonalitiesList() {
    return useQuery({
        queryKey: ["admin-personalities"],
        queryFn: () => personalitiesApi.list(),
    });
}

export function useCreatePersonality() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePersonalityRequest) => personalitiesApi.create(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-personalities"] }),
    });
}

export function useUpdatePersonality() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePersonalityRequest }) =>
            personalitiesApi.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-personalities"] }),
    });
}

export function useDeletePersonality() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => personalitiesApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-personalities"] }),
    });
}