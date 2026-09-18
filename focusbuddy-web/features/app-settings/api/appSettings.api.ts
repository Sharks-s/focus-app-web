import { apiClient } from "@/lib/apiClient";
import type { AppSettingItem, UpdateAppSettingRequest } from "../types/appSettings.types";

export const appSettingsApi = {
    list: () => apiClient.get<AppSettingItem[]>("/api/admin/admin/app-settings"),

    update: (key: string, body: UpdateAppSettingRequest) =>
        apiClient.patch<AppSettingItem>(`/api/admin/admin/app-settings/${encodeURIComponent(key)}`, body),
};
