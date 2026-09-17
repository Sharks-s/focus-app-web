"use client";

import React from "react";
import { Timer, Pause, User } from "lucide-react";
import type { AdminSessionMonitorItem } from "@/features/sessions-monitor/types/sessionsMonitor.types";

interface ActiveSessionsListProps {
    sessions: AdminSessionMonitorItem[];
    isLoading?: boolean;
}

function formatDuration(startedAt: string): string {
    const diff = Date.now() - new Date(startedAt).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}g ${mins}p`;
    return `${minutes}p`;
}

export function ActiveSessionsList({ sessions, isLoading }: ActiveSessionsListProps) {
    const displayed = sessions.slice(0, 5);

    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-base font-semibold text-gray-800">Sessions đang chạy</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Cập nhật mỗi 30 giây</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {sessions.length} active
                </span>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                            <div className="h-8 w-8 rounded-full bg-gray-100" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3 w-32 rounded bg-gray-100" />
                                <div className="h-3 w-20 rounded bg-gray-100" />
                            </div>
                            <div className="h-5 w-12 rounded-full bg-gray-100" />
                        </div>
                    ))}
                </div>
            ) : displayed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <Timer className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400">Không có session nào đang chạy</p>
                </div>
            ) : (
                <div className="space-y-2.5">
                    {displayed.map((session) => (
                        <div
                            key={session.id}
                            className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-gray-50 transition-colors"
                        >
                            {/* Avatar placeholder */}
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100">
                                <User className="h-4 w-4 text-violet-600" />
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-800">
                                    {session.userFullName ?? session.userEmail}
                                </p>
                                <p className="truncate text-xs text-gray-400">
                                    {session.goal ?? "Không có mục tiêu"}
                                </p>
                            </div>

                            {/* Duration + status */}
                            <div className="flex shrink-0 flex-col items-end gap-1">
                                <span className="flex items-center gap-1 text-xs font-medium text-gray-600">
                                    <Timer className="h-3 w-3" />
                                    {formatDuration(session.startedAt)}
                                </span>
                                {session.isPaused && (
                                    <span className="flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-xs text-amber-600">
                                        <Pause className="h-2.5 w-2.5" />
                                        Paused
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}

                    {sessions.length > 5 && (
                        <p className="pt-1 text-center text-xs text-gray-400">
                            +{sessions.length - 5} sessions khác
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
