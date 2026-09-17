export interface HourlyStudyPoint {
    hour: number;
    users?: number | null;
    sessions: number;
    focusMinutes?: number | null;
}

export interface RetentionPoint {
    cohort: string;
    cohortUsers: number;
    retainedUsers: number;
    retentionRate: number;
}

export interface CompletionTrendPoint {
    date: string;
    started: number;
    completed: number;
    rate: number;
}

export interface SystemAnalyticsSummary {
    totalUsers: number;
    activeUsers: number;
    startedSessions: number;
    completedSessions: number;
    completionRate: number;
    retentionRate: number;
    avgSessionMinutes: number;
}

export interface SystemAnalyticsResponse {
    summary: SystemAnalyticsSummary;
    hourlyStudy: HourlyStudyPoint[];
    retention: RetentionPoint[];
    completionTrend: CompletionTrendPoint[];
}
