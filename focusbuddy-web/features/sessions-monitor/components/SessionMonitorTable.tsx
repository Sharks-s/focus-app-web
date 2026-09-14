"use client";

import { useActiveSessions } from "../hooks/useSessionsMonitor";
import { LiveDuration } from "./LiveDuration";
import { HeartbeatStatus } from "./HeartbeatStatus";

export function SessionMonitorTable() {
    const { data, isPending, isError, isFetching, dataUpdatedAt } = useActiveSessions();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {data ? `${data.length} session đang chạy` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                    {isFetching ? "⟳ đang cập nhật..." : `Cập nhật lúc ${new Date(dataUpdatedAt).toLocaleTimeString("vi-VN")}`}
                </p>
            </div>

            {isPending && <p className="text-sm text-muted-foreground">Đang tải...</p>}
            {isError && <p className="text-sm text-red-500">Có lỗi khi tải danh sách.</p>}

            {data && (
                <table className="w-full text-sm border rounded-md overflow-hidden">
                    <thead className="bg-muted text-left">
                        <tr>
                            <th className="px-3 py-2">User</th>
                            <th className="px-3 py-2">Mục tiêu</th>
                            <th className="px-3 py-2">Pet / Cá tính</th>
                            <th className="px-3 py-2">Thời gian học</th>
                            <th className="px-3 py-2">Dự kiến</th>
                            <th className="px-3 py-2">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-3 py-4 text-center text-muted-foreground">
                                    Không có session nào đang chạy.
                                </td>
                            </tr>
                        )}
                        {data.map((s) => (
                            <tr key={s.id} className="border-t">
                                <td className="px-3 py-2">
                                    <p>{s.userFullName ?? s.userEmail}</p>
                                    <p className="text-xs text-muted-foreground">{s.userEmail}</p>
                                </td>
                                <td className="px-3 py-2">{s.goal ?? "—"}</td>
                                <td className="px-3 py-2">
                                    {s.petName ?? "—"} / {s.personalityCode ?? "—"}
                                </td>
                                <td className="px-3 py-2">
                                    <LiveDuration startedAt={s.startedAt} />
                                    {s.isPaused && (
                                        <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                                            Đang nghỉ
                                        </span>
                                    )}
                                </td>
                                <td className="px-3 py-2">{s.plannedDuration ?? "—"} phút</td>
                                <td className="px-3 py-2">
                                    <HeartbeatStatus lastHeartbeatAt={s.lastHeartbeatAt} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}