export type AppSettingValueType = "STRING" | "NUMBER" | "BOOLEAN" | "JSON";

export interface AppSettingItem {
    key: string;
    value: string;
    defaultValue?: string | null;
    valueType: AppSettingValueType;
    description?: string | null;
    category?: string | null;
    editable?: boolean;
    updatedAt?: string | null;
}

export interface UpdateAppSettingRequest {
    value: string;
}
