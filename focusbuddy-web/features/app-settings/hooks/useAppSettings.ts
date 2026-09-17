"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appSettingsApi } from "../api/appSettings.api";

export function useAppSettings() {
    return useQuery({
        queryKey: ["admin-app-settings"],
        queryFn: () => appSettingsApi.list(),
    });
}

export function useUpdateAppSetting() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ key, value }: { key: string; value: string }) =>
            appSettingsApi.update(key, { value }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-app-settings"] });
        },
    });
}
