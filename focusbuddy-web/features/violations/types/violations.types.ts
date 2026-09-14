export type ViolationType =
    | "AWAY"
    | "LOOK_AWAY"
    | "BAD_POSTURE"
    | "POOR_LIGHTING"
    | "TOO_CLOSE"
    | "ENTERTAINMENT";

export interface TopViolator {
    userId: number;
    email: string;
    fullName: string | null;
    violationCount: number;
}

export interface TopApp {
    appName: string;
    violationCount: number;
}

export interface TypeCount {
    type: ViolationType;
    count: number;
}

export interface AdminViolationStatsResponse {
    topViolators: TopViolator[];
    topApps: TopApp[];
    byType: TypeCount[];
}

export interface AdminViolationListItem {
    id: number;
    userId: number;
    userEmail: string;
    userFullName: string | null;
    type: ViolationType;
    appName: string | null;
    windowTitle: string | null;
    minutesDeducted: number;
    occurredAt: string;
}

export interface PagedResponse<T> {
    items: T[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
}

export interface SearchViolationsParams {
    userId?: number;
    type?: ViolationType;
    from?: string;
    to?: string;
    page?: number;
    size?: number;
}