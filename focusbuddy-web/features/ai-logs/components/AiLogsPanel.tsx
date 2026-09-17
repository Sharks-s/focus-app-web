"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Bot, Braces, CircleDollarSign, Clock } from "lucide-react";
import { useAiLogsSearch, useAiLogStats } from "../hooks/useAiLogs";
import type { AiJsonParseStatus, AiLogStatus } from "../types/aiLogs.types";

const DAY_OPTIONS = [1, 7, 30, 90];

function formatMoney(value?: number | null) {
    return `$${(value ?? 0).toFixed(4)}`;
}

function formatPercent(value?: number | null) {
    return `${Math.round(value ?? 0)}%`;
}

function formatNumber(value?: number | null) {
    return new Intl.NumberFormat("vi-VN").format(value ?? 0);
}

export function AiLogsPanel() {
    const [days, setDays] = useState(7);
    const [page, setPage] = useState(0);
    const [feature, setFeature] = useState("");
    const [status, setStatus] = useState<AiLogStatus | "">("");
    const [jsonParseStatus, setJsonParseStatus] = useState<AiJsonParseStatus | "">("");

    const dateRange = useMemo(() => {
        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - days + 1);
        return {
            from: from.toISOString(),
            to: to.toISOString(),
        };
    }, [days]);

    const statsQuery = useAiLogStats(days);
    const logsQuery = useAiLogsSearch({
        feature: feature.trim() || undefined,
        status: status || undefined,
        jsonParseStatus: jsonParseStatus || undefined,
        from: dateRange.from,
        to: dateRange.to,
        page,
        size: 20,
    });

    const stats = statsQuery.data;
    const pageData = logsQuery.data;
    const visibleLogs = pageData?.items ?? [];
    const visibleCostUsd = visibleLogs.reduce((sum, log) => sum + (Number(log.costUsd) || 0), 0);
    const logsWithLatency = visibleLogs.filter((log) => log.latencyMs != null);
    const avgVisibleLatencyMs =
        logsWithLatency.length === 0
            ? 0
            : logsWithLatency.reduce((sum, log) => sum + (log.latencyMs ?? 0), 0) / logsWithLatency.length;
    const errorRate = stats?.totalCalls ? (stats.failedCalls / stats.totalCalls) * 100 : 0;
    const jsonCalls = (stats?.jsonParseSuccess ?? 0) + (stats?.jsonParseFailed ?? 0);
    const parseErrorRate = jsonCalls ? ((stats?.jsonParseFailed ?? 0) / jsonCalls) * 100 : 0;

    function resetAndSetDays(nextDays: number) {
        setDays(nextDays);
        setPage(0);
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold">AI Logs</h2>
                    <p className="text-sm text-muted-foreground">
                        Lịch sử gọi AI Cloud, chi phí, lỗi request và lỗi parse JSON.
                    </p>
                </div>
                <div className="flex rounded-md border p-1">
                    {DAY_OPTIONS.map((option) => (
                        <button
                            key={option}
                            onClick={() => resetAndSetDays(option)}
                            className={`rounded px-3 py-1.5 text-sm ${days === option ? "bg-black text-white" : "hover:bg-gray-100"}`}
                        >
                            {option} ngày
                        </button>
                    ))}
                </div>
            </div>

            {statsQuery.isError && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    Không thể tải thống kê AI Logs. Kiểm tra backend endpoint /admin/ai-logs/stats.
                </p>
            )}

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <MetricCard icon={Bot} label="Tổng calls" value={formatNumber(stats?.totalCalls)} />
                <MetricCard icon={CircleDollarSign} label="Cost trang này" value={formatMoney(visibleCostUsd)} />
                <MetricCard icon={AlertTriangle} label="Tỷ lệ lỗi" value={formatPercent(errorRate)} />
                <MetricCard icon={Braces} label="Lỗi parse JSON" value={formatPercent(parseErrorRate)} />
                <MetricCard icon={Clock} label="Latency trang này" value={`${Math.round(avgVisibleLatencyMs)} ms`} />
            </div>

            <div className="flex flex-wrap gap-2">
                <input
                    value={feature}
                    onChange={(event) => {
                        setFeature(event.target.value);
                        setPage(0);
                    }}
                    placeholder="Feature hoặc prompt..."
                    className="w-60 rounded-md border px-3 py-2 text-sm"
                />
                <select
                    value={status}
                    onChange={(event) => {
                        setStatus(event.target.value as AiLogStatus | "");
                        setPage(0);
                    }}
                    className="rounded-md border px-3 py-2 text-sm"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="FAILED">FAILED</option>
                </select>
                <select
                    value={jsonParseStatus}
                    onChange={(event) => {
                        setJsonParseStatus(event.target.value as AiJsonParseStatus | "");
                        setPage(0);
                    }}
                    className="rounded-md border px-3 py-2 text-sm"
                >
                    <option value="">Tất cả JSON</option>
                    <option value="SUCCESS">Parse OK</option>
                    <option value="FAILED">Parse failed</option>
                    <option value="NOT_JSON">Không phải JSON</option>
                </select>
                {logsQuery.isFetching && (
                    <span className="self-center text-xs text-muted-foreground">Đang cập nhật...</span>
                )}
            </div>

            {logsQuery.isPending && <p className="text-sm text-muted-foreground">Đang tải...</p>}
            {logsQuery.isError && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    Không thể tải danh sách AI Logs. Kiểm tra backend endpoint /admin/ai-logs.
                </p>
            )}

            {pageData && (
                <>
                    <div className="overflow-hidden rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-left">
                                <tr>
                                    <th className="px-3 py-2">Thời điểm</th>
                                    <th className="px-3 py-2">Feature</th>
                                    <th className="px-3 py-2">Model</th>
                                    <th className="px-3 py-2">Trạng thái</th>
                                    <th className="px-3 py-2">JSON</th>
                                    <th className="px-3 py-2 text-right">Tokens</th>
                                    <th className="px-3 py-2 text-right">Cost</th>
                                    <th className="px-3 py-2 text-right">Latency</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageData.items.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">
                                            Không có log nào trong khoảng này.
                                        </td>
                                    </tr>
                                )}
                                {pageData.items.map((log) => (
                                    <tr key={log.id} className="border-t align-top">
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleString("vi-VN")}
                                        </td>
                                        <td className="px-3 py-2">
                                            <p className="font-medium">{log.feature ?? "-"}</p>
                                            <p className="text-xs text-muted-foreground">{log.promptName ?? ""}</p>
                                        </td>
                                        <td className="px-3 py-2">
                                            <p>{log.model ?? "-"}</p>
                                            <p className="text-xs text-muted-foreground">{log.provider ?? ""}</p>
                                        </td>
                                        <td className="px-3 py-2">
                                            <StatusBadge status={log.status} />
                                            {log.errorMessage && (
                                                <p className="mt-1 max-w-64 truncate text-xs text-red-600" title={log.errorMessage}>
                                                    {log.errorMessage}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-3 py-2">
                                            <JsonBadge status={log.jsonParseStatus} />
                                            {log.jsonParseError && (
                                                <p className="mt-1 max-w-56 truncate text-xs text-red-600" title={log.jsonParseError}>
                                                    {log.jsonParseError}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right">{formatNumber(log.totalTokens)}</td>
                                        <td className="px-3 py-2 text-right">{formatMoney(log.costUsd)}</td>
                                        <td className="px-3 py-2 text-right">{log.latencyMs ?? "-"} ms</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span>
                            Trang {pageData.currentPage + 1} / {Math.max(pageData.totalPages, 1)} - {pageData.totalItems} logs
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={pageData.currentPage === 0}
                                onClick={() => setPage((current) => current - 1)}
                                className="rounded-md border px-3 py-1 disabled:opacity-40"
                            >
                                Trước
                            </button>
                            <button
                                disabled={!pageData.hasNext}
                                onClick={() => setPage((current) => current + 1)}
                                className="rounded-md border px-3 py-1 disabled:opacity-40"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function MetricCard({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-md border bg-white p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: AiLogStatus }) {
    const isSuccess = status === "SUCCESS";
    return (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {status}
        </span>
    );
}

function JsonBadge({ status }: { status?: AiJsonParseStatus | null }) {
    if (!status) return <span className="text-xs text-muted-foreground">-</span>;
    const className =
        status === "SUCCESS"
            ? "bg-green-100 text-green-700"
            : status === "FAILED"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-600";
    return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>{status}</span>;
}
