"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promptTemplatesApi } from "../api/promptTemplates.api";
import type { UpdatePromptTemplateRequest } from "../types/promptTemplates.types";

export function usePromptTemplatesList() {
    return useQuery({
        queryKey: ["admin-prompt-templates"],
        queryFn: () => promptTemplatesApi.list(),
    });
}

export function useUpdatePromptTemplate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePromptTemplateRequest }) =>
            promptTemplatesApi.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-prompt-templates"] }),
    });
}