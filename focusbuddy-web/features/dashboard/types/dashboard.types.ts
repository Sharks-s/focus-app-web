export interface DashboardStats {
    totalUsers: number;
    activeToday: number;
    totalActiveSessions: number;
    premiumUsers: number;
    activeTodayRate: number; // % của tổng users
    premiumRate: number; // % của tổng users
}

export interface GrowthDataPoint {
    date: string; // "MM/DD"
    fullDate: string; // ISO date string
    newUsers: number;
    cumulativeUsers: number;
}

export type GrowthRange = 7 | 14 | 30;
