"use client";

import { useState } from "react";
import { useViolationsSearch } from "../hooks/useViolations";
import { ViolationTypeLabel } from "./ViolationTypeLabel";
import type { ViolationType } from "../types/violations.types";

const TYPE_OPTIONS: { label: string; value: ViolationType | "" }[] = [
    { label: "Tất cả loại", value: "" },
    { label: "Rời khỏi ghế", value: "AWAY" },
    { label: "Nhìn đi chỗ khác", value: "LOOK_AWAY" },
    { label: "Sai tư thế", value: "BAD_POSTURE" },
    { label: "Thiếu sáng", value: "POOR_LIGHTING" },
    { label: "Ngồi quá gần", value: "TOO_CLOSE" },
    { label: "Mở app giải trí", value: "ENTERTAINMENT" },
];

export function ViolationSearchTable() {
    const [userId, setUserId] = useState("");
    const [type, setType] = useState<ViolationType | "">("");
    const [page, setPage] = useState(0);
    const [hasSearched, setHasSearched] = useState(false);

    const { data, isPending, isFetching, isError } = useViolationsSearch(
        {
            userId: userId ? Number(userId) : undefined,
            type: type || undefined,
            page,
            size: 20,
        },
        hasSearched,
    );

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setPage(0);
        setHasSearched(true);
    }

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="User ID (để trống = tất cả)"
                    className="border rounded-md px-3 py-2 text-sm w-56"
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ViolationType | "")}
                    className="border rounded-md px-3 py-2 text-sm"
                >
                    {TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="rounded-md bg-black px-4 py-2 text-sm text-white"
                >
                    Tìm kiếm
                </button>
            </form>

            {!hasSearched && (
                <p className="text-sm text-muted-foreground">
                    Nhập điều kiện và bấm "Tìm kiếm" để tra cứu chi tiết.
                </p>
            )}

            {hasSearched && isPending && <p className="text-sm text-muted-foreground">Đang tải...</p>}
            {isError && <p className="text-sm text-red-500">Có lỗi khi tải danh sách.</p>}

            {hasSearched && data && (
                <>
                    <div className="flex items-center gap-2">
                        {isFetching && (
                            <span className="text-xs text-muted-foreground animate-pulse">⟳ đang cập nhật...</span>
                        )}
                    </div>

                    <table className="w-full text-sm border rounded-md overflow-hidden">
                        <thead className="bg-muted text-left">
                            <tr>
                                <th className="px-3 py-2">User</th>
                                <th className="px-3 py-2">Loại</th>
                                <th className="px-3 py-2">App / Window</th>
                                <th className="px-3 py-2">Phút trừ</th>
                                <th className="px-3 py-2">Thời điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-3 py-4 text-center text-muted-foreground">
                                        Không tìm thấy vi phạm nào.
                                    </td>
                                </tr>
                            )}
                            {data.items.map((v) => (
                                <tr key={v.id} className="border-t">
                                    <td className="px-3 py-2">{v.userFullName ?? v.userEmail}</td>
                                    <td className="px-3 py-2">
                                        <ViolationTypeLabel type={v.type} />
                                    </td>
                                    <td className="px-3 py-2 text-muted-foreground">
                                        {v.appName ?? "—"}
                                        {v.windowTitle && ` — ${v.windowTitle}`}
                                    </td>
                                    <td className="px-3 py-2">{v.minutesDeducted}</td>
                                    <td className="px-3 py-2">{new Date(v.occurredAt).toLocaleString("vi-VN")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between text-sm">
                        <span>
                            Trang {data.currentPage + 1} / {data.totalPages} — {data.totalItems} vi phạm
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={data.currentPage === 0}
                                onClick={() => setPage((p) => p - 1)}
                                className="border rounded-md px-3 py-1 disabled:opacity-40"
                            >
                                Trước
                            </button>
                            <button
                                disabled={!data.hasNext}
                                onClick={() => setPage((p) => p + 1)}
                                className="border rounded-md px-3 py-1 disabled:opacity-40"
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