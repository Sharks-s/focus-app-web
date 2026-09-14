"use client";

import { useState } from "react";
import { useViolationStats } from "../hooks/useViolations";
import { ViolationTypeLabel } from "./ViolationTypeLabel";

const DAY_OPTIONS = [7, 30, 90];

export function ViolationStatsOverview() {
    const [days, setDays] = useState(7);
    const { data, isPending, isError } = useViolationStats(days);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                {DAY_OPTIONS.map((d) => (
                    <button
                        key={d}
                        onClick={() => setDays(d)}
                        className={`rounded-md px-3 py-1.5 text-sm border ${days === d ? "bg-black text-white" : "hover:bg-muted"
                            }`}
                    >
                        {d} ngày qua
                    </button>
                ))}
            </div>

            {isPending && <p className="text-sm text-muted-foreground">Đang tải...</p>}
            {isError && <p className="text-sm text-red-500">Có lỗi khi tải thống kê.</p>}

            {data && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Top user vi phạm nhiều nhất */}
                    <div className="rounded-md border p-4">
                        <h3 className="mb-3 text-sm font-semibold">Top user vi phạm nhiều nhất</h3>
                        {data.topViolators.length === 0 && (
                            <p className="text-xs text-muted-foreground">Không có dữ liệu.</p>
                        )}
                        <ul className="flex flex-col gap-2">
                            {data.topViolators.map((v, i) => (
                                <li key={v.userId} className="flex items-center justify-between text-sm">
                                    <span className="truncate">
                                        {i + 1}. {v.fullName ?? v.email}
                                    </span>
                                    <span className="font-medium text-red-600">{v.violationCount}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Top app bị vi phạm nhiều nhất */}
                    <div className="rounded-md border p-4">
                        <h3 className="mb-3 text-sm font-semibold">Top app bị vi phạm nhiều nhất</h3>
                        {data.topApps.length === 0 && (
                            <p className="text-xs text-muted-foreground">Không có dữ liệu.</p>
                        )}
                        <ul className="flex flex-col gap-2">
                            {data.topApps.map((a, i) => (
                                <li key={a.appName} className="flex items-center justify-between text-sm">
                                    <span className="truncate">
                                        {i + 1}. {a.appName}
                                    </span>
                                    <span className="font-medium text-red-600">{a.violationCount}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Phân bố theo loại */}
                    <div className="rounded-md border p-4">
                        <h3 className="mb-3 text-sm font-semibold">Phân bố theo loại vi phạm</h3>
                        {data.byType.length === 0 && (
                            <p className="text-xs text-muted-foreground">Không có dữ liệu.</p>
                        )}
                        <ul className="flex flex-col gap-2">
                            {data.byType.map((t) => (
                                <li key={t.type} className="flex items-center justify-between text-sm">
                                    <ViolationTypeLabel type={t.type} />
                                    <span className="font-medium">{t.count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}