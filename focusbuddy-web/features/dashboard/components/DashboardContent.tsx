"use client";

import React, { useState } from "react";
import { Users, UserCheck, Timer, Crown, AlertCircle } from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { StatCard } from "./StatCard";
import { GrowthChart } from "./GrowthChart";
import { ActiveSessionsList } from "./ActiveSessionsList";
import type { GrowthRange } from "../types/dashboard.types";

export function DashboardContent() {
    const [range, setRange] = useState<GrowthRange>(7);
    const { stats, growthData, sessions, isLoading, isError } = useDashboardStats(range);

    const now = new Date();
    const dateStr = now.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-0.5 text-sm text-gray-500">{dateStr}</p>
                </div>
                {isError && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        Không thể tải dữ liệu
                    </div>
                )}
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatCard
                    label="Tổng người dùng"
                    value={stats.totalUsers}
                    icon={Users}
                    color="violet"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Active hôm nay"
                    value={stats.activeToday}
                    subLabel={`${stats.activeTodayRate}%`}
                    icon={UserCheck}
                    color="emerald"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Sessions đang chạy"
                    value={stats.totalActiveSessions}
                    icon={Timer}
                    color="sky"
                    isLoading={isLoading}
                />
                <StatCard
                    label="Premium users"
                    value={stats.premiumUsers}
                    subLabel={`${stats.premiumRate}%`}
                    icon={Crown}
                    color="amber"
                    isLoading={isLoading}
                />
            </div>

            {/* Main content: chart + sessions */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Growth chart — chiếm 2/3 */}
                <div className="lg:col-span-2">
                    <GrowthChart
                        data={growthData}
                        range={range}
                        onRangeChange={setRange}
                        isLoading={isLoading}
                    />
                </div>

                {/* Active sessions — chiếm 1/3 */}
                <div className="lg:col-span-1">
                    <ActiveSessionsList sessions={sessions} isLoading={isLoading} />
                </div>
            </div>

            {/* Quick insights row */}
            {!isLoading && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <InsightCard
                        label="Tỉ lệ hoạt động"
                        value={`${stats.activeTodayRate}%`}
                        desc="Users đăng nhập hôm nay / tổng users"
                        color="violet"
                    />
                    <InsightCard
                        label="Tỉ lệ Premium"
                        value={`${stats.premiumRate}%`}
                        desc="Users đang dùng gói Premium"
                        color="amber"
                    />
                    <InsightCard
                        label="Sessions / Active users"
                        value={stats.activeToday > 0
                            ? (stats.totalActiveSessions / stats.activeToday).toFixed(1)
                            : "—"}
                        desc="Trung bình sessions mỗi user active"
                        color="sky"
                    />
                </div>
            )}
        </div>
    );
}

interface InsightCardProps {
    label: string;
    value: string;
    desc: string;
    color: "violet" | "amber" | "sky";
}

function InsightCard({ label, value, desc, color }: InsightCardProps) {
    const colorMap = {
        violet: "text-violet-600 bg-violet-50",
        amber: "text-amber-600 bg-amber-50",
        sky: "text-sky-600 bg-sky-50",
    };
    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${colorMap[color].split(" ")[0]}`}>{value}</p>
            <p className="mt-1 text-xs text-gray-400">{desc}</p>
        </div>
    );
}
