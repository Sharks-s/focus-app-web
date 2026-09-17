import type { PagedResponse } from "@/features/users/types/users.types";

export type AiLogStatus = "SUCCESS" | "FAILED";
export type AiJsonParseStatus = "SUCCESS" | "FAILED" | "NOT_JSON";

export interface AdminAiLogItem {
    id: number | string;
    provider?: string | null;
    model?: string | null;
    feature?: string | null;
    promptName?: string | null;
    status: AiLogStatus;
    jsonParseStatus?: AiJsonParseStatus | null;
    jsonParseError?: string | null;
    inputTokens?: number | null;
    outputTokens?: number | null;
    totalTokens?: number | null;
    costUsd?: number | null;
    latencyMs?: number | null;
    errorMessage?: string | null;
    createdAt: string;
}

export interface AdminAiLogStats {
    days: number;
    totalCalls: number;
    successCalls: number;
    failedCalls: number;
    jsonParseSuccess: number;
    jsonParseFailed: number;
    notJson: number;
    byFeature: {
        feature: string;
        count: number;
    }[];
}

export interface AiLogsParams {
    feature?: string;
    status?: AiLogStatus;
    jsonParseStatus?: AiJsonParseStatus;
    from?: string;
    to?: string;
    page?: number;
    size?: number;
}

export type AiLogsPage = PagedResponse<AdminAiLogItem>;
