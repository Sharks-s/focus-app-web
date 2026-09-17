"use client";

import React, { useMemo } from "react";
import type { GrowthDataPoint, GrowthRange } from "../types/dashboard.types";

interface GrowthChartProps {
    data: GrowthDataPoint[];
    range: GrowthRange;
    onRangeChange: (r: GrowthRange) => void;
    isLoading?: boolean;
}

const RANGES: GrowthRange[] = [7, 14, 30];

function buildSvgPath(points: { x: number; y: number }[]): string {
    if (points.length === 0) return "";
    const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    return d;
}

function buildAreaPath(points: { x: number; y: number }[], height: number): string {
    if (points.length === 0) return "";
    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    return `${linePath} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;
}

export function GrowthChart({ data, range, onRangeChange, isLoading }: GrowthChartProps) {
    const W = 600;
    const H = 180;
    const PAD_X = 12;
    const PAD_Y = 16;

    const chartPoints = useMemo(() => {
        if (data.length === 0) return [];
        const values = data.map((d) => d.cumulativeUsers);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const range_ = maxVal - minVal || 1;

        return data.map((d, i) => ({
            x: PAD_X + (i / Math.max(data.length - 1, 1)) * (W - PAD_X * 2),
            y: PAD_Y + (1 - (d.cumulativeUsers - minVal) / range_) * (H - PAD_Y * 2),
            label: d.date,
            value: d.cumulativeUsers,
            newUsers: d.newUsers,
        }));
    }, [data]);

    const barPoints = useMemo(() => {
        if (data.length === 0) return [];
        const values = data.map((d) => d.newUsers);
        const maxVal = Math.max(...values, 1);
        return data.map((d, i) => ({
            x: PAD_X + (i / Math.max(data.length - 1, 1)) * (W - PAD_X * 2),
            barHeight: (d.newUsers / maxVal) * 40,
            newUsers: d.newUsers,
            label: d.date,
        }));
    }, [data]);

    const linePath = buildSvgPath(chartPoints);
    const areaPath = buildAreaPath(chartPoints, H);

    // Tính label ticks: hiển thị 7 nhãn đều nhau
    const tickIndices = useMemo(() => {
        if (data.length <= 7) return data.map((_, i) => i);
        const step = Math.floor(data.length / 6);
        const ticks: number[] = [];
        for (let i = 0; i < data.length; i += step) ticks.push(i);
        if (!ticks.includes(data.length - 1)) ticks.push(data.length - 1);
        return ticks;
    }, [data]);

    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-gray-800">Tăng trưởng người dùng</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Tổng số người dùng theo ngày</p>
                </div>
                <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
                    {RANGES.map((r) => (
                        <button
                            key={r}
                            onClick={() => onRangeChange(r)}
                            className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                                range === r
                                    ? "bg-white shadow text-violet-600 font-semibold"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {r}N
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="mt-4 relative">
                {isLoading ? (
                    <div className="h-[180px] w-full animate-pulse rounded-xl bg-gray-100" />
                ) : (
                    <svg
                        viewBox={`0 0 ${W} ${H}`}
                        className="w-full"
                        style={{ height: H }}
                        aria-label="Biểu đồ tăng trưởng người dùng"
                    >
                        <defs>
                            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
                                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        {[0.25, 0.5, 0.75].map((fraction) => (
                            <line
                                key={fraction}
                                x1={PAD_X}
                                x2={W - PAD_X}
                                y1={PAD_Y + fraction * (H - PAD_Y * 2)}
                                y2={PAD_Y + fraction * (H - PAD_Y * 2)}
                                stroke="#f0f0f0"
                                strokeWidth="1"
                            />
                        ))}

                        {/* Area fill */}
                        {areaPath && (
                            <path d={areaPath} fill="url(#lineGrad)" />
                        )}

                        {/* Line */}
                        {linePath && (
                            <path
                                d={linePath}
                                fill="none"
                                stroke="#7c3aed"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )}

                        {/* Data points */}
                        {chartPoints.map((p, i) => (
                            <g key={i}>
                                <circle cx={p.x} cy={p.y} r={4} fill="#7c3aed" />
                                <circle cx={p.x} cy={p.y} r={7} fill="#7c3aed" fillOpacity={0.15} />
                            </g>
                        ))}

                        {/* X-axis labels */}
                        {tickIndices.map((idx) => {
                            const p = chartPoints[idx];
                            if (!p) return null;
                            return (
                                <text
                                    key={idx}
                                    x={p.x}
                                    y={H - 2}
                                    textAnchor="middle"
                                    fontSize={9}
                                    fill="#9ca3af"
                                >
                                    {data[idx]?.date}
                                </text>
                            );
                        })}
                    </svg>
                )}
            </div>

            {/* New users bar mini-chart */}
            {!isLoading && barPoints.length > 0 && (
                <div className="mt-3 border-t pt-3">
                    <p className="text-xs font-medium text-gray-400 mb-1.5">User đăng ký mới mỗi ngày</p>
                    <div className="flex items-end gap-0.5 h-10">
                        {barPoints.map((p, i) => (
                            <div
                                key={i}
                                className="group relative flex-1 flex items-end justify-center"
                                title={`${p.label}: +${p.newUsers} users`}
                            >
                                <div
                                    className="w-full rounded-t-sm bg-violet-200 hover:bg-violet-400 transition-colors cursor-pointer"
                                    style={{ height: `${Math.max(p.barHeight, p.newUsers > 0 ? 2 : 0)}px` }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
