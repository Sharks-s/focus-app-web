"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { petsApi } from "../api/pets.api";
import type { UpdatePetRequest } from "../types/pets.types";

export function usePetsList() {
    return useQuery({
        queryKey: ["admin-pets"],
        queryFn: () => petsApi.list(),
    });
}

export function useUpdatePet() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePetRequest }) =>
            petsApi.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-pets"] }),
    });
}