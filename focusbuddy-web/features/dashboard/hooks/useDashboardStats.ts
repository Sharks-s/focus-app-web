"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";
import type { DashboardStats, GrowthDataPoint, GrowthRange } from "../types/dashboard.types";

function isSameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function buildGrowthData(
    createdDates: string[],
    rangeDays: GrowthRange,
    totalUsers: number,
): GrowthDataPoint[] {
    const today = new Date();
    const points: GrowthDataPoint[] = [];

    for (let i = rangeDays - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        d.setHours(0, 0, 0, 0);

        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        const newUsers = createdDates.filter((iso) => {
            const created = new Date(iso);
            return isSameDay(created, d);
        }).length;

        points.push({
            date: `${day}/${month}`,
            fullDate: d.toISOString(),
            newUsers,
            cumulativeUsers: 0, // sẽ fill sau
        });
    }

    // Tính cumulative: lấy totalUsers làm điểm cuối, trừ ngược lại
    let running = totalUsers;
    for (let i = points.length - 1; i >= 0; i--) {
        points[i].cumulativeUsers = running;
        running -= points[i].newUsers;
    }

    return points;
}

export function useDashboardStats(rangeDays: GrowthRange = 7) {
    const usersQuery = useQuery({
        queryKey: ["dashboard-users"],
        queryFn: () => dashboardApi.getAllUsers(),
        staleTime: 60_000,
    });

    const sessionsQuery = useQuery({
        queryKey: ["dashboard-sessions"],
        queryFn: () => dashboardApi.getActiveSessions(),
        staleTime: 30_000,
        refetchInterval: 30_000,
    });

    const users = usersQuery.data?.items ?? [];
    const totalUsers = usersQuery.data?.totalItems ?? 0;
    const sessions = sessionsQuery.data ?? [];

    const today = new Date();

    const activeToday = users.filter((u) => {
        if (!u.lastLoginAt) return false;
        return isSameDay(new Date(u.lastLoginAt), today);
    }).length;

    const premiumUsers = users.filter((u) => u.premium).length;

    const stats: DashboardStats = {
        totalUsers,
        activeToday,
        totalActiveSessions: sessions.length,
        premiumUsers,
        activeTodayRate: totalUsers > 0 ? Math.round((activeToday / totalUsers) * 100) : 0,
        premiumRate: totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0,
    };

    const growthData = buildGrowthData(
        users.map((u) => u.createdAt),
        rangeDays,
        totalUsers,
    );

    return {
        stats,
        growthData,
        sessions,
        isLoading: usersQuery.isLoading || sessionsQuery.isLoading,
        isError: usersQuery.isError || sessionsQuery.isError,
    };
}
