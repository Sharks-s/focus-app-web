"use client";

import { useState } from "react";
import { Activity, Clock3, Repeat, TimerReset, Users } from "lucide-react";
import { useSystemAnalytics } from "../hooks/useSystemAnalytics";
import type { HourlyStudyPoint } from "../types/systemAnalytics.types";

const DAY_OPTIONS = [7, 30, 90];

function formatNumber(value?: number | null) {
    return new Intl.NumberFormat("vi-VN").format(value ?? 0);
}

function formatPercent(value?: number | null) {
    return `${Math.round(value ?? 0)}%`;
}

export function SystemAnalyticsDashboard() {
    const [days, setDays] = useState(30);
    const { data, isPending, isError, isFetching } = useSystemAnalytics(days);
    const summary = data?.summary;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">System Analytics</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        View tổng hợp toàn hệ thống, không phải analytics cá nhân của từng user.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {isFetching && <span className="text-xs text-muted-foreground">Đang cập nhật...</span>}
                    <div className="flex rounded-md border p-1">
                        {DAY_OPTIONS.map((option) => (
                            <button
                                key={option}
                                onClick={() => setDays(option)}
                                className={`rounded px-3 py-1.5 text-sm ${days === option ? "bg-black text-white" : "hover:bg-gray-100"}`}
                            >
                                {option} ngày
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isError && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    Không thể tải System Analytics. Kiểm tra backend endpoint /admin/analytics/system.
                </p>
            )}
            {isPending && <p className="text-sm text-muted-foreground">Đang tải...</p>}

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <MetricCard icon={Users} label="Active users" value={formatNumber(summary?.activeUsers)} sub={`${formatNumber(summary?.totalUsers)} total`} />
                <MetricCard icon={TimerReset} label="Sessions started" value={formatNumber(summary?.startedSessions)} sub={`${formatNumber(summary?.completedSessions)} completed`} />
                <MetricCard icon={Activity} label="Completion rate" value={formatPercent(summary?.completionRate)} sub="Completed / started" />
                <MetricCard icon={Repeat} label="Retention rate" value={formatPercent(summary?.retentionRate)} sub={`${days} ngày gần nhất`} />
                <MetricCard icon={Clock3} label="Avg session" value={`${Math.round(summary?.avgSessionMinutes ?? 0)} phút`} sub="Thời lượng trung bình" />
            </div>

            {data && (
                <div className="grid gap-5 xl:grid-cols-2">
                    <section className="rounded-md border bg-white p-4">
                        <h2 className="font-semibold">Giờ học cao điểm</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Số session bắt đầu theo từng giờ trong ngày.</p>
                        <HourlyBars data={data.hourlyStudy} />
                    </section>

                    <section className="rounded-md border bg-white p-4">
                        <h2 className="font-semibold">Retention</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Tỷ lệ user quay lại theo cohort/mốc ngày.</p>
                        <div className="mt-4 space-y-3">
                            {data.retention.length === 0 && (
                                <p className="text-sm text-muted-foreground">Chưa có dữ liệu retention.</p>
                            )}
                            {data.retention.map((item) => (
                                <div key={item.cohort}>
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span>{item.cohort}</span>
                                        <span className="font-medium">
                                            {formatPercent(item.retentionRate)}
                                            <span className="text-muted-foreground">
                                                {" "}-
                                                {" "}{formatNumber(item.retainedUsers)}/{formatNumber(item.cohortUsers)} users
                                            </span>
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100">
                                        <div className="h-2 rounded-full bg-black" style={{ width: `${Math.min(Math.max(item.retentionRate, 0), 100)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-md border bg-white p-4 xl:col-span-2">
                        <h2 className="font-semibold">Tỷ lệ hoàn thành session</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Xu hướng started/completed theo ngày.</p>
                        <div className="mt-4 overflow-hidden rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-left">
                                    <tr>
                                        <th className="px-3 py-2">Ngày</th>
                                        <th className="px-3 py-2 text-right">Started</th>
                                        <th className="px-3 py-2 text-right">Completed</th>
                                        <th className="px-3 py-2 text-right">Completion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.completionTrend.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">
                                                Chưa có dữ liệu completion trend.
                                            </td>
                                        </tr>
                                    )}
                                    {data.completionTrend.map((item) => (
                                        <tr key={item.date} className="border-t">
                                            <td className="px-3 py-2">{new Date(item.date).toLocaleDateString("vi-VN")}</td>
                                            <td className="px-3 py-2 text-right">{formatNumber(item.started)}</td>
                                            <td className="px-3 py-2 text-right">{formatNumber(item.completed)}</td>
                                            <td className="px-3 py-2 text-right">{formatPercent(item.rate)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

function MetricCard({
    icon: Icon,
    label,
    value,
    sub,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    sub: string;
}) {
    return (
        <div className="rounded-md border bg-white p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        </div>
    );
}

function HourlyBars({ data }: { data: HourlyStudyPoint[] }) {
    const maxSessions = Math.max(...data.map((item) => item.sessions), 1);

    if (data.length === 0) {
        return <p className="mt-4 text-sm text-muted-foreground">Chưa có dữ liệu theo giờ.</p>;
    }

    return (
        <div className="mt-4 grid grid-cols-12 gap-2">
            {data.map((item) => (
                <div key={item.hour} className="flex h-44 flex-col justify-end gap-2">
                    <div className="flex flex-1 items-end rounded bg-gray-50 px-1">
                        <div
                            className="w-full rounded-t bg-black"
                            style={{ height: `${Math.max((item.sessions / maxSessions) * 100, 4)}%` }}
                            title={`${item.hour}:00 - ${formatNumber(item.sessions)} sessions`}
                        />
                    </div>
                    <div className="text-center text-xs text-muted-foreground">{String(item.hour).padStart(2, "0")}</div>
                </div>
            ))}
        </div>
    );
}
